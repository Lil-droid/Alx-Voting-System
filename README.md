# Alx Voting System

A full-stack voting application built with **Next.js** (App Router), **Supabase** (for authentication, database, and real-time features), and deployed on **Vercel**.  

The system allows users to sign up, sign in, vote in polls, and view results, while admins can create and manage polls via a protected dashboard.  

---

## 🚀 Setup and Run Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/alx-voting-system.git
cd alx-voting-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
- Create a .env.local file in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run database migrations

- Copy the SQL schema into Supabase SQL Editor.
- Enable Row Level Security (RLS) on all tables.
- Create the create_profile RPC function for automatic profile creation.

###  5. Start the development server
```bash
npm run dev
```
- Visit http://localhost:3000 in your browser.

---

## Features Implemented

### User Authentication
- **Sign Up / Log In:** User authentication and session management via [Supabase Auth](https://supabase.com/docs/guides/auth).
- **Automatic Profile Creation:** Profiles are automatically created using Supabase Remote Procedure Calls (RPC).

### Admin Dashboard
- **Poll Management:** Admins can create, edit, and manage polls (with middleware protection).
- **Analytics:** View poll voting results and detailed analytics.
  
### Voting Mechanism
- **Real-Time Voting:** Users can vote on polls in real-time.
- **Single and Multiple Choice Polls:** Supports both single and multiple-choice voting.

### Polling Management
- **Start/End Time Control:** Admins can control the start and end times for polls.
- **Active/Inactive Polls:** Polls can be toggled between active and inactive status.
  
### Searchable Polls & Voting History
- **Search Polls:** Polls can be searched by title.
- **Voting History:** Users can view their personal voting history on their dashboard.

### Protected Routes
- **Middleware:** Authenticated users can access `/dashboard` and `/polls`. Admin-only access for `/admin` routes.

### Responsive UI
- **TailwindCSS Styling:** Mobile-first design with responsive layouts for both mobile and desktop views.
- **Modern Design:** Clean and modern UI, ensuring a seamless user experience.

## 🛠 Technologies Used

- **Next.js 13+ (App Router):** Frontend framework for building the app.
- **Supabase:** Authentication, database management, and real-time updates.
- **Tailwind CSS:** Utility-first CSS framework for responsive styling.
- **Vercel:** Deployment platform.
- **TypeScript:** For type safety and improved developer experience.

## 🤖 Notes on AI Usage

AI tools (ChatGPT/GPT-5) were used in the following contexts:
- **Code Generation:** Assisted in generating initial code for Next.js pages, Supabase integration, and middleware templates.
- **Database Schema:** Helped generate SQL for profiles, polls, options, and votes, with Row-Level Security (RLS) policies.
- **UI Components:** Assisted in building reusable and styled components for authentication and dashboard pages.
- **Documentation:** Helped in writing this README and generating commit messages.