require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const Profile = require('./models/Profile');
const SkillGroup = require('./models/SkillGroup');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Testimonial = require('./models/Testimonial');
const Contact = require('./models/Contact');

const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Admin routes
app.use('/api', adminRoutes);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabaseIfEmpty();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Seed DB from data.json if collections are empty
async function seedDatabaseIfEmpty() {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) return;
    const raw = fs.readFileSync(dataPath);
    const data = JSON.parse(raw);

    const profileCount = await Profile.countDocuments();
    if (profileCount === 0 && data.profile) {
      await Profile.create(data.profile);
      console.log('Seeded Profile');
    }

    const skillsCount = await SkillGroup.countDocuments();
    if (skillsCount === 0 && Array.isArray(data.skills)) {
      await SkillGroup.insertMany(data.skills);
      console.log('Seeded Skills');
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0 && Array.isArray(data.services)) {
      await Service.insertMany(data.services);
      console.log('Seeded Services');
    }

    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0 && Array.isArray(data.projects)) {
      await Project.insertMany(data.projects);
      console.log('Seeded Projects');
    }

    const testimonialsCount = await Testimonial.countDocuments();
    if (testimonialsCount === 0 && Array.isArray(data.testimonials)) {
      await Testimonial.insertMany(data.testimonials);
      console.log('Seeded Testimonials');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// API Routes (query MongoDB)

// Get profile
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await SkillGroup.find().lean();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().lean();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().lean();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured projects only
app.get('/api/projects/featured', async (req, res) => {
  try {
    const featured = await Project.find({ featured: true }).lean();
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().lean();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle contact form submission (persist to DB)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await Contact.create({ name, email, subject, message });
    console.log('Saved contact submission to DB:', { name, email, subject });
    res.json({ success: true, message: 'Successfully submitted and we will reach you within 24 hour' });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Handle all other routes with index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✨ Portfolio server is running on http://localhost:${PORT}`);
  console.log(`📁 API endpoints available at http://localhost:${PORT}/api/*`);
});
