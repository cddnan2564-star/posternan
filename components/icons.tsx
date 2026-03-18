import React from 'react';

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "w-8 h-8 text-gray-500 mb-3"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export const WandIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "w-5 h-5 mr-2"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 15l-1.012.942a2.022 2.022 0 01-1.848.337l-3.26.923a.916.916 0 01-1.109-1.109l.923-3.26a2.022 2.022 0 01.337-1.848L4.096 9.813 4 9l.942-1.012a2.022 2.022 0 011.848-.337l3.26-.923a.916.916 0 011.109 1.109l-.923 3.26a2.022 2.022 0 01-.337 1.848z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 19l2.449-5.143M19 13l-5.143 2.449"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 3l1.5 1.5M4 10l1.5 1.5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.5 6.5l-1-1M21 3l-2.5 2.5"
    />
  </svg>
);

export const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "w-5 h-5 mr-2"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);