import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF Compressor</h1>
        <p className="text-gray-600">Reduce your PDF file size instantly without losing quality.</p>
      </header>
      
      <main className="w-full">
        <FileUploader />
      </main>
    </div>
  );
}

export default App;