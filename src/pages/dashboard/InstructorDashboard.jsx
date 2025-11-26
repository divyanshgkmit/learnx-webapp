import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { courseAPI, uploadAPI } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { COURSE_CATEGORIES, COURSE_DIFFICULTY, COURSE_LANGUAGES } from "@/constants/courseOptions";
import { ROUTES } from "@/constants/routes";
import {
  BookOpen,
  CheckCircle2,
  DollarSign,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

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

const StatCard = ({ title, value, icon: Icon, description, accent }) => (
  <Card className="border-gray-800 bg-slate-900/50 backdrop-blur">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      <div className={`rounded-full p-2 ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-white">{value}</div>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </CardContent>
  </Card>
);

const CourseRow = ({ course, onManage, onDelete, onTogglePublish, deleting, toggling }) => {
  const updatedAt = course.updatedAt ? new Date(course.updatedAt).toLocaleString() : "—";

  return (
    <div className="p-4 border border-gray-800 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 transition">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-0">
        <div className="flex-1 space-y-1">
          <div className="flex items-center flex-wrap gap-2">
            <h4 className="text-lg font-semibold text-white">{course.title}</h4>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                course.isPublished
                  ? "bg-green-500/20 text-green-300 border border-green-500/40"
                  : "bg-yellow-500/20 text-yellow-200 border border-yellow-500/40"
              }`}
            >
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{course.description || "No description yet."}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 pt-1">
            <span className="uppercase tracking-wide">{course.category || "Uncategorized"}</span>
            <span>• {course.difficultyLevel || "—"}</span>
            <span>• {course.primaryLanguage || "—"}</span>
            <span>• Updated {updatedAt}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:pl-6">
          <p className="text-xl font-semibold text-blue-300">${Number(course.price || 0).toFixed(2)}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-200 bg-gray-900/40"
              onClick={() => onManage(course._id)}
            >
              <Pencil className="w-4 h-4" />
              Manage
            </Button>
            <Button
              size="sm"
              className={course.isPublished ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
              disabled={toggling}
              onClick={() => onTogglePublish(course)}
            >
              {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : course.isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-red-500/40 text-red-300 bg-red-500/40"
              onClick={() => onDelete(course)}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const instructorId = user?._id || user?.id || user?.userId;
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultCourseForm);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const fetchCourses = useCallback(async () => {
    if (!instructorId) {
      setCourses([]);
      setLoadingCourses(false);
      return;
    }
    setLoadingCourses(true);
    try {
      const response = await courseAPI.getInstructorCourses(instructorId);
      const items = Array.isArray(response)
        ? response
        : response?.data || response?.courses || [];
      setCourses(items);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to fetch courses");
    } finally {
      setLoadingCourses(false);
    }
  }, [instructorId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((c) => c.isPublished).length;
    const draft = total - published;
    const revenue = courses.reduce((sum, c) => sum + Number(c.price || 0), 0);
    return [
      {
        title: "Total Courses",
        value: total,
        icon: BookOpen,
        description: `${published} live • ${draft} drafts`,
        accent: "bg-blue-600/40 border border-blue-500/30",
      },
      {
        title: "Published",
        value: published,
        icon: CheckCircle2,
        description: "Visible to students",
        accent: "bg-green-600/40 border border-green-500/30",
      },
      {
        title: "Drafts",
        value: draft,
        icon: RefreshCw,
        description: "Keep iterating",
        accent: "bg-yellow-600/30 border border-yellow-500/30",
      },
      {
        title: "Potential Revenue",
        value: `$${revenue.toFixed(2)}`,
        icon: DollarSign,
        description: "Sum of listed prices",
        accent: "bg-purple-600/40 border border-purple-500/30",
      },
    ];
  }, [courses]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const resetForm = () => {
    setFormData(defaultCourseForm);
    setThumbnailPreview("");
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { thumbnailFile, ...baseForm } = formData;
      const payload = {
        title: baseForm.title.trim(),
        category: baseForm.category.trim(),
        difficultyLevel: baseForm.difficultyLevel,
        description: baseForm.description.trim(),
        price: Number(baseForm.price) || 0,
        primaryLanguage: baseForm.primaryLanguage,
        isPublished: Boolean(baseForm.isPublished),
      };

      if (!payload.title || !payload.description) {
        toast.error("Title and description are required");
        setSubmitting(false);
        return;
      }

      if (!thumbnailFile) {
        toast.error("Thumbnail image is required for new courses");
        setSubmitting(false);
        return;
      }

      const createdCourse = await courseAPI.create(payload);
      if (thumbnailFile && createdCourse?._id) {
        try {
          await uploadAPI.uploadCourseThumbnail(createdCourse._id, thumbnailFile);
        } catch (uploadError) {
          console.error(uploadError);
          toast.error("Course saved but thumbnail upload failed");
        }
      }
      toast.success("Course created");

      await fetchCourses();
      resetForm();
      setIsFormVisible(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(`Delete "${course.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingId(course._id);
    try {
      await courseAPI.delete(course._id);
      toast.success("Course deleted");
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (course) => {
    setTogglingId(course._id);
    try {
      await courseAPI.update(course._id, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? "Course moved to draft" : "Course published");
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isPublished: !course.isPublished } : c))
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update course status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleManageCourse = (courseId) => {
    navigate(ROUTES.COURSE_EDITOR.replace(":courseId", courseId));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <Card className="border-gray-800 bg-slate-900/50 backdrop-blur">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Your Courses</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-200 bg-transparent"
                onClick={fetchCourses}
              >
                {loadingCourses ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreateForm}>
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingCourses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No courses yet. Start by creating your first course.</p>
              </div>
            ) : (
              courses.map((course) => (
                <CourseRow
                  key={course._id}
                  course={course}
                  onManage={handleManageCourse}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  deleting={deletingId === course._id}
                  toggling={togglingId === course._id}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Create New Course</CardTitle>
            <CardDescription className="text-gray-400">
              Fill the form to push changes to the backend instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFormVisible ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Full Stack Development"
                    className="bg-slate-900/60 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {COURSE_CATEGORIES.map((option) => (
                      <option key={option} value={option} className="bg-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Difficulty Level</Label>
                    <select
                      value={formData.difficultyLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, difficultyLevel: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {COURSE_DIFFICULTY.map((option) => (
                        <option key={option} value={option} className="bg-slate-900">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Primary Language</Label>
                    <select
                      value={formData.primaryLanguage}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, primaryLanguage: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {COURSE_LANGUAGES.map((option) => (
                        <option key={option} value={option} className="bg-slate-900">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your course..."
                    rows={4}
                    className="w-full rounded-md border border-gray-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Price (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="89.99"
                    className="bg-slate-900/60 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Thumbnail Image</Label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setFormData((prev) => ({ ...prev, thumbnailFile: file || null }));
                        if (file) {
                          setThumbnailPreview(URL.createObjectURL(file));
                        } else {
                          setThumbnailPreview("");
                        }
                      }}
                      className="w-full rounded-md border border-dashed border-gray-700 bg-slate-900/40 px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Course thumbnail preview"
                        className="h-48 w-full rounded-lg object-cover border border-gray-800"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-slate-900/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-white">Publish immediately</p>
                    <p className="text-xs text-gray-400">Toggle to keep as draft</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="peer h-6 w-11 rounded-full border border-gray-700 bg-gray-700 transition peer-checked:bg-blue-600"></div>
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Course"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-700 text-black"
                    onClick={() => {
                      resetForm();
                      setIsFormVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Ready to ship your next idea?</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={openCreateForm}>
                  <Plus className="w-4 h-4" /> Start Building
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;