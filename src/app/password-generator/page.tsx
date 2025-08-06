"use client";

import { useState } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy, trackEvent } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

// Função para gerar senha
function generatePassword(options: PasswordOptions): string {
  let charset = "";
  
  if (options.includeLowercase) {
    charset += "abcdefghijklmnopqrstuvwxyz";
  }
  
  if (options.includeUppercase) {
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  
  if (options.includeNumbers) {
    charset += "0123456789";
  }
  
  if (options.includeSymbols) {
    charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  }
  
  // Remove caracteres similares se solicitado
  if (options.excludeSimilar) {
    charset = charset.replace(/[il1Lo0O]/g, "");
  }
  
  // Remove caracteres ambíguos se solicitado
  if (options.excludeAmbiguous) {
    charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, "");
  }
  
  if (charset === "") {
    return "";
  }
  
  let password = "";
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Função para calcular força da senha
function calculatePasswordStrength(password: string): { score: number; text: string; color: string } {
  let score = 0;
  
  // Comprimento
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Tipos de caracteres
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return { score, text: "Weak", color: "text-red-600 dark:text-red-400" };
  if (score <= 4) return { score, text: "Medium", color: "text-yellow-600 dark:text-yellow-400" };
  if (score <= 6) return { score, text: "Strong", color: "text-green-600 dark:text-green-400" };
  return { score, text: "Very Strong", color: "text-emerald-600 dark:text-emerald-400" };
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
    trackGeneration("Password");
    
    // Track password options
    trackEvent("generate_password", "Tool Usage", "Password Generator", options.length);
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        trackCopy("Password");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying:", err);
      }
    }
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => {
      const newOptions = { ...prev, [key]: value };
      // Track option changes
      trackEvent("update_password_option", "Configuration", `Changed ${key} to ${value}`);
      return newOptions;
    });
  };

  const strength = password ? calculatePasswordStrength(password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.password className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Password Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate secure passwords with custom options
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Options Panel */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Password Options
              </h3>
              
              {/* Length Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Length: {options.length} characters
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={options.length}
                  onChange={(e) => updateOption('length', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>

              {/* Character Types */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Characters
                </h4>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.includeUppercase}
                    onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Uppercase Letters (A-Z)
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.includeLowercase}
                    onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Lowercase Letters (a-z)
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.includeNumbers}
                    onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Numbers (0-9)
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.includeSymbols}
                    onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Symbols (!@#$%^&*)
                  </span>
                </label>
              </div>

              {/* Advanced Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Advanced Options
                </h4>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.excludeSimilar}
                    onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Exclude Similar Characters (i, l, 1, L, o, 0, O)
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Exclude Ambiguous Characters ({`{} [] () / \\ ' " ~ , ; < > .`})
                  </span>
                </label>
              </div>
            </div>

            {/* Password Display */}
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 mb-6"
                >
                  Generate Password
                </button>

                {password && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Generated Password:
                      </div>
                      <div className="text-lg font-mono font-bold text-gray-900 dark:text-white break-all leading-relaxed">
                        {password}
                      </div>
                      
                      {strength && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Strength:
                            </span>
                            <span className={`text-sm font-medium ${strength.color}`}>
                              {strength.text}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                strength.score <= 2 
                                  ? 'bg-red-600' 
                                  : strength.score <= 4 
                                  ? 'bg-yellow-600' 
                                  : strength.score <= 6 
                                  ? 'bg-green-600' 
                                  : 'bg-emerald-600'
                              }`}
                              style={{ width: `${(strength.score / 7) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
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
                          Copy Password
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.tip className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Password Security Tips
              </h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use at least 12 characters for better security</li>
                  <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li>Avoid using personal information in passwords</li>
                  <li>Use unique passwords for each account</li>
                  <li>Consider using a password manager</li>
                  <li>Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.warning className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Important Security Notice
              </h3>
              <div className="text-amber-700 dark:text-amber-300 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>This tool generates passwords locally in your browser</li>
                  <li>No passwords are stored or transmitted to any server</li>
                  <li>Clear your browser history if using a shared computer</li>
                  <li>Never share your passwords with anyone</li>
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
