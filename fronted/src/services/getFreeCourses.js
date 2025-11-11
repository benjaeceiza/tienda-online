
const API_URL = "http://localhost:8080/api";

export const getFreeCourses = async () => {
    const res = await fetch(`${API_URL}/courses/free`);

    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return await res.json();
};
