import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Download, Share2 } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  title: string;
  description?: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  title,
  description,
  size = 200
}) => {
  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `paraboda-login-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  // Listen for custom download events
  useEffect(() => {
    const handleDownloadEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { qrData, filename } = customEvent.detail;
        if (qrData === value) {
          downloadQR();
        }
      }
    };

    window.addEventListener('downloadQR', handleDownloadEvent);
    return () => {
      window.removeEventListener('downloadQR', handleDownloadEvent);
    };
  }, [value]);

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || 'ParaBoda QR Code',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 inline-block mb-4">
          <QRCode
            id="qr-code"
            value={value}
            size={Math.min(size, window.innerWidth - 120)}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          {navigator.share && (
            <button
              onClick={shareQR}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};