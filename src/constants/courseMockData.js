import { BookOpen, Users, PlayCircle, BarChart3 } from "lucide-react";

export const COURSES = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    instructor: "John Doe",
    price: 99.99,
    originalPrice: 149.99,
    rating: 4.8,
    students: 12500,
    duration: "42 hours",
    lessons: 156,
    level: "Beginner",
    category: "Development",
    description:
      "Learn web development from scratch. HTML, CSS, JavaScript, React, Node.js and more!",
    thumbnail:
      "https://placehold.co/400x250/orange/white?text=Web+Development",
  },
  {
    id: 2,
    title: "React Masterclass - From Zero to Hero",
    instructor: "Jane Smith",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    students: 8900,
    duration: "28 hours",
    lessons: 112,
    level: "Intermediate",
    category: "Development",
    description:
      "Master React with hooks, context, redux, and build real-world projects",
    thumbnail: "https://placehold.co/400x250/skyblue/white?text=React+JS",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    instructor: "Mike Johnson",
    price: 119.99,
    originalPrice: 159.99,
    rating: 4.7,
    students: 6700,
    duration: "35 hours",
    lessons: 98,
    level: "Intermediate",
    category: "Data Science",
    description:
      "Learn Python, pandas, numpy, and machine learning basics",
    thumbnail:
      "https://placehold.co/400x250/purple/white?text=Data+Science",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    instructor: "Sarah Wilson",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    students: 4300,
    duration: "18 hours",
    lessons: 64,
    level: "Beginner",
    category: "Design",
    description:
      "Learn modern UI/UX design patterns and tools",
    thumbnail:
      "https://placehold.co/400x250/green/white?text=UI%2FUX+Design",
  },
  {
    id: 5,
    title: "Advanced JavaScript Patterns",
    instructor: "Alex Chen",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.9,
    students: 5200,
    duration: "24 hours",
    lessons: 85,
    level: "Advanced",
    category: "Development",
    description:
      "Master advanced JavaScript concepts and design patterns",
    thumbnail:
      "https://placehold.co/400x250/yellow/black?text=JavaScript",
  },
  {
    id: 6,
    title: "Mobile App Development with React Native",
    instructor: "Emily Davis",
    price: 94.99,
    originalPrice: 129.99,
    rating: 4.7,
    students: 3800,
    duration: "32 hours",
    lessons: 120,
    level: "Intermediate",
    category: "Mobile",
    description:
      "Build cross-platform mobile apps with React Native",
    thumbnail:
      "https://placehold.co/400x250/blue/white?text=Mobile+Apps",
  },
];

export const COURSES_INSTRUCTOR = [
  { id: 1, title: "React Masterclass", students: 45, modules: 12, status: "active", revenue: "$2,340" },
  { id: 2, title: "Node.js Fundamentals", students: 32, modules: 8, status: "draft", revenue: "$1,560" },
  { id: 3, title: "Advanced JavaScript", students: 28, modules: 10, status: "active", revenue: "$1,890" },
];

export const STATS = [
  {
    title: "Total Courses",
    value: COURSES_INSTRUCTOR.length,
    icon: BookOpen,
    iconColor: "text-blue-400",
    description: "Active courses",
  },
  {
    title: "Total Students",
    value: COURSES_INSTRUCTOR.reduce((total, course) => total + course.students, 0),
    icon: Users,
    iconColor: "text-green-400",
    description: "Across all courses",
  },
  {
    title: "Active Courses",
    value: COURSES_INSTRUCTOR.filter((course) => course.status === "active").length,
    icon: PlayCircle,
    iconColor: "text-purple-400",
    description: "Published",
  },
  {
    title: "Total Revenue",
    value: `$${COURSES_INSTRUCTOR.reduce(
      (total, course) => total + parseInt(course.revenue.replace("$", "").replace(",", "")),
      0
    ).toLocaleString()}`,
    icon: BarChart3,
    iconColor: "text-yellow-400",
    description: "Lifetime",
  },
];
