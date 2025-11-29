# Google Authentication Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: SS Fashions
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: SS Fashions Web
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Existing database credentials
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=your_server.database.windows.net
DB_NAME=your_database_name

# Google OAuth (NEW)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Secret (NEW)
AUTH_SECRET=your_random_secret_here
```

To generate `AUTH_SECRET`, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Create Database Tables

Run the script to create Users and Wishlists tables:

```bash
node scripts/create-auth-tables.js
```

## Step 4: Test Authentication

1. Start the dev server: `npm run dev`
2. Click "Sign In" in the header
3. Sign in with your Google account
4. You should see your name in the header
5. Try adding items to your wishlist

## How It Works

- **Users Table**: Stores user information (email, name, profile image)
- **Wishlists Table**: Links users to their saved sarees
- **Google OAuth**: Handles secure authentication
- **Session Management**: Keeps users logged in across page refreshes
