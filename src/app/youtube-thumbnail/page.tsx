"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<{ url: string; quality: string; isDownloading?: boolean }[]>([]);
  const [videoId, setVideoId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleGenerate = () => {
    setError("");
    setThumbnails([]);
    
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }
    
    const id = extractVideoId(url);
    if (!id) {
      setError("Invalid YouTube URL");
      return;
    }
    
    setLoading(true);
    setVideoId(id);
    
    // Different thumbnail quality options that YouTube provides
    const thumbnailQualities = [
      { quality: "Maximum Resolution (maxresdefault)", url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` },
      { quality: "High Quality (hqdefault)", url: `https://img.youtube.com/vi/${id}/hqdefault.jpg` },
      { quality: "Medium Quality (mqdefault)", url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` },
      { quality: "Standard Definition (sddefault)", url: `https://img.youtube.com/vi/${id}/sddefault.jpg` },
      { quality: "Default Thumbnail (default)", url: `https://img.youtube.com/vi/${id}/default.jpg` },
      { quality: "Thumbnail 1 (1)", url: `https://img.youtube.com/vi/${id}/1.jpg` },
      { quality: "Thumbnail 2 (2)", url: `https://img.youtube.com/vi/${id}/2.jpg` },
      { quality: "Thumbnail 3 (3)", url: `https://img.youtube.com/vi/${id}/3.jpg` }
    ];
    
    setThumbnails(thumbnailQualities);
    setLoading(false);
    trackGeneration("YouTube-Thumbnail");
  };

  const handleDownload = async (imageUrl: string, quality: string, index: number) => {
    try {
      // Update the loading state for this specific thumbnail
      const updatedThumbnails = [...thumbnails];
      updatedThumbnails[index].isDownloading = true;
      setThumbnails(updatedThumbnails);
      
      // Fetch the image first to handle CORS issues
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create object URL from blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Create anchor element for download
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `youtube-thumbnail-${videoId}-${quality.toLowerCase().replace(/\s/g, "-")}.jpg`;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      
      // Reset loading state for this thumbnail
      updatedThumbnails[index].isDownloading = false;
      setThumbnails(updatedThumbnails);
      
      trackCopy("YouTube-Thumbnail-Download");
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download the image. Please try again.");
      
      // Reset loading state on error
      const updatedThumbnails = [...thumbnails];
      updatedThumbnails[index].isDownloading = false;
      setThumbnails(updatedThumbnails);
    }
  };

  const handleClear = () => {
    setUrl("");
    setThumbnails([]);
    setVideoId("");
    setError("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.youtube className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Download high-quality thumbnails from YouTube videos
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube Video URL
              </label>
              <input
                type="text"
                id="youtube-url"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full sm:w-auto flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Thumbnails"}
              </button>
              <button
                onClick={handleClear}
                className="w-full sm:w-auto flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {thumbnails.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Available Thumbnails
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thumbnails.map((thumbnail, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {thumbnail.quality}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="relative w-full h-40 mb-3">
                        <img 
                          src={thumbnail.url}
                          alt={`YouTube thumbnail - ${thumbnail.quality}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Hide the image and show "Not available" message
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) nextElement.style.display = "flex";
                          }}
                        />
                        <div 
                          className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium" 
                          style={{ display: "none" }}
                        >
                          This quality is not available
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(thumbnail.url, thumbnail.quality.split(" ")[0], index)}
                        disabled={thumbnail.isDownloading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
                      >
                        {thumbnail.isDownloading ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                How to use this tool
              </h3>
              <div className="text-red-700 dark:text-red-300 space-y-2">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Paste any YouTube video URL in the input field above</li>
                  <li>Click on "Get Thumbnails" to fetch all available thumbnail qualities</li>
                  <li>Preview the thumbnails and click "Download" to save your preferred version</li>
                </ol>
                <p className="mt-2"><strong>Note:</strong> Not all thumbnail qualities are available for every video. The maximum resolution thumbnail might not be available for older videos.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
