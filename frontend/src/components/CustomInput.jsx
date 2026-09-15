import { useEffect, useRef, useState } from "react";

function CustomInput({
  value,
  onChange,
  placeholder,
  type = "text",
  ariaLabel
}) {
  const editorRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";

  const displayValue = isPassword
    ? "•".repeat(value.length)
    : value;


  // ==========================================
  // UPDATE DISPLAYED VALUE
  // ==========================================

  useEffect(() => {
    const element = editorRef.current;

    if (!element) {
      return;
    }

    const displayText = isPassword
      ? "•".repeat(value.length)
      : value;

    if (element.textContent !== displayText) {
      element.textContent = displayText;
    }
  }, [value, isPassword]);


  // ==========================================
  // GET CURSOR POSITION
  // ==========================================

  const getCursorPosition = () => {
    const element = editorRef.current;
    const selection = window.getSelection();

    if (
      !element ||
      !selection ||
      selection.rangeCount === 0
    ) {
      return 0;
    }

    const range = selection.getRangeAt(0);

    return range.startOffset;
  };


  // ==========================================
  // SET CURSOR POSITION
  // ==========================================

  const setCursorPosition = (position) => {
    const element = editorRef.current;

    if (!element) {
      return;
    }

    const selection = window.getSelection();

    if (!selection) {
      return;
    }

    const textNode = element.firstChild;

    if (!textNode) {
      return;
    }

    const range = document.createRange();

    const safePosition = Math.min(
      position,
      textNode.textContent.length
    );

    range.setStart(
      textNode,
      safePosition
    );

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  };


  // ==========================================
  // KEYBOARD
  // ==========================================

  const handleKeyDown = (e) => {
    const cursorPosition = getCursorPosition();


    // BACKSPACE
    if (e.key === "Backspace") {

      e.preventDefault();

      if (cursorPosition === 0) {
        return;
      }

      const newValue =
        value.slice(0, cursorPosition - 1) +
        value.slice(cursorPosition);

      onChange(newValue);

      requestAnimationFrame(() => {
        setCursorPosition(
          cursorPosition - 1
        );
      });

      return;
    }


    // DELETE
    if (e.key === "Delete") {

      e.preventDefault();

      if (cursorPosition >= value.length) {
        return;
      }

      const newValue =
        value.slice(0, cursorPosition) +
        value.slice(cursorPosition + 1);

      onChange(newValue);

      requestAnimationFrame(() => {
        setCursorPosition(cursorPosition);
      });

      return;
    }


    // ENTER
    if (e.key === "Enter") {
      return;
    }


    // CTRL / CMD SHORTCUTS
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "x", "v"].includes(
        e.key.toLowerCase()
      )
    ) {
      return;
    }


    // NAVIGATION
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      return;
    }


    // IGNORE OTHER CONTROL KEYS
    if (e.key.length !== 1) {
      return;
    }


    // INSERT CHARACTER
    e.preventDefault();

    const newValue =
      value.slice(0, cursorPosition) +
      e.key +
      value.slice(cursorPosition);

    onChange(newValue);

    requestAnimationFrame(() => {
      setCursorPosition(
        cursorPosition + 1
      );
    });
  };


  // ==========================================
  // PASTE
  // ==========================================

  const handlePaste = (e) => {

    e.preventDefault();

    const pastedText =
      e.clipboardData.getData("text");

    if (!pastedText) {
      return;
    }

    const cursorPosition =
      getCursorPosition();

    const newValue =
      value.slice(0, cursorPosition) +
      pastedText +
      value.slice(cursorPosition);

    onChange(newValue);

    requestAnimationFrame(() => {
      setCursorPosition(
        cursorPosition + pastedText.length
      );
    });
  };


  // ==========================================
  // FOCUS
  // ==========================================

  const handleFocus = () => {
    setIsFocused(true);
  };


  // ==========================================
  // BLUR
  // ==========================================

  const handleBlur = () => {
    setIsFocused(false);
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      className={`custom-input-wrapper ${
        isFocused
          ? "custom-input-wrapper-focused"
          : ""
      }`}
    >

      {/* Placeholder */}
      <span
        className={`custom-input-placeholder ${
          value || isFocused
            ? "custom-input-placeholder-hidden"
            : ""
        }`}
      >
        {placeholder}
      </span>


      {/* Editable area */}
      <div
        ref={editorRef}
        className="custom-input"
        contentEditable={true}
        suppressContentEditableWarning={true}
        role="textbox"
        aria-label={ariaLabel}
        aria-multiline="false"
        spellCheck={false}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

    </div>
  );
}

export default CustomInput;