"use client";

import { useState } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

export default function Base64Tool() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState<boolean>(false);

  const handleEncodeDecode = () => {
    if (!text) return;
    
    try {
      let newResult = "";
      if (mode === "encode") {
        // Use btoa for encoding but handle UTF-8 properly
        newResult = btoa(unescape(encodeURIComponent(text)));
      } else {
        // Use atob for decoding but handle UTF-8 properly
        newResult = decodeURIComponent(escape(atob(text)));
      }
      setResult(newResult);
      setCopied(false);
      trackGeneration("Base64-" + (mode === "encode" ? "Encode" : "Decode"));
    } catch (error) {
      console.error("Base64 error:", error);
      setResult("Error: Invalid input for " + (mode === "encode" ? "encoding" : "decoding"));
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        trackCopy("Base64-" + (mode === "encode" ? "Encode" : "Decode"));
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Copy error:", error);
      }
    }
  };

  const handleModeToggle = (newMode: "encode" | "decode") => {
    if (newMode !== mode) {
      setMode(newMode);
      setText("");
      setResult("");
      setCopied(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.base64 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Base64 Encoder / Decoder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Easily encode text to Base64 or decode Base64 to text
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`py-2 px-4 text-sm font-medium rounded-l-lg border ${
                mode === "encode" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleModeToggle("encode")}
            >
              Encode
            </button>
            <button
              type="button"
              className={`py-2 px-4 text-sm font-medium rounded-r-lg border ${
                mode === "decode" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleModeToggle("decode")}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <textarea
            id="input"
            rows={6}
            className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            onClick={handleEncodeDecode}
          >
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === "encode" ? "Base64 Result" : "Decoded Text"}
              </label>
              <button
                type="button"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <textarea
                readOnly
                rows={6}
                className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                value={result}
              />
            </div>
          </div>
        )}
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                About Base64
              </h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <p>
                  Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating
                  it into a radix-64 representation.
                </p>
                <p>
                  It's commonly used when there is a need to encode binary data in environments
                  that only support text, such as embedding binary data in XML or JSON, transferring data in email attachments,
                  storing complex data in URLs, and encoding images for web display.
                </p>
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
