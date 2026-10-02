#!/usr/bin/env python3
"""Fail if a credential is committed to this repo.

Why this exists
---------------
`locks.txt` sat at the repo root from 11 May 2026 with the project URL plus
`anon` and `service_role` JWTs for the Supabase project, in a PUBLIC repository.
The file was only noticed five months later, and only because something else
happened to read the directory. Nothing in this repo's tooling was ever going to
look at it. This scanner is that missing pair of eyes.

Design notes
------------
* **It never prints a secret.** Only the label and a masked fragment (`eyJhbG…`)
  are echoed, because this runs in CI on a public repo: a scanner that prints
  what it finds turns a blocked commit into a published one. Nobody needs the
  value — they need the file and line.
* **It checks both key generations.** Legacy Supabase keys are JWTs starting
  `eyJ`; the newer keys are `sb_publishable_…` / `sb_secret_…`. A scanner that
  greps only for one of them misses half the leaks.
* **It watches filenames as well as contents.** The incident was a whole file,
  not a pattern inside one. `locks.txt` and any `.env` are refused by name.
* **No dependencies, no network, no secrets of its own** — it is a pure function
  of the tracked tree, so it can never itself become the thing that fails
  mysteriously in CI.

Usage
-----
    python3 scripts/secret-scan.py            # scan every tracked file (CI)
    python3 scripts/secret-scan.py --staged   # scan what is staged (pre-commit)
    python3 scripts/secret-scan.py --all      # include ignored/untracked files

Wire the staged form into a pre-commit hook to catch things before they exist:

    printf '#!/bin/sh\npython3 scripts/secret-scan.py --staged || exit 1\n' \
      > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

Exit codes: 0 = clean, 1 = findings, 2 = could not determine (e.g. not a git repo)
— "could not tell" is never reported as "clean".
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

MAX_BYTES = 5 * 1024 * 1024  # skip anything larger; locks/keys are small
ALLOW_MARKER = "pragma: allowlist secret"

# (label, compiled regex). Patterns match VALUES, never variable names: the env
# var *name* `SUPABASE_SERVICE_KEY` in application code is expected and fine.
CONTENT_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("JSON Web Token (legacy Supabase anon/service_role, or any JWT)",
     re.compile(r"\beyJ[A-Za-z0-9_\-]{8,}\.eyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{10,}")),
    ("Supabase secret key", re.compile(r"\bsb_secret_[A-Za-z0-9_\-]{12,}")),
    ("Supabase personal access token", re.compile(r"\bsbp_[A-Za-z0-9]{20,}")),
    ("Stripe secret key", re.compile(r"\bsk_(?:live|test)_[A-Za-z0-9]{16,}")),
    ("Paystack secret key", re.compile(r"\bsk_(?:live|test)_[a-f0-9]{20,}")),
    ("GitHub token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}")),
    ("GitHub fine-grained token", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}")),
    ("AWS access key id", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_\-]{30,}")),
    ("Slack token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}")),
    ("private key block", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----")),
    ("OpenAI API key", re.compile(r"\bsk-[A-Za-z0-9]{32,}")),
]

# Whole files that must never be tracked. The first entry is this repo's actual
# incident; the `.env` rule is the general case behind it.
FILENAME_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("a dump of credentials (the 2026-05-11 incident)",
     re.compile(r"^locks\.txt$", re.IGNORECASE)),
    ("an environment file", re.compile(r"(^|/)\.env(?:\.[^/]*)?$")),
    ("a key or certificate file", re.compile(r"\.(?:pem|p12|pfx|keystore|jks)$", re.IGNORECASE)),
]

# Deliberate, documented exceptions: the example files exist to be committed.
FILENAME_ALLOW = [
    re.compile(r"\.env\.(?:example|sample|template)$", re.IGNORECASE),
    re.compile(r"\.env\.example$", re.IGNORECASE),
]


def git(*args: str) -> tuple[int, str]:
    proc = subprocess.run(
        ["git", *args], capture_output=True, text=True, check=False
    )
    return proc.returncode, proc.stdout


def tracked_files(staged: bool, include_all: bool) -> list[str] | None:
    """Return the file list to scan, or None if it could not be determined."""
    if staged:
        code, out = git("diff", "--cached", "--name-only", "--diff-filter=ACMR")
        if code != 0:
            return None
        return [f for f in out.splitlines() if f.strip()]
    if include_all:
        code, out = git("ls-files", "--cached", "--others", "--exclude-standard")
    else:
        code, out = git("ls-files", "--cached")
    if code != 0:
        return None
    return [f for f in out.splitlines() if f.strip()]


def mask(match: str) -> str:
    """Show enough to recognise the finding, never enough to use it."""
    head = match[:8]
    return f"{head}… ({len(match)} chars)"


def scan_file(path: str) -> list[str]:
    findings: list[str] = []
    name = Path(path).name

    if not any(allow.search(path) for allow in FILENAME_ALLOW):
        for label, pattern in FILENAME_RULES:
            if pattern.search(path) or pattern.search(name):
                findings.append(f"{path}: the file itself is {label}")

    try:
        if Path(path).stat().st_size > MAX_BYTES:
            return findings
        text = Path(path).read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return findings  # binary or unreadable: no content rules applied

    for lineno, line in enumerate(text.splitlines(), start=1):
        if ALLOW_MARKER in line:
            continue
        for label, pattern in CONTENT_RULES:
            found = pattern.search(line)
            if found:
                findings.append(f"{path}:{lineno}: {label} — {mask(found.group(0))}")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--staged", action="store_true",
                        help="scan only files staged for commit (pre-commit)")
    parser.add_argument("--all", action="store_true",
                        help="also scan untracked, non-ignored files")
    args = parser.parse_args()

    code, _ = git("rev-parse", "--is-inside-work-tree")
    if code != 0:
        print("secret-scan: not inside a git work tree — cannot scan (this is NOT a pass).")
        return 2

    files = tracked_files(args.staged, args.all)
    if files is None:
        print("secret-scan: could not list files from git — cannot scan (this is NOT a pass).")
        return 2

    findings: list[str] = []
    for path in files:
        findings.extend(scan_file(path))

    scope = "staged" if args.staged else "tracked"
    if not findings:
        print(f"secret-scan: clean — {len(files)} {scope} file(s), no credentials found.")
        return 0

    print(f"secret-scan: {len(findings)} finding(s) in {scope} files — refusing to pass.\n")
    for finding in findings:
        print(f"  {finding}")
    print(
        "\nThese must not be committed. Remove the value, rotate it at the provider\n"
        "(removing a committed key does not invalidate it — the provider must issue a\n"
        "new one), and add the file to .gitignore. If a finding is a genuine false\n"
        f"positive, append `# {ALLOW_MARKER}` to that line and say why in the commit."
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
