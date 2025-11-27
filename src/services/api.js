import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me").then((res) => res.data.data),
};

export const courseAPI = {
  getAll: () => api.get("/courses").then((res) => res.data.data),
  getById: (id) => api.get(`/courses/${id}`).then((res) => res.data.data),
  create: (data) => api.post("/courses", data).then((res) => res.data.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then((res) => res.data.data),
  delete: (id) => api.delete(`/courses/${id}`).then((res) => res.data.data),
  getInstructorCourses: (instructorId) =>
    api.get(`/courses/instructor/${instructorId}`).then((res) => res.data.data),
};

export const moduleAPI = {
  create: (data) => api.post("/modules", data).then((res) => res.data.data),
  getByCourse: (courseId) => api.get(`/modules/course/${courseId}`).then((res) => res.data.data),
  delete: (id) => api.delete(`/modules/${id}`).then((res) => res.data.data),
};

export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/course/${courseId}`),
  status: (courseId) => api.get(`/enrollments/course/${courseId}/status`).then((res) => res.data.data),
  getStudentEnrollments: (studentId) =>
    api.get(`/enrollments/student/${studentId}`).then((res) => res.data.data),
  markAsCompleted: (courseId) => 
  api.patch(`/enrollments/course/${courseId}/complete`).then(res => res.data.data),
};

const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const uploadAPI = {
  uploadCourseThumbnail: (courseId, file) => {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return api
      .post(`/upload/course/${courseId}/thumbnail`, formData, multipartConfig)
      .then((res) => res.data.data);
  },
  deleteCourseThumbnail: (courseId) =>
    api.delete(`/upload/course/${courseId}/thumbnail`).then((res) => res.data.data),
  uploadModuleVideo: (moduleId, file) => {
    const formData = new FormData();
    formData.append("video", file);
    return api
      .post(`/upload/module/${moduleId}/video`, formData, multipartConfig)
      .then((res) => res.data.data);
  },
};

export default api;
