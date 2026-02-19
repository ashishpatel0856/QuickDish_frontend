import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
      { label: 'Press', path: '/press' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Safety', path: '/safety' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
    ],
    partners: [
      { label: 'Add Restaurant', path: '/partner' },
      { label: 'Become Driver', path: '/driver' },
      { label: 'For Enterprise', path: '/enterprise' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white text-xl font-bold">Q</span>
              </div>
              <span className="text-2xl font-bold gradient-text">QuickDish</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-sm">Delivering happiness to your doorstep. Order your favorite food from the best restaurants in your city.</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600"><Mail className="w-5 h-5 text-primary-500" /><span>support@quickdish.com</span></div>
              <div className="flex items-center space-x-3 text-gray-600"><Phone className="w-5 h-5 text-primary-500" /><span>+91 1800-123-4567</span></div>
              <div className="flex items-center space-x-3 text-gray-600"><MapPin className="w-5 h-5 text-primary-500" /><span>Delhi, India</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-gray-600 hover:text-primary-600 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-gray-600 hover:text-primary-600 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Partners</h3>
            <ul className="space-y-3">
              {footerLinks.partners.map((link) => (
                <li key={link.label}><Link to={link.path} className="text-gray-600 hover:text-primary-600 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">© {currentYear} QuickDish. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;