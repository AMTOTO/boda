import React, { useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, Share2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  title?: string;
  description?: string;
  showDownload?: boolean;
  showShare?: boolean;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  title,
  description,
  showDownload = true,
  showShare = true,
  className = ''
}) => {
  const { language } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      
      // Download as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `paraboda-qr-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      });
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'ParaBoda QR Code',
          text: description || 'My ParaBoda QR Code for quick access',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(value);
        alert(language === 'sw' ? 'QR code data imekopiwa' : 'QR code data copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg text-center ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      <div ref={qrRef} className="inline-block p-4 bg-white rounded-xl border-2 border-gray-200 mb-4">
        <QRCode
          value={value}
          size={size}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox={`0 0 256 256`}
        />
      </div>

      {(showDownload || showShare) && (
        <div className="flex justify-center space-x-3">
          {showDownload && (
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'sw' ? 'Pakua' : 'Download'}</span>
            </button>
          )}
          
          {showShare && (
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'sw' ? 'Shiriki' : 'Share'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};