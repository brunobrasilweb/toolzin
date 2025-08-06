"use client";

import { useState } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

// Função para gerar CPF válido
function generateCPF(): string {
  // Gera os 9 primeiros dígitos aleatoriamente
  const digits = [];
  for (let i = 0; i < 9; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let firstVerifier = 11 - (sum % 11);
  if (firstVerifier >= 10) firstVerifier = 0;
  digits.push(firstVerifier);

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  let secondVerifier = 11 - (sum % 11);
  if (secondVerifier >= 10) secondVerifier = 0;
  digits.push(secondVerifier);

  // Formata o CPF
  const cpf = digits.join("");
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
}

export default function CPFGenerator() {
  const [cpf, setCpf] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    const newCpf = generateCPF();
    setCpf(newCpf);
    setCopied(false);
    trackGeneration("CPF");
  };

  const handleCopy = async () => {
    if (cpf) {
      try {
        await navigator.clipboard.writeText(cpf);
        setCopied(true);
        trackCopy("CPF");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.cpf className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CPF Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate valid CPFs for testing and development
          </p>
        </div>

        {/* Generator Tool */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="text-center">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 mb-6"
            >
              Generate CPF
            </button>

            {cpf && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Generated CPF:
                  </div>
                  <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                    {cpf}
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
                      Copy CPF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.warning className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                About CPF and Important Care
              </h3>
              <div className="text-amber-700 dark:text-amber-300 space-y-2">
                <p>
                  <strong>What is CPF:</strong> The Individual Taxpayer Registry (CPF) is a document issued by the Brazilian Federal Revenue that serves to identify Brazilian taxpayers.
                </p>
                <p>
                  <strong>How to use generated CPFs:</strong> CPFs generated by this tool are only for testing purposes, software development and demonstrations. They follow the official validation algorithm.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ToolIcons.ban className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Care and Usage Restrictions
              </h3>
              <div className="text-red-700 dark:text-red-300 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Never use for fraudulent purposes:</strong> It is a crime to use third-party CPF or false data in official documents.
                  </li>
                  <li>
                    <strong>Only for testing:</strong> Use exclusively for development, software testing and demonstrations.
                  </li>
                  <li>
                    <strong>These are not real CPFs:</strong> Although they follow the validation algorithm, these CPFs do not belong to real people.
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
      <Footer />
    </div>
  );
}
