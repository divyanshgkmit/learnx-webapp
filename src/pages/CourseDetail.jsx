import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Loader,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Sonner";
import { courseAPI, enrollmentAPI, moduleAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseAPI.getById(courseId);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    const fetchModules = async () => {
      setModulesLoading(true);
      try {
        const data = await moduleAPI.getByCourse(courseId);
        const list = Array.isArray(data) ? data : data?.data || [];
        setModules(list);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load modules");
      } finally {
        setModulesLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  useEffect(() => {
    if (!courseId || !user || user.role !== "Student") {
      setEnrolled(false);
      return;
    }

    let active = true;
    const checkEnrollment = async () => {
      setCheckingEnrollment(true);
      try {
        const status = await enrollmentAPI.status(courseId);
        if (active) setEnrolled(Boolean(status));
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
          toast.error(error.response?.data?.message || "Unable to verify enrollment");
        }
        if (active) setEnrolled(false);
      } finally {
        if (active) setCheckingEnrollment(false);
      }
    };

    checkEnrollment();
    return () => {
      active = false;
    };
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Please login to enroll in this course");
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(courseId);
      setEnrolled(true);
      toast.success("Enrollment successful!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to enroll. Please try again.";
      toast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  const learningHighlights = useMemo(() => {
    if (!course?.description) return [];
    return course.description
      .split(". ")
      .map((point) => point.trim())
      .filter(Boolean)
      .slice(0, 6)
      .map((point) => point.replace(/\.$/, ""));
  }, [course?.description]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-white text-lg flex items-center gap-3">
          <Loader className="w-5 h-5 animate-spin" />
          Loading course...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Course not found</h2>
          <p className="text-gray-400 mb-4">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 text-gray-300 hover:bg-white hover:text-black"
          >
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Courses</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="space-y-4">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm">
                  {course.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-300">
                <StatPill
                  icon={<Star className="w-4 h-4 text-yellow-400" />}
                  value={`${(course.rating ?? 4.8).toFixed(1)} Rating`}
                />
                <StatPill
                  icon={<Users className="w-4 h-4 text-green-400" />}
                  value={
                    course.students
                      ? course.students.toLocaleString()
                      : "New course"
                  }
                />
                <StatPill
                  icon={<Clock className="w-4 h-4 text-purple-400" />}
                  value={course.duration || "Self-paced"}
                />
                <StatPill
                  icon={<BookOpen className="w-4 h-4 text-blue-400" />}
                  value={`${course.lessons || modules.length} Lessons`}
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {course.instructorId?.fullName?.charAt(0) || "I"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-lg">Instructor</p>
                  <p className="text-gray-400">
                    {course.instructorId?.fullName || "Unknown Instructor"}
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <Card className="border-gray-700 bg-slate-800/50 backdrop-blur-xs sticky top-6">
                <CardContent className="p-6 space-y-6">
                  <div className="text-3xl font-bold text-white text-center">
                  {course.price === 0 ? (
                    "Free"
                  ) : (
                    <span>${course.price}</span>
                  )}
                  </div>

                  {user?.role === "Instructor" ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400 text-center">
                        You are an instructor. Manage this course from the dashboard.
                      </div>
                    </div>
                  ) : enrolled ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Enrolled
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-gray-600 text-black h-12"
                      >
                        <Link
                          to={`${ROUTES.LEARN.replace(":courseId", courseId)}${
                            modules.length ? `?module=${modules[0]._id}` : ""
                          }`}
                          className="flex items-center justify-center"
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Start Learning
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling || checkingEnrollment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                    >
                      {enrolling ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  )}

                  <div className="space-y-3 text-sm border-t border-gray-700 pt-4">
                    <InfoRow label="Level" value={course.difficultyLevel} />
                    <InfoRow label="Language" value={course.primaryLanguage} />
                    <InfoRow label="Category" value={course.category} />
                    <InfoRow
                      label="Published"
                      value={course.isPublished ? "Yes" : "Draft"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Course Content
              </h2>
              <p className="text-gray-400">
                {modules.length} modules • {course.duration || "Self-paced"}
              </p>
            </div>

            <div className="space-y-3">
              {modulesLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Loading modules...
                </div>
              ) : modules.length === 0 ? (
                <Card className="border-dashed border-gray-700 bg-slate-800/30">
                  <CardContent className="p-6 text-center text-gray-400">
                    Modules will appear here once the instructor adds them.
                  </CardContent>
                </Card>
              ) : (
                modules.map((module, index) => (
                  <Card
                    key={module._id}
                    className="border-gray-700 bg-slate-800/50 backdrop-blur-xs hover:border-gray-600 transition-colors"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-lg mb-1 line-clamp-2">
                              {module.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                              <div className="flex items-center gap-1">
                                <PlayCircle className="w-4 h-4" />
                                {module.duration || "10 min"}
                              </div>
                              {module.description && (
                                <p className="text-gray-500 text-sm line-clamp-1">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {user?.role !== "Instructor" && (
                          enrolled ? (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 ml-4 flex-shrink-0"
                            >
                              <Link to={`${ROUTES.LEARN.replace(":courseId", courseId)}?module=${module._id}`}>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Watch</span>
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-gray-200 hover:bg-slate-700/40 ml-4 flex-shrink-0"
                              onClick={() => toast.info("Enroll to watch this lesson")}
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Watch
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="xl:col-span-1">
            <Card className="border-gray-700 bg-slate-800/50 backdrop-blur-xs sticky top-6">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningHighlights.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    Detailed learning objectives will appear here once the
                    instructor adds them.
                  </p>
                )}
                {learningHighlights.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {point}.
                    </span>
                  </div>
                ))}

                <div className="mt-6 pt-6 border-t border-gray-700 space-y-2 text-sm text-gray-300">
                  <h4 className="text-white font-medium mb-3">
                    This course includes:
                  </h4>
                  <FeatureRow
                    icon={<PlayCircle className="w-4 h-4 text-blue-400" />}
                    text={`${modules.length} on-demand videos`}
                  />
                  <FeatureRow
                    icon={<Clock className="w-4 h-4 text-green-400" />}
                    text={course.duration || "Lifetime access"}
                  />
                  <FeatureRow
                    icon={<BookOpen className="w-4 h-4 text-purple-400" />}
                    text="Certificate of completion"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
      {icon}
      <span className="font-medium">{value}</span>
      <span className="text-gray-400 text-xs uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}