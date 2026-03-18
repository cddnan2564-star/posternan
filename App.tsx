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
    <div className="min-h-screen gradient-bg text-slate-800 font-sans flex flex-col">
      <header className="py-6 bg-white/60 backdrop-blur-md sticky top-0 z-10 border-b border-pink-100">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500 tracking-tight">
            AI Poster Magic ✨
          </h1>
          <p className="text-center text-slate-500 mt-2 font-medium">
            เปลี่ยนภาพสินค้าธรรมดาให้เป็นโปสเตอร์โฆษณาสุดปัง!
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Controls Section */}
          <div className="glass-card p-8 rounded-3xl flex flex-col space-y-8">
            <section>
              <label className="flex items-center text-lg font-bold mb-3 text-pink-600">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                อัปโหลดรูปภาพสินค้า
              </label>
              <div className="mt-1 flex justify-center px-6 pt-8 pb-10 border-2 border-sky-200 border-dashed rounded-2xl bg-sky-50/30 hover:bg-sky-50/50 transition-colors cursor-pointer group">
                <div className="space-y-2 text-center">
                  <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-2 group-hover:scale-110 transition-transform">
                    <UploadIcon className="text-sky-500" />
                  </div>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-xl font-bold text-sky-600 hover:text-sky-700 focus-within:outline-none px-4 py-2 shadow-sm border border-sky-100"
                    >
                      <span>เลือกไฟล์ภาพ</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">PNG, JPG ขนาดไม่เกิน 10MB</p>
                </div>
              </div>
            </section>

            {previewUrl && (
                <div className="text-center animate-in fade-in zoom-in duration-300">
                    <div className="relative inline-block">
                      <img src={previewUrl} alt="Product Preview" className="max-h-48 mx-auto rounded-2xl shadow-lg border-4 border-white" />
                      <button 
                        onClick={() => {setPreviewUrl(null); setProductImage(null);}}
                        className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-md hover:bg-pink-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                </div>
            )}

            <section className="space-y-5">
              <div>
                <label htmlFor="product-name" className="flex items-center text-lg font-bold mb-3 text-sky-600">
                  <span className="bg-sky-100 text-sky-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  ชื่อสินค้า
                </label>
                <input
                  type="text"
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="เช่น 'หูฟังไร้สายรุ่นใหม่'"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all placeholder-slate-300 shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="slogan" className="flex items-center text-lg font-bold mb-3 text-sky-600">
                  <span className="bg-sky-100 text-sky-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  สโลแกน
                </label>
                <input
                  type="text"
                  id="slogan"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="เช่น 'เสียงคมชัดทุกมิติ'"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-sky-100 focus:border-sky-400 outline-none transition-all placeholder-slate-300 shadow-sm"
                />
              </div>
            </section>
            
            <section>
              <label className="flex items-center text-lg font-bold mb-4 text-pink-600">
                <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                เลือกสไตล์โปสเตอร์
              </label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {posterStyles.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setSelectedStyle(style.name)}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 border-2 relative overflow-hidden group ${
                      selectedStyle === style.name
                        ? 'bg-white border-pink-400 shadow-md scale-[1.02]'
                        : 'bg-white border-slate-100 hover:border-pink-200 hover:shadow-sm'
                    }`}
                  >
                    {selectedStyle === style.name && (
                      <div className="absolute top-0 right-0 bg-pink-400 text-white px-2 py-1 rounded-bl-xl text-[10px] font-bold">SELECTED</div>
                    )}
                    <p className={`font-bold ${selectedStyle === style.name ? 'text-pink-600' : 'text-slate-700'}`}>{style.name}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{style.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <div className="pt-6">
              <button
                onClick={handleGeneratePoster}
                disabled={!productImage || !productName || !slogan || isLoading}
                className="w-full flex items-center justify-center soft-gradient hover:opacity-90 text-white font-black text-xl py-5 px-6 rounded-2xl shadow-xl shadow-pink-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-3" />
                    กำลังร่ายมนตร์...
                  </>
                ) : (
                  <>
                    <WandIcon className="mr-3" />
                    สร้างโปสเตอร์เลย!
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center min-h-[500px] lg:min-h-full relative">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 text-center max-w-md animate-bounce">
                <p className="font-bold mb-1">โอ๊ะโอ! เกิดข้อผิดพลาด</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            )}
            
            {!generatedPoster && !isLoading && !error && (
              <div className="text-center space-y-4">
                <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <WandIcon className="w-12 h-12 text-pink-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">รอชมผลงานสุดเจ๋ง!</h2>
                <p className="text-slate-400 max-w-xs mx-auto">กรอกข้อมูลด้านซ้ายให้ครบ แล้วกดปุ่มเพื่อเริ่มสร้างโปสเตอร์ด้วย AI</p>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center space-y-6">
                <div className="relative">
                  <LoadingSpinner className="w-16 h-16 text-sky-500 mx-auto" />
                  <div className="absolute inset-0 animate-ping bg-sky-200 rounded-full opacity-20"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-slate-800">AI กำลังทำงาน...</p>
                  <p className="text-slate-500">กำลังเนรมิตโปสเตอร์สไตล์ <span className="text-pink-500 font-bold">{selectedStyle}</span> ให้คุณ</p>
                </div>
              </div>
            )}
            
            {generatedPoster && !isLoading && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-500">
                    ว้าว! สวยมากเลย
                  </h2>
                  <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedStyle}
                  </span>
                </div>
                
                <div className="relative group">
                  <img 
                    src={generatedPoster} 
                    alt="Generated Poster" 
                    className="w-full h-auto object-contain rounded-2xl shadow-2xl border-8 border-white" 
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none"></div>
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-8 w-full flex items-center justify-center bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                >
                  <DownloadIcon className="mr-3" />
                  ดาวน์โหลดรูปภาพ (PNG)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm mt-10 border-t border-slate-100">
        <p className="font-medium">✨ สร้างสรรค์ด้วยความรักและ AI (Google Gemini) ✨</p>
      </footer>
    </div>
  );
};

export default App;