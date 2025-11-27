import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { moduleAPI, courseAPI } from "@/services/api";
import { ROUTES } from "@/constants/routes";
import { Loader2, Play, Clock, ArrowLeft, BookOpen, Video, List } from "lucide-react";

const WatchCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const [courseData, moduleData] = await Promise.all([
          courseAPI.getById(courseId),
          moduleAPI.getByCourse(courseId),
        ]);
        setCourse(courseData);
        const normalizedModules = Array.isArray(moduleData) ? moduleData : moduleData?.data || [];
        setModules(normalizedModules);
        const queryModule = new URLSearchParams(window.location.search).get("module");
        if (queryModule && normalizedModules.some((m) => m._id === queryModule)) {
          setActiveModuleId(queryModule);
        } else if (normalizedModules.length) {
          setActiveModuleId(normalizedModules[0]._id);
          setSearchParams({ module: normalizedModules[0]._id }, { replace: true });
        } else {
          setActiveModuleId(null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to load course content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, setSearchParams]);

  useEffect(() => {
    const queryModule = searchParams.get("module");
    if (!queryModule || modules.length === 0) return;
    if (modules.some((m) => m._id === queryModule)) {
      setActiveModuleId((prev) => (prev === queryModule ? prev : queryModule));
    }
  }, [searchParams, modules]);

  const activeModule = useMemo(
    () => modules.find((mod) => mod._id === activeModuleId),
    [modules, activeModuleId]
  );

  const handleModuleSelect = (moduleId) => {
    setLoadingVideo(true);
    setActiveModuleId(moduleId);
    setSearchParams({ module: moduleId }, { replace: true });
    setTimeout(() => setLoadingVideo(false), 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          Loading your classroom...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="bg-slate-900/60 border-gray-800 max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-white">Course not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">We couldn't locate this course. Try returning to the catalog.</p>
            <Button onClick={() => navigate(ROUTES.COURSES)}>Back to Courses</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-200 bg-transparent"
              onClick={() => navigate(ROUTES.COURSE_DETAIL.replace(":courseId", courseId))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <span className="hidden sm:inline">Course ID: {courseId}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{course.category}</Badge>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-purple-400" /> {modules.length} <span className="hidden sm:inline">modules</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-emerald-400" /> {course.duration || "Self-paced"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <Card className="border-gray-800 bg-slate-900/60 backdrop-blur-sm h-fit lg:w-[340px] lg:sticky lg:top-4">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <List className="w-4 h-4 text-blue-400" />
                Course Modules
              </CardTitle>
              <p className="text-gray-400 text-sm">Pick a lesson to watch. Progress is synced automatically.</p>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {modules.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-4">
                  No modules yet. Check back soon!
                </div>
              )}
              {modules.map((module, index) => {
                const isActive = module._id === activeModuleId;
                return (
                  <button
                    key={module._id}
                    onClick={() => handleModuleSelect(module._id)}
                    className={`w-full text-left rounded-lg border px-3 py-3 transition ${
                      isActive
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 hover:border-gray-600 hover:bg-gray-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs text-gray-300">
                        {index + 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration || "—"}
                      </span>
                    </div>
                    <p className="text-white font-medium line-clamp-2">{module.title}</p>
                    {module.courseId?.title && (
                      <p className="text-xs text-gray-500 mt-1">{module.courseId.title}</p>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex-1 space-y-4">
            <Card className="border-gray-800 bg-slate-900/70 backdrop-blur-sm">
              <CardContent className="p-0">
                {activeModule && activeModule.videoUrl ? (
                  <div className="relative">
                    {loadingVideo && (
                      <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                      </div>
                    )}
                    <video
                      key={activeModule._id}
                      controls
                      src={activeModule.videoUrl}
                      className="w-full rounded-t-xl bg-black"
                      poster={course.thumbnailUrl || undefined}
                      onLoadStart={() => setLoadingVideo(true)}
                      onLoadedData={() => setLoadingVideo(false)}
                    />
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Play className="w-4 h-4 text-green-400" />
                        Now playing
                      </div>
                      <h2 className="text-2xl font-semibold text-white">{activeModule.title}</h2>
                      <p className="text-gray-400 text-sm">
                        Duration: {activeModule.duration || "—"} • Order #{activeModule.order || "—"}
                      </p>
                      {activeModule.description && (
                        <p className="text-gray-300 text-sm leading-relaxed">{activeModule.description}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-400">
                    <Video className="w-10 h-10 mx-auto mb-4 text-gray-500" />
                    Select a module to start watching.
                  </div>
                )}
              </CardContent>
            </Card>

            {course && (
              <Card className="border-gray-800 bg-slate-900/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">About this course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-400 text-sm">
                  <p>{course.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-2">
                    <span>Instructor: {course.instructorId?.fullName || "Unknown"}</span>
                    <span>Level: {course.difficultyLevel}</span>
                    <span>Language: {course.primaryLanguage}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;

