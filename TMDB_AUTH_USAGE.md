# TMDB v4 Authentication - Implementation Guide

## Overview
The complete TMDB v4 authentication flow has been implemented with the following components:

## Files Created/Modified

### 1. `/server/api/createRequestToken.ts` (Modified)
- **Purpose**: Initiates the authentication process by creating a request token
- **Method**: POST
- **Returns**: Request token and authorization URL

### 2. `/server/api/createAccessToken.ts` (New)
- **Purpose**: Exchanges an approved request token for an access token
- **Method**: POST
- **Body**: `{ request_token: string }`
- **Returns**: Access token and account ID

### 3. `/pages/auth/callback.vue` (New)
- **Purpose**: Handles the redirect from TMDB after user authorization
- **Features**:
  - Retrieves request token from localStorage (stored before redirect)
  - Exchanges it for access token
  - Stores credentials in localStorage
  - Shows success/error messages
  - Auto-redirects to home page

### 4. `/components/TMDBAuthButton.vue` (New)
- **Purpose**: Ready-to-use authentication button component
- **Features**:
  - Shows "Connect TMDB Account" when not authenticated
  - Shows "Connected" status when authenticated
  - Stores request token in localStorage before redirecting to TMDB
  - Includes logout functionality
  - Error handling and loading states

## Usage

### In any Vue page/component:

```vue
<template>
  <div>
    <h1>My Page</h1>
    <TMDBAuthButton />
  </div>
</template>

<script setup>
// The component is auto-imported by Nuxt
</script>
```

### Accessing the stored credentials:

```javascript
// Get access token
const accessToken = localStorage.getItem('tmdb_access_token')
const accountId = localStorage.getItem('tmdb_account_id')

// Use in API calls
const options = {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}
```

### Making authenticated requests:

```javascript
// Example: Rate a movie
const rateMovie = async (movieId, rating) => {
  const accessToken = localStorage.getItem('tmdb_access_token')
  
  const response = await fetch(`https://api.themoviedb.org/4/movie/${movieId}/rating`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: rating })
  })
  
  return response.json()
}
```

## Authentication Flow

1. User clicks "Connect TMDB Account" button
2. App calls `/api/createRequestToken` to get a request token
3. **Request token is stored in localStorage** (TMDB doesn't send it back in the URL)
4. User is redirected to TMDB website to approve the request
5. After approval, TMDB redirects to `/auth/callback` (no token in URL)
6. Callback page retrieves the request token from localStorage
7. Callback page calls `/api/createAccessToken` to exchange the request token for an access token
8. Access token is stored in localStorage and the pending request token is removed
9. User is redirected back to home page
10. App can now make authenticated API calls using the stored access token

## Environment Variables

Your `nuxt.config.ts` already contains:
- `apiSecret`: Your TMDB Bearer token (for server-side API calls)
- `apiBase`: TMDB API base URL

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to your app
3. Add the `<TMDBAuthButton />` component to any page
4. Click "Connect TMDB Account"
5. Log in to TMDB and approve the request
6. You should be redirected back and see "Connected to TMDB"

## Notes

- **Important**: TMDB does not return the request token in the callback URL, so the token must be stored in localStorage before redirecting
- Access tokens are stored in localStorage (consider using secure cookies for production)
- The callback URL defaults to `http://localhost:3000/auth/callback` for development
- Update the redirect URL for production deployment
- Access tokens don't expire but can be revoked by the user on TMDB
