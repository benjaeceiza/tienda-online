
const API_URL = import.meta.env.VITE_API_URL_BACKEND;
export const getPaidCourses = async (categoria) => {

    const res = await fetch(`${API_URL}/courses/${categoria}`);
    if (!res.ok) {
        throw new Error(`Error ${res.status}`);
    }

    return await res.json();
};
