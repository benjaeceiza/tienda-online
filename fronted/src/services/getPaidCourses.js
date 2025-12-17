
const API_URL = "http://localhost:8080/api";

export const getPaidCourses = async () => {

    const res = await fetch(`${API_URL}/courses/paid`);
    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return await res.json();
};
