import React, { memo } from 'react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  disabled?: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  mobileLabel?: string;
  desktopLabel?: string;
}

const FileUpload: React.FC<FileUploadProps> = memo(({
  label,
  accept = '*',
  disabled = false,
  onFileChange,
  file,
  mobileLabel = 'Upload',
  desktopLabel = 'Upload File',
}) => (
  <>
    <label
      htmlFor="file-upload"
      className={`px-3 py-1.5 bg-blue-600 text-white rounded shadow transition-colors font-medium inline-block text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-700'}`}
      aria-disabled={disabled}
    >
      {label && <span className="sr-only">{label}</span>}
      <span className="block md:hidden">{mobileLabel}</span>
      <span className="hidden md:block">{desktopLabel}</span>
      <input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="hidden"
        disabled={disabled}
      />
    </label>
    {file && (
      <span className={`text-gray-700 truncate max-w-xs ml-2 align-middle ${disabled ? 'opacity-50' : ''}`}>{file.name}</span>
    )}
  </>
));

export default FileUpload; 