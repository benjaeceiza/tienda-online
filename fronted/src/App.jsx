import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import CursosPagos from "./views/CursosPagos";
import MisCursos from "./views/MisCursos";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cursos-pagos" element={<CursosPagos />} />
          <Route path="/mis-cursos" element={<MisCursos />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}