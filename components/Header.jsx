export default function Header() {
  return (
    <header className="w-full text-center py-16 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
            App Store Connect Helper
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-8 rounded-full"></div>
        </div>

        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-8 max-w-3xl mx-auto">
          Generate optimized App Store metadata with AI in seconds
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Optimized for App Store</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Generate Icons</span>
          </div>
        </div>
      </div>
    </header>
  );
}
