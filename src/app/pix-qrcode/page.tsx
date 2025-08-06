"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { QrCode, Copy, Download, Repeat, ChevronDown, ChevronUp, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Pix } from "@/utils/Pix";
import { pixInformation } from "@/utils/pixInformation";

// Translations
const translations = {
  "pt-BR": {
    title: "Gerador de QR Code PIX",
    description: "Gere QR Codes para pagamentos via PIX facilmente e gratuitamente",
    keyType: "Tipo de Chave",
    keyTypePlaceholder: "Selecione o tipo de chave",
    cpf: "CPF",
    cnpj: "CNPJ",
    email: "E-mail",
    phone: "Telefone",
    randomKey: "Chave Aleatória",
    key: "Chave PIX",
    keyPlaceholder: "Digite sua chave PIX",
    amount: "Valor (R$)",
    amountPlaceholder: "Digite o valor (opcional)",
    descriptionLabel: "Descrição/Identificação",
    descriptionPlaceholder: "Digite uma identificação para o pagamento (opcional)",
    generate: "Gerar QR Code",
    copy: "Copiar PIX Copia e Cola",
    download: "Baixar QR Code",
    qrCodeResult: "QR Code PIX gerado com sucesso!",
    noQrCode: "Preencha o formulário e clique em Gerar QR Code",
    language: "Idioma",
    copySuccess: "Código PIX copiado com sucesso!",
    downloadSuccess: "QR Code baixado com sucesso!",
    requiredField: "Campo obrigatório",
    invalidFormat: "Formato inválido",
    instructions: "Como usar o QR Code PIX:",
    instructionsText: "1. Preencha sua chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória)\n2. Opcionalmente, digite um valor e uma descrição\n3. Clique em 'Gerar QR Code'\n4. Use o botão 'Copiar' para obter o código PIX\n5. Ou baixe a imagem do QR Code para compartilhar"
  },
  "en": {
    title: "PIX QR Code Generator",
    description: "Generate QR Codes for PIX payments easily and for free",
    keyType: "Key Type",
    keyTypePlaceholder: "Select key type",
    cpf: "CPF (Brazilian ID)",
    cnpj: "CNPJ (Brazilian Company ID)",
    email: "Email",
    phone: "Phone",
    randomKey: "Random Key",
    key: "PIX Key",
    keyPlaceholder: "Enter your PIX key",
    amount: "Amount (R$)",
    amountPlaceholder: "Enter amount (optional)",
    descriptionLabel: "Description/Identification",
    descriptionPlaceholder: "Enter an identification for the payment (optional)",
    generate: "Generate QR Code",
    copy: "Copy PIX Code",
    download: "Download QR Code",
    qrCodeResult: "PIX QR Code successfully generated!",
    noQrCode: "Fill out the form and click Generate QR Code",
    language: "Language",
    copySuccess: "PIX code successfully copied!",
    downloadSuccess: "QR Code downloaded successfully!",
    requiredField: "Required field",
    invalidFormat: "Invalid format",
    instructions: "How to use PIX QR Code:",
    instructionsText: "1. Enter your PIX key (CPF, CNPJ, email, phone or random key)\n2. Optionally, enter an amount and a description\n3. Click on 'Generate QR Code'\n4. Use the 'Copy' button to get the PIX code\n5. Or download the QR Code image to share"
  }
};

export default function PixQrCode() {
  const [language, setLanguage] = useState<"pt-BR" | "en">("pt-BR");
  const [keyType, setKeyType] = useState<string>("");
  const [pixKey, setPixKey] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [pixCodeText, setPixCodeText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formattedPixCode, setFormattedPixCode] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const t = translations[language];
  const pixInfo = pixInformation[language];

  useEffect(() => {
    // Reset notification states
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
    if (downloaded) {
      const timer = setTimeout(() => setDownloaded(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied, downloaded]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!keyType) newErrors.keyType = t.requiredField;
    if (!pixKey) newErrors.pixKey = t.requiredField;
    
    // Validate key format based on type
    if (keyType && pixKey) {
      if (keyType === "CPF" && !/^\d{11}$/.test(pixKey.replace(/\D/g, ''))) {
        newErrors.pixKey = t.invalidFormat;
      } else if (keyType === "CNPJ" && !/^\d{14}$/.test(pixKey.replace(/\D/g, ''))) {
        newErrors.pixKey = t.invalidFormat;
      } else if (keyType === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
        newErrors.pixKey = t.invalidFormat;
      } else if (keyType === "PHONE") {
        // Remove todos os caracteres não numéricos para validação
        const phoneDigits = pixKey.replace(/\D/g, '');
        // Telefone brasileiro deve ter 10 ou 11 dígitos (com DDD)
        if (!(phoneDigits.length === 10 || phoneDigits.length === 11)) {
          newErrors.pixKey = t.invalidFormat;
        }
      } else if (keyType === "RANDOM" && pixKey.length < 8) {
        newErrors.pixKey = t.invalidFormat;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePixCode = () => {
    if (!validateForm()) return;
    
    // Formatar a chave de acordo com o tipo selecionado
    let formattedKey = pixKey;
    if (keyType === "CPF") {
      // Apenas números para CPF
      formattedKey = pixKey.replace(/\D/g, '');
    } else if (keyType === "CNPJ") {
      // Apenas números para CNPJ
      formattedKey = pixKey.replace(/\D/g, '');
    } else if (keyType === "EMAIL") {
      // Email permanece como está
      formattedKey = pixKey.toLowerCase();
    } else if (keyType === "PHONE") {
      // Padronizar telefone como +55 + número, removendo caracteres não numéricos
      const phoneDigits = pixKey.replace(/\D/g, '');
      // Garantir que está no formato internacional
      if (phoneDigits.length === 11) { // Com 9 na frente + DDD + número
        formattedKey = `+55${phoneDigits}`;
      } else if (phoneDigits.length === 10) { // DDD + número sem 9
        formattedKey = `+55${phoneDigits}`;
      }
    }
    
    // Gerar TxID aleatório se não fornecido
    const txid = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Criar instância do PIX
    const pix = new Pix(
      formattedKey,
      description || "Pagamento PIX",
      "USUARIO PIX",
      "BRASILIA",
      txid,
      amount ? parseFloat(amount) : undefined
    );
    
    // Obter o payload
    const payload = pix.getPayload();
    
    // Formatar o código PIX para exibição (grupos de 4 caracteres para facilitar leitura)
    const formattedCode = payload.match(/.{1,4}/g)?.join(' ') || payload;
    
    setPixCodeText(payload);
    setFormattedPixCode(formattedCode);
  };

  const copyToClipboard = () => {
    if (pixCodeText) {
      navigator.clipboard.writeText(pixCodeText);
      setCopied(true);
      
      // Resetar estado após 3 segundos
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        // Convert SVG to string
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const link = document.createElement("a");
        link.href = svgUrl;
        link.download = "pix-qrcode.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(svgUrl);
        setDownloaded(true);
        
        // Resetar estado após 3 segundos
        setTimeout(() => setDownloaded(false), 3000);
      }
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ToolIcons.qrcode className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {t.description}
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700 dark:text-gray-300">{t.language}:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "pt-BR" | "en")}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm"
            >
              <option value="pt-BR">Português</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="keyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.keyType} *
                </label>
                <select
                  id="keyType"
                  value={keyType}
                  onChange={(e) => setKeyType(e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.keyType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="" disabled>{t.keyTypePlaceholder}</option>
                  <option value="CPF">{t.cpf}</option>
                  <option value="CNPJ">{t.cnpj}</option>
                  <option value="EMAIL">{t.email}</option>
                  <option value="PHONE">{t.phone}</option>
                  <option value="RANDOM">{t.randomKey}</option>
                </select>
                {errors.keyType && <p className="mt-1 text-sm text-red-500">{errors.keyType}</p>}
              </div>

              <div>
                <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.key} *
                </label>
                <input
                  type="text"
                  id="pixKey"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder={t.keyPlaceholder}
                  className={`w-full px-3 py-2 border ${errors.pixKey ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.pixKey && <p className="mt-1 text-sm text-red-500">{errors.pixKey}</p>}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.amount}
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t.amountPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.descriptionLabel}
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                onClick={generatePixCode}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-md shadow transition duration-150 flex items-center justify-center"
              >
                <QrCode className="h-5 w-5 mr-2" />
                {t.generate}
              </button>
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">{t.instructions}</h3>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t.instructionsText.split('\n').map((line, index) => (
                  <p key={index} className="mb-1">{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Result */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-between">
            <div className="w-full text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {pixCodeText ? t.qrCodeResult : t.noQrCode}
              </h2>
              
              <div ref={qrRef} className="mx-auto w-64 h-64 flex items-center justify-center bg-white p-3 rounded-lg mb-4">
                {pixCodeText ? (
                  <QRCodeSVG 
                    value={pixCodeText} 
                    size={250} 
                    level="Q" 
                    includeMargin={true}
                    bgColor={"#FFFFFF"}
                    fgColor={"#000000"}
                  />
                ) : (
                  <QrCode className="h-16 sm:h-20 w-16 sm:w-20 text-gray-300" />
                )}
              </div>
            </div>

            {pixCodeText && (
              <div className="w-full mt-4 space-y-3 sm:space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-md overflow-x-auto">
                  <code className="text-xs sm:text-sm break-all text-gray-800 dark:text-gray-200 font-mono">
                    {formattedPixCode}
                  </code>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-150 flex items-center justify-center"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  {copied ? t.copySuccess : t.copy}
                </button>
                
                <button
                  onClick={downloadQRCode}
                  className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-2.5 px-4 rounded-md transition duration-150 flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {downloaded ? t.downloadSuccess : t.download}
                </button>
                
                <button
                  onClick={generatePixCode}
                  className="w-full border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-gray-700 dark:text-cyan-400 dark:border-cyan-400 font-medium py-2.5 px-4 rounded-md transition duration-150 flex items-center justify-center"
                >
                  <Repeat className="h-5 w-5 mr-2" />
                  {t.generate}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* PIX Information Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="h-6 w-6 mr-2 text-cyan-600 dark:text-cyan-400" />
            {pixInfo.title}
          </h2>
          
          <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
            {pixInfo.introduction}
          </p>
          
          <div className="space-y-4">
            {pixInfo.sections.map((section, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{section.title}</h3>
                  {expandedSections.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {expandedSections.includes(index) && (
                  <div className="p-4 dark:bg-gray-800">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <div key={pIndex} className="mb-3">
                        {paragraph.includes('• ') ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {paragraph.split('• ').filter(Boolean).map((item, iIndex) => (
                              <li key={iIndex} className="text-gray-700 dark:text-gray-300">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">{paragraph}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
