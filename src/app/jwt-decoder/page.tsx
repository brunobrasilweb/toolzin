"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";

interface JWTPayload {
  [key: string]: any;
}

interface DecodedJWT {
  header: { [key: string]: any };
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
}

function decodeJWT(token: string): DecodedJWT | null {
  if (!token) return null;
  
  try {
    // Split the token into its three parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode header and payload
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];

    // We can't verify the signature in the browser without the secret key
    // This would just be a format check
    const isValid = parts[0].length > 0 && parts[1].length > 0 && parts[2].length > 0;

    return { header, payload, signature, isValid };
  } catch (error) {
    console.error("JWT decoding error:", error);
    return null;
  }
}

function formatDateTime(timestamp: number): string {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
}

function getTimeStatus(exp?: number, nbf?: number): string {
  if (!exp && !nbf) return 'No time constraints';
  
  const now = Math.floor(Date.now() / 1000);
  
  if (exp && now > exp) return 'Expired';
  if (nbf && now < nbf) return 'Not yet valid';
  if (exp) {
    const remaining = exp - now;
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) return `Valid for ${days} days and ${hours} hours`;
    if (hours > 0) return `Valid for ${hours} hours`;
    return `Expires soon`;
  }
  
  return 'Valid';
}

function JsonViewer({ data }: { data: any }) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function JWTDecoder() {
  const [jwt, setJwt] = useState<string>("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("decoded");
  
  // Auto-decode when JWT changes
  useEffect(() => {
    if (jwt) {
      const result = decodeJWT(jwt);
      setDecoded(result);
    } else {
      setDecoded(null);
    }
  }, [jwt]);

  const handleDecode = () => {
    if (!jwt) return;
    
    const result = decodeJWT(jwt);
    setDecoded(result);
    setCopied(false);
    trackGeneration("JWT-Decode");
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackCopy("JWT-Content");
  };

  const handleClear = () => {
    setJwt("");
    setDecoded(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.jwt className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JWT Decoder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Decode and inspect JSON Web Tokens
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">JWT Decoder</h2>
          
          {/* Input Area */}
          <div className="mb-6">
            <label htmlFor="jwt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter JWT Token
            </label>
            <textarea
              id="jwt"
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste your JWT token here..."
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleDecode}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              disabled={!jwt}
            >
              Decode Token
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
          
          {/* Helper Text */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-8 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How to use this tool:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Paste your JWT token into the field above</li>
              <li>Click the "Decode Token" button to analyze the token</li>
              <li>View the decoded information in the tabs below</li>
              <li>Use the "Copy" buttons to copy specific parts of the token</li>
            </ol>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              This tool operates entirely in your browser - no data is sent to any server, ensuring your token remains private and secure.
            </p>
          </div>

          {/* Results Area */}
          {decoded && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "decoded"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("decoded")}
                >
                  Decoded
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "header"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("header")}
                >
                  Header
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "payload"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("payload")}
                >
                  Payload
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "signature"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("signature")}
                >
                  Signature
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "decoded" && (
                  <div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Token Status: {decoded.isValid ? 
                            'Valid Format' : 'Invalid Format'}
                          </h3>
                          {decoded.payload.exp && (
                            <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                              {getTimeStatus(decoded.payload.exp, decoded.payload.nbf)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Token Info</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 space-y-2">
                          {decoded.payload.iss && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Issuer (iss):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{decoded.payload.iss}</span>
                            </div>
                          )}
                          {decoded.payload.sub && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject (sub):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{decoded.payload.sub}</span>
                            </div>
                          )}
                          {decoded.payload.aud && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Audience (aud):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                                {Array.isArray(decoded.payload.aud) ? decoded.payload.aud.join(', ') : decoded.payload.aud}
                              </span>
                            </div>
                          )}
                          {decoded.payload.iat && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Issued At (iat):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{formatDateTime(decoded.payload.iat)}</span>
                            </div>
                          )}
                          {decoded.payload.exp && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expires At (exp):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{formatDateTime(decoded.payload.exp)}</span>
                            </div>
                          )}
                          {decoded.payload.nbf && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Before (nbf):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{formatDateTime(decoded.payload.nbf)}</span>
                            </div>
                          )}
                          {decoded.payload.jti && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">JWT ID (jti):</span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{decoded.payload.jti}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "header" && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Header</h4>
                      <button
                        onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2))}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <JsonViewer data={decoded.header} />
                  </div>
                )}

                {activeTab === "payload" && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Payload</h4>
                      <button
                        onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2))}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <JsonViewer data={decoded.payload} />
                  </div>
                )}

                {activeTab === "signature" && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Signature (Base64Url encoded)</h4>
                      <button
                        onClick={() => handleCopy(decoded.signature)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto break-all text-sm">
                      {decoded.signature}
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Note: This tool cannot verify the signature without the secret key or public key used to sign the token.
                    </p>
                  </div>
                )}
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
                About JSON Web Tokens (JWT)
              </h3>
              <div className="text-blue-700 dark:text-blue-300 space-y-2">
                <p>
                  JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. 
                  JWTs consist of three parts: Header (algorithm & token type), Payload (data), and Signature (verification).
                </p>
                <p>
                  JWT Structure: <code className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded text-xs">header.payload.signature</code>
                </p>
                <p>
                  <strong>Header:</strong> Contains the type of token (JWT) and the signing algorithm (e.g., HMAC SHA256 or RSA).
                </p>
                <p>
                  <strong>Payload:</strong> Contains claims (statements about an entity and data). Common claims include:
                  <code className="text-xs bg-blue-100 dark:bg-blue-800/50 p-1 rounded mx-1">iss</code> (Issuer),
                  <code className="text-xs bg-blue-100 dark:bg-blue-800/50 p-1 rounded mx-1">sub</code> (Subject),
                  <code className="text-xs bg-blue-100 dark:bg-blue-800/50 p-1 rounded mx-1">exp</code> (Expiration Time),
                  <code className="text-xs bg-blue-100 dark:bg-blue-800/50 p-1 rounded mx-1">iat</code> (Issued At).
                </p>
                <p>
                  <strong>Signature:</strong> Created by signing the encoded header and payload using a secret key. It verifies that the message wasn't changed and, in some cases, verifies the sender's identity.
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
