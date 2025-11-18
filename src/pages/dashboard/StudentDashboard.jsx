import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Clock, Award } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, iconColor, description }) => (
  <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs">
    <CardHeader className="flex items-center justify-between">
      <CardTitle className="text-lg font-medium text-gray-400">{title}</CardTitle>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-white">{value}</div>
      <p className="text-sm text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const CourseCard = ({ course }) => (
  <div className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-semibold text-white text-base md:text-lg">{course.title}</h4>
      <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm md:text-base">
        {course.progress}%
      </div>
    </div>
    <p className="text-sm md:text-base text-gray-400 mb-2">by {course.instructor}</p>
    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${course.progress}%` }}
      />
    </div>
    <div className="flex justify-between text-sm md:text-base text-gray-400 mb-3">
      <span>Next: {course.nextModule}</span>
      <span>{course.timeSpent}</span>
    </div>
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2" size="sm">
      <PlayCircle className="w-5 h-5" />
      Continue
    </Button>
  </div>
);

const StudentDashboard = () => {
  const enrolledCourses = [
    { id: 1, title: "React Masterclass", progress: 65, instructor: "John Doe", nextModule: "State Management", timeSpent: "12h 30m" },
    { id: 2, title: "Node.js Fundamentals", progress: 30, instructor: "Jane Smith", nextModule: "Express.js Basics", timeSpent: "5h 15m" },
    { id: 3, title: "UI/UX Design Principles", progress: 80, instructor: "Mike Johnson", nextModule: "Prototyping", timeSpent: "18h 45m" },
    { id: 1, title: "React Masterclass", progress: 65, instructor: "John Doe", nextModule: "State Management", timeSpent: "12h 30m" },
    { id: 2, title: "Node.js Fundamentals", progress: 30, instructor: "Jane Smith", nextModule: "Express.js Basics", timeSpent: "5h 15m" },
    { id: 3, title: "UI/UX Design Principles", progress: 80, instructor: "Mike Johnson", nextModule: "Prototyping", timeSpent: "18h 45m" },
  ];

  const stats = [
    { title: "Enrolled Courses", value: enrolledCourses.length, icon: BookOpen, iconColor: "text-blue-400", description: "Active courses" },
    { title: "Time Spent", value: "36h 30m", icon: Clock, iconColor: "text-green-400", description: "This month" },
    { title: "Courses Completed", value: 7, icon: Award, iconColor: "text-purple-400", description: "This Year" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl">Continue Learning</CardTitle>
          <CardDescription className="text-gray-400 text-sm md:text-base">
            Pick up where you left off
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
