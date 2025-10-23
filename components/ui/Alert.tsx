import React from "react";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const isError = type === "error";

  return (
    <div
      className={`border rounded-lg p-3 ${
        isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex">
        <svg
          className={`w-5 h-5 mr-2 ${
            isError ? "text-red-400" : "text-green-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isError ? (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          )}
        </svg>
        <p className={`text-sm ${isError ? "text-red-700" : "text-green-700"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};
