import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string, file: File) => void;
  title?: string;
  context?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  context
}) => {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(
        language === 'sw'
          ? 'Imeshindwa kupata ufikiaji wa kamera. Tafadhali ruhusu kamera.'
          : 'Failed to access camera. Please allow camera access.'
      );
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    // Convert to file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        if (onCapture) {
          onCapture(imageData, file);
        }
      }
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedImage('');
    startCamera();
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90"
          onClick={onClose}
        />

        {/* Camera Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">
                  {title || (language === 'sw' ? 'Piga Picha' : 'Take Photo')}
                </h2>
                {context && (
                  <p className="text-sm opacity-90">
                    {context}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Camera Content */}
          <div className="flex-1 relative overflow-hidden">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === 'sw' ? 'Hitilafu ya Kamera' : 'Camera Error'}
                </h3>
                <p className="text-gray-300 mb-6">{error}</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {language === 'sw' ? 'Jaribu Tena' : 'Try Again'}
                </button>
              </div>
            ) : capturedImage ? (
              <div className="relative h-full">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={retakePhoto}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Piga Tena' : 'Retake'}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    <span>{language === 'sw' ? 'Tumia Picha' : 'Use Photo'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-lg">
                        {language === 'sw' ? 'Inafungua kamera...' : 'Opening camera...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    
                    {/* Camera Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                      {/* Switch Camera */}
                      <button
                        onClick={switchCamera}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </button>

                      {/* Capture Button */}
                      <button
                        onClick={capturePhoto}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full"></div>
                      </button>

                      {/* Placeholder for symmetry */}
                      <div className="w-12 h-12"></div>
                    </div>

                    {/* Camera Frame Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-full border-4 border-white/30 rounded-3xl m-4"></div>
                      {/* Corner indicators */}
                      <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-yellow-400"></div>
                      <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-yellow-400"></div>
                      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-yellow-400"></div>
                      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-yellow-400"></div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};