Backend helpers for Supabase integration

Setup
- Copy `backend/.env.example` to `backend/.env` and fill `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- The root `.gitignore` already ignores `.env` files; do NOT commit `backend/.env`.

Files
- `config/supabaseClient.js` — creates and exports a Supabase client using environment variables.
- `services/authService.js` — thin wrappers around Supabase Auth APIs: `signUp`, `signIn`, `signOut`, `getCurrentUser`, `getSession`.
- `services/profileService.js` — helpers to `getProfileById` and `upsertProfile` in `profiles` table.
- `utils/sessionManager.js` — listener and helpers for auth state/session.

Notes for React Native / Expo
- `process.env` is not available in the bundled mobile app by default. Use `expo-constants` or a build-time env plugin (e.g. `babel-plugin-inline-dotenv` or `react-native-dotenv`) to inject keys into the client app.
- Alternatively keep secrets server-side and expose a light API. Do not embed sensitive keys in public builds.
