import React from "react";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonColor = "primary" | "accent" | "neutral" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
};

function classNames(classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function colorClasses(color: ButtonColor, variant: ButtonVariant) {
  switch (variant) {
    case "solid":
      return {
        primary:
          "bg-brightpetrole text-gray hover:bg-brightpetrole-90 focus-visible:ring-brightpetrole-90",
        accent:
          "bg-fancyorange text-white hover:bg-fancyorange-90 focus-visible:ring-fancyorange-90",
        neutral:
          "bg-black text-black hover:bg-gray-700 focus-visible:ring-gray-600",
        danger:
          "bg-deeppurple text-white hover:bg-deeppurple-90 focus-visible:ring-deeppurple-90",
      }[color];
    case "outline":
      return {
        primary:
          "border-2 border-brightpetrole text-brightpetrole hover:bg-brightpetrole-50 hover:text-gray-90",
        accent:
          "border border-fancyorange text-fancyorange hover:bg-fancyorange-10",
        neutral: "border border-gray-400 text-gray-200 hover:bg-black",
        danger:
          "border border-deeppurple text-deeppurple hover:bg-deeppurple-10",
      }[color];
    case "ghost":
    default:
      return {
        primary: "text-brightpetrole hover:bg-brightpetrole-10",
        accent: "text-fancyorange hover:bg-fancyorange-10",
        neutral: "text-gray-200 hover:bg-gray-800",
        danger: "text-deeppurple hover:bg-deeppurple-10",
      }[color];
  }
}

function sizeClasses(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-sm";
    case "md":
      return "h-10 px-4 text-xl";
    case "lg":
      return "h-12 px-6 text-lg";
    case "icon":
    default:
      return "h-10 w-10 p-0 inline-flex items-center justify-center";
  }
}

export function Button({
  variant = "solid",
  color = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames([
        "rounded-md cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
        sizeClasses(size),
        colorClasses(color, variant),
        fullWidth ? "w-full" : undefined,
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
