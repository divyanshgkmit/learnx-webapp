import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { COURSES_INSTRUCTOR as courses, STATS as stats } from "@/constants/courseMockData";


const StatCard = ({ title, value, icon: Icon, iconColor, description }) => (
  <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs">
    <CardHeader className="flex items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium text-gray-400">{title}</CardTitle>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-white">{value}</div>
      <p className="text-sm text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

const CourseRow = ({ course }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-1">
        <h4 className="font-semibold text-white">{course.title}</h4>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            course.status === "active"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          }`}
        >
          {course.status}
        </span>
      </div>
      <p className="text-sm text-gray-400">
        {course.students} students • {course.modules} modules • {course.revenue} revenue
      </p>
    </div>
    <div className="flex space-x-2 mt-2 md:mt-0">
      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-gray-700">
        Edit
      </Button>
      <Button
        size="sm"
        className={`${
          course.status === "active"
            ? "border-green-500 text-green-400 bg-green-700/30"
            : "border-yellow-500 text-yellow-400 bg-yellow-700/30"
        }`}
      >
        {course.status === "active" ? "Set Draft" : "Set Active"}
      </Button>
    </div>
  </div>
);

const InstructorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <Card className="border-gray-800 bg-slate-800/50 backdrop-blur-xs">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-white">Your Courses</CardTitle>
            <CardDescription className="text-gray-400">Manage and create new courses</CardDescription>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Course
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 mt-2">
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
