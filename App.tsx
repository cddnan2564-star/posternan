import React, { useState, useCallback } from 'react';
import { generatePoster } from './services/geminiService';
import type { ImageFile } from './types';
import { UploadIcon, WandIcon, LoadingSpinner, DownloadIcon } from './components/icons';

const posterStyles = [
  { name: 'Minimalist', description: 'สะอาดตา ทันสมัย เน้นตัวสินค้า' },
  { name: 'Vibrant', description: 'สีสันสดใส โดดเด่น ดึงดูดสายตา' },
  { name: 'Retro', description: 'สไตล์ย้อนยุค มีเสน่ห์แบบคลาสสิก' },
  { name: 'Elegant', description: 'หรูหรา พรีเมียม ยกระดับสินค้า' },
  { name: 'Futuristic', description: 'ล้ำสมัย ไฮเทค เหมาะกับแกดเจ็ต' }
];

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [slogan, setSlogan] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(posterStyles[0].name);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setProductImage({
          base64: base64String,
          mimeType: file.type,
        });
        setPreviewUrl(URL.createObjectURL(file));
      };
      reader.onerror = () => {
        setError("เกิดข้อผิดพลาดในการอ่านไฟล์");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePoster = useCallback(async () => {
    if (!productImage || !productName || !slogan || !selectedStyle) {
      setError('กรุณากรอกข้อมูลและเลือกสไตล์ให้ครบ');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedPoster(null);
    try {
      const poster = await generatePoster(productImage, productName, slogan, selectedStyle);
      setGeneratedPoster(poster);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [productImage, productName, slogan, selectedStyle]);

  const handleDownload = () => {
    if (!generatedPoster) return;
    const link = document.createElement('a');
    link.href = generatedPoster;
    const fileName = `${productName.replace(/\s+/g, '_') || 'ai-poster'}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <header className="py-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Product Poster Generator
          </h1>
          <p className="text-center text-gray-400 mt-1">
            เปลี่ยนภาพสินค้าธรรมดาให้เป็นโปสเตอร์โฆษณาสุดปัง!
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2 text-purple-300">
                1. อัปโหลดรูปภาพสินค้า
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadIcon />
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-2 py-1"
                    >
                      <span>เลือกไฟล์</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    <p className="pl-1">หรือลากและวาง</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                </div>
              </div>
            </div>

            {previewUrl && (
                <div className="text-center">
                    <img src={previewUrl} alt="Product Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
                </div>
            )}

            <div>
              <label htmlFor="product-name" className="block text-lg font-semibold mb-2 text-purple-300">
                2. ใส่ชื่อสินค้า
              </label>
              <input
                type="text"
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="เช่น 'หูฟังไร้สายรุ่นใหม่'"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="slogan" className="block text-lg font-semibold mb-2 text-purple-300">
                3. ใส่สโลแกน
              </label>
              <input
                type="text"
                id="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="เช่น 'เสียงคมชัดทุกมิติ'"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-lg font-semibold mb-2 text-purple-300">4. เลือกสไตล์</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {posterStyles.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setSelectedStyle(style.name)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                      selectedStyle === style.name
                        ? 'bg-purple-600 border-purple-400 ring-2 ring-purple-400'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-purple-500'
                    }`}
                  >
                    <p className="font-bold">{style.name}</p>
                    <p className="text-xs text-gray-300">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGeneratePoster}
                disabled={!productImage || !productName || !slogan || isLoading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    กำลังสร้างสรรค์...
                  </>
                ) : (
                  <>
                    <WandIcon />
                    สร้างโปสเตอร์เลย!
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Result Section */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center min-h-[400px] lg:min-h-full">
            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {!generatedPoster && !isLoading && !error && (
              <div className="text-center text-gray-500">
                <WandIcon className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">โปสเตอร์ของคุณจะปรากฏที่นี่</h2>
                <p>กรอกข้อมูลและเลือกสไตล์เพื่อเริ่มต้น</p>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-2 text-lg">AI กำลังทำงาน... อาจใช้เวลาสักครู่</p>
                <p className="text-sm text-gray-400">กำลังสร้างโปสเตอร์สไตล์ {selectedStyle} สำหรับคุณ</p>
              </div>
            )}
            
            {generatedPoster && !isLoading && (
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">ผลลัพธ์!</h2>
                <img src={generatedPoster} alt="Generated Poster" className="w-full h-auto object-contain rounded-lg shadow-2xl" />
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <DownloadIcon />
                  ดาวน์โหลดรูปภาพ
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;