# Property Listing App

A modern property listing application built with Next.js 15, React 19, and Supabase.

## 🚀 Features

- User authentication (login/signup)
- Property listings with images
- Admin dashboard for property management
- Role-based access (User/Admin)
- Responsive design

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Supabase account

## Test Accounts

You can use the following accounts to log in and explore the app:

**Admin Account**
- Email: `admin@gmail.com`
- Password: `adminadmin`

**User Account**
- Email: `johnDoe@gmail.com`
- Password: `johndoe`

## 🔧 Setup

### 1. Backend Setup (Supabase)

1. Create a [Supabase](https://supabase.com) account and new project
2. Wait for project setup to complete
3. Note your project URL and anon key from **Settings > API**
4. Create a `users` table:
   - `id` (UUID)
   - `email` (text)
   - `name` (text)
   - `user_role` (enum: `Admin` | `User`)
5. Create a `property_listings` table:
   - `id` (UUID)
   - `title` (text)
   - `description` (text)
   - `location` (text)
   - `price` (text)
   - `property_type` (enum: `House` | `Apartment` | `Commercial`)
   - `status` (enum: `ForSale` | `ForRent`)
   - `image` (text[])
6. Create a function in the Supabase SQL Editor to attach the `user_role` from the `users` table to the JWT claims.
DECLARE
  user_role text;
  claims jsonb;
BEGIN
  SELECT u.user_role INTO user_role FROM public.users u WHERE u.id = (event->>'user_id')::uuid;

  IF user_role IS NULL THEN
    user_role := 'null';
  END IF;

  claims := COALESCE(event->'claims', '{}'::jsonb);

  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));



### 2. Frontend Setup

1. **Clone and install dependencies:**
   ```bash
   git clone git@github.com:ren89/property-listing-app.git
   cd property-listing-app
   npm install
   ```

2. **Create environment file:**
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```


## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production
```bash
npm run build
npm start
```

### Other Commands
```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues
npm run type-check    # TypeScript type checking
```

## 📱 Application Structure

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS
- **Backend**: Supabase (authentication, database, storage)
- **UI Components**: Radix UI primitives with custom styling

## 🔑 Authentication

The app uses Supabase authentication. Users can sign up and log in with email/password.

## 👥 User Roles

- **User**: Can view property listings
- **Admin**: Can manage (create/edit/delete) properties

> **Note**: Role assignment and database schema setup will depend on your specific Supabase configuration.

## 📂 Key Directories

```
├── app/                # Next.js App Router pages
├── components/         # React components
│   ├── feature/       # Feature-specific components
│   ├── shared/        # Reusable components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
└── utils/supabase/    # Supabase client configuration
```

## 🚀 Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js:

1. Push code to GitHub
2. Connect to your deployment platform
3. Add environment variables
4. Deploy

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn
- **Backend**: Supabase
- **UI**: Radix UI, Lucide React icons
- **State Management**: React hooks, React Table

---

For detailed documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)