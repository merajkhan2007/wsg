import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import ShopContent from './ShopContent';

async function getProducts() {
  try {
    const res = await query('SELECT p.*, c.name as category_name, s.shop_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN sellers s ON p.seller_id = s.id ORDER BY p.created_at DESC');
    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <ShopContent initialProducts={products} />
  );
}
