import { useState } from "react";
import flecha from "../../assets/iconos/flecha-correcta.png";
import emailjs from "@emailjs/browser";
import CodeInput from "../../components/CodeInput";

const Recovery = ({ setRecovery }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("email");
  // email | code | password
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  /* ===============================
     EMAILJS
  =============================== */
  const sendEmail = (userEmail, code) => {
    return emailjs.send(
      "service_9bojsir",
      "template_7b0zv1z",
      {
        email: userEmail,
        recovery_code: code,
      },
      "ozycZTfYueG9-OUJR"
    );
  };

  /* ===============================
     1️⃣ ENVIAR CÓDIGO
  =============================== */
  const checkEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/recovery/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }

      // ⚠️ SOLO PARA DEV (el backend hace console.log del código)
      // en producción NO se envía el código al front
      await sendEmail(email, data.code);

      setStep("code");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     2️⃣ VALIDAR CÓDIGO
  =============================== */
  const verifyCode = async (code) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/recovery/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }

      setStep("password");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error validando código");
    }
  };

  /* ===============================
     3️⃣ RESET PASSWORD
  =============================== */
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/recovery/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        return;
      }

      alert("Contraseña cambiada con éxito 🔐");
      setRecovery(false);
    } catch (error) {
      setErrorMessage("Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="recoveryPasswordContainer">
        <div className="modalRecovery">
          <div className="iconContainerRecovery">
            <img src={flecha} alt="Volver" onClick={() => setRecovery(false)} />
          </div>

          <div className="formRecoveryContainer">
            {/* ================= TITULO ================= */}
            <h4 className="titleRecovery">
              {step === "email" && "Ingrese el correo de la cuenta"}
              {step === "code" && "Ingresá el código recibido"}
              {step === "password" && "Ingresá la nueva contraseña"}
            </h4>

            {/* ================= STEP EMAIL ================= */}
            {step === "email" && (
              <form className="formAuth formRecovery" onSubmit={checkEmail}>
                <label className="labelForm">Correo Electrónico</label>
                <input
                  className="formInput"
                  type="email"
                  placeholder="Correo"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="formInputButton"
                  type="submit"
                  disabled={loading}
                  value={loading ? "Enviando..." : "Enviar código"}
                />
              </form>
            )}

            {/* ================= STEP CODE ================= */}
            {step === "code" && (
              <CodeInput length={5} onComplete={verifyCode} />
            )}

            {/* ================= STEP PASSWORD ================= */}
            {step === "password" && (
              <form className="formAuth " onSubmit={resetPassword}>
                <label className="labelForm">Nueva contraseña</label>
                <input
                  className="formInput"
                  type="password"
                  placeholder="Nueva contraseña"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label className="labelForm">Repite la contraseña</label>
                <input
                  className="formInput"
                  type="password"
                  placeholder="Nueva contraseña"
                  required
                  minLength={6}
                  onChange={(e) => setRepPassword(e.target.value)}
                />

                {
                  newPassword != repPassword
                    ?
                    <p onClick={() => setErrorMessage("Las contraseñas no coinciden")} className="formInputButton">Cambiar contraseña</p>
                    :
                    <input
                      className="formInputButton"
                      type="submit"
                      disabled={loading}
                      value={loading ? "Guardando..." : "Cambiar contraseña"}
                    />
                }
              </form>
            )}

            {errorMessage && <p className="messageErrorLogin">{errorMessage}</p>}
          </div>


        </div>
      </section>
    </main>
  );
};

export default Recovery;
