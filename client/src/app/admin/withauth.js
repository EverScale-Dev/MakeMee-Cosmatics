// admin/useAuth.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/utils/axiosClient';

const useAdminAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      // Skip auth check for admin login page
      if (pathname === '/admin/login') {
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        router.push('/admin/login');
        return;
      }

      try {
        // Verify admin token with backend
        const res = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (res.data.role !== 'admin') {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router, pathname]);

  return { isAuthorized, loading };
};

export default useAdminAuth;
