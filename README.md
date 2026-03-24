# LifeLink Organ Donation System

LifeLink is a complete full-stack web application designed to connect organ donors with recipients securely, transparently, and efficiently. It uses advanced multi-factor matching algorithms prioritizing blood groups, geolocation, and medical urgency. Built with React (Vite, TypeScript, Tailwind CSS) on the frontend and Supabase (Auth, Postgres SQL, Storage) on the backend.

## Features Let Down
- **Role-Based Access**: 4 specialized modules (Donor, Recipient, Hospital, Admin).
- **Google OAuth**: Fast login and specialized role-selection onboarding for new users.
- **Form Workflows**: Extensive, validated medical intake forms with secure PDF/Image Storage for verification.
- **Matching Algorithm**: Highly accurate local mapping that pairs O+ with universal recipients perfectly alongside distance matrices mapping directly from React.
- **Audit Logs**: Traceable admin security on all status updates.

## Local Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Supabase Environment Variables**
   Rename `.env.example` to `.env.local` and substitute your actual keys.
   ```
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

3. **Supabase Auth Configuration**
   - Go to your Supabase project dashboard: `Authentication` > `Providers`.
   - Enable the **Google** provider and enter your Client ID and Secret obtained from Google Cloud Console.
   - For Google OAuth callback, make sure to add `http://localhost:5173/` and `http://localhost:5173/role-selection` to your Redirect URLs in your Supabase Auth settings.

4. **Storage Configuration**
   Ensure an active, public Storage bucket named `documents` exists in your Supabase instance. RLS policies should allow insert for authenticated users and select anywhere.

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

## Folder Structure Summary
- `/src/components` - Reusable Tailwind aesthetic UI, including Navbars, Layouts, and Modals.
- `/src/pages` - Pages grouped into logical chunks: Auth, Onboarding, Dashboards, Profiles, and Admin.
- `/src/services` - Decoupled logic separating database integration, audits, storage, from UI files.
- `/src/contexts` - AuthContext powering the global secure route-guard.
