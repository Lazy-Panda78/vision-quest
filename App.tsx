
import React, { useState, useEffect } from 'react';
import { predictImage } from './services/predictionService';

const App: React.FC = () => {
  // App State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State (Persistent via LocalStorage)
  const [localHistory, setLocalHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('vq_local_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Save Local History whenever it updates
  useEffect(() => {
    localStorage.setItem('vq_local_history', JSON.stringify(localHistory));
  }, [localHistory]);

  // Scroll Reveal Observer for aesthetic entrance animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, [localHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError("Please use a valid JPG or PNG image.");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setResultImageUrl(null);
      setPreviewUrl(URL.createObjectURL(file));
      document.getElementById('analysis-tool')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fileToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsPredicting(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const timestamp = Date.now();
      const resultBlob = await predictImage(selectedFile);
      const annotatedUrl = URL.createObjectURL(resultBlob);
      setResultImageUrl(annotatedUrl);

      // Save to local persistence
      const base64 = await fileToBase64(resultBlob);
      const newRecord = {
        id: timestamp,
        result_url: base64,
        created_at: new Date().toISOString()
      };
      setLocalHistory(prev => [newRecord, ...prev].slice(0, 15)); // Keep last 15 scans
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#020617]">
      <div className="glow-orb top-[-10%] left-[-10%]"></div>
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md border-b border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <i className="fas fa-eye text-xl text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">VISIONQUEST</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            <i className="fas fa-bolt text-[8px]"></i> YOLO V11 Engine
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6 relative">
        <div className="reveal active">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-indigo-500/20">
            Professional Grade Detection
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
            INSTANT OBJECT <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10 leading-relaxed font-medium">
            Classify and localize objects in real-time. No account required. All data remains in your browser for complete privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="#analysis-tool" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105">
              Launch Lab
            </a>
            <a href="#history" className="px-10 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold text-lg transition-all border border-white/5">
              History
            </a>
          </div>
        </div>
      </section>

      {/* Classifier Tool */}
      <section id="analysis-tool" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="reveal">
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
              
              <h2 className="text-3xl font-bold mb-10 text-white flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-sm shadow-lg shadow-indigo-600/30">
                  <i className="fas fa-microscope"></i>
                </span>
                Vision Lab
              </h2>

              <div className="relative group mb-10">
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className={`border-2 border-dashed ${selectedFile ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/20'} rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all group-hover:border-indigo-400/50`}>
                  <i className={`fas ${selectedFile ? 'fa-check-circle text-emerald-400' : 'fa-cloud-upload-alt text-slate-600'} text-5xl mb-6 transition-all`}></i>
                  <p className="text-xl font-bold text-slate-200 text-center">
                    {selectedFile ? selectedFile.name : 'Select JPG or PNG to Analyze'}
                  </p>
                </div>
              </div>

              {resultImageUrl ? (
                <div className="rounded-[2.5rem] overflow-hidden border border-indigo-500/50 bg-black aspect-video flex items-center justify-center shadow-2xl group relative">
                  <img src={resultImageUrl} className="max-h-full object-contain" alt="Classification output" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">
                    Analysis Complete
                  </div>
                </div>
              ) : previewUrl && (
                <div className="rounded-[2.5rem] overflow-hidden border border-slate-800 bg-black/40 aspect-video flex items-center justify-center relative">
                  <img src={previewUrl} className="max-h-full object-contain opacity-50 blur-sm" alt="Preview" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">Ready for Inference</span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={!selectedFile || isPredicting}
                className={`w-full mt-10 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-lg transition-all transform active:scale-[0.98] ${
                  !selectedFile || isPredicting ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40'
                }`}
              >
                {isPredicting ? (
                  <span className="flex items-center justify-center gap-3">
                    <i className="fas fa-circle-notch fa-spin"></i> Processing...
                  </span>
                ) : (
                  'Start Detection'
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* History Archive */}
      <section id="history" className="py-32 bg-slate-950 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 reveal">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Recent Archive</h2>
            <p className="text-slate-500 mt-3 text-lg font-medium">
              Locally stored classification history
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {localHistory.length > 0 ? localHistory.map((item) => (
              <div key={item.id} className="reveal bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-indigo-500/40 transition-all hover:translate-y-[-8px] shadow-xl">
                <div className="aspect-video bg-black relative">
                  <img src={item.result_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" alt="Result" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                      <i className="far fa-calendar text-[10px] text-indigo-400"></i>
                      <span className="text-[10px] font-bold text-white">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center reveal">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 text-slate-700 shadow-inner">
                  <i className="fas fa-folder-open text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Archive is empty</h3>
                <p className="text-slate-600 mt-3 font-medium">Your detections will be automatically saved here.</p>
              </div>
            )}
          </div>
          
          {localHistory.length > 0 && (
            <div className="mt-16 text-center reveal">
              <button 
                onClick={() => { if(window.confirm('Clear all local history?')) setLocalHistory([]); }}
                className="text-slate-600 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Clear Archive
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 bg-slate-950 text-center">
        <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">VisionQuest intelligence Lab &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
