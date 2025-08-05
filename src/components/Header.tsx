'use client';

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  showBackButton?: boolean;
};

export default function Header({ showBackButton = false }: HeaderProps) {
  return (
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
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
