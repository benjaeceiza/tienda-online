import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Register from "./views/register/Register";
import CursosPagos from "./views/cursos-pagos/CursosPagos";
import CursosGratuitos from "./views/cursos-gratuitos/CursosGratuitos";
import MisCursos from "./views/mis-cursos/MisCursos";
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
          <Route path="/cursos-gratuitos" element={<CursosGratuitos />} />
          <Route path="/mis-cursos" element={<MisCursos />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}