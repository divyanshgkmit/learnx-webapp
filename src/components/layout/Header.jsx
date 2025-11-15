import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";

const menuItems = [
  { label: 'Courses', href: ROUTES.COURSES },
  { label: 'Dashboard', href: ROUTES.DASHBOARD }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-sm w-full fixed top-0 z-50 border-b-2 border-gray-800/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LearnX</span>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-300 hover:text-white transition-all duration-200 font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
            >
              <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <Link to={ROUTES.REGISTER}>Start Learning</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden top-full left-0 right-0 w-full backdrop-blur-lg border-y border-gray-800 shadow-xl my-3">
            <div className="container mx-auto py-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-black bg-white justify-center hover:bg-gray-300 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to={ROUTES.SIGN_IN}>Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to={ROUTES.REGISTER}>Start Learning</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;