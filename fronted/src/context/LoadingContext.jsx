import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);  // siempre montado
  const [isExiting, setIsExiting] = useState(false);

  const showLoader = () => {
    setIsExiting(false);
    setIsVisible(true);
  };

  const hideLoader = () => {
    setIsExiting(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 600); 
  };

  return (
    <LoadingContext.Provider value={{ isVisible, isExiting, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
