"use client";
import React from 'react';
import Link from 'next/link';

const ThankYou = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white">
      <div className="bg-white rounded-lg shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">Thank You!</h1>
        <p className="text-lg mb-4 text-black">Your order has been placed successfully!</p>
        <p className="mb-6 text-black">We appreciate your business and hope to see you again soon.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
