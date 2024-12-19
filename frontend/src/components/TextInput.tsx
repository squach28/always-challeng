import { HTMLInputTypeAttribute } from "react";

type TextInputProps = {
  type?: HTMLInputTypeAttribute;
  label: string;
  hint?: string;
};

const TextInput = ({ type = "text", label, hint }: TextInputProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-lg" htmlFor={label}>
          {label}
        </label>
        <input
          id={label}
          className="rounded-md border border-gray-300 p-2"
          type={type}
          placeholder={hint}
        ></input>
      </div>
    </>
  );
};

export default TextInput;
