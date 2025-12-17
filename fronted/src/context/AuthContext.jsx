import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
     const [loadingContext, setLoadingContext] = useState(true);

    //  Verificar si hay token y está vigente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp > now) {
                    setUser(decoded);
                } else {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
            }
        }
         setLoadingContext(false)
    }, []);


    //  Login: guardar token y decodificar
    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    //  Logout: limpiar todo
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user,setUser, login, logout,loadingContext}}>
             {loadingContext ? <p>Cargando sesión...</p> : children}
        </AuthContext.Provider>
    );
}

// 👇 Hook para usar el contexto
export function useAuth() {
    return useContext(AuthContext);
}
