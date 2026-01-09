
const API_URL = "http://localhost:8080/api";

export const getPaidCourses = async (categoria) => {

    const res = await fetch(`${API_URL}/courses/${categoria}`);
    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return await res.json();
};
