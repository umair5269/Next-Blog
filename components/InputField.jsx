"use client";

import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const InputField = ({
  type = "text",
  value,
  onChange,
  placeholder,
  label,
  name,
  id,
  className = "",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={id}
        required={required}
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-10 right-2 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
