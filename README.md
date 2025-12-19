# Portfolio App - Admin Panel Documentation

## Overview
This is a full-stack freelancing portfolio application built with Node.js, Express, MongoDB, and vanilla JavaScript. It includes a complete admin panel with JWT authentication for managing portfolio content.

## Features

### Frontend
- **Responsive Design**: Modern UI with gradient backgrounds, smooth animations, and mobile-friendly layout
- **Dynamic Portfolio**: All content loads from MongoDB API
- **Testimonials**: Client testimonials with star ratings and avatar initials
- **Contact Form**: Visitor messages saved to MongoDB
- **Sections**: Hero, About, Skills, Services, Projects (with category filters), Testimonials, Contact

### Backend API
- **Express.js Server**: RESTful API for all portfolio data
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **JWT Authentication**: Secure admin endpoints with token-based auth
- **Admin Routes**: Full CRUD operations for portfolio items
- **File Upload**: Multer integration for image uploads
- **Environment Configuration**: Secure config via `.env` file

### Admin Panel
- **Secure Login**: Username/password authentication with JWT token storage
- **Dashboard**: Tabbed interface for managing different portfolio sections
- **Profile Management**: Edit professional info, bio, contact details, social links
- **Skills Management**: Add/edit/delete skill categories and items
- **Services Management**: Create and manage freelance services with pricing
- **Projects Management**: Add portfolio projects with technologies and featured flag
- **Testimonials Management**: Manage client testimonials with ratings
- **Contact Messages**: View all visitor contact submissions
- **Responsive Layout**: Sidebar navigation with smooth transitions

## Getting Started

### Installation

1. Clone or extract the project
```bash
cd my-portfolio-app
```

2. Install dependencies
```bash
npm install
```

3. Ensure MongoDB is running locally:
```bash
mongod
# Or connect to MongoDB Atlas by updating MONGODB_URI in .env
```

4. Configure environment variables:
```bash
# Edit .env file with your credentials
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
PORT=3000
NODE_ENV=development
```

5. Start the server
```bash
npm start
# Or for development with auto-reload
npm run dev
```

6. Visit the application:
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## API Endpoints

### Public API

#### Get Portfolio Data
- `GET /api/profile` - Get profile information
- `GET /api/skills` - Get all skill categories
- `GET /api/services` - Get all services
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects only
- `GET /api/testimonials` - Get all testimonials
- `POST /api/contact` - Submit contact form

### Admin API (Requires JWT Token)

#### Authentication
- `POST /api/admin/login` - Get JWT token
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns: `{ "success": true, "token": "jwt_token_here" }`

#### File Upload
- `POST /api/admin/upload` - Upload image file
  - Requires: JWT token in Authorization header
  - Returns: `{ "success": true, "url": "/uploads/filename.jpg" }`

#### Profile Management
- `GET /api/admin/profile` - Get profile
- `POST /api/admin/profile` - Update profile

#### Skills Management
- `GET /api/admin/skills` - Get all skills
- `POST /api/admin/skills` - Add skill
- `PUT /api/admin/skills/:id` - Update skill
- `DELETE /api/admin/skills/:id` - Delete skill

#### Services Management
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Add service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

#### Projects Management
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Add project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

#### Testimonials Management
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Add testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial

#### Contact Messages
- `GET /api/admin/contacts` - Get all contact submissions

## Database Models

### Profile
```javascript
{
  name: String,
  title: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  profileImage: String,
  social: {
    github: String,
    linkedin: String,
    twitter: String
  }
}
```

### SkillGroup
```javascript
{
  category: String,
  items: [String]
}
```

### Service
```javascript
{
  id: String,
  title: String,
  description: String,
  price: Number,
  features: [String]
}
```

### Project
```javascript
{
  id: String,
  title: String,
  description: String,
  category: String,
  image: String,
  technologies: [String],
  link: String,
  github: String,
  featured: Boolean
}
```

### Testimonial
```javascript
{
  id: String,
  client: String,
  company: String,
  message: String,
  rating: Number,
  image: String
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: Date
}
```

## Project Structure

```
my-portfolio-app/
├── server.js                 # Express server with MongoDB integration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (local)
├── .env.example              # Environment template
├── data.json                 # Initial seed data
│
├── models/                   # Mongoose schemas
│   ├── Profile.js
│   ├── SkillGroup.js
│   ├── Service.js
│   ├── Project.js
│   ├── Testimonial.js
│   └── Contact.js
│
├── routes/                   # API routes
│   └── admin.js              # Admin CRUD endpoints with auth
│
├── middleware/               # Express middleware
│   └── auth.js               # JWT verification
│
└── public/                   # Frontend static files
    ├── index.html            # Main portfolio page
    ├── admin.html            # Admin dashboard
    ├── script.js             # Portfolio JavaScript
    ├── style.css             # Portfolio styles
    └── uploads/              # User-uploaded files
```

## Security

- **JWT Tokens**: Admin routes protected with JWT authentication
- **Token Expiration**: Tokens expire after 24 hours
- **Password Hashing**: Passwords can be hashed with bcryptjs (implementation ready)
- **CORS Ready**: Easily configurable for cross-origin requests
- **Environment Secrets**: Sensitive data stored in `.env` (not in git)

## Deployment

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get connection string from Atlas dashboard
3. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

### Hosting Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo directly
- **Render**: Deploy with free tier
- **Vercel** (frontend only): Deploy `/public` as static site

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- For Atlas: Whitelist your IP and use correct credentials

### Admin Login Issues
- Check ADMIN_USERNAME and ADMIN_PASSWORD in `.env`
- Clear browser localStorage and try again
- Check server console for JWT errors

### File Upload Not Working
- Ensure `/public/uploads` directory exists
- Check file size limit (default 5MB)
- Verify proper Authorization header is sent

### CORS Issues
- Add CORS middleware to server.js if needed:
  ```javascript
  const cors = require('cors');
  app.use(cors());
  ```

## Development

### Watch Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

### Database Seeding
Database automatically seeds from `data.json` on first run if collections are empty. To reseed:
1. Delete the MongoDB database
2. Restart the server


## License
MIT
