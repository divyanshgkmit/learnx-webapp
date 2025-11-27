import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Layers, Loader2, PlusCircle, Save, Trash2, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { courseAPI, moduleAPI, uploadAPI } from "@/services/api";
import { COURSE_CATEGORIES, COURSE_DIFFICULTY, COURSE_LANGUAGES } from "@/constants/courseOptions";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

const defaultCourseForm = {
  title: "",
  category: "",
  difficultyLevel: COURSE_DIFFICULTY[0],
  description: "",
  price: "",
  primaryLanguage: COURSE_LANGUAGES[0],
  isPublished: true,
  thumbnailFile: null,
};

const defaultModuleForm = {
  title: "",
  duration: "",
  videoFile: null,
};

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(defaultCourseForm);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [modules, setModules] = useState([]);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [moduleSubmitting, setModuleSubmitting] = useState(false);
  const [deletingModules, setDeletingModules] = useState({});
  const [moduleForm, setModuleForm] = useState(defaultModuleForm);

  const isInstructor = user?.role === "Instructor";

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoadingCourse(true);
    try {
      const data = await courseAPI.getById(courseId);
      setCourse(data);
      setCourseForm({
        title: data?.title || "",
        category: data?.category || "",
        difficultyLevel: data?.difficultyLevel || COURSE_DIFFICULTY[0],
        description: data?.description || "",
        price: data?.price?.toString() || "",
        primaryLanguage: data?.primaryLanguage || COURSE_LANGUAGES[0],
        isPublished: Boolean(data?.isPublished),
        thumbnailFile: null,
      });
      setThumbnailPreview(data?.thumbnailUrl || "");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load course");
    } finally {
      setLoadingCourse(false);
    }
  }, [courseId]);

  const fetchModules = useCallback(async () => {
    if (!courseId) return;
    setLoadingModules(true);
    try {
      const data = await moduleAPI.getByCourse(courseId);
      setModules(Array.isArray(data) ? data : data?.modules || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load modules");
    } finally {
      setLoadingModules(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
    fetchModules();
  }, [fetchCourse, fetchModules]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const courseMeta = useMemo(() => {
    if (!course) return [];
    return [
      {
        label: "Category",
        value: course.category || "Uncategorized",
        icon: Layers,
      },
      {
        label: "Difficulty",
        value: course.difficultyLevel || "N/A",
        icon: CheckCircle2,
      },
      {
        label: "Language",
        value: course.primaryLanguage || "N/A",
        icon: BookOpen,
      },
      {
        label: "Modules",
        value: modules.length,
        icon: Video,
      },
    ];
  }, [course, modules.length]);

  const handleCourseUpdate = async (event) => {
    event.preventDefault();
    if (!courseId) return;
    setCourseSubmitting(true);
    try {
      const { thumbnailFile, ...rest } = courseForm;
      const payload = {
        ...rest,
        price: Number(rest.price) || 0,
      };
      await courseAPI.update(courseId, payload);
      if (thumbnailFile) {
        try {
          const uploadResponse = await uploadAPI.uploadCourseThumbnail(courseId, thumbnailFile);
          if (uploadResponse?.thumbnailUrl) {
            setThumbnailPreview(uploadResponse.thumbnailUrl);
          }
          setCourseForm((prev) => ({ ...prev, thumbnailFile: null }));
        } catch (uploadError) {
          console.error(uploadError);
          toast.error("Course updated but thumbnail upload failed");
        }
      }
      toast.success("Course details updated");
      await fetchCourse();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setCourseSubmitting(false);
    }
  };

  const handleModuleCreate = async (event) => {
    event.preventDefault();
    if (!courseId) return;
    if (!moduleForm.videoFile) {
      toast.error("Please select a video file");
      return;
    }
    setModuleSubmitting(true);
    let createdModule = null;
    try {
      const modulePayload = {
        courseId,
        title: moduleForm.title.trim(),
        duration: moduleForm.duration.trim(),
        videoUrl: "uploading",
      };
      createdModule = await moduleAPI.create(modulePayload);
      await uploadAPI.uploadModuleVideo(createdModule._id, moduleForm.videoFile);
      toast.success("Module added");
      setModuleForm(defaultModuleForm);
      await fetchModules();
    } catch (error) {
      console.error(error);
      if (createdModule?._id) {
        try {
          await moduleAPI.delete(createdModule._id);
        } catch (cleanupError) {
          console.error("Failed to cleanup module after upload error", cleanupError);
        }
      }
      toast.error(error.response?.data?.message || "Failed to create module");
    } finally {
      setModuleSubmitting(false);
    }
  };

  const handleModuleDelete = async (moduleId) => {
    if (!moduleId) return;
    
    setDeletingModules(prev => ({ ...prev, [moduleId]: true }));
    try {
      await moduleAPI.delete(moduleId);
      setModules(prev => prev.filter(module => module._id !== moduleId));
      toast.success("Module deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete module");
    } finally {
      setDeletingModules(prev => ({ ...prev, [moduleId]: false }));
    }
  };

  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="border-gray-800 bg-slate-900/70 backdrop-blur max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-white">Restricted</CardTitle>
            <CardDescription className="text-gray-400">
              Only instructors can manage courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Back to dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-4 justify-between md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-200 bg-transparent"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Last updated</p>
            <p className="text-white font-semibold">
              {course?.updatedAt ? new Date(course.updatedAt).toLocaleString() : "—"}
            </p>
          </div>
        </div>

        {loadingCourse ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : !course ? (
          <div className="text-center text-gray-400 py-16">
            <p>Course not found.</p>
            <Button className="mt-4" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Go back
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-gray-800 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Edit Course
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      courseForm.isPublished
                        ? "border-green-500/40 text-green-300 bg-green-500/10"
                        : "border-yellow-500/40 text-yellow-200 bg-yellow-500/10"
                    }`}
                  >
                    {courseForm.isPublished ? "Published" : "Draft"}
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update course metadata, pricing, and thumbnail. Changes save immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCourseUpdate}>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={courseForm.title}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-900/60 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Category</Label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {COURSE_CATEGORIES.map((category) => (
                          <option key={category} value={category} className="bg-slate-900">
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Difficulty</Label>
                      <select
                        value={courseForm.difficultyLevel}
                        onChange={(e) =>
                          setCourseForm((prev) => ({ ...prev, difficultyLevel: e.target.value }))
                        }
                        className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {COURSE_DIFFICULTY.map((level) => (
                          <option key={level} value={level} className="bg-slate-900">
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Primary Language</Label>
                      <select
                        value={courseForm.primaryLanguage}
                        onChange={(e) =>
                          setCourseForm((prev) => ({ ...prev, primaryLanguage: e.target.value }))
                        }
                        className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {COURSE_LANGUAGES.map((language) => (
                          <option key={language} value={language} className="bg-slate-900">
                            {language}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Price (USD)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, price: e.target.value }))}
                        className="bg-slate-900/60 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Description</Label>
                    <textarea
                      rows={5}
                      value={courseForm.description}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Explain what students will learn..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Thumbnail</Label>
                    <div className="flex flex-col gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setCourseForm((prev) => ({ ...prev, thumbnailFile: file || null }));
                          if (file) {
                            setThumbnailPreview(URL.createObjectURL(file));
                          } else {
                            setThumbnailPreview(course?.thumbnailUrl || "");
                          }
                        }}
                        className="w-full rounded-md border border-dashed border-gray-700 bg-slate-900/40 px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="h-48 w-full rounded-lg object-cover border border-gray-800"
                        />
                      ) : (
                        <div className="h-48 w-full rounded-lg border border-dashed border-gray-800 flex items-center justify-center text-gray-500 text-sm">
                          No thumbnail
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-slate-900/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-white">Publish Status</p>
                      <p className="text-xs text-gray-400">
                        Toggle to hide course from catalog while editing.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={courseForm.isPublished}
                        onChange={(e) =>
                          setCourseForm((prev) => ({ ...prev, isPublished: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="peer h-6 w-11 rounded-full border border-gray-700 bg-gray-700 transition peer-checked:bg-blue-600"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={courseSubmitting}>
                      {courseSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-gray-800 bg-slate-900/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    Modules ({modules.length})
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Each module is visible to enrolled students immediately.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {loadingModules ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-6">
                      No modules yet. Create the first lesson below.
                    </div>
                  ) : (
                    modules.map((module) => (
                      <div
                        key={module._id}
                        className="rounded-lg border border-gray-800 bg-slate-900/40 px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-white font-semibold">{module.title}</p>
                          <span className="text-xs text-gray-400">{module.duration || "—"}</span>
                        </div>
                        <p className="text-xs text-gray-400 break-all">{module.videoUrl}</p>
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleModuleDelete(module._id)}
                            disabled={deletingModules[module._id]}
                            className="h-7 px-2 text-xs"
                          >
                            {deletingModules[module._id] ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-slate-900/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-green-400" />
                    Add Module
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Provide a title, video file, and duration to append a module.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3" onSubmit={handleModuleCreate}>
                    <div className="space-y-1.5">
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900/60 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-300">Lesson Video</Label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setModuleForm((prev) => ({ ...prev, videoFile: file }));
                        }}
                        className="w-full rounded-md border border-dashed border-gray-700 bg-slate-900/40 px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      {moduleForm.videoFile && (
                        <p className="text-xs text-gray-400">
                          Selected: <span className="text-white">{moduleForm.videoFile.name}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-300">Duration (mm:ss)</Label>
                      <Input
                        value={moduleForm.duration}
                        onChange={(e) => setModuleForm((prev) => ({ ...prev, duration: e.target.value }))}
                        placeholder="25:00"
                        className="bg-slate-900/60 border-gray-700 text-white"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={moduleSubmitting}>
                      {moduleSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          Create Module
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-slate-900/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseMeta.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-slate-900/40 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 text-gray-300">
                        <item.icon className="w-4 h-4 text-blue-400" />
                        {item.label}
                      </div>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditor;