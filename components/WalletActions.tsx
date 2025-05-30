import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Download, Share, Send } from "lucide-react";
import SendModal from "./Send";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onCopyAddress: (address: string) => void;
}

const ReceiveModal = ({
  isOpen,
  onClose,
  walletAddress,
  onCopyAddress,
}: ReceiveModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await onCopyAddress(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wallet Address",
          text: "Send me crypto to this address:",
          url: walletAddress,
        });
      } catch (err) {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "wallet-qr-code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Receive Crypto</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="text-center mb-6">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 inline-block shadow-sm">
            <QRCodeSVG
              id="qr-code"
              value={walletAddress}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Scan this QR code to send crypto to your wallet
          </p>
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 break-all">
              {walletAddress}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:text-[#8B1212] hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy address"
            >
              <Copy className={`w-4 h-4 ${copied ? "text-green-600" : ""}`} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1">
              Address copied to clipboard!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download QR</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors text-sm"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated ActionButtons component with Send functionality
const ActionButtons = ({
  walletAddress,
  onCopyAddress,
}: {
  walletAddress: string;
  onCopyAddress: (address: string) => void;
}) => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  }>({
    message: "",
    type: "success",
    show: false,
  });

  // Handle successful send transaction
  const handleSendSuccess = (signature: string) => {
    setNotification({
      message: `Transaction successful! Signature: ${signature.slice(0, 8)}...`,
      type: "success",
      show: true,
    });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      5000
    );
  };

  // Handle send transaction error
  const handleSendError = (error: string) => {
    setNotification({
      message: `Transaction failed: ${error}`,
      type: "error",
      show: true,
    });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      5000
    );
  };

  return (
    <>
      <div className="flex flex-row justify-between w-full gap-6">
        {/* Send Button */}
        <button
          className="flex flex-col items-center space-y-3 w-full p-4 sm:p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100"
          onClick={() => setShowSendModal(true)}
        >
          <Send className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
          <span className="text-xs sm:text-sm font-medium text-blue-700">
            Send
          </span>
        </button>

        {/* Receive Button */}
        <button
          className="flex flex-col items-center w-full space-y-3 p-4 sm:p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-all border border-green-100"
          onClick={() => setShowReceiveModal(true)}
        >
          <Download className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
          <span className="text-xs sm:text-sm font-medium text-green-700">
            Receive
          </span>
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Send Modal */}
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSuccess={handleSendSuccess}
        onError={handleSendError}
      />

      {/* Receive Modal */}
      <ReceiveModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        walletAddress={walletAddress}
        onCopyAddress={onCopyAddress}
      />
    </>
  );
};

export default ActionButtons;
