const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const Profile = require('../models/Profile');
const SkillGroup = require('../models/SkillGroup');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');

const router = express.Router();

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Upload endpoint
router.post('/admin/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const uploadsDir = path.join(__dirname, '../public/uploads');
    const originalPath = path.join(uploadsDir, req.file.filename);

    // Ensure filename components
    const ext = path.extname(req.file.filename);
    const base = path.basename(req.file.filename, ext);

    // Large resized image (max width 1200)
    const largeFilename = `${base}_lg${ext}`;
    const largePath = path.join(uploadsDir, largeFilename);
    await sharp(originalPath)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .toFile(largePath);

    // Thumbnail (max width 400)
    const thumbFilename = `${base}_thumb${ext}`;
    const thumbPath = path.join(uploadsDir, thumbFilename);
    await sharp(originalPath)
      .rotate()
      .resize({ width: 400, withoutEnlargement: true })
      .toFile(thumbPath);

    // Optionally remove original to save space (keep for now)

    // Return large image URL and thumbnail URL
    const largeUrl = `/uploads/${largeFilename}`;
    const thumbUrl = `/uploads/${thumbFilename}`;
    res.json({ success: true, url: largeUrl, thumb: thumbUrl });
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// Profile CRUD
router.get('/admin/profile', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/profile', verifyToken, async (req, res) => {
  try {
    await Profile.deleteMany();
    const profile = await Profile.create(req.body);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Skills CRUD
router.get('/admin/skills', verifyToken, async (req, res) => {
  try {
    const skills = await SkillGroup.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/skills', verifyToken, async (req, res) => {
  try {
    const skill = await SkillGroup.create(req.body);
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/admin/skills/:id', verifyToken, async (req, res) => {
  try {
    const skill = await SkillGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/skills/:id', verifyToken, async (req, res) => {
  try {
    await SkillGroup.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Services CRUD
router.get('/admin/services', verifyToken, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/services', verifyToken, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/admin/services/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/services/:id', verifyToken, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects CRUD
router.get('/admin/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/projects', verifyToken, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/admin/projects/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/projects/:id', verifyToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Testimonials CRUD
router.get('/admin/testimonials', verifyToken, async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/testimonials', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/admin/testimonials/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/testimonials/:id', verifyToken, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contacts
router.get('/admin/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
