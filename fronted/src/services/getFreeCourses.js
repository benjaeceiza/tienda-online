
const API_URL = "http://localhost:8080/api";

export const getFreeCourses = async () => {
    const res = await fetch(`${API_URL}/courses/categoria/freeCourses`);

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    const result = await res.json();

    return result.courses;






};
