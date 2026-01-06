import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Register from "./views/register/Register";
import CursosPagos from "./views/cursos-pagos/CursosPagos";
import CursosGratuitos from "./views/cursos-gratuitos/CursosGratuitos";
import MisCursos from "./views/mis-cursos/MisCursos";
import { AuthProvider } from "./context/AuthContext";
import Curso from "./views/detalle-curso/Curso";
import Contacto from "./views/contacto/Contacto";
import Footer from "./components/Footer";
import { useLoading } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen";
import RouteLoader from "./components/RouteLoader";
import Checkout from "./utils/payments/Checkout";

export default function App() {
  const { isVisible, isExiting } = useLoading();

  return (
    <>
     
      <LoadingScreen isExiting={isExiting} isVisible={isVisible} />

      <AuthProvider>
        <BrowserRouter>
          <RouteLoader />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cursos-pagos" element={<CursosPagos />} />
            <Route path="/cursos-gratuitos" element={<CursosGratuitos />} />
            <Route path="/mis-cursos" element={<MisCursos />} />
            <Route path="/curso/:cid" element={<Curso />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
