"use client";

import { useState } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

// Função para gerar hash de acordo com o algoritmo selecionado
async function generateHash(text: string, algorithm: string): Promise<string> {
  if (!text) return "";
  
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  let hashBuffer;
  try {
    hashBuffer = await crypto.subtle.digest(algorithm, data);
  } catch (error) {
    console.error("Hash generation error:", error);
    return "Error generating hash";
  }
  
  // Converter o buffer para string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [text, setText] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<string>("SHA-256");
  const [hash, setHash] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  const hashAlgorithms = [
    { value: "SHA-1", label: "SHA-1" },
    { value: "SHA-256", label: "SHA-256" },
    { value: "SHA-384", label: "SHA-384" },
    { value: "SHA-512", label: "SHA-512" }
  ];

  const handleGenerate = async () => {
    if (!text) return;
    
    const newHash = await generateHash(text, algorithm);
    setHash(newHash);
    setCopied(false);
    trackGeneration("Hash");
  };

  const handleCopy = async () => {
    if (hash) {
      try {
        await navigator.clipboard.writeText(hash);
        setCopied(true);
        trackCopy("Hash");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.hash className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hash Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate hash values from text using various algorithms
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="space-y-6">
            {/* Input textarea */}
            <div className="space-y-2">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Text to hash
              </label>
              <textarea
                id="text-input"
                rows={5}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
                placeholder="Enter text to hash..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            
            {/* Algorithm selection */}
            <div className="space-y-2">
              <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hash Algorithm
              </label>
              <select
                id="algorithm"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 dark:focus:border-teal-400 dark:focus:ring-teal-400"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                {hashAlgorithms.map((algo) => (
                  <option key={algo.value} value={algo.value}>
                    {algo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate button */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={!text}
                className={`${
                  text ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                } text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200`}
              >
                Generate Hash
              </button>
            </div>

            {/* Hash output */}
            {hash && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {algorithm} Hash:
                  </div>
                  <div className="text-base font-mono font-medium text-gray-900 dark:text-white break-all">
                    {hash}
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className={`${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  } text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto`}
                >
                  {copied ? (
                    <>
                      <ToolIcons.check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ToolIcons.copy className="h-4 w-4 mr-2" />
                      Copy Hash
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-2">
                About Hash Functions
              </h3>
              <div className="text-teal-700 dark:text-teal-300 space-y-2">
                <p>
                  <strong>What are hash functions:</strong> Hash functions are mathematical algorithms that convert data of any size into a fixed-size output (hash value). They are designed to be one-way functions, meaning it should be computationally infeasible to reverse the process.
                </p>
                <p>
                  <strong>Common uses:</strong> Password storage, data integrity verification, digital signatures, and file checksums.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.security className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Security Considerations
              </h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>SHA-1:</strong> No longer considered secure for cryptographic purposes.
                  </li>
                  <li>
                    <strong>SHA-256 and above:</strong> Currently considered secure for most applications.
                  </li>
                  <li>
                    <strong>Password hashing:</strong> For storing passwords, specialized algorithms like bcrypt, Argon2, or PBKDF2 are recommended instead of simple hash functions.
                  </li>
                  <li>
                    <strong>Client-side computation:</strong> This tool performs all hash calculations in your browser using the Web Crypto API, so your data never leaves your computer.
                  </li>
                </ul>
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
