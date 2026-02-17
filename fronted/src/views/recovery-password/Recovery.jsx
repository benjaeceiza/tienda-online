import { useState, useEffect } from "react"; // 🔥 Agregamos useEffect
import emailjs from "@emailjs/browser";
import CodeInput from "./CodeInput";

const Recovery = ({ setRecovery }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("email"); 
  const [loading, setLoading] = useState(false);
  
  // 🔥 NUEVO: Estado para el temporizador (60 segundos)
  const [timer, setTimer] = useState(60);

  const [newPassword, setNewPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");


  useEffect(() => {
    let interval = null;
    
    if (step === "code" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [step, timer]);


  // ... (Tus funciones sendEmail y verifyCode siguen igual) ...
  const sendEmail = (userEmail, code) => {
    return emailjs.send("service_9bojsir", "template_7b0zv1z", { email: userEmail, recovery_code: code }, "ozycZTfYueG9-OUJR");
  };

  const verifyCode = async (code) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/recovery/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.message); return; }
      setStep("password"); setErrorMessage("");
    } catch (error) { setErrorMessage("Error validando código"); }
  };

  const resetPassword = async (e) => {
     // ... (tu lógica de resetPassword igual) ...
      e.preventDefault(); setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/recovery/reset`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) { setErrorMessage(data.message); return; }
        alert("Contraseña cambiada con éxito 🔐"); setRecovery(false);
      } catch (error) { setErrorMessage("Error al cambiar contraseña"); } finally { setLoading(false); }
  };

  // ... (Tu función checkEmail original) ...
  const checkEmail = async (e) => {
    if(e) e.preventDefault(); // Si viene de un evento, prevenimos
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/recovery/send`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.message); return; }
      await sendEmail(email, data.code);
      
      setStep("code");
      setTimer(60); // 🔥 Reiniciamos el reloj al enviar
    } catch (error) { setErrorMessage("Error al enviar el correo"); } finally { setLoading(false); }
  };

  /* =================================================
     🔥 NUEVA FUNCIÓN: REENVIAR
  ================================================= */
  const handleResend = () => {
      setTimer(60); // Reinicia visualmente
      checkEmail(); // Vuelve a llamar a la API
  };

  return (
    <section className="page-login-container">
      <div className="page-login-card">
        
        {/* Header (Igual que antes) */}
        <div className="page-login-header-left">
          <button className="page-login-back-btn" onClick={() => setRecovery(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Volver</span>
          </button>
        </div>

        <div className="page-login-header">
           <h2 className="page-login-title">Recuperar Cuenta</h2>
           <p className="page-login-subtitle">
              {step === "email" && "Ingresa tu correo para recibir un código"}
              {step === "code" && "Revisa tu correo e ingresa el código"}
              {step === "password" && "Crea una nueva contraseña segura"}
           </p>
           <div className="page-login-divider"></div>
        </div>

        {/* STEP EMAIL */}
        {step === "email" && (
          <form className="page-login-form" onSubmit={checkEmail}>
            <div className="page-login-input-group">
                <label className="page-login-label">Correo Electrónico</label>
                <input className="page-login-input" type="email" placeholder="ejemplo@email.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {errorMessage && <div className="page-login-error-box">{errorMessage}</div>}
            <input className="page-login-btn-submit" type="submit" disabled={loading} value={loading ? "Enviando..." : "Enviar Código"} />
          </form>
        )}

        {/* STEP CODE */}
        {step === "code" && (
          <div className="page-login-code-wrapper">
             <CodeInput length={5} onComplete={verifyCode} />
             
             {errorMessage && <div className="page-login-error-box" style={{marginTop:'20px'}}>{errorMessage}</div>}

             {/* 🔥 ACÁ ESTÁ EL LINK CON TEMPORIZADOR */}
             <div className="page-login-resend-container">
                {timer > 0 ? (
                    <span className="page-login-timer-text">
                        Reenviar código en {timer}s
                    </span>
                ) : (
                    <button 
                        className="page-login-resend-link" 
                        onClick={handleResend}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Reenviar código ahora"}
                    </button>
                )}
             </div>

          </div>
        )}

        {/* STEP PASSWORD (Igual que antes) */}
        {step === "password" && (
          <form className="page-login-form" onSubmit={resetPassword}>
            <div className="page-login-input-group">
                <label className="page-login-label">Nueva Contraseña</label>
                <input className="page-login-input" type="password" placeholder="••••••••" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="page-login-input-group">
                <label className="page-login-label">Confirmar Contraseña</label>
                <input className="page-login-input" type="password" placeholder="••••••••" required minLength={8} onChange={(e) => setRepPassword(e.target.value)} />
            </div>
            {errorMessage && <div className="page-login-error-box">{errorMessage}</div>}
            {newPassword !== repPassword ? (
               <div className="page-login-error-box">Las contraseñas no coinciden</div>
            ) : (
               <input className="page-login-btn-submit" type="submit" disabled={loading} value={loading ? "Guardando..." : "Cambiar Contraseña"} />
            )}
          </form>
        )}

      </div>
    </section>
  );
};

export default Recovery;