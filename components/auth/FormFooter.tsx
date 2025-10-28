import React from "react";
import Link from "next/link";

interface FormFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export const FormFooter = ({ text, linkText, linkHref }: FormFooterProps) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">
        {text}{" "}
        <Link
          href={linkHref}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};
