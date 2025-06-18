"use client";

import { useState } from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  maxLength,
  showCharCount = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={maxLength}
        className={`
          w-full px-4 py-4 rounded-lg border bg-white dark:bg-gray-800
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-gray-400 dark:hover:border-gray-500
          text-gray-900 dark:text-white placeholder-transparent
          ${
            hasValue || isFocused
              ? "border-gray-400 dark:border-gray-500"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
        placeholder={placeholder}
        required={required}
        {...props}
      />

      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 ease-in-out pointer-events-none
            ${
              hasValue || isFocused
                ? "top-2 text-xs text-blue-600 dark:text-blue-400"
                : "top-4 text-base text-gray-500 dark:text-gray-400"
            }
          `}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {showCharCount && maxLength && (
        <div className="absolute right-3 top-2 text-xs text-gray-500 dark:text-gray-400">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
}
