import React from 'react';
import { Download, X } from 'lucide-react';

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  title?: string;
  description?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  isOpen,
  onClose,
  qrCodeUrl,
  title = "QR Code",
  description = "Scan this QR code with your mobile device"
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};