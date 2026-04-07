const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

async function seedCategories() {
  const categories = [
    { name: 'Home Decor', slug: 'home-decor' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-accessories' },
    { name: 'Bags & Fashion', slug: 'bags-fashion' },
    { name: 'Wedding & Decor', slug: 'wedding-decor' },
    { name: 'Art & Paintings', slug: 'art-paintings' },
    { name: 'Handicrafts', slug: 'handicrafts' }
  ];

  console.log('Inserting categories into database...');
  for (const cat of categories) {
    try {
      await pool.query(
        `INSERT INTO categories (name, seo_slug, seo_description) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (name) DO UPDATE SET seo_slug = EXCLUDED.seo_slug`,
        [cat.name, cat.slug, `Premium ${cat.name} Collection`]
      );
      console.log(`✅ Added/Updated: ${cat.name}`);
    } catch (e) {
      console.error(`❌ Failed to add ${cat.name}:`, e.message);
    }
  }
  
  console.log('Finished inserting categories.');
  await pool.end();
}

seedCategories();
