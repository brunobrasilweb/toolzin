import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  FileSpreadsheet, 
  Building2, 
  KeyRound, 
  Lock, 
  Search, 
  RefreshCw, 
  Youtube, 
  Clock,
  Instagram,
  Timer,
  QrCode,
  ImageIcon
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

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
                <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                <KeyRound className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                <Lock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
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
                <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
                <RefreshCw className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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

          {/* YouTube Thumbnail Downloader */}
          <Link href="/youtube-thumbnail" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                YouTube Thumbnail
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download thumbnails from YouTube videos
              </p>
              <div className="mt-4 text-red-600 dark:text-red-400 font-medium group-hover:text-red-700 dark:group-hover:text-red-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Instagram Image Downloader */}
          <Link href="/instagram-image" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 dark:group-hover:bg-pink-800 transition-colors">
                <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Instagram Image
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download images from Instagram posts
              </p>
              <div className="mt-4 text-pink-600 dark:text-pink-400 font-medium group-hover:text-pink-700 dark:group-hover:text-pink-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Pomodoro Timer */}
          <Link href="/pomodoro-timer" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <Timer className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Pomodoro Timer
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your tasks and productivity with a customizable Pomodoro timer
              </p>
              <div className="mt-4 text-orange-600 dark:text-orange-400 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* PIX QR Code Generator */}
          <Link href="/pix-qrcode" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800 transition-colors">
                <QrCode className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                PIX QR Code
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gere QR Codes para pagamentos via PIX
              </p>
              <div className="mt-4 text-cyan-600 dark:text-cyan-400 font-medium group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                Use tool →
              </div>
            </div>
          </Link>

          {/* Favicon Generator */}
          <Link href="/favicon-generator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-200 dark:group-hover:bg-violet-800 transition-colors">
                <ImageIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Favicon Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate high-quality ICO and PNG favicons for web, mobile and desktop
              </p>
              <div className="mt-4 text-violet-600 dark:text-violet-400 font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300">
                Use tool →
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
