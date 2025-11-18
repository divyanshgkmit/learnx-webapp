import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, PlayCircle, BookOpen } from "lucide-react";

import { COURSES as courses } from "../constants/courseMockData";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clearFilters = () => {
    setSearchTerm("");
  };

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const q = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(q) ||
      course.instructor.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="space-y-8">
        <section className="px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium my-6 border border-blue-500/30 backdrop-blur-xs">
              <BookOpen className="w-4 h-4" />
              Expand Your Knowledge
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Explore Our <span className="text-blue-400">Courses</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover expert-led courses designed to help you master new
              skills and advance your career.
            </p>
          </div>
        </section>

        <section className="px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-cente flex-col sm:flex-row lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search courses by title, instructor, or topic..."
                  className="pl-12 bg-slate-800/50 border-gray-700 text-white placeholder:text-gray-400 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                {searchTerm && (
                <Button
                  className="h-10 border-gray-800 bg-gray-700 text-white"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-sm">
                Showing {filteredCourses.length} of {courses.length} courses{" "}
                {searchTerm && `for "${searchTerm}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-gray-800 bg-slate-800/50 backdrop-blur-xs h-full flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2 py-1 rounded text-xs font-medium">
                      {course.level}
                    </div>
                  </div>

                  <CardHeader className="flex-1">
                    <div className="mb-2">
                      <span className="text-xs text-blue-400 font-medium bg-blue-500/20 px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>

                    <CardTitle className="text-lg text-white leading-tight line-clamp-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="hover:text-blue-300 transition-colors"
                      >
                        {course.title}
                      </Link>
                    </CardTitle>

                    <CardDescription className="text-gray-400 line-clamp-2 mt-2 text-sm">
                      {course.description}
                    </CardDescription>

                    <p className="text-sm text-gray-300 mt-2">
                      By {course.instructor}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{course.rating}</span>
                        <span>({(course.students / 1000).toFixed(1)}k)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span>{course.duration}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4 text-green-400" />
                          <span>{course.lessons}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-400">
                          ${course.price}
                        </span>
                      </div>

                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-9 cursor-pointer">
                        <Link to={`/courses/${course.id}`} className="flex items-center gap-1 text-sm">
                          <BookOpen className="w-3 h-3" /> View Course
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  No courses found
                </h3>

                <p className="text-gray-400 mb-4 text-sm">
                  {searchTerm
                    ? `No results found for "${searchTerm}".`
                    : "Try adjusting your filters."}
                </p>

                <Button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 h-9"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Courses;
