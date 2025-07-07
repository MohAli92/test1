# Environment Variables Setup

## 📁 `.env` file for **Server** (in `server/` folder)

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://admin:M123456M@cluster0.7wmwaer.mongodb.net/foodshare?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=dhqi68qck
CLOUDINARY_API_KEY=883382227937463
CLOUDINARY_API_SECRET=g_5hwXcqQ-EQopcJrL4bJ3_v8Ds

# Server Configuration
PORT=5000
NODE_ENV=development

# CodeSpaces Configuration
CODESPACES=false
```

## 📁 `.env` file for **Client** (in `client/` folder)

```env
# API URL - Leave empty for auto-detection
# REACT_APP_API_URL=
```

## 🔧 Variable Explanation

### Server Variables

#### **MongoDB Configuration**
- `MONGO_URI`: MongoDB Atlas database connection link
- **Required:** Yes
- **Example:** `mongodb+srv://username:password@cluster.mongodb.net/database`

#### **JWT Configuration**
- `JWT_SECRET`: Secret key for signing JWT tokens
- **Required:** Yes
- **Note:** Change this in production

#### **Cloudinary Configuration**
- `CLOUDINARY_CLOUD_NAME`: Account name in Cloudinary
- `CLOUDINARY_API_KEY`: API key
- `CLOUDINARY_API_SECRET`: API secret
- **Required:** Yes (for image uploads)

#### **Server Configuration**
- `PORT`: Port on which the server runs
- `NODE_ENV`: Operating environment (development/production)
- **Required:** No (default values)

#### **CodeSpaces Configuration**
- `CODESPACES`: Whether running on GitHub CodeSpaces
- **Required:** No
- **Values:** true/false

### Client Variables

#### **API Configuration**
- `REACT_APP_API_URL`: API address (optional)
- **Note:** If left empty, automatic detection will be used

## 🚀 How to Setup

### 1. For Local Environment (Local Development)
```env
# Server
MONGO_URI=mongodb://localhost:27017/share-dish
JWT_SECRET=your-local-secret-key
PORT=5000
NODE_ENV=development
CODESPACES=false

# Client
# REACT_APP_API_URL= (leave empty for automatic detection)
```

### 2. For Cloud Environment (Cloud/CodeSpaces)
```env
# Server
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret-key
PORT=5000
NODE_ENV=production
CODESPACES=true

# Client
REACT_APP_API_URL=https://your-codespace-url-5000.app.github.dev
```

### 3. For Production
```env
# Server
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=very-secure-production-secret-key
PORT=5000
NODE_ENV=production
CODESPACES=false

# Client
REACT_APP_API_URL=https://your-production-api.com
```

## 🔒 Security Notes

1. **Don't share `.env` files** in Git
2. **Change JWT_SECRET** in production
3. **Use strong passwords** for the database
4. **Protect Cloudinary** API keys

## 🐛 Troubleshooting

### If database connection doesn't work:
- Check `MONGO_URI`
- Make sure IP is allowed in MongoDB Atlas

### If authentication doesn't work:
- Check `JWT_SECRET`
- Make sure the token is being sent

### If image upload doesn't work:
- Check Cloudinary settings
- Make sure API keys are correct 