// components/RouteLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

export default function RouteLoader() {
  const location = useLocation();
  const { showLoader } = useLoading();

  useEffect(() => {
    // Muestra loader apenas cambia la ruta
    showLoader();

    
  }, [location]);

  return null;
}