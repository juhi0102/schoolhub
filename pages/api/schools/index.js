import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getPool } from '@/lib/db';

export const config = { api: { bodyParser: false } };

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
      ensureDirSync(uploadDir);

      const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
        uploadDir
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: 'Invalid form data' });
        }
        try {
          const name = String(fields.name || '').trim();
          const address = String(fields.address || '').trim();
          const city = String(fields.city || '').trim();
          const state = String(fields.state || '').trim();
          const email_id = String(fields.email_id || '').trim();
          const contact = Number(fields.contact || 0);

          // Basic validations (server-side)
          if (!name || !address || !city || !state || !email_id || !contact) {
            return res.status(422).json({ error: 'All fields are required' });
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email_id)) {
            return res.status(422).json({ error: 'Invalid email format' });
          }

          let imageRelPath = 'schoolImages/placeholder.png';
          let file = files.image;

          // Handle both array and single file cases
          if (Array.isArray(file)) file = file[0];

          if (file) {
          const ext = path.extname(file.originalFilename || file.filepath || '');
          const safeBase = (name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'school')
            .slice(0, 40);
          const finalName = `${Date.now()}-${safeBase}${ext || ''}`;
          const finalPath = path.join(uploadDir, finalName);
          fs.renameSync(file.filepath, finalPath);
          imageRelPath = path.posix.join('schoolImages', finalName);
          }


          const pool = getPool();
          await pool.execute(
            `INSERT INTO schools (name, address, city, state, contact, image, email_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, address, city, state, contact, imageRelPath, email_id]
          );

          return res.status(201).json({ ok: true, message: 'School added successfully' });
        } catch (e) {
          console.error(e);
          return res.status(500).json({ error: 'Server error' });
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Upload failed' });
    }
  } else if (req.method === 'GET') {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
      );
      return res.status(200).json({ data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to fetch schools' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
