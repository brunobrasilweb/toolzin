import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Toolzin</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At Toolzin, our mission is to provide a collection of free, useful, and easy-to-use online tools that help people solve everyday problems. We believe that useful tools should be accessible to everyone without paywalls or complicated interfaces.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">What We Offer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Toolzin provides a variety of web-based utilities designed to make your digital life easier:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">Data generators for testing and development (CPF, CNPJ)</li>
              <li className="mb-2">Security tools (Password Generator, Hash Generator)</li>
              <li className="mb-2">Encoding/Decoding utilities (Base64 Tool, JWT Decoder)</li>
              <li className="mb-2">Media downloaders (YouTube Thumbnail, Instagram Image)</li>
              <li className="mb-2">And more tools coming soon!</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">Privacy First</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Most of our tools run directly in your browser. Your data never leaves your device, ensuring maximum privacy and security.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Simplicity</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We design our tools to be straightforward and easy to use, without unnecessary complications or distractions.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">Accessibility</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe useful tools should be available to everyone, regardless of technical expertise or financial means.
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-2">Continuous Improvement</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We're constantly working to improve our existing tools and develop new ones based on user feedback.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Toolzin was created by a team of developers who were tired of having to navigate through ad-filled websites just to use simple online tools. We wanted to create a clean, ad-free platform where people could quickly access the utilities they need.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              What started as a small project has grown into a collection of tools used by thousands of people daily. We're committed to expanding our offerings while staying true to our core values of privacy, simplicity, and accessibility.
            </p>

            <div className="mt-8 text-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
