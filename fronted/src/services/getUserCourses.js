// src/services/userService.js
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

export const getUserCourses = async (token) => {
  const res = await fetch(`${API_URL}/users/me/courses`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }); 

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return await res.json();
};
