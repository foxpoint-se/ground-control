import { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import "./button.css";

type Variant = "primary" | "secondary" | "default";

type ButtonProps = {
  variant?: Variant;
  onClick?: () => void;
  pressed?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  style?: CSSProperties;
};

type LinkButtonProps = ButtonProps & {
  href: string;
};

const variantClass: Record<Variant, string> = {
  default: "btn-neutral",
  primary: "btn-primary",
  secondary: "btn-secondary",
};

const getVariantClass = (variant: Variant): string => {
  return variantClass[variant];
};

export const Button = ({
  variant = "default",
  onClick,
  pressed,
  children,
  className = "",
  disabled,
  style,
}: ButtonProps) => {
  const variantClass = getVariantClass(variant);

  const pressedClass = pressed ? "active" : "";

  return (
    <button
      className={`btn ${variantClass} ${pressedClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export const LinkButton = ({
  variant = "default",
  onClick,
  pressed,
  children,
  href,
  className = "",
}: LinkButtonProps) => {
  const variantClass = getVariantClass(variant);
  const pressedClass = pressed ? "active" : "";

  return (
    <Link
      className={`btn ${variantClass} ${pressedClass} ${className}`}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
