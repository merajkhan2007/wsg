import { query } from './src/lib/db';

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
      await query(
        `INSERT INTO categories (name, slug, description) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
        [cat.name, cat.slug, \`Premium \${cat.name} Collection\`]
      );
      console.log(\`✅ Added: \${cat.name}\`);
    } catch (e) {
      console.error(\`❌ Failed to add \${cat.name}:\`, e.message);
    }
  }
  
  console.log('Finished inserting categories.');
  process.exit(0);
}

seedCategories();
