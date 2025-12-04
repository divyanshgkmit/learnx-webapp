import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { courseAPI } from "@/services/api";
import { toast } from "@/components/ui/Sonner";
import { Search, User, BookOpen, Tag, Globe, Layers, Loader2 } from "lucide-react";
import { filterCourses } from "../utils/filterCourses";
import { COURSE_DIFFICULTY } from "../constants/courseOptions";

const fallbackImage =
  "https://placehold.co/600x400/1e293b/ffffff?text=No+Thumbnail";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const res = await courseAPI.getAll();
      setCourses(res.courses || []);
    } catch (err) {
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filtered = filterCourses(courses, search)
    .filter(course => {
      if (selectedDifficulty === "All") return true;
      return course.difficultyLevel === selectedDifficulty;
    });

  const difficultyLevels = ["All", ...COURSE_DIFFICULTY];

  return (
    <div className="w-full px-4 pt-6 pb-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm border border-blue-500/30">
            <BookOpen className="w-4 h-4" />
            Expand Your Knowledge
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Explore <span className="text-blue-400">Top Courses</span>
          </h1>

          <p className="text-gray-300 max-w-xl mx-auto mt-4">
            Discover expert-led courses designed to help you master new skills and advance your career.
          </p>
        </div>

        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by title, category, difficulty..."
              className="pl-11 bg-slate-800/50 border-gray-700 text-white placeholder:text-gray-400 py-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
          </div>
          {search && (
            <Button
              className="bg-gray-700 hover:bg-gray-600"
              onClick={() => setSearch("")}
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {difficultyLevels.map((level) => (
            <Button
              key={level}
              variant={selectedDifficulty === level ? "default" : "outline"}
              size="sm"
              className={`cursor-pointer ${selectedDifficulty === level 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-slate-800/30 hover:bg-slate-700/50 hover:text-white border-gray-600"}`}
              onClick={() => setSelectedDifficulty(level)}
              disabled={isLoading}
            >
              {level}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300 text-lg">Loading courses...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-center">
              Showing {filtered.length} of {courses.length} courses
              {selectedDifficulty !== "All" && ` (${selectedDifficulty})`}
              {search && ` matching "${search}"`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Card
                  key={course._id}
                  className="border-gray-800 bg-slate-800/50 backdrop-blur-sm flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.thumbnailUrl || fallbackImage}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-gray-400 mt-2 line-clamp-2">
                      {course.description}
                    </CardDescription>

                    <div className="mt-3 space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        {course.instructorId?.fullName || "Unknown Instructor"}
                      </p>

                      <p className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-400" />
                        {course.category}
                      </p>

                      <p className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-400" />
                        {course.difficultyLevel}
                      </p>

                      <p className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-yellow-400" />
                        {course.primaryLanguage}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                      <span className="text-xl font-bold text-blue-400">
                        {course.price === 0 ? "Free" : "$" + course.price}
                      </span>

                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        <Link to={`/courses/${course._id}`}>View Course</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  No courses found
                </h3>

                <p className="text-gray-400 mb-4 text-sm">
                  Try different filters or search terms
                </p>

                <Button 
                  onClick={() => {
                    setSearch("");
                    setSelectedDifficulty("All");
                  }} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}