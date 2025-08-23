# Civic Auth Setup for PeerLink

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:** Navigate to `http://localhost:5173`

## 🔐 Civic Auth Configuration

### Option 1: Use Mock Auth (Development)
The app will automatically fall back to mock authentication if Civic Auth fails. This is perfect for development and testing.

### Option 2: Real Civic Auth (Production)
To use real Civic Auth:

1. **Get your Civic App ID:**
   - Go to [Civic Auth Dashboard](https://auth.civic.com)
   - Create a new app
   - Copy your App ID

2. **Set environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_CIVIC_APP_ID=your_civic_app_id_here
   VITE_CIVIC_REDIRECT_URI=http://localhost:5173
   VITE_CIVIC_SCOPE=openid profile email
   VITE_API_URL=http://localhost:5000
   ```

3. **Update the Civic Auth configuration:**
   - Edit `src/config/civic.ts`
   - Replace the default values with your actual Civic App ID

## 🎯 How It Works

1. **User clicks "Login with Civic Auth"**
2. **Civic Auth flow starts:**
   - Redirects to Civic Auth
   - User authenticates with their preferred method
   - Civic returns user data + JWT token
3. **User data is processed:**
   - Transformed to PeerLink User interface
   - Stored locally for persistence
   - User is redirected to dashboard

## 🔧 Development Features

- **Mock Fallback:** If Civic Auth fails, falls back to mock user
- **Local Storage:** User sessions persist across browser refreshes
- **Profile Management:** Users can update their information
- **Privacy Controls:** Granular control over what information to share

## 🚀 Production Deployment

1. **Update Civic Auth config:**
   - Set production App ID
   - Update redirect URI to your domain
   - Configure proper scopes

2. **Environment variables:**
   ```env
   VITE_CIVIC_APP_ID=your_production_app_id
   VITE_CIVIC_REDIRECT_URI=https://yourdomain.com
   VITE_CIVIC_SCOPE=openid profile email
   VITE_API_URL=https://yourdomain.com/api
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   # Deploy the dist folder to your hosting service
   ```

## 🎉 What You Get

- ✅ **Real Civic Auth integration**
- ✅ **Fallback to mock auth for development**
- ✅ **Complete user profile management**
- ✅ **Privacy controls and visibility toggles**
- ✅ **QR code generation for networking**
- ✅ **Event management system**
- ✅ **Private messaging between users**

## 🔍 Troubleshooting

### Civic Auth not working?
- Check your App ID in the config
- Verify redirect URI matches Civic dashboard
- Check browser console for errors
- App will fall back to mock auth automatically

### Mock auth not working?
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing browser data

### Build errors?
- Make sure all dependencies are installed
- Check TypeScript compilation
- Verify environment variables are set correctly

---

**PeerLink is now ready with Civic Auth! 🎉**
