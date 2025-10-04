# Strapi Setup Instructions for Image Storage

This guide will help you set up Strapi as a backend for handling image and video uploads for the Post Add feature.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running PostgreSQL/MySQL/SQLite database (SQLite is easiest for development)

## Step 1: Install Strapi

Open a new terminal window (separate from your React app) and create a Strapi project:

```bash
# Navigate to a directory where you want to store Strapi (outside your React project)
cd ..

# Create a new Strapi project (using SQLite for simplicity)
npx create-strapi-app@latest gp-strapi --quickstart

# Or with specific database:
# npx create-strapi-app@latest gp-strapi
```

This will:

- Install Strapi
- Create a new project folder called `gp-strapi`
- Automatically start Strapi on `http://localhost:1337`

## Step 2: Create Admin Account

When Strapi starts for the first time, it will open your browser to `http://localhost:1337/admin`. Create your admin account:

- Username: (your choice)
- Email: (your email)
- Password: (secure password)

## Step 3: Configure API Token

1. In the Strapi admin panel, go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Configure:
   - Name: `React App Token`
   - Description: `Token for React frontend image uploads`
   - Token duration: `Unlimited`
   - Token type: `Full access` (or customize as needed)
4. Click **Save**
5. **IMPORTANT**: Copy the generated token immediately (you won't see it again)

## Step 4: Configure Upload Plugin

Strapi comes with a built-in upload plugin. You may need to configure it:

1. Go to **Settings** → **Media Library**
2. Configure settings:
   - **Responsive friendly upload**: Enable
   - **Size optimization**: Enable
   - **Auto orientation**: Enable

## Step 5: Set Up Environment Variables in React App

1. In your React project (`gp` folder), create a `.env` file:

```bash
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_token_from_step_3
```

2. Replace `your_token_from_step_3` with the actual token you copied

## Step 6: Configure CORS (if needed)

If you encounter CORS issues, update Strapi's CORS settings:

1. In your Strapi project, open `config/middlewares.js`
2. Update the CORS configuration:

```javascript
module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "http://localhost:5173"],
          "media-src": ["'self'", "data:", "blob:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:5173", "http://localhost:5174"], // Add your React app URLs
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
```

3. Restart Strapi after making changes

## Step 7: Configure Upload Permissions

1. In Strapi admin, go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Expand **Upload** permissions
4. Check the following permissions:
   - `upload` - Allow file upload
   - `find` - Allow finding files
   - `findOne` - Allow finding single file
5. Click **Save**

## Step 8: Test the Setup

1. Start Strapi (if not already running):

```bash
cd ../gp-strapi
npm run develop
```

2. Start your React app (in the original project):

```bash
cd "d:/Websites/Group Project/gp"
npm run dev
```

3. Try creating a post with image uploads

## Common Issues and Solutions

### Issue: "Request failed with status code 403"

**Solution**: Check that your API token is correctly set in `.env` and has proper permissions.

### Issue: "Network Error" or CORS error

**Solution**: Verify CORS configuration in `config/middlewares.js` and restart Strapi.

### Issue: Images not displaying

**Solution**:

- Check that Strapi is running on port 1337
- Verify the `VITE_STRAPI_URL` environment variable
- Check browser console for image URL issues

### Issue: "Cannot find module" errors in Strapi

**Solution**: Run `npm install` in the Strapi directory and restart.

## Production Deployment

For production:

1. **Strapi**:

   - Deploy to services like Heroku, AWS, DigitalOcean, or Railway
   - Use a production database (PostgreSQL recommended)
   - Configure cloud storage (AWS S3, Cloudinary, etc.) for media files

2. **React App**:
   - Update `VITE_STRAPI_URL` to your production Strapi URL
   - Ensure API token is kept secret (use environment variables)

## Strapi Project Structure

```
gp-strapi/
├── config/              # Configuration files
│   ├── middlewares.js   # CORS and security config
│   ├── database.js      # Database configuration
│   └── server.js        # Server configuration
├── public/              # Uploaded files stored here (in development)
│   └── uploads/         # Image and video uploads
├── src/
│   └── api/             # Your API endpoints
└── .env                 # Strapi environment variables
```

## Useful Strapi Commands

```bash
# Start Strapi in development mode
npm run develop

# Start Strapi in production mode
npm run start

# Build Strapi admin panel
npm run build

# Clear cache
npm run strapi clean
```

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi Upload Plugin](https://docs.strapi.io/dev-docs/plugins/upload)
- [Strapi API Tokens](https://docs.strapi.io/dev-docs/configurations/api-tokens)

## Security Notes

- **Never commit** `.env` files with actual tokens to version control
- **Use different tokens** for development and production
- **Regenerate tokens** if they are accidentally exposed
- **Configure proper permissions** for public vs authenticated routes
