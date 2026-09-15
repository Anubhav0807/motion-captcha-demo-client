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

  /*
   * We use a hidden internal representation for password fields.
   * The actual value remains in React state.
   */

  const isPassword = type === "password";


  // ==========================================
  // DISPLAY VALUE
  // ==========================================

  const displayValue = isPassword
    ? "•".repeat(value.length)
    : value;


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

    const range = document.createRange();

    range.selectNodeContents(element);

    const textNode = element.firstChild;

    if (!textNode) {
      return;
    }

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
  // GET CURSOR POSITION
  // ==========================================

  const getCursorPosition = () => {
    const element = editorRef.current;

    const selection = window.getSelection();

    if (!element || !selection || selection.rangeCount === 0) {
      return 0;
    }

    const range = selection.getRangeAt(0);

    return range.startOffset;
  };


  // ==========================================
  // UPDATE DOM VALUE
  // ==========================================

  useEffect(() => {
    const element = editorRef.current;

    if (!element) {
      return;
    }

    /*
     * For password fields we render bullets.
     * For normal fields we render the actual value.
     */

    const newDisplayValue = isPassword
      ? "•".repeat(value.length)
      : value;

    if (element.textContent !== newDisplayValue) {
      element.textContent = newDisplayValue;
    }

  }, [value, isPassword]);


  // ==========================================
  // KEYBOARD HANDLING
  // ==========================================

  const handleKeyDown = (e) => {

    const currentPosition = getCursorPosition();


    // ------------------------------------------
    // BACKSPACE
    // ------------------------------------------

    if (e.key === "Backspace") {

      e.preventDefault();

      if (currentPosition === 0) {
        return;
      }

      const newValue =
        value.slice(0, currentPosition - 1) +
        value.slice(currentPosition);

      onChange(newValue);

      requestAnimationFrame(() => {
        setCursorPosition(
          currentPosition - 1
        );
      });

      return;
    }


    // ------------------------------------------
    // DELETE
    // ------------------------------------------

    if (e.key === "Delete") {

      e.preventDefault();

      if (currentPosition >= value.length) {
        return;
      }

      const newValue =
        value.slice(0, currentPosition) +
        value.slice(currentPosition + 1);

      onChange(newValue);

      requestAnimationFrame(() => {
        setCursorPosition(
          currentPosition
        );
      });

      return;
    }


    // ------------------------------------------
    // ENTER
    // ------------------------------------------

    if (e.key === "Enter") {
      return;
    }


    // ------------------------------------------
    // ALLOW NAVIGATION KEYS
    // ------------------------------------------

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      return;
    }


    // ------------------------------------------
    // CTRL/CMD + A
    // ------------------------------------------

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "a"
    ) {
      return;
    }


    // ------------------------------------------
    // CTRL/CMD + C
    // ------------------------------------------

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "c"
    ) {
      return;
    }


    // ------------------------------------------
    // CTRL/CMD + X
    // ------------------------------------------

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "x"
    ) {
      return;
    }


    // ------------------------------------------
    // CTRL/CMD + V
    // ------------------------------------------

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "v"
    ) {
      return;
    }


    // ------------------------------------------
    // IGNORE OTHER CONTROL KEYS
    // ------------------------------------------

    if (e.key.length !== 1) {
      return;
    }


    // ------------------------------------------
    // INSERT CHARACTER
    // ------------------------------------------

    e.preventDefault();

    const newValue =
      value.slice(0, currentPosition) +
      e.key +
      value.slice(currentPosition);

    onChange(newValue);


    // Move cursor after inserted character

    requestAnimationFrame(() => {
      setCursorPosition(
        currentPosition + 1
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

    const currentPosition =
      getCursorPosition();

    const newValue =
      value.slice(0, currentPosition) +
      pastedText +
      value.slice(currentPosition);

    onChange(newValue);


    requestAnimationFrame(() => {
      setCursorPosition(
        currentPosition + pastedText.length
      );
    });
  };


  // ==========================================
  // CUT
  // ==========================================

  const handleCut = (e) => {

    const selection =
      window.getSelection();

    if (!selection || selection.isCollapsed) {
      return;
    }

    const selectedText =
      selection.toString();

    e.clipboardData.setData(
      "text/plain",
      selectedText
    );

    e.preventDefault();


    const start =
      selection.anchorOffset;

    const end =
      selection.focusOffset;

    const selectionStart =
      Math.min(start, end);

    const selectionEnd =
      Math.max(start, end);


    const newValue =
      value.slice(0, selectionStart) +
      value.slice(selectionEnd);

    onChange(newValue);


    requestAnimationFrame(() => {
      setCursorPosition(
        selectionStart
      );
    });
  };


  // ==========================================
  // SELECTION DELETE
  // ==========================================

  const handleBeforeInput = (e) => {

    if (
      e.inputType ===
      "deleteByCut"
    ) {
      return;
    }
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
  // CLICK
  // ==========================================

  const handleClick = () => {

    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
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

        onCut={handleCut}

        onBeforeInput={handleBeforeInput}

        onFocus={handleFocus}

        onBlur={handleBlur}

        onClick={handleClick}
      />

      {!value && !isFocused && (
        <div
          className="custom-input-placeholder"
          onClick={() => {
            editorRef.current?.focus();
          }}
        >
          {placeholder}
        </div>
      )}

    </div>
  );
}

export default CustomInput;