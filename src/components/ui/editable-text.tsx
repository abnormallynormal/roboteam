import React, { useState, useRef, useEffect } from "react";

type EditableTextProps = {
  initialText: string;
};

const EditableText = ({ initialText }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current && textRef.current) {
      // Set input width to match text content width
      inputRef.current.style.width = `${textRef.current.scrollWidth}px`;
    }
  }, [isEditing, text]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Focus the input when editing starts
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => setIsEditing(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);
  const handleBlur = () => setIsEditing(false);

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing || text === "" ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-auto min-w-[8px]"
          />
          {/* Hidden span for measuring text width */}
          <span
            ref={textRef}
            className="invisible absolute whitespace-nowrap"
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      ) : (
        <span className="inline-block whitespace-nowrap py-2 mr-4">
          {text}
        </span>
      )}
    </div>
  );
};

export default EditableText;
