export default function Card({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const baseClasses = `
    rounded-lg border transition-all duration-200
    shadow-sm hover:shadow-md
  `;

  const variants = {
    default: `
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      hover:border-gray-300 dark:hover:border-gray-600
    `,
    elevated: `
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      shadow-md hover:shadow-lg
    `,
    result: `
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      hover:border-gray-300 dark:hover:border-gray-600
      shadow-md hover:shadow-lg
    `,
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
