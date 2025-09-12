import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Scan, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ 
  isOpen, 
  onClose, 
  onScan, 
  title 
}) => {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      cleanupTimers();
    };
  }, [isOpen]);

  // Cleanup function for all timers and animation frames
  const cleanupTimers = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      // Start scanning process
      startScanning();
    } catch (err) {
      console.error('Camera access error:', err);
      setError(language === 'sw' 
        ? 'Imeshindwa kupata ufikiaji wa kamera. Tafadhali ruhusu kamera.' 
        : 'Failed to access camera. Please allow camera access.'
      );
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    cleanupTimers();
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scanFrame = () => {
      // Clear any existing animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (!isScanning || !video.videoWidth || !video.videoHeight) {
        if (isScanning) {
          animationFrameRef.current = requestAnimationFrame(scanFrame);
        }
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simulate QR code detection (in real implementation, use a QR library)
        simulateQRDetection();
      }

      if (isScanning && !isProcessing) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection with random success
    if (Math.random() > 0.98 && !isProcessing) { // 2% chance per frame
      const mockQRData = generateMockQRData();
      handleQRDetected(mockQRData);
    }
  };

  const generateMockQRData = () => {
    const users = [
      { id: 'user_001', name: 'Amina Wanjiku', role: 'community' },
      { id: 'user_002', name: 'John Mwangi', role: 'rider' },
      { id: 'user_003', name: 'Sarah Akinyi', role: 'chv' },
      { id: 'user_004', name: 'Dr. Mary Njeri', role: 'health_worker' },
      { id: 'user_005', name: 'Admin Peter', role: 'admin' }
    ];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return JSON.stringify({
      type: 'paraboda_login',
      userId: randomUser.id,
      name: randomUser.name,
      role: randomUser.role,
      timestamp: Date.now(),
      location: 'Kiambu County'
    });
  };

  const handleQRDetected = async (qrData: string) => {
    // Stop scanning immediately to prevent multiple detections
    setIsScanning(false);
    setIsProcessing(true);
    setScanResult(qrData);
    cleanupTimers();
    
    // Add a small delay for better UX
    timeoutRef.current = window.setTimeout(() => {
      onScan(qrData);
      setIsProcessing(false);
      // Clear the timeout reference after execution
      timeoutRef.current = null;
    }, 1500);
  };

  const handleManualInput = () => {
    // For demo purposes, generate a mock QR code
    const mockData = generateMockQRData();
    handleQRDetected(mockData);
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
          className="fixed inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />
        
        {/* Scanner Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Scan className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {title || (language === 'sw' ? 'Skani QR Code' : 'Scan QR Code')}
                  </h2>
                  <p className="text-sm opacity-90">
                    {language === 'sw' 
                      ? 'Elekeza kamera kwenye QR code yako ya kuingia'
                      : 'Point camera at your login QR code'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scanner Content */}
          <div className="flex-1 relative overflow-hidden">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'sw' ? 'Hitilafu ya Kamera' : 'Camera Error'}
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {language === 'sw' ? 'Jaribu Tena' : 'Try Again'}
                </button>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Video Stream */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-64 h-64 sm:w-80 sm:h-80 border-4 border-white rounded-3xl relative overflow-hidden">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400"></div>
                      
                      {/* Scanning line animation */}
                      {isScanning && !isProcessing && (
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                          animate={{ y: [0, 256, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      
                      {/* Processing indicator */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-white rounded-2xl p-4 flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <span className="text-green-800 font-bold">
                              {language === 'sw' ? 'QR Imepatikana!' : 'QR Detected!'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                      <p className="text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-xl">
                        {language === 'sw' 
                          ? 'Weka QR code ndani ya mstari'
                          : 'Place QR code inside the frame'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isScanning ? (
                          <>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-bold">
                              {language === 'sw' ? 'Inaskani...' : 'Scanning...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span className="font-bold">
                              {language === 'sw' ? 'Kamera Imesimama' : 'Camera Stopped'}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {isProcessing && (
                        <Loader className="w-5 h-5 animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  {language === 'sw' 
                    ? 'Hakuna QR code? Tumia njia nyingine za kuingia'
                    : "Don't have a QR code? Use other login methods"
                  }
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleManualInput}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  {language === 'sw' ? 'Onyesho' : 'Demo'}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {language === 'sw' ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};