import { useState } from 'react';
import { saveCanvasAsPNG } from '../utils/utils';

export const Footer = ( {hand, setHand, camera, setCamera, canvasPaintRef, computationTime} ) => {

  const toggleHand = () => {
    setHand((prev) => (prev === 'Hand R' ? 'Hand L' : 'Hand R'));
  };

  const toggleCamera = () => {
    setCamera((prev) => (prev === 'Camera Off' ? 'Camera On' : 'Camera Off'));
  };

  return (
    <div className='fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center'>
      <div className='flex justify-center space-x-2'>
        <button
          onClick={toggleHand}
          className='bg-blue-500 px-4 py-2 rounded transition-transform transform hover:scale-105 hover:cursor-pointer active:brightness-125'>
          {hand}
        </button>
        <button
          onClick={toggleCamera}
          className='bg-green-500 px-4 py-2 rounded transition-transform transform hover:scale-105 hover:cursor-pointer active:brightness-125'>
          {camera}
        </button>
        <button onClick={
          () => {saveCanvasAsPNG(canvasPaintRef.current);}
        } className='bg-yellow-500 px-4 py-2 rounded transition-transform transform hover:scale-105 hover:cursor-pointer active:brightness-125'>
          Export
        </button>
      </div>
      <div className='mt-3'>
        <p>Moondream2 computation time: {computationTime || "0.000"} ms</p>
      </div>
    </div>
  );
};
