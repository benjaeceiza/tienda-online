import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import CodeInput from "./CodeInput";
// 🔥 Importamos el traductor
import { useTranslation } from 'react-i18next';

const Recovery = ({ setRecovery }) => {
  const { t } = useTranslation("global");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("email"); 
  const [loading, setLoading] = useState(false);
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

  const sendEmail = (userEmail, code) => {
    return emailjs.send("service_9bojsir", "template_7b0zv1z", { email: userEmail, recovery_code: code }, "ozycZTfYueG9-OUJR");
  };

  const verifyCode = async (code) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/recovery/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(t("recovery.error_codigo")); return; }
      setStep("password"); setErrorMessage("");
    } catch (error) { setErrorMessage(t("recovery.error_validando")); }
  };

  const resetPassword = async (e) => {
      e.preventDefault(); setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/recovery/reset`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) { setErrorMessage(data.message); return; }
        alert(t("recovery.exito_cambio")); setRecovery(false);
      } catch (error) { setErrorMessage(t("recovery.error_cambio")); } finally { setLoading(false); }
  };

  const checkEmail = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/users/recovery/send`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(t("recovery.error_email_no_existe")); return; }
      await sendEmail(email, data.code);
      setStep("code");
      setTimer(60);
    } catch (error) { setErrorMessage(t("recovery.error_envio")); } finally { setLoading(false); }
  };

  const handleResend = () => {
      setTimer(60);
      checkEmail();
  };

  return (
    <section className="page-login-container">
      <div className="page-login-card">
        
        <div className="page-login-header-left">
          <button className="page-login-back-btn" onClick={() => setRecovery(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>{t("recovery.volver")}</span>
          </button>
        </div>

        <div className="page-login-header">
           <h2 className="page-login-title">{t("recovery.titulo")}</h2>
           <p className="page-login-subtitle">
              {step === "email" && t("recovery.sub_email")}
              {step === "code" && t("recovery.sub_code")}
              {step === "password" && t("recovery.sub_pass")}
           </p>
           <div className="page-login-divider"></div>
        </div>

        {step === "email" && (
          <form className="page-login-form" onSubmit={checkEmail}>
            <div className="page-login-input-group">
                <label className="page-login-label">{t("login.label_email")}</label>
                <input className="page-login-input" type="email" placeholder="ejemplo@email.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {errorMessage && <div className="page-login-error-box">{errorMessage}</div>}
            <input className="page-login-btn-submit" type="submit" disabled={loading} value={loading ? t("recovery.enviando") : t("recovery.btn_enviar")} />
          </form>
        )}

        {step === "code" && (
          <div className="page-login-code-wrapper">
             <CodeInput length={5} onComplete={verifyCode} />
             {errorMessage && <div className="page-login-error-box" style={{marginTop:'20px'}}>{errorMessage}</div>}
             <div className="page-login-resend-container">
                {timer > 0 ? (
                    <span className="page-login-timer-text">
                        {t("recovery.reenviar_en")} {timer}s
                    </span>
                ) : (
                    <button className="page-login-resend-link" onClick={handleResend} disabled={loading}>
                        {loading ? t("recovery.enviando") : t("recovery.reenviar_ahora")}
                    </button>
                )}
             </div>
          </div>
        )}

        {step === "password" && (
          <form className="page-login-form" onSubmit={resetPassword}>
            <div className="page-login-input-group">
                <label className="page-login-label">{t("recovery.label_nueva")}</label>
                <input className="page-login-input" type="password" placeholder="••••••••" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="page-login-input-group">
                <label className="page-login-label">{t("recovery.label_confirmar")}</label>
                <input className="page-login-input" type="password" placeholder="••••••••" required minLength={8} onChange={(e) => setRepPassword(e.target.value)} />
            </div>
            {errorMessage && <div className="page-login-error-box">{errorMessage}</div>}
            {newPassword !== repPassword ? (
               <div className="page-login-error-box">{t("recovery.error_match")}</div>
            ) : (
               <input className="page-login-btn-submit" type="submit" disabled={loading} value={loading ? t("recovery.guardando") : t("recovery.btn_cambiar")} />
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default Recovery;