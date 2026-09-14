import { useRef, useState } from "react";

function CustomInput({
  value,
  onChange,
  placeholder,
  type = "text",
  ariaLabel
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    // Backspace
    if (e.key === "Backspace") {
      e.preventDefault();

      onChange(value.slice(0, -1));
      return;
    }

    // Enter
    if (e.key === "Enter") {
      return;
    }

    // Ignore control keys
    if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "CapsLock" ||
      e.key === "Tab"
    ) {
      return;
    }

    // Allow normal characters
    if (e.key.length === 1) {
      e.preventDefault();

      onChange(value + e.key);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text");

    if (pastedText) {
      onChange(value + pastedText);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const displayValue =
    type === "password"
      ? "•".repeat(value.length)
      : value;

  return (
    <div
      ref={inputRef}
      className={`custom-input ${
        isFocused ? "custom-input-focused" : ""
      }`}
      tabIndex={0}
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="false"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {displayValue ? (
        <span className="custom-input-value">
          {displayValue}
        </span>
      ) : (
        <span className="custom-input-placeholder">
          {placeholder}
        </span>
      )}

      {isFocused && (
        <span className="custom-input-cursor" />
      )}
    </div>
  );
}

export default CustomInput;