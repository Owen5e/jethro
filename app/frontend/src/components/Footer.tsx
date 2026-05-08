import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a2e] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#d4a574]">
              Jethro Liberation Ministries Intl
            </h3>
            <p className="text-gray-300">
              A place of worship, community, and spiritual growth. Join us in
              our mission to spread love and faith.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/about" className="hover:text-[#d4a574] transition">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/ministries"
                  className="hover:text-[#d4a574] transition"
                >
                  Ministries
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-[#d4a574] transition">
                  Events
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#d4a574] transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-[#e94560]" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-[#e94560]" />
                <span>info@gracechurch.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-[#e94560] mt-1" />
                <span>
                  123 Faith Street
                  <br />
                  Hope City, ST 12345
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#e94560] transition">
                Facebook
              </a>
              <a href="#" className="hover:text-[#e94560] transition">
                Twitter
              </a>
              <a href="#" className="hover:text-[#e94560] transition">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#0f3460] pt-6">
          <p className="text-center text-gray-400">
            &copy; {currentYear} Jethro Liberation Ministries Intl. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
