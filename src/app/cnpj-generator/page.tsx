"use client";

import { useState } from "react";
import Link from "next/link";

// Função para gerar CNPJ válido
function generateCNPJ(): string {
  // Gera os 8 primeiros dígitos aleatoriamente
  const digits = [];
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Adiciona os dígitos de filial (0001)
  digits.push(0, 0, 0, 1);

  // Calcula o primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weights1[i];
  }
  let firstVerifier = sum % 11;
  firstVerifier = firstVerifier < 2 ? 0 : 11 - firstVerifier;
  digits.push(firstVerifier);

  // Calcula o segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * weights2[i];
  }
  let secondVerifier = sum % 11;
  secondVerifier = secondVerifier < 2 ? 0 : 11 - secondVerifier;
  digits.push(secondVerifier);

  // Formata o CNPJ
  const cnpj = digits.join("");
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
}

export default function CNPJGenerator() {
  const [cnpj, setCnpj] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    const newCnpj = generateCNPJ();
    setCnpj(newCnpj);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (cnpj) {
      try {
        await navigator.clipboard.writeText(cnpj);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔧 Toolzin
              </h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Online Tools
              </span>
            </Link>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CNPJ Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate valid CNPJs for testing and development
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="text-center">
            <button
              onClick={handleGenerate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 mb-6"
            >
              Generate CNPJ
            </button>

            {cnpj && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Generated CNPJ:
                  </div>
                  <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                    {cnpj}
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
                      <span className="mr-2">✓</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📋</span>
                      Copy CNPJ
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                About CNPJ and How It Works
              </h3>
              <div className="text-emerald-700 dark:text-emerald-300 space-y-2">
                <p>
                  <strong>What is CNPJ:</strong> The National Registry of Legal Entities (CNPJ) is a unique number that identifies a legal entity in Brazil. It is issued by the Federal Revenue.
                </p>
                <p>
                  <strong>CNPJ Structure:</strong> The CNPJ has 14 digits in the format XX.XXX.XXX/XXXX-XX, where the first 8 identify the company, the next 4 the branch (0001 for headquarters) and the last 2 are verification digits.
                </p>
                <p>
                  <strong>How to use generated CNPJs:</strong> Ideal for system testing, software development, demonstrations and form validation. All follow the official validation algorithm.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚫</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Care and Usage Restrictions
              </h3>
              <div className="text-red-700 dark:text-red-300 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Never use for fraudulent purposes:</strong> It is a crime to use third-party CNPJ or false data in official documents.
                  </li>
                  <li>
                    <strong>Only for testing and development:</strong> Use exclusively for development, software testing and demonstrations.
                  </li>
                  <li>
                    <strong>These are not CNPJs of real companies:</strong> Although they follow the validation algorithm, these CNPJs do not belong to existing companies.
                  </li>
                  <li>
                    <strong>Prohibited improper commercial use:</strong> Do not use these CNPJs for company registration or any official purpose.
                  </li>
                  <li>
                    <strong>User responsibility:</strong> Inappropriate use is the exclusive responsibility of the user.
                  </li>
                </ul>
              </div>
            </div>
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
