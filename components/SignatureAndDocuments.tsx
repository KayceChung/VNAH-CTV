import React, { useRef, useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface SignatureAndDocumentsProps {
  onSignatureCaptured: (base64Data: string) => void;
  onCCCDImageCaptured: (base64Data: string) => void;
  errors?: {
    signature?: string;
    cccd_image?: string;
  };
}

/**
 * SignatureAndDocuments Component
 * 
 * Handles two file captures:
 * 1. Signature - Drawn on canvas, stored in Google Drive "VNAH_Signatures" folder
 * 2. Portrait Photo (CCCD/ID) - Uploaded image, stored in Google Drive "VNAH_PortraitPhotos" folder
 */
export default function SignatureAndDocuments({
  onSignatureCaptured,
  onCCCDImageCaptured,
  errors = {},
}: SignatureAndDocumentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const [cccdPreview, setCCCDPreview] = useState<string | null>(null);
  const [cccdFileName, setCCCDFileName] = useState<string>('');
  const [isCCCDSaved, setIsCCCDSaved] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  }, []);

  // Handle canvas drawing - Mouse Events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Handle canvas drawing - Touch Events (for mobile/tablet)
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsSignatureSaved(false);
  };

  // Capture signature
  const captureSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64Data = canvas.toDataURL('image/png');
    console.log("Signature captured!");
    console.log("Base64 length:", base64Data.length);
    console.log("First 100 chars:", base64Data.substring(0, 100));
    onSignatureCaptured(base64Data);
    setIsSignatureSaved(true);
  };

  // Handle CCCD image upload
  const handleCCCDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCCCDFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setCCCDPreview(base64Data);
      onCCCDImageCaptured(base64Data);
      setIsCCCDSaved(true);
    };
    reader.readAsDataURL(file);
  };

  // Remove CCCD image
  const removeCCCDImage = () => {
    setCCCDPreview(null);
    setCCCDFileName('');
    onCCCDImageCaptured('');
    setIsCCCDSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Signature Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">🖊️ Chữ ký nhân viên</h3>
          {isSignatureSaved && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <Check size={14} />
              Đã lưu
            </div>
          )}
        </div>
        <p className="text-xs text-blue-600 mb-3 font-medium">
          💾 Lưu vào: Google Drive / VNAH_Signatures
        </p>
        <p className="text-sm text-gray-600 mb-3">Vẽ chữ ký của bạn trong ô dưới đây</p>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawingTouch}
          onTouchCancel={stopDrawingTouch}
          className="w-full border-2 border-dashed border-gray-300 bg-white cursor-crosshair rounded mb-3 touch-none"
          style={{ minHeight: '150px' }}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={captureSignature}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              isSignatureSaved
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSignatureSaved ? '✓ Đã lưu' : 'Lưu chữ ký'}
          </button>
          <button
            type="button"
            onClick={clearSignature}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm font-medium"
          >
            Xóa
          </button>
        </div>

        {errors.signature && (
          <p className="text-sm text-red-600 mt-2">{errors.signature}</p>
        )}
      </div>

      {/* CCCD Image Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">📷 Ảnh chân dung (CCCD/CMND)</h3>
          {isCCCDSaved && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <Check size={14} />
              Đã lưu
            </div>
          )}
        </div>
        <p className="text-xs text-blue-600 mb-3 font-medium">
          💾 Lưu vào: Google Drive / VNAH_Avatars
        </p>
        <p className="text-sm text-gray-600 mb-3">Tải lên ảnh scan CCCD hoặc CMND (JPG, PNG, tối đa 5MB)</p>

        {!cccdPreview ? (
          <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 bg-white transition">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-8v10m-6-2l-6-6m0 0l6-6m-6 6h12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-medium">Chọn ảnh</span> hoặc kéo thả vào đây
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleCCCDUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative bg-white rounded border border-gray-200 p-2">
            <img
              src={cccdPreview}
              alt="CCCD Preview"
              className="w-full h-auto rounded max-h-64 object-contain"
            />
            <button
              type="button"
              onClick={removeCCCDImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            >
              <X size={16} />
            </button>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-600">
                📄 {cccdFileName}
              </p>
              {isCCCDSaved && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  <Check size={12} />
                  Đã lưu
                </div>
              )}
            </div>
          </div>
        )}

        {errors.cccd_image && (
          <p className="text-sm text-red-600 mt-2">{errors.cccd_image}</p>
        )}
      </div>
    </div>
  );
}
