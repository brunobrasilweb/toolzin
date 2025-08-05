import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔧 Toolzin
              </h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Online Tools
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Useful Online Tools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of practical and free tools for your daily needs
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* CPF Generator Tool */}
          <Link href="/cpf-generator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <span className="text-2xl">🆔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                CPF Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate valid CPFs for testing and development
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* CNPJ Generator Tool */}
          <Link href="/cnpj-generator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                CNPJ Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate valid CNPJs for testing and development
              </p>
              <div className="mt-4 text-green-600 dark:text-green-400 font-medium group-hover:text-green-700 dark:group-hover:text-green-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Password Generator Tool */}
          <Link href="/password-generator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Password Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate secure passwords with custom options
              </p>
              <div className="mt-4 text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Hash Generator Tool */}
          <Link href="/hash-generator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Hash Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate hash values from text using various algorithms
              </p>
              <div className="mt-4 text-teal-600 dark:text-teal-400 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* JWT Decoder Tool */}
          <Link href="/jwt-decoder" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                JWT Decoder
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Decode and analyze JWT tokens with detailed explanations
              </p>
              <div className="mt-4 text-amber-600 dark:text-amber-400 font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Base64 Tool */}
          <Link href="/base64-tool" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Base64 Tool
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Encode text to Base64 or decode Base64 to text
              </p>
              <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Placeholder for future tools */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 opacity-50">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔜</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Coming soon...
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              More useful tools are coming
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Toolzin. Free tools for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
