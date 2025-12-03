import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Mail, Calendar, Shield, BookOpen, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "../utils";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 bg-slate-800/80">
          <h2 className="text-xl font-semibold text-white mb-2">User Not Found</h2>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to={ROUTES.LOGIN}>Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto lg:max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6 lg:mb-8 text-center">
            Profile
          </h1>
          
          <Card className="border-slate-700 bg-slate-800/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-4 lg:pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl lg:text-2xl text-white">{user?.fullName}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 lg:space-y-5">
              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <Mail className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <Shield className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white font-medium">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <Calendar className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6">
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2">
                  <Link to={ROUTES.COURSES} className="flex items-center justify-center space-x-2">
                    <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base">Courses</span>
                  </Link>
                </Button>
                
                <Button asChild className="flex-1 hover:bg-slate-300 bg-white text-black py-2">
                  <Link to={ROUTES.DASHBOARD} className="flex items-center justify-center space-x-2">
                    <LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base">Dashboard</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;