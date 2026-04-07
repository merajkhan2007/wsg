# Messaging Privacy Update TODO

## Approved Plan Steps (Breakdown)

### 1. Update Database Schema (schema.sql)
- Add constraints to `messages` table to prevent direct customer-seller messaging.
- Enhance `tickets` table with `order_id`, `seller_id` fields for context.
- Add `ticket_forwards` table for admin mediation if needed.

### 2. Modify Customer Chat API (src/app/api/customer/chat/route.ts)
- POST: Create ticket instead of direct message to seller.
- GET: Return user's tickets filtered by orders.

### 3. Modify Seller Chat API (src/app/api/seller/chat/route.ts)
- POST: Redirect to ticket creation or block direct customer sends.
- GET: Read-only access to past messages + related tickets.

### 4. Update Seller Messages UI (src/app/seller/messages/page.tsx)
- Disable send functionality.
- Add button/link to "Escalate to Admin" (create ticket).

### 5. Enhance Admin Tickets API (src/app/api/admin/tickets/route.ts)
- Add filters by `order_id`, `seller_id`.
- Add forward message option (create notification/ticket for other party).

### 6. Enhance Admin Tickets UI (src/app/admin/tickets/page.tsx)
- Show order/seller context.
- Buttons for forwarding to seller/customer.

### 7. Add Customer Chat UI if missing
- Check/create chat section in dashboard/customer/order/[id]/page.tsx.

### 8. Testing & Migration
- Apply schema changes.
- Test flows: customer message → ticket, seller view/escalate.
- Ensure existing messages readable.

### 1. Update Database Schema (schema.sql) ✅
### 2. Modify Customer Chat API (src/app/api/customer/chat/route.ts) ✅
### 3. Modify Seller Chat API (src/app/api/seller/chat/route.ts) ✅
### 4. Update Seller Messages UI (src/app/seller/messages/page.tsx) ✅
### 5. Enhance Admin Tickets API (src/app/api/admin/tickets/route.ts) ✅
### 6. Enhance Admin Tickets UI (src/app/admin/tickets/page.tsx) ✅
### 7. Add Customer Chat UI if missing ✅ (Updated order page link)

*Updated after each completed step.*

