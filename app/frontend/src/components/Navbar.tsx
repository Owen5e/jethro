import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import jethrologo from '../assets/jethrologo.png';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#1a1a2e] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-15 h-15 rounded-full flex items-center justify-center font-bold text-lg">
              <img
                className="w-full h-full"
                src={jethrologo}
                alt="Jethro Liberation Ministries Intl"
              />
            </div>
            <span className="text-xl font-bold hidden sm:inline">
              Jethro Liberation Ministries Intl
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <Link to="/" className="hover:text-[#d4a574] transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-[#d4a574] transition">
              About
            </Link>
            <Link to="/ministries" className="hover:text-[#d4a574] transition">
              Ministries
            </Link>
            <Link to="/sermons" className="hover:text-[#d4a574] transition">
              Sermons
            </Link>
            <Link to="/events" className="hover:text-[#d4a574] transition">
              Events
            </Link>
            <Link to="/books" className="hover:text-[#d4a574] transition">
              Books
            </Link>
            <Link to="/blog" className="hover:text-[#d4a574] transition">
              Blog
            </Link>
            <Link to="/giving" className="hover:text-[#d4a574] transition">
              Giving
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && <MobileMenu isOpen={isOpen} onClose={toggleMenu} />}
      </div>
    </nav>
  );
}
