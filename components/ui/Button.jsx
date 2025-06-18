export default function Button({
  children,
  variant = "primary",
  size = "default",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 
      text-white shadow-sm hover:shadow-md
      focus:ring-blue-500 border border-transparent
    `,
    secondary: `
      bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400
      text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 
      dark:border-gray-600 dark:hover:border-gray-500
      focus:ring-gray-500
    `,
    ghost: `
      hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200
      focus:ring-gray-500
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-6 py-2.5 text-base h-11",
    lg: "px-8 py-3 text-lg h-12",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
