export const filterCourses = (courses, search) => {
  if (!search) return courses;
  
  const q = search.toLowerCase();
  return courses.filter((course) => 
    course.title.toLowerCase().includes(q) ||
    course.category.toLowerCase().includes(q) ||
    course.description.toLowerCase().includes(q)
  );
};