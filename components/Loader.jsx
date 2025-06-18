export default function Loader({ size = "default", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>

        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>

        {/* Inner pulsing dot */}
        <div className="absolute inset-2 rounded-full bg-blue-600 animate-pulse"></div>
      </div>
    </div>
  );
}
