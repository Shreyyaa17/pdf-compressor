// import React, { useState, useRef } from 'react';

// const MAX_FILE_SIZE_MB = 50;
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// export default function FileUploader() {
//   const [isUploading, setIsUploading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [compressionLevel, setCompressionLevel] = useState('recommended');
//   const [result, setResult] = useState<any>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const validateAndSetFile = (selectedFile: File) => {
//     setError(null);
//     setResult(null);

//     if (selectedFile.type !== 'application/pdf') {
//       setError('Please upload a valid PDF file.');
//       return;
//     }

//     if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
//       setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
//       return;
//     }

//     setFile(selectedFile);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) validateAndSetFile(e.target.files[0]);
//   };
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
//   };
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };
//   const handleDragLeave = () => setIsDragging(false);

//   const handleCompress = async () => {
//     if (!file) return;

//     setIsUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('pdf', file);
//     formData.append('level', compressionLevel);

//     try {
//       const response = await fetch('http://localhost:5000/api/compress', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error || 'Upload failed');

//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || 'An unexpected error occurred during compression.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (result && result.fileId) {
//       window.location.href = `http://localhost:5000/api/download/${result.fileId}`;
//     }
//   };

//   if (result) {
//     return (
//       <div className="w-full max-w-xl mx-auto mt-6 p-6 sm:p-8 bg-white border rounded-2xl shadow-sm text-center">
//         <div className="text-5xl mb-3">🎉</div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF Compressed!</h2>
        
//         <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-gray-50 p-4 sm:p-6 rounded-xl border">
//           <div>
//             <p className="text-xs sm:text-sm text-gray-500 font-medium">Original Size</p>
//             <p className="text-base sm:text-lg font-semibold text-gray-700">{formatBytes(result.originalSize)}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-500 font-medium">Compressed Size</p>
//             <p className="text-base sm:text-lg font-semibold text-green-600">{formatBytes(result.compressedSize)}</p>
//           </div>
//           <div className="col-span-2 border-t pt-4 mt-1">
//             <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Space Saved</p>
//             <p className="text-xl sm:text-2xl font-bold text-blue-600">
//               {result.reductionPercentage}% ({formatBytes(result.savedBytes)})
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleDownload}
//           className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
//         >
//           <span>Download Compressed PDF</span>
//         </button>

//         <button 
//           onClick={() => { setFile(null); setResult(null); }}
//           className="mt-5 text-sm text-gray-500 hover:text-gray-800 font-medium underline"
//         >
//           Compress another PDF
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-xl mx-auto mt-6">
//       <div
//         className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer mb-6 shadow-sm
//           ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-300 bg-white hover:border-gray-400'}
//         `}
//         onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
//         {file ? (
//           <div className="space-y-2">
//             <div className="text-blue-600 font-semibold text-base sm:text-lg truncate max-w-md mx-auto">
//               📄 {file.name}
//             </div>
//             <div className="text-gray-500 text-sm">
//               Size: {formatBytes(file.size)}
//             </div>
//             <p className="text-xs text-blue-500 font-medium pt-2">Click or drop to replace file</p>
//           </div>
//         ) : (
//           <div className="space-y-2 text-gray-600">
//             <div className="text-4xl mb-2">📥</div>
//             <p className="text-lg font-semibold text-gray-800">Choose a PDF file or drag it here</p>
//             <p className="text-xs sm:text-sm text-gray-400">Supports documents up to {MAX_FILE_SIZE_MB}MB</p>
//           </div>
//         )}
//       </div>

//       {file && !isUploading && (
//         <div className="mb-6 p-4 sm:p-5 bg-white border rounded-2xl shadow-sm space-y-3">
//           <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Compression Setting</h3>
//           <div className="space-y-2.5">
//             {[
//               { id: 'extreme', label: 'Extreme Compression', desc: 'Maximum reduction, lower visual quality' },
//               { id: 'recommended', label: 'Recommended', desc: 'Balanced compression and clear readability' },
//               { id: 'low', label: 'Low Compression', desc: 'High fidelity retention, minimal reduction' }
//             ].map(lvl => (
//               <label 
//                 key={lvl.id} 
//                 className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all
//                   ${compressionLevel === lvl.id ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}
//                 `}
//               >
//                 <input 
//                   type="radio" 
//                   name="level" 
//                   value={lvl.id}
//                   checked={compressionLevel === lvl.id}
//                   onChange={(e) => setCompressionLevel(e.target.value)}
//                   className="mt-1 mr-3 accent-blue-600"
//                 />
//                 <div>
//                   <p className="font-medium text-gray-900 text-sm">{lvl.label}</p>
//                   <p className="text-xs text-gray-500">{lvl.desc}</p>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm font-medium">
//           ⚠️ {error}
//         </div>
//       )}

//       {file && (
//         <button 
//           onClick={handleCompress}
//           disabled={isUploading}
//           className={`w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md flex items-center justify-center gap-3
//             ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'}`}
//         >
//           {isUploading ? (
//             <>
//               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-25" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0012 20c4.411 0 8-3.589 8-8h-4c0 2.206-1.794 4-4 4v3.291z"></path>
//               </svg>
//               <span>Compressing PDF...</span>
//             </>
//           ) : (
//             <span>Compress PDF</span>
//           )}
//         </button>
//       )}
//     </div>
//   );
// }



import React, { useState, useRef } from 'react';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Use environment variable if available, otherwise fall back to your live Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pdf-compressor-backend-o58j.onrender.com';

export default function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [result, setResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setResult(null);

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) validateAndSetFile(e.target.files[0]);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleCompress = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('level', compressionLevel);

    try {
      const response = await fetch(`${API_BASE_URL}/api/compress`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during compression.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.fileId) {
      window.location.href = `${API_BASE_URL}/api/download/${result.fileId}`;
    }
  };

  if (result) {
    return (
      <div className="w-full max-w-xl mx-auto mt-6 p-6 sm:p-8 bg-white border rounded-2xl shadow-sm text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF Compressed!</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-gray-50 p-4 sm:p-6 rounded-xl border">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Original Size</p>
            <p className="text-base sm:text-lg font-semibold text-gray-700">{formatBytes(result.originalSize)}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Compressed Size</p>
            <p className="text-base sm:text-lg font-semibold text-green-600">{formatBytes(result.compressedSize)}</p>
          </div>
          <div className="col-span-2 border-t pt-4 mt-1">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Space Saved</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {result.reductionPercentage}% ({formatBytes(result.savedBytes)})
            </p>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>Download Compressed PDF</span>
        </button>

        <button 
          onClick={() => { setFile(null); setResult(null); }}
          className="mt-5 text-sm text-gray-500 hover:text-gray-800 font-medium underline"
        >
          Compress another PDF
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer mb-6 shadow-sm
          ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-300 bg-white hover:border-gray-400'}
        `}
        onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        {file ? (
          <div className="space-y-2">
            <div className="text-blue-600 font-semibold text-base sm:text-lg truncate max-w-md mx-auto">
              📄 {file.name}
            </div>
            <div className="text-gray-500 text-sm">
              Size: {formatBytes(file.size)}
            </div>
            <p className="text-xs text-blue-500 font-medium pt-2">Click or drop to replace file</p>
          </div>
        ) : (
          <div className="space-y-2 text-gray-600">
            <div className="text-4xl mb-2">📥</div>
            <p className="text-lg font-semibold text-gray-800">Choose a PDF file or drag it here</p>
            <p className="text-xs sm:text-sm text-gray-400">Supports documents up to {MAX_FILE_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      {file && !isUploading && (
        <div className="mb-6 p-4 sm:p-5 bg-white border rounded-2xl shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Compression Setting</h3>
          <div className="space-y-2.5">
            {[
              { id: 'extreme', label: 'Extreme Compression', desc: 'Maximum reduction, lower visual quality' },
              { id: 'recommended', label: 'Recommended', desc: 'Balanced compression and clear readability' },
              { id: 'low', label: 'Low Compression', desc: 'High fidelity retention, minimal reduction' }
            ].map(lvl => (
              <label 
                key={lvl.id} 
                className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all
                  ${compressionLevel === lvl.id ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  name="level" 
                  value={lvl.id}
                  checked={compressionLevel === lvl.id}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                  className="mt-1 mr-3 accent-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{lvl.label}</p>
                  <p className="text-xs text-gray-500">{lvl.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {file && (
        <button 
          onClick={handleCompress}
          disabled={isUploading}
          className={`w-full text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md flex items-center justify-center gap-3
            ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'}`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-25" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0112 20c4.411 0 8-3.589 8-8h-4c0 2.206-1.794 4-4 4v3.291z"></path>
              </svg>
              <span>Compressing PDF...</span>
            </>
          ) : (
            <span>Compress PDF</span>
          )}
        </button>
      )}
    </div>
  );
}