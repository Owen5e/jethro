import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events', href: '/events' },
    { label: 'Giving', href: '/giving' },
    { label: 'Contact', href: '/contact' },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-[#16213e] border-t border-[#0f3460]">
      <div className="flex flex-col gap-4 py-4 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className="text-white hover:text-[#d4a574] transition py-2"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
