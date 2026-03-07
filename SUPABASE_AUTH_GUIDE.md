# 🔐 Supabase Authentication Setup Guide

To get the login, OTP, and Google Authentication working for RoadGuard AI, you must configure your Supabase project. The code is already fully built, you just need to activate the services in your Supabase dashboard!

## Step 1: Connect Your React App to Supabase
1. Create a free account at [Supabase](https://supabase.com).
2. Click **New Project**.
3. Go to `Project Settings` ➔ `API`.
4. Copy the **Project URL** and the **anon public API Key**.
5. Paste them into BOTH of your `.env` files:
   *   `roadguard-frontend/.env` (use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
   *   `roadguard-backend/.env` (use `SUPABASE_URL` and `SUPABASE_KEY`)

---

## Step 2: Enable Email OTP (Magic Links)
By default, Supabase requires you to click a link to verify an email. We built it to use **6-Digit OTP** codes inside the app instead.
1. In Supabase, go to `Authentication` ➔ `Providers` ➔ `Email`.
2. Ensure **Enable Email Provider** is turned ON.
3. Ensure **Confirm email** is ON.
4. Go to `Authentication` ➔ `Email Templates`.
5. Under both **Confirm signup** and **Magic Link**, edit the template body to include the raw OTP token instead of a URL:
   ```html
   <h2>Your RoadGuard Verification Code</h2>
   <p>Enter the following 6-digit code in the app to verify:</p>
   <h1>{{ .Token }}</h1>
   ```

---

## Step 3: Enable Google OAuth Auth
To make the "Continue with Google" button work:
1. Go to `Authentication` ➔ `Providers` ➔ `Google` in Supabase.
2. Turn it **ON**.
3. You need a **Client ID** and **Client Secret** from Google.
   * Go to the [Google Cloud Console](https://console.cloud.google.com).
   * Create a new project.
   * Go to `APIs & Services` ➔ `Credentials`.
   * Click **Create Credentials** ➔ **OAuth client ID**.
   * Application type: **Web application**.
   * Under **Authorized redirect URIs**, paste the *Callback URL* that Supabase gives you (e.g. `https://xyz.supabase.co/auth/v1/callback`).
   * Copy the generated Client ID and secret and paste them back into the Supabase Google Provider settings.

---

## Step 4: Add Authorized Redirect URLs
1. In Supabase, go to `Authentication` ➔ `URL Configuration`.
2. Under **Site URL**, ensure your local app address is there:
   `http://localhost:3000`
3. If you deploy this to Vercel/Netlify, add that live URL to the **Redirect URLs** list below it so Google knows it is safe to redirect back to your website.

---

Once these 4 steps are complete, your React App will instantly start sending OTP emails to users and accepting Google Logins!
