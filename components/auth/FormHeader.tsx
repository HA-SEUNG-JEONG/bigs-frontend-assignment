import React from "react";

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export const FormHeader = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};
