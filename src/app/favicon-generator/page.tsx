"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { trackGeneration, trackCopy } from "@/utils/analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, Copy, Upload, ImageIcon, Monitor, Smartphone, Globe } from "lucide-react";

interface FaviconSize {
  size: string;
  name: string;
  type: "web" | "mobile" | "desktop";
}

const faviconSizes: FaviconSize[] = [
  // Web
  { size: "16x16", name: "favicon-16x16.png", type: "web" },
  { size: "32x32", name: "favicon-32x32.png", type: "web" },
  { size: "96x96", name: "favicon-96x96.png", type: "web" },
  { size: "48x48", name: "favicon.ico", type: "web" }, // Mudando para 48x48 como base para ICO de melhor qualidade
  
  // Mobile
  { size: "57x57", name: "apple-icon-57x57.png", type: "mobile" },
  { size: "60x60", name: "apple-icon-60x60.png", type: "mobile" },
  { size: "72x72", name: "apple-icon-72x72.png", type: "mobile" },
  { size: "76x76", name: "apple-icon-76x76.png", type: "mobile" },
  { size: "114x114", name: "apple-icon-114x114.png", type: "mobile" },
  { size: "120x120", name: "apple-icon-120x120.png", type: "mobile" },
  { size: "144x144", name: "apple-icon-144x144.png", type: "mobile" },
  { size: "152x152", name: "apple-icon-152x152.png", type: "mobile" },
  { size: "180x180", name: "apple-icon-180x180.png", type: "mobile" },
  { size: "192x192", name: "android-icon-192x192.png", type: "mobile" },
  
  // Desktop
  { size: "512x512", name: "favicon-512x512.png", type: "desktop" },
];

export default function FaviconGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<{ [key: string]: string }>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["web", "mobile"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setGeneratedFavicons({});
        setHtmlCode("");
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (imageDataUrl: string, size: string, filename: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        const [width, height] = size.split("x").map(Number);
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          // Configura qualidade máxima para redimensionamento
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          
          // Para ícones pequenos, usa técnica de redimensionamento em etapas
          if (width <= 32 || height <= 32) {
            // Redimensionamento em múltiplas etapas para melhor qualidade
            const scaleRatio = Math.max(img.width / width, img.height / height);
            
            if (scaleRatio > 2) {
              // Cria canvas temporário para redimensionamento intermediário
              const tempCanvas = document.createElement("canvas");
              const tempCtx = tempCanvas.getContext("2d");
              
              // Primeiro redimensiona para 2x o tamanho final
              const intermediateSize = Math.max(width * 2, height * 2);
              tempCanvas.width = intermediateSize;
              tempCanvas.height = intermediateSize;
              
              if (tempCtx) {
                tempCtx.imageSmoothingEnabled = true;
                tempCtx.imageSmoothingQuality = "high";
                tempCtx.drawImage(img, 0, 0, intermediateSize, intermediateSize);
                
                // Agora redimensiona do tamanho intermediário para o final
                ctx.drawImage(tempCanvas, 0, 0, width, height);
              } else {
                // Fallback para redimensionamento direto
                ctx.drawImage(img, 0, 0, width, height);
              }
            } else {
              // Redimensionamento direto se a diferença não for muito grande
              ctx.drawImage(img, 0, 0, width, height);
            }
          } else {
            // Para tamanhos maiores, redimensionamento direto
            ctx.drawImage(img, 0, 0, width, height);
          }
        }
        
        // Se for .ico, converter para ICO, caso contrário manter PNG
        if (filename.endsWith('.ico')) {
          resolve(convertToIco(canvas, width, height));
        } else {
          resolve(canvas.toDataURL("image/png", 1.0)); // Qualidade máxima
        }
      };
      
      img.src = imageDataUrl;
    });
  };

  // Função para converter canvas para formato ICO real
  const convertToIco = (canvas: HTMLCanvasElement, width: number, height: number): string => {
    // Criamos múltiplas resoluções para um ICO de melhor qualidade
    const sizes = [16, 32, 48]; // Tamanhos comuns em arquivos ICO
    const images: ImageData[] = [];
    
    // Gera as imagens em diferentes tamanhos
    sizes.forEach(size => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = size;
      tempCanvas.height = size;
      
      if (tempCtx) {
        // Usa algoritmo de redimensionamento suave
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = "high";
        tempCtx.drawImage(canvas, 0, 0, size, size);
        images.push(tempCtx.getImageData(0, 0, size, size));
      }
    });
    
    // Converte para formato ICO binário
    const ico = createIcoFile(images, sizes);
    return `data:image/x-icon;base64,${ico}`;
  };

  // Função para criar arquivo ICO binário
  const createIcoFile = (images: ImageData[], sizes: number[]): string => {
    // Cabeçalho ICO (6 bytes)
    const header = new Uint8Array([
      0, 0,           // Reserved
      1, 0,           // Type (1 = ICO)
      images.length, 0 // Number of images
    ]);
    
    // Diretório de entradas (16 bytes por imagem)
    const entries: Uint8Array[] = [];
    let dataOffset = 6 + (images.length * 16); // Offset inicial dos dados
    
    images.forEach((imageData, index) => {
      const size = sizes[index];
      const pngData = imageDataToPng(imageData, size);
      
      const entry = new Uint8Array([
        size === 256 ? 0 : size,  // Width (0 = 256)
        size === 256 ? 0 : size,  // Height (0 = 256)
        0,                        // Color palette (0 = no palette)
        0,                        // Reserved
        1, 0,                     // Color planes
        32, 0,                    // Bits per pixel
        ...numberToBytes(pngData.length, 4), // Size of image data
        ...numberToBytes(dataOffset, 4)      // Offset to image data
      ]);
      
      entries.push(entry);
      dataOffset += pngData.length;
    });
    
    // Dados das imagens (PNG)
    const imageDataArrays = images.map((imageData, index) => 
      imageDataToPng(imageData, sizes[index])
    );
    
    // Combina tudo
    const totalSize = header.length + entries.reduce((sum, entry) => sum + entry.length, 0) + 
                     imageDataArrays.reduce((sum, data) => sum + data.length, 0);
    
    const result = new Uint8Array(totalSize);
    let offset = 0;
    
    // Adiciona cabeçalho
    result.set(header, offset);
    offset += header.length;
    
    // Adiciona entradas
    entries.forEach(entry => {
      result.set(entry, offset);
      offset += entry.length;
    });
    
    // Adiciona dados das imagens
    imageDataArrays.forEach(data => {
      result.set(data, offset);
      offset += data.length;
    });
    
    // Converte para base64
    return btoa(String.fromCharCode(...result));
  };

  // Converte ImageData para PNG
  const imageDataToPng = (imageData: ImageData, size: number): Uint8Array => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(',')[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return bytes;
    }
    
    return new Uint8Array(0);
  };

  // Converte número para array de bytes
  const numberToBytes = (num: number, bytes: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < bytes; i++) {
      result.push(num & 0xFF);
      num >>= 8;
    }
    return result;
  };

  const generateFavicons = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    const filteredSizes = faviconSizes.filter(favicon => selectedTypes.includes(favicon.type));
    const newFavicons: { [key: string]: string } = {};
    
    for (const favicon of filteredSizes) {
      const resizedImage = await resizeImage(uploadedImage, favicon.size, favicon.name);
      newFavicons[favicon.name] = resizedImage;
    }
    
    setGeneratedFavicons(newFavicons);
    generateHtmlCode(filteredSizes);
    setIsGenerating(false);
    trackGeneration("Favicon");
  };

  const generateHtmlCode = (sizes: FaviconSize[]) => {
    const webSizes = sizes.filter(s => s.type === "web");
    const mobileSizes = sizes.filter(s => s.type === "mobile");
    
    let code = `<!-- Favicon -->\n`;
    
    // Favicon ICO (tradicional)
    code += `<link rel="icon" href="/favicon.ico" type="image/x-icon">\n`;
    code += `<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">\n`;
    
    // Web favicons
    if (webSizes.length > 0) {
      code += `\n<!-- PNG Favicons -->\n`;
      code += `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n`;
      code += `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n`;
      code += `<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">\n`;
    }
    
    // Mobile favicons
    if (mobileSizes.length > 0) {
      code += `\n<!-- Apple Touch Icons -->\n`;
      mobileSizes.forEach(size => {
        if (size.name.includes("apple")) {
          const sizeValue = size.size;
          code += `<link rel="apple-touch-icon" sizes="${sizeValue}" href="/${size.name}">\n`;
        }
      });
      
      code += `\n<!-- Android Icons -->\n`;
      code += `<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png">\n`;
      code += `<meta name="msapplication-TileImage" content="/android-icon-144x144.png">\n`;
    }
    
    setHtmlCode(code);
  };

  const downloadFavicon = (filename: string, dataUrl: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    Object.entries(generatedFavicons).forEach(([filename, dataUrl]) => {
      setTimeout(() => downloadFavicon(filename, dataUrl), 100);
    });
  };

  const copyHtmlCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackCopy("Favicon HTML");
    } catch (err) {
      console.error("Failed to copy HTML code:", err);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Favicon Generator
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Generate favicons from images</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload a JPG or PNG image and generate high-quality favicon files (ICO with multiple resolutions and PNG) for web, mobile, and desktop platforms with HTML code included.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {/* Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Upload Image (JPG or PNG)
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="flex flex-col items-center">
                  <img src={uploadedImage} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg mb-4" />
                  <p className="text-green-600 dark:text-green-400 font-medium">Image uploaded successfully!</p>
                  <p className="text-sm text-gray-500 mt-1">Click to upload a different image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload an image</p>
                  <p className="text-sm text-gray-500 mt-1">JPG or PNG files only</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Platform Selection */}
          {uploadedImage && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Select Platforms
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleTypeToggle("web")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTypes.includes("web")
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                  }`}
                >
                  <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="font-medium text-gray-900 dark:text-white">Web</p>
                  <p className="text-sm text-gray-500">ICO + PNG formats</p>
                </button>
                
                <button
                  onClick={() => handleTypeToggle("mobile")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTypes.includes("mobile")
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                  }`}
                >
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <p className="font-medium text-gray-900 dark:text-white">Mobile</p>
                  <p className="text-sm text-gray-500">iOS & Android icons</p>
                </button>
                
                <button
                  onClick={() => handleTypeToggle("desktop")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTypes.includes("desktop")
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-300"
                  }`}
                >
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <p className="font-medium text-gray-900 dark:text-white">Desktop</p>
                  <p className="text-sm text-gray-500">512x512 for PWA</p>
                </button>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {uploadedImage && selectedTypes.length > 0 && (
            <div className="mb-8">
              <button
                onClick={generateFavicons}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    Generate Favicons
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Favicons */}
          {Object.keys(generatedFavicons).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generated Favicons ({Object.keys(generatedFavicons).length})
                </h3>
                <button
                  onClick={downloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(generatedFavicons).map(([filename, dataUrl]) => {
                  const size = faviconSizes.find(s => s.name === filename);
                  return (
                    <div key={filename} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <img src={dataUrl} alt={filename} className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{size?.size}</p>
                      <button
                        onClick={() => downloadFavicon(filename, dataUrl)}
                        className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-2 py-1 rounded transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HTML Code */}
          {htmlCode && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  HTML Code
                </h3>
                <button
                  onClick={copyHtmlCode}
                  className={`font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                    copied
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  <code>{htmlCode}</code>
                </pre>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Add this code to the &lt;head&gt; section of your HTML document and upload the generated favicon files to your website's root directory.
              </p>
            </div>
          )}
        </div>

        {/* Back to Tools */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Tools
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
