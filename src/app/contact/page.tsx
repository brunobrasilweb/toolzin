"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

export default function Contact() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
          
          <div className="flex flex-col items-center justify-center py-10">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-xl font-medium text-gray-900 dark:text-white text-center mb-2">
              Email Us
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
              <a href="mailto:contact@toolzin.site" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                contact@toolzin.site
              </a>
            </p>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-center max-w-lg">
              Have questions, feedback, or suggestions? We'd love to hear from you! 
              Feel free to reach out to us at the email address above.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}