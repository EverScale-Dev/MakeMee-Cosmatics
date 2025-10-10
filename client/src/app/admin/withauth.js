// admin/useAuth.js
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust the key based on your token storage method
    if (!token) {                                
      router.push('/login'); // Redirect to login if token is not present
    }
  }, [router]);
};

export default useAuth;
