import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Last updated: August 6, 2025
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At Toolzin, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Toolzin provides online tools that process data directly in your browser. Most of our tools operate entirely on the client-side, which means that the data you input is processed locally on your device and is not sent to our servers.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              However, we do collect some anonymous usage data to help us improve our services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">Usage data (which tools are most used)</li>
              <li className="mb-2">Device information (browser type, operating system)</li>
              <li className="mb-2">Location data (country and region)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li className="mb-2">To improve our website and tools</li>
              <li className="mb-2">To understand how users interact with our tools</li>
              <li className="mb-2">To analyze usage patterns and optimize user experience</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Analytics</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use Google Analytics to track and analyze the usage of our website. Google Analytics may use cookies to collect anonymous information. You can opt-out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The security of your data is important to us. Since most of our tools process data directly in your browser, your sensitive information does not leave your device. For the limited data we do collect, we have implemented appropriate security measures to protect it from unauthorized access.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Email: <a href="mailto:contact@toolzin.site" className="text-indigo-600 dark:text-indigo-400 hover:underline">contact@toolzin.site</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
