import * as React from "react";
import { SVGProps } from "react";

export const SvgCaret = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M6.293 8.793a1 1 0 0 1 1.414 0L12 13.086l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414Z"
      clipRule="evenodd"
    />
  </svg>
);
