"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

export default function InstagramImage() {
  const [url, setUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Function to extract Instagram post ID from URL
  const extractInstagramId = (url: string): string | null => {
    // Support for various Instagram URL formats
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleGenerate = () => {
    setError("");
    setImageUrl("");
    setSuccess(false);
    
    if (!url) {
      setError("Please enter an Instagram post URL");
      return;
    }
    
    const id = extractInstagramId(url);
    if (!id) {
      setError("Invalid Instagram URL. Please enter a valid Instagram post or reel URL");
      return;
    }
    
    setLoading(true);
    
    // In a real implementation, you'd use an API to fetch the Instagram image
    // Since direct scraping of Instagram is against their terms and requires authentication,
    // we would typically use a server-side approach or a proxy API
    
    // For demonstration purposes, we'll use a simplified approach
    // In a production environment, you would need to implement a proper backend service
    const directImageUrl = `https://www.instagram.com/p/${id}/media/?size=l`;
    setImageUrl(directImageUrl);
    setSuccess(true);
    setLoading(false);
    trackGeneration("Instagram-Image");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tool Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.instagram className="h-8 w-8 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Instagram Image Downloader
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Download images from Instagram posts with just a URL
          </p>
        </div>

        {/* Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto mb-12">
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram Post URL
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                id="instagram-url"
                placeholder="https://www.instagram.com/p/XXXXXXXXXXXX/"
                className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Get Image"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 flex items-start">
              <ToolIcons.warning className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Info Notice */}
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-300 flex items-start">
            <ToolIcons.info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Important Note</p>
              <p className="text-sm">
                This tool works with public Instagram posts only. Due to Instagram's policies, some images may not be downloadable directly. We respect Instagram's terms of service and recommend using this tool for personal use only.
              </p>
            </div>
          </div>

          {/* Results Section */}
          {success && imageUrl && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Instagram Image
              </h3>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                  {/* Note: In a real app, you might need to handle CORS issues with Image component */}
                  <img 
                    src={imageUrl} 
                    alt="Instagram post image" 
                    className="object-contain w-full h-full" 
                  />
                </div>
                
                {/* Download instructions instead of button */}
                <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200">
                  <p className="text-center font-medium mb-1">
                    <ToolIcons.info className="h-5 w-5 mr-2 inline-block" />
                    To download this image:
                  </p>
                  <ol className="list-decimal pl-8 text-sm space-y-1">
                    <li>Right-click on the image above</li>
                    <li>Select "Save image as..." from the context menu</li>
                    <li>Choose a location on your computer and save</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-300 flex items-start">
                <ToolIcons.tip className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">
                    For mobile devices: Press and hold on the image, then select "Download image" or "Save image" from the menu that appears. On some browsers, you may need to first open the image in a new tab by tapping on it before you can download.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium">
            &larr; Back to All Tools
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
