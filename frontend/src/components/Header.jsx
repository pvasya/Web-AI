import { useState, useEffect } from 'react';

export const Header = ({ worker, selectedMode, setSelectedMode, isModelDownloaded, setisModelDownloaded }) => {
  const [loading, setLoading] = useState(false);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    console.log(`Selected mode: ${mode}`);
  };

  useEffect(() => {
    if (!worker) {
      return;
    }

    const handleWorkerMessage = (e) => {
      const { type } = e.data;
      
      if (type === 'delete_success') {
        setisModelDownloaded(false);
        setLoading(false);
        console.log('Model deleted successfully');
        window.location.reload();
      } else if (type === 'ready') {
        setisModelDownloaded(true);
        setLoading(false);
        console.log('Model downloaded successfully');
      }
    };

    worker.addEventListener('message', handleWorkerMessage);

    return () => {
      worker.removeEventListener('message', handleWorkerMessage);
    };
  }, [worker, setisModelDownloaded]);

  const toggleButton = () => {
    if (selectedMode === 'Hybrid') {
      alert('Select Client mode first');
      return;
    }
    if (!worker) {
      console.error('Worker not initialized');
      return;
    }
    
    setLoading(true);
    
    if (!isModelDownloaded) {
      console.log('Downloading model...');
      worker.postMessage({ type: 'init' });
    } else {
      console.log('Deleting model...');
      worker.postMessage({ type: 'delete' });
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full bg-gray-900 text-white p-4 text-center'>
      <div className='flex justify-between items-center'>
        <div className='flex space-x-1'>
          {['Client', 'Hybrid'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-2 py-2 rounded transition duration-300 ease-in-out transform ${
                selectedMode === mode
                  ? 'bg-blue-500 hover:scale-105'
                  : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
              } cursor-pointer`}>
              {mode}
            </button>
          ))}
        </div>
        <button
          onClick={toggleButton}
          className={`px-2 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer w-35 ${
            isModelDownloaded
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          } flex items-center justify-center`}
          disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Loading...
            </>
          ) : (
            isModelDownloaded ? 'Delete model' : 'Download model'
          )}
        </button>
      </div>
    </div>
  );
};
