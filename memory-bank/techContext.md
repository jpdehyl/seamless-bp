# Tech Context: Seamless BP

## 1. Technologies Used
- **Frontend Framework**: Next.js (v14+ assumed, using App Router)
- **Styling**: Tailwind CSS
- **Backend Platform**: Supabase
  - **Authentication**: Supabase Auth (Google OAuth)
  - **Database**: Supabase PostgreSQL (Schema TBD based on features: projects, timecards, finances, users)
  - **Real-time**: Potentially Supabase Realtime for dashboard updates (TBD)
- **Language**: TypeScript
- **Package Manager**: npm (or yarn, check package-lock.json/yarn.lock)
- **Hosting**: Vercel (Assumed, standard for Next.js)
- **Version Control**: Git / GitHub (Assumed)

## 2. Development Setup
- **Local Environment**: Node.js environment for running Next.js dev server (`npm run dev` or `yarn dev`).
- **Environment Variables**: Requires Supabase URL and Anon Key, plus Google OAuth Client ID/Secret stored in `.env.local`.
- **Supabase Setup**: A Supabase project linked to the repo. Google Auth provider needs to be configured correctly in Supabase dashboard.
- **Code Editor**: Cursor IDE.

## 3. Technical Constraints
- **Supabase Limits**: Dependent on the chosen Supabase plan (free tier has limitations).
- **Google OAuth Setup**: Requires correct configuration in both Google Cloud Console and Supabase dashboard. Redirect URIs must match.
- **Scalability**: Initial focus is on MVP for ~5-6 clients; scaling considerations (database indexing, real-time connections) can be addressed later.

## 4. Dependencies (Core)
- **Core**: `next`, `react`, `react-dom`, `tailwindcss`
- **Supabase**: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs` (likely used for App Router integration)
- **Development**: `typescript`, `@types/react`, `@types/node`, `postcss`, `autoprefixer`

## 5. Potential Future Tech
- State Management (if complexity grows): Zustand, Jotai, or React Context.
- Data Fetching/Caching: React Query (TanStack Query) or SWR.
- Component Library: Shadcn/ui (integrates well with Tailwind).
