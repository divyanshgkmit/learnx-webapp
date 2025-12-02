import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { BookOpen, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="backdrop-blur-sm w-full sticky top-0 z-50 border-b border-gray-800/50 bg-slate-900/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to={ROUTES.HOME} 
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LearnX</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link 
                to={ROUTES.COURSES} 
                className="text-gray-300 hover:text-white transition-colors font-medium relative group"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
              </Link>
              {isAuthenticated && (
                <Link 
                  to={ROUTES.DASHBOARD} 
                  className="text-gray-300 hover:text-white transition-colors font-medium relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Clickable User Profile */}
                  <Link 
                    to={ROUTES.PROFILE}
                    className="flex items-center space-x-2 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200 cursor-pointer group"
                  >
                    <User className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-blue-300 font-medium group-hover:text-blue-200">
                      {user?.fullName || "User"}
                    </span>
                  </Link>
                  
                  <Button
                    onClick={handleLogout}
                    className="bg-red-500/20 font-medium py-5 shadow-xs border border-red-500/20 text-red-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 text-white transition-all duration-200"
                  >
                    <Link to={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                  >
                    <Link to={ROUTES.REGISTER}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
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
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800 bg-slate-900/95 backdrop-blur-lg rounded-lg shadow-xl">
            <div className="space-y-2 mb-4">
              <Link
                to={ROUTES.COURSES}
                className="block py-3 px-4 text-gray-300 hover:text-white bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-gray-700/50 hover:border-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="block py-3 px-4 text-gray-300 hover:text-white bg-gray-800/50 rounded-lg transition-all duration-200 font-medium border border-gray-700/50 hover:border-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-gray-700/50 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center space-x-3 bg-blue-500/10 px-4 py-3 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-200 mb-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-300 font-medium text-sm">Hi, {user?.fullName}</p>
                      <p className="text-blue-400/80 text-xs">{user?.email}</p>
                    </div>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-center border-gray-600 text-red-500 bg-red-600/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center border-gray-600 text-gray-300 bg-gray-800 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                  
                  <Button
                    asChild
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to={ROUTES.REGISTER}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;