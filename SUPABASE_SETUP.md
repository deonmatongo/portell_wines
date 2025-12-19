# Supabase Setup Instructions

## Step 1: Get Your Supabase Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/tjlvivpxnltubacusphz
2. Navigate to **Settings** → **API**
3. Find the **Project API keys** section
4. Copy the **`anon` `public`** key (this is safe to use in frontend)

## Step 2: Create .env File

Create a `.env` file in the root of your project with:

```env
VITE_SUPABASE_URL=https://tjlvivpxnltubacusphz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the anon key you copied from Step 1.

## Step 3: Restart Your Dev Server

After creating the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Verify Connection

1. Open your app at http://localhost:5000
2. Try adding a product or event through the admin panel
3. Check the browser console for any errors

## Database Tables Created

The following tables are now available in your Supabase database:

- ✅ `products` - Wine products
- ✅ `events` - Wine events and tastings
- ✅ `bookings` - Event reservations
- ✅ `orders` - Product orders
- ✅ `users` - Admin users

## Next Steps

### Enable Row Level Security (RLS)

For production, you should enable RLS on your tables:

1. Go to **Authentication** → **Policies** in Supabase Dashboard
2. Enable RLS on each table
3. Create policies for:
   - Public read access for products and events
   - Admin write access for all tables

### Set Up Email Service

The `SendEmail` function currently logs a warning. For production, you'll need to:

1. Set up Supabase Edge Functions for email sending, OR
2. Use a service like Resend, SendGrid, or Mailgun
3. Update the `SendEmail` function in `src/api/apiClient.js`

## Troubleshooting

### "VITE_SUPABASE_ANON_KEY is not set"
- Make sure you created the `.env` file in the project root
- Restart your dev server after creating `.env`
- Check that the variable name is exactly `VITE_SUPABASE_ANON_KEY`

### "Failed to fetch" errors
- Check your Supabase URL is correct
- Verify your anon key is correct
- Check browser console for detailed error messages

### Database connection issues
- Verify your Supabase project is active
- Check that tables exist in the Table Editor
- Ensure RLS policies allow the operations you're trying to perform

