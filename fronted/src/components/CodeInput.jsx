import { useRef } from "react";

const CodeInput = ({ length = 5, onComplete }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) return;

    inputsRef.current[index].value = value[value.length - 1];

    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    checkComplete();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    pasted.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = char;
      }
    });

    checkComplete();
  };

  const checkComplete = () => {
    const code = inputsRef.current.map(input => input.value).join("");
    if (code.length === length) {
      onComplete(code);
    }
  };

  return (
    <div className="codeInputContainer" onPaste={handlePaste}>
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="codeInput"
          ref={(el) => (inputsRef.current[i] = el)}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
};

export default CodeInput;
