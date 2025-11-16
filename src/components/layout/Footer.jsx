import { Link } from "react-router-dom";
import { Heart, BookOpen, Github, Twitter, Mail, Linkedin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/constants";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800/50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 group mb-4"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LearnX</span>
            </Link>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              Empowering learners and instructors with modern, accessible education technology. 
              Transform your skills with our comprehensive learning platform.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <div className="space-y-3">
              {FOOTER_LINKS.PLATFORM.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.label}
                    to={social.href}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
                    aria-label={social.ariaLabel}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 LearnX LMS. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-blue-400 fill-current animate-pulse" />
              <span>by <a href="https://github.com/divyanshgkmit" target="_blank" className="hover:text-blue-400 underline cursor-pointer">Divyansh</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
