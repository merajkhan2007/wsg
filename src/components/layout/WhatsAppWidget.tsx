import React from 'react';

export default function WhatsAppWidget() {
  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      {/* Subtle Ping Effect behind the button */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping-slow opacity-30 group-hover:opacity-0" />
      
      {/* Floating Tooltip Label */}
      <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-2xl shadow-xl border border-pink-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none scale-95 group-hover:scale-100">
        <span className="relative z-10">Chat with us! ✨</span>
        {/* Tooltip Arrow */}
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-t border-pink-50" />
      </div>

      {/* Main WhatsApp Button */}
      <a
        href="https://wa.me/917595989813"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_8px_40px_rgb(37,211,102,0.6)] transition-all duration-500 hover:scale-110 active:scale-95 animate-soft-bounce group-hover:pause-animation"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-9 h-9"
        >
          <path d="M12.031 0C5.385 0 0 5.388 0 12.038c0 2.124.553 4.195 1.605 6.015L.233 23.32l5.419-1.422a11.967 11.967 0 0 0 6.379 1.834h.005c6.643 0 12.03-5.389 12.03-12.038C24.066 5.388 18.674 0 12.031 0zm0 21.734h-.003a9.96 9.96 0 0 1-5.074-1.385l-.364-.216-3.771.99.999-3.676-.237-.377A9.957 9.957 0 0 1 2.008 12.04c0-5.54 4.509-10.05 10.023-10.05 5.513 0 10.024 4.51 10.024 10.05 0 5.541-4.51 10.05-10.024 10.05zm5.5-7.514c-.302-.152-1.785-.882-2.062-.982-.277-.101-.48-.152-.68.151-.202.303-.782.982-.958 1.184-.177.202-.353.227-.655.076-.302-.151-1.275-.47-2.43-1.503-.898-.804-1.504-1.796-1.68-2.099-.177-.302-.019-.466.132-.617.136-.135.302-.353.454-.53.151-.176.201-.302.302-.504.1-.202.05-.378-.025-.53-.076-.151-.68-1.64-.932-2.245-.246-.59-.496-.51-.68-.52-.177-.008-.38-.01-.582-.01-.202 0-.53.076-.807.378-.277.303-1.058 1.034-1.058 2.52 0 1.488 1.083 2.924 1.234 3.125.151.202 2.128 3.25 5.158 4.557.72.311 1.282.497 1.721.637.725.23 1.386.197 1.905.12.583-.087 1.785-.73 2.037-1.438.252-.708.252-1.314.177-1.439-.076-.126-.277-.202-.579-.354z" />
        </svg>
      </a>
    </div>
  );
}

