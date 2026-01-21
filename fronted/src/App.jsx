import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Register from "./views/register/Register";
import Cursos from "./views/cursos/Cursos";
import MisCursos from "./views/mis-cursos/MisCursos";
import { AuthProvider } from "./context/AuthContext";
import Curso from "./views/detalle-curso/Curso";
import Contacto from "./views/contacto/Contacto";
import Footer from "./components/Footer";
import { useLoading } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen";
import RouteLoader from "./components/RouteLoader";
import Approved from "./views/pay/Approved";
import LoginRoute from "./components/LoginRoute";
import HaveCourseRoute from "./components/haveCourseRoute";
import ScrollToTop from "./components/ScrollToTop";
import Checkout from "./views/checkout/Checkout";
import NavbarDesktop from "./components/navbar/NavbarDesktop";

export default function App() {
  const { isVisible, isExiting } = useLoading();

  return (
    <>

      <LoadingScreen isExiting={isExiting} isVisible={isVisible} />

      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop/>
          <RouteLoader />
          <NavbarDesktop/>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cursos/:categoria" element={<Cursos />} />
            <Route path="/mis-cursos" element={<LoginRoute><MisCursos /></LoginRoute>} />
            <Route path="/curso/:cid" element={<HaveCourseRoute><Curso /></HaveCourseRoute>} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/payment/:uid/:cid" element={<Checkout />} />
            <Route path="/pago-exitoso" element={<Approved />} />
            <Route path="/pago-fallido" element={<h1>Pago fallido</h1>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
