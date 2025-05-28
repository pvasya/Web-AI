import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Header } from './components/Header.jsx'
import { Main } from './components/Main.jsx'
import { Footer } from './components/Footer.jsx'


export function App() {
  const workerRef = useRef(null);

  const [selectedMode, setSelectedMode] = useState('Hybrid');
  const [isModelDownloaded, setisModelDownloaded] = useState(false);
  const [computationTime, setComputationTime] = useState(0);

  const [hand, setHand] = useState('Hand R');
  const [camera, setCamera] = useState('Camera On');
  const canvasPaintRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./utils/moondream2.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, answer: res } = e.data;
      if (type === 'ready') {
        setisModelDownloaded(true);
      }
      if (type === 'result') {
        console.log('Got result from worker:', res);
      }
    };
    
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header worker={workerRef.current} selectedMode={selectedMode} setSelectedMode={setSelectedMode} isModelDownloaded={isModelDownloaded} setisModelDownloaded={setisModelDownloaded} />
      <Main worker={workerRef.current} isModelDownloaded={isModelDownloaded} selectedMode={selectedMode} hand={hand} setHand={setHand} camera={camera} setCamera={setCamera} canvasPaintRef={canvasPaintRef} computationTime={computationTime} setComputationTime={setComputationTime} />
      <Footer hand={hand} setHand={setHand} camera={camera} setCamera={setCamera} canvasPaintRef={canvasPaintRef} computationTime={computationTime} />
    </div>
  )
}