// components/RouteLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

export default function RouteLoader() {
  const location = useLocation();
  const [ruta, setRuta] = useState(location.pathname);
  const { showLoader } = useLoading();

  useEffect(() => {

    if(location.pathname !== ruta) {
      showLoader();
      setRuta(location.pathname);
    }
    

  }, [location]);

  return null;
}