import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthGuard() {
  const router = useRouter();
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      router.replace('/login');
    }
  }, [router]);
}