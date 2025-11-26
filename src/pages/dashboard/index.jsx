import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-lg animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome, {user?.fullName} 👋🏻
          </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        {user.role === "Instructor" ? <InstructorDashboard /> : <StudentDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
