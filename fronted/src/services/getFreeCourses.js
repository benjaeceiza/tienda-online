
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

export const getFreeCourses = async () => {
    const res = await fetch(`${API_URL}/courses/categoria/freeCourses`);

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();

    return result.courses;






};
