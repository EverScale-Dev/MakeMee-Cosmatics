"use client";
import React from 'react';
import Link from 'next/link';
// Using a standard success icon for professionalism
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ThankYou = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      
      {/* Main Confirmation Card */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 md:p-12 border border-gray-100">
        
        {/* Icon & Status */}
        <div className="flex flex-col items-center border-b pb-6 mb-6">
          <CheckCircleOutlineIcon 
            className="text-green-600" 
            style={{ fontSize: '3.5rem' }} 
          />
          <h1 className="text-3xl font-bold mt-4 text-gray-900 tracking-tight">
            Order Confirmation
          </h1>
        </div>
        
        {/* Core Message */}
        <p className="text-lg text-gray-700 mb-2">
          Thank you for placing your order with us.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Your order has been successfully processed and a detailed receipt has been sent to your email address.
        </p>
        
        {/* Call to Action Buttons (Vertical Stack) */}
        <div className="flex flex-col space-y-4">
          
          {/* Primary CTA: Continue Shopping */}
          <Link 
            href="/" 
            className="w-full text-center bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out shadow-md"
          >
            Continue Shopping
          </Link>
          
          {/* Secondary CTA: View Order */}
          <Link 
            href="/my-orders" // Link to a dedicated order history/details page
            className="w-full text-center border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out"
          >
            View Order Status
          </Link>
          
        </div>
        
        {/* Footer/Support Link */}
        <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
          <p>
            For any immediate questions, please contact our support team at 
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 underline">
              Support Center.
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default ThankYou;