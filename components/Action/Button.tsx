interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-medium outline-none transition ease-in-out duration-150";

  const variantStyles = {
    primary: "bg-[#533BE5] text-white hover:bg-[#533BE5] shadow-button",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
    className || ""
  }`;

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
};
