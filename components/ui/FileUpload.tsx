"use client";

interface FileUploadProps {
  label?: string;
  accept?: string;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label = "파일 업로드",
  accept = "*/*",
  selectedFile,
  onFileChange,
  error
}: FileUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
        aria-describedby={error ? "file-error" : undefined}
      />
      {selectedFile && (
        <p className="mt-1 text-sm text-gray-600">
          선택된 파일: {selectedFile.name}
        </p>
      )}
      {error && (
        <p id="file-error" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
