import type { SVGProps } from 'react';

export function PromptifyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="17" x2="12" y2="21"></line>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <path d="M5 3v4"></path>
      <path d="M19 3v4"></path>
      <path d="M3 5h4"></path>
      <path d="M17 5h4"></path>
    </svg>
  );
}
