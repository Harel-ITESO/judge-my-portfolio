import { useState } from "react";

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  stateHandler?: (data: string) => void;
  disabled?: boolean;
}

export default function FormControl({
  id,
  label,
  placeholder,
  maxLength,
  name,
  stateHandler,
  disabled,
}: Props) {
  const [length, setLength] = useState(0);
  return (
    <div className="flex flex-col text-lg gap-1 relative">
      <label htmlFor={id} className="opacity-75">
        {label}
      </label>
      <input
        type="text"
        name={name}
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        className="bg-gray-200 outline-none focus:outline-red-500 px-3 py-1 rounded-lg disabled:bg-gray-400 disabled:opacity-35"
        maxLength={maxLength}
        onChange={(e) => {
          setLength(e.target.value.length);
          if (stateHandler) stateHandler(e.target.value);
        }}
      />
      {maxLength ? (
        <div className="bg-gray-200 mr-1 h-max w-max absolute bottom-0 right-0 mb-1.5">
          <small
            className="h-max w-max px-3 py-1 text-xs opacity-50"
            hidden={disabled}
          >
            {length} / {maxLength}
          </small>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
