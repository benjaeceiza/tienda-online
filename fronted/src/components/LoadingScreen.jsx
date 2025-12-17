

;
import butterfly from "../assets/logos/logo.png";

export default function LoadingScreen({ isVisible, isExiting }) {
  return (
    <div
      className={`loaderContainer 
        ${isVisible ? "show" : "hide"} 
        ${isExiting ? "exit" : ""}`
      }
    >
      <img src={butterfly} className="butterfly" />
    </div>
  );
}
