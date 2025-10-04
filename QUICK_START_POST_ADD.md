# Quick Start: Post Add Feature

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# In your React project (already done)
npm install axios
```

### 2. Set Up Strapi (Separate Terminal)

```bash
# Navigate out of your React project
cd ..

# Create Strapi project
npx create-strapi-app@latest gp-strapi --quickstart

# Strapi will start automatically at http://localhost:1337
```

### 3. Configure Strapi Admin

1. Open `http://localhost:1337/admin` in browser
2. Create admin account (first time only)
3. Go to **Settings** → **API Tokens** → **Create new API Token**
4. Set:
   - Name: `React App Token`
   - Token type: `Full access`
   - Token duration: `Unlimited`
5. Copy the token (you'll only see it once!)

### 4. Set Up Environment Variables

Create a `.env` file in your React project root:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=paste_your_token_here
```

### 5. Configure Upload Permissions in Strapi

1. Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Check these Upload permissions:
   - `upload`
   - `find`
   - `findOne`
3. Click **Save**

### 6. Test the Feature

```bash
# Make sure Strapi is running in one terminal
cd ../gp-strapi
npm run develop

# Start your React app in another terminal
cd "d:/Websites/Group Project/gp"
npm run dev
```

## ✅ Test Checklist

1. **Sign up/Login as boarding owner**
   - Go to signup
   - Select "Boarding Owner" user type
2. **Access Post Add**
   - Navigate to landing page
   - Scroll to "Post Your Add" section
   - Click "Add Post" button
3. **Fill Step 1 - Details**

   - Enter title (min 10 chars)
   - Select category
   - Select for whom
   - Select location
   - Enter description (min 20 chars)
   - Enter rent amount
   - Verify email (auto-filled)
   - Enter 9-digit mobile number
   - Click "Next"

4. **Fill Step 2 - Gallery**

   - Upload 1-10 images
   - Optionally upload videos
   - Click "Next"

5. **Step 3 - Review & Submit**

   - Review all information
   - Click "Submit Post"
   - Wait for success message
   - Get redirected to Browse page

6. **Verify in Browse Page**
   - See your new post
   - Check images load correctly
   - Test filters

## 🔧 Troubleshooting

### "Network Error" when uploading images

**Solution**: Make sure Strapi is running on http://localhost:1337

```bash
cd ../gp-strapi
npm run develop
```

### "Only boarding owners can post ads"

**Solution**:

1. Check you signed up as "Boarding Owner"
2. Log out and log back in
3. Verify in Firebase Console → Firestore → users → your user → role should be "boarding_owner"

### Images not displaying in Browse page

**Solution**:

1. Check `.env` file has correct `VITE_STRAPI_URL`
2. Restart your React dev server after changing `.env`
3. Check browser console for errors

### CORS errors

**Solution**: Update `gp-strapi/config/middlewares.js` to allow your React app URL:

```javascript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
}
```

Restart Strapi after changes.

## 📁 Key Files Created

- `src/pages/main-pages/PostAddFormPage.jsx` - Main form component
- `src/firebase/strapiService.js` - Strapi API integration
- `src/firebase/dbService.js` - Added post CRUD operations
- `src/routes/AppRoutes.jsx` - Added /post-add route
- `src/pages/landing-pages/PostAdd.jsx` - Updated button handler

## 🎯 What's Working

✅ Multi-step form with validation  
✅ Image upload to Strapi  
✅ Video upload to Strapi (optional)  
✅ Data storage in Firestore  
✅ Protected route (boarding owners only)  
✅ Browse page displays real posts  
✅ Images load from Strapi  
✅ Filtering and search  
✅ Responsive design

## 📚 Need More Help?

- Full documentation: `STRAPI_SETUP_INSTRUCTIONS.md`
- Implementation details: `POST_ADD_IMPLEMENTATION_GUIDE.md`
- Strapi docs: https://docs.strapi.io/
