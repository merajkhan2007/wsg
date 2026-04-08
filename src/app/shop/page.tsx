import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import ShopContent from './ShopContent';
import { Suspense } from 'react';

async function getProducts() {
  try {
    const res = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC');
    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-light flex items-center justify-center p-10"><div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent initialProducts={products} />
    </Suspense>
  );
}
