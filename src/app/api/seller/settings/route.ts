import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve full profile from users and sellers tables
    const res = await query(`
      SELECT u.id, u.name, u.email, s.shop_name, s.shop_description, s.shop_logo,
             s.bank_name, s.bank_account_name, s.bank_account_number, s.bank_ifsc,
             s.aadhar_url, s.pan_url
      FROM users u
      LEFT JOIN sellers s ON s.user_id = u.id
      WHERE u.id = $1
    `, [user.id]);
    
    // In a real application, you might also join settings/shipping preferences here.
    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
   try {
     const user = getUser(req);
     if (!user || user.role !== 'seller') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const body = await req.json();
     const { shop_name, shop_description, shop_logo, name, bank_name, bank_account_name, bank_account_number, bank_ifsc, aadhar_url, pan_url } = body;
     
     // Build dynamic query for users table
     let updates = [];
     let params: any[] = [];
     let paramIndex = 1;

     if (name !== undefined) { updates.push(`name = $${paramIndex++}`); params.push(name); }

     let userProfile = {};
     if (updates.length > 0) {
       params.push(user.id);
       const updateRes = await query(`
         UPDATE users
         SET ${updates.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING id, name
       `, params);
       if (updateRes.rows.length > 0) {
         userProfile = updateRes.rows[0];
       }
     }

     // Build dynamic query for sellers table (settings & bank details)
     let sellerUpdates = [];
     let sellerParams: any[] = [];
     let sellerParamIndex = 1;

     if (shop_name !== undefined) { sellerUpdates.push(`shop_name = $${sellerParamIndex++}`); sellerParams.push(shop_name); }
     if (shop_description !== undefined) { sellerUpdates.push(`shop_description = $${sellerParamIndex++}`); sellerParams.push(shop_description); }
     if (shop_logo !== undefined) { sellerUpdates.push(`shop_logo = $${sellerParamIndex++}`); sellerParams.push(shop_logo); }
     if (bank_name !== undefined) { sellerUpdates.push(`bank_name = $${sellerParamIndex++}`); sellerParams.push(bank_name); }
     if (bank_account_name !== undefined) { sellerUpdates.push(`bank_account_name = $${sellerParamIndex++}`); sellerParams.push(bank_account_name); }
     if (bank_account_number !== undefined) { sellerUpdates.push(`bank_account_number = $${sellerParamIndex++}`); sellerParams.push(bank_account_number); }
     if (bank_ifsc !== undefined) { sellerUpdates.push(`bank_ifsc = $${sellerParamIndex++}`); sellerParams.push(bank_ifsc); }
     if (aadhar_url !== undefined) { sellerUpdates.push(`aadhar_url = $${sellerParamIndex++}`); sellerParams.push(aadhar_url); }
     if (pan_url !== undefined) { sellerUpdates.push(`pan_url = $${sellerParamIndex++}`); sellerParams.push(pan_url); }

     if (sellerUpdates.length > 0) {
       sellerParams.push(user.id);
       const sellerRes = await query(`
         UPDATE sellers
         SET ${sellerUpdates.join(', ')}
         WHERE user_id = $${sellerParamIndex}
         RETURNING shop_name, shop_description, shop_logo
       `, sellerParams);
       if (sellerRes.rows.length > 0) {
         userProfile = { ...userProfile, ...sellerRes.rows[0] };
       }
     }

     if (updates.length === 0 && sellerUpdates.length === 0) {
       return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
     }

     return NextResponse.json({ success: true, message: 'Settings saved successfully', profile: userProfile });
   } catch(error) {
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
