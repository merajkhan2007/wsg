import { query } from './src/lib/db.js';

async function run() {
  try {
    await query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(20);');
    console.log('Successfully added phone column to orders table.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

run();
