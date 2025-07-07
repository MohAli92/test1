# Environment Variables Setup

## 📁 ملف `.env` للـ **Server** (في مجلد `server/`)

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

## 📁 ملف `.env` للـ **Client** (في مجلد `client/`)

```env
# API URL - Leave empty for auto-detection
# REACT_APP_API_URL=
```

## 🔧 شرح المتغيرات

### Server Variables

#### **MongoDB Configuration**
- `MONGO_URI`: رابط الاتصال بقاعدة البيانات MongoDB Atlas
- **مطلوب:** نعم
- **مثال:** `mongodb+srv://username:password@cluster.mongodb.net/database`

#### **JWT Configuration**
- `JWT_SECRET`: مفتاح سري لتوقيع JWT tokens
- **مطلوب:** نعم
- **ملاحظة:** غيّر هذا في الإنتاج

#### **Cloudinary Configuration**
- `CLOUDINARY_CLOUD_NAME`: اسم الحساب في Cloudinary
- `CLOUDINARY_API_KEY`: مفتاح API
- `CLOUDINARY_API_SECRET`: السر الخاص بـ API
- **مطلوب:** نعم (لرفع الصور)

#### **Server Configuration**
- `PORT`: البورت الذي يعمل عليه الـ server
- `NODE_ENV`: بيئة التشغيل (development/production)
- **مطلوب:** لا (قيم افتراضية)

#### **CodeSpaces Configuration**
- `CODESPACES`: هل يعمل على GitHub CodeSpaces
- **مطلوب:** لا
- **قيم:** true/false

### Client Variables

#### **API Configuration**
- `REACT_APP_API_URL`: عنوان الـ API (اختياري)
- **ملاحظة:** إذا تركته فارغ، سيتم الاكتشاف التلقائي

## 🚀 كيفية الإعداد

### 1. للبيئة المحلية (Local Development)
```env
# Server
MONGO_URI=mongodb://localhost:27017/share-dish
JWT_SECRET=your-local-secret-key
PORT=5000
NODE_ENV=development
CODESPACES=false

# Client
# REACT_APP_API_URL= (اتركه فارغ للاكتشاف التلقائي)
```

### 2. للبيئة السحابية (Cloud/CodeSpaces)
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

### 3. للإنتاج (Production)
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

## 🔒 ملاحظات الأمان

1. **لا تشارك ملفات `.env`** في Git
2. **غيّر JWT_SECRET** في الإنتاج
3. **استخدم كلمات مرور قوية** لقاعدة البيانات
4. **احمِ مفاتيح Cloudinary** API

## 🐛 استكشاف الأخطاء

### إذا لم يعمل الاتصال بقاعدة البيانات:
- تحقق من `MONGO_URI`
- تأكد من أن IP مسموح في MongoDB Atlas

### إذا لم تعمل المصادقة:
- تحقق من `JWT_SECRET`
- تأكد من أن الـ token يتم إرساله

### إذا لم تعمل رفع الصور:
- تحقق من إعدادات Cloudinary
- تأكد من صحة API keys 