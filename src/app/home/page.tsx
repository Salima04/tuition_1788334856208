'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router?.replace('/dashboard');
  }, [router]);
  return (
    <div className="flex items-center justify-center h-screen bg-[#0F172A]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">A</div>
        <p className="text-white text-sm font-medium">Loading ABC Business School...</p>
      </div>
    </div>
  );
}