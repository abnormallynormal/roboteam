import { RowData } from "@tanstack/react-table";
import React, { useState, useRef, useEffect } from "react";

type EditableTextProps = {
  initialText: string;
  row: any;
  collection: string;
  team: string;
  field: string
};

const EditableText = ({ initialText, row, collection, team, field }: EditableTextProps) => {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
  };
  const handleBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(false);
    try {
      console.log(collection)
      console.log(team)
      const response = await fetch(`/api/add-inventory-item`, {
        method: "PATCH",
        body: JSON.stringify({
          collection: collection,
          team: team,
          id: row.original.id,
          name: row.original.name,
          category: row.original.category,
          amount: row.original.amount,
          description: row.original.description,
          update: field,
          value: e.target.value
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  
  }


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
        <span className="inline-block whitespace-nowrap py-2 mr-4">{text}</span>
      )}
    </div>
  );
};

export default EditableText;
