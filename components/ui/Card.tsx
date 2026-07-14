import type { ComponentProps } from "react";

interface CardProps extends ComponentProps<"div"> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)] ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
