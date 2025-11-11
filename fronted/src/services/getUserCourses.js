// src/services/userService.js
const API_URL = "http://localhost:8080/api";

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
