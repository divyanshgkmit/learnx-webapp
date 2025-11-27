import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, PlayCircle, Clock, Award, Loader2, CheckCircle2 } from "lucide-react";
import { enrollmentAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/Sonner";
import { ROUTES } from "@/constants/routes";

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

const CourseCard = ({ enrollment }) => {
  const course = enrollment.courseId || enrollment;
  const courseId = course._id || course.id;
  const progress = enrollment.progress || 0;
  
  const [isCompleted, setIsCompleted] = useState(enrollment.isCompleted || false);
  const [markingComplete, setMarkingComplete] = useState(false);

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      await enrollmentAPI.markAsCompleted(courseId);
      setIsCompleted(true);
      toast.success("Course marked as completed!");
    } catch (error) {
      toast.error("Failed to update course status");
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors bg-slate-800/40">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-white text-base md:text-lg line-clamp-2">{course.title}</h4>
        {isCompleted ? (
          <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium border border-green-500/30">
            Completed
          </div>
        ) : (
          <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
            {progress}%
          </div>
        )}
      </div>
      <p className="text-sm md:text-base text-gray-400 mb-2">
        {course.category || "Uncategorized"}
      </p>
      {!isCompleted && (
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {course.difficultyLevel || "All Levels"}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {course.primaryLanguage || "English"}
        </span>
      </div>
      
      <Button
        onClick={handleMarkComplete}
        disabled={markingComplete || isCompleted}
        className="w-full mb-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {markingComplete ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </>
        ) : (
          <>
            <Award className="w-4 h-4" />
            Mark Complete
          </>
        )}
      </Button>
      
      <Button
        asChild
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
        size="sm"
      >
        <Link to={ROUTES.LEARN.replace(":courseId", courseId)}>
          <PlayCircle className="w-4 h-4" />
          {isCompleted ? "Review Course" : "Continue Learning"}
        </Link>
      </Button>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const studentId = user.id;
        const data = await enrollmentAPI.getStudentEnrollments(studentId);
        const normalized = data || [];
        setEnrollments(normalized);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        toast.error("Unable to load enrolled courses");
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.isCompleted).length;
    const inProgress = total - completed;
    return [
      {
        title: "Enrolled Courses",
        value: total,
        icon: BookOpen,
        iconColor: "text-blue-400",
        description: `${inProgress} in progress`,
      },
      {
        title: "In Progress",
        value: inProgress,
        icon: Clock,
        iconColor: "text-green-400",
        description: "Active learning",
      },
      {
        title: "Completed",
        value: completed,
        icon: Award,
        iconColor: "text-purple-400",
        description: "Courses finished",
      },
    ];
  }, [enrollments]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl">My Enrolled Courses</CardTitle>
          <CardDescription className="text-gray-400 text-sm md:text-base">
            {loading
              ? "Loading your courses..."
              : enrollments.length === 0
              ? "You haven't enrolled in any courses yet"
              : "Continue your learning journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium mb-2">No enrolled courses</p>
              <p className="text-sm mb-4">Browse courses and enroll to start learning!</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to={ROUTES.COURSES}>Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment) => (
                <CourseCard key={enrollment._id} enrollment={enrollment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;