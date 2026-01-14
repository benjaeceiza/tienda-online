import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // 1. Obtenemos la ruta actual (pathname)
  const { pathname } = useLocation();

  useEffect(() => {
    // 2. Cada vez que cambie el pathname, hacemos scroll arriba
    window.scrollTo(0, 0);
  }, [pathname]); // <--- La dependencia es clave: se ejecuta al cambiar la ruta

  return null; // 3. No renderiza nada visual, es un componente lógico
};

export default ScrollToTop;