import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, Users } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: USER_ROLES.STUDENT
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.log(error);    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-white">Join LearnX</CardTitle>
            <CardDescription className="text-gray-400 text-base">Start your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    name="fullName" 
                    placeholder="Enter your full name" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className="bg-gray-800/50 border-gray-700 text-white pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="bg-gray-800/50 border-gray-700 text-white pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="bg-gray-800/50 border-gray-700 text-white pl-10 pr-10" 
                    required 
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="bg-gray-800/50 border-gray-700 text-white pl-10 pr-10" 
                    required 
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              
              {/* Beautiful Radio Button Selection */}
              <div className="space-y-3">
                <Label className="text-gray-300 text-base">Join as:</Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Student Option */}
                  <div
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      formData.role === USER_ROLES.STUDENT
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    onClick={() => handleRoleChange(USER_ROLES.STUDENT)}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={USER_ROLES.STUDENT}
                      checked={formData.role === USER_ROLES.STUDENT}
                      onChange={() => handleRoleChange(USER_ROLES.STUDENT)}
                      className="absolute opacity-0"
                    />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.role === USER_ROLES.STUDENT ? 'bg-blue-500/30' : 'bg-gray-700'
                      }`}>
                        <GraduationCap className={`w-5 h-5 ${
                          formData.role === USER_ROLES.STUDENT ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`font-medium ${
                        formData.role === USER_ROLES.STUDENT ? 'text-blue-400' : 'text-gray-300'
                      }`}>
                        Student
                      </span>
                      <p className={`text-xs ${
                        formData.role === USER_ROLES.STUDENT ? 'text-blue-300' : 'text-gray-400'
                      }`}>
                        Learn courses
                      </p>
                    </div>
                  </div>

                  <div
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      formData.role === USER_ROLES.INSTRUCTOR
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    onClick={() => handleRoleChange(USER_ROLES.INSTRUCTOR)}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={USER_ROLES.INSTRUCTOR}
                      checked={formData.role === USER_ROLES.INSTRUCTOR}
                      onChange={() => handleRoleChange(USER_ROLES.INSTRUCTOR)}
                      className="absolute opacity-0"
                    />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.role === USER_ROLES.INSTRUCTOR ? 'bg-blue-500/30' : 'bg-gray-700'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          formData.role === USER_ROLES.INSTRUCTOR ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`font-medium ${
                        formData.role === USER_ROLES.INSTRUCTOR ? 'text-blue-400' : 'text-gray-300'
                      }`}>
                        Instructor
                      </span>
                      <p className={`text-xs ${
                        formData.role === USER_ROLES.INSTRUCTOR ? 'text-blue-300' : 'text-gray-400'
                      }`}>
                        Teach courses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center text-gray-400 text-sm">
                Already have an account? <Link to={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300">Sign in</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;