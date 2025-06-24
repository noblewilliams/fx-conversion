import React, { useState, useRef, useEffect } from "react";

export const SelectInput = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    const syntheticEvent = {
      target: { value: selectedValue },
      currentTarget: { value: selectedValue },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      {/* Custom Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 pr-10 text-left text-sm relative
          border border-gray-300 dark:border-gray-600 rounded-md
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-white
          hover:border-gray-400 dark:hover:border-gray-500
          transition-all duration-200 ease-in-out
          ${isOpen ? "ring-2 ring-black border-black" : ""}
        `}
      >
        <span className="block truncate">
          {selectedOption?.label || "Select an option"}
        </span>

        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`
          absolute z-10 w-full mt-1 
          bg-white dark:bg-gray-700 
          border border-gray-300 dark:border-gray-600 
          rounded-md shadow-lg
          transition-all duration-200 ease-in-out origin-top
          ${
            isOpen
              ? "opacity-100 scale-y-100 visible"
              : "opacity-0 scale-y-95 invisible"
          }
        `}
      >
        <div className="py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-3 py-2 text-left text-sm relative
                hover:bg-gray-50 dark:hover:bg-gray-600
                focus:bg-gray-50 dark:focus:bg-gray-600
                focus:outline-none
                transition-colors duration-150 ease-in-out text-gray-900 dark:text-white
                ${option.value === value ? "bg-black/5" : " "}
              `}
            >
              <span className="block truncate">{option.label}</span>
              {option.value === value && (
                <div className="absolute h-full right-0 top-0 flex items-center pr-3">
                  <span className="">
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Input = ({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="group">
      {label && (
        <label
          htmlFor={id}
          className={`
            block text-sm font-medium mb-2 transition-colors duration-200
            ${
              isFocused
                ? "text-black dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }
          `}
        >
          {label}
          {required && (
            <span className="text-gray-800 dark:text-gray-300 ml-1">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 text-sm
            bg-white dark:bg-gray-900
            border-2 rounded-lg
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-300 ease-out
            transform border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600
            ${isFocused ? "scale-[1.02] shadow-lg" : ""}
            ${type === "password" ? "pr-12" : ""}
            focus:outline-none
            group-hover:shadow-md
          `}
          placeholder={placeholder}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2
              p-1 rounded-md
              text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
              transition-all duration-200 ease-out
              hover:bg-gray-100 dark:hover:bg-gray-800
              focus:outline-none cursor-pointer
            `}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}

        <div
          className={`
            absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white
            transition-all duration-300 ease-out
            ${isFocused ? "w-full" : "w-0"}
          `}
        />
      </div>
    </div>
  );
};
