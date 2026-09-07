require('dotenv').config()
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require("cors");

// const corsMiddleware = require('./middleware/cors')
const { uploadsDir } = require('./middleware/upload')
const pool = require('./database/db/db')

const collectionRoutes = require('./routes/collections')
const siteDetailsRoutes = require('./routes/siteDetails')
const adminDetailsRoutes = require('./routes/adminDetails')
const businessesRoutes = require('./routes/businesses')

const app = express()
const port = process.env.PORT || 3000

// const getAllowedOrigins = () => {
//   const baseUrl = process.env.BASE_URL;
//   console.log("BASE_URL:", baseUrl); // 👈 Add this to debug
//   if (!baseUrl) {
//     console.warn(
//       "⚠️ BASE_URL environment variable not set. CORS may not work properly in production.",
//     );
//     return ["http://localhost:3000", "http://localhost:3001"];
//   }
//   return Array.isArray(baseUrl) ? baseUrl : [baseUrl];
// };

// app.use(cors({ 
//   origin: getAllowedOrigins(), 
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (
      origin.endsWith(".vercel.app") ||   // ✅ allow all Vercel deployments
      origin.includes("localhost")        // ✅ allow local dev
    ) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir))

// Routes
app.get('/', (req, res) => res.send('Enquiry App backend'))
app.use('/api/collections', collectionRoutes)
app.use('/api/site-details', siteDetailsRoutes)
app.use('/api/admin-details', adminDetailsRoutes)
app.use('/api/businesses', businessesRoutes)

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Global error handler (catches multer and other errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({ success: false, error: 'File too large (max 50MB)' })
    }
    return res.status(400).json({ success: false, error: 'Upload error: ' + err.message })
  } else if (err) {
    return res.status(500).json({ success: false, error: 'Server error: ' + err.message })
  }
  next()
})

app.listen(port, () => {
  console.log(`Enquiry app listening on port ${port}`)
})
