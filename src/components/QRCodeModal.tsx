import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface Props {
  token: string;
  onClose: () => void;
}

export function QRCodeModal({ token, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const url = `${window.location.origin}/b/${token}`;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [url]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Customer QR Code</h3>
          
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48 mx-auto mb-4 border rounded-lg"
            />
          ) : (
            <div className="bg-gray-100 w-48 h-48 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">Generating QR Code...</div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Show this QR code to your customer to scan
          </p>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Or share this link:</p>
            <div className="bg-gray-50 p-2 rounded text-xs break-all">
              {url}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(url);
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              Copy Link
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
