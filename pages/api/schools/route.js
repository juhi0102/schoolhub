// pages/api/schools.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Setup MySQL connection
async function connectDB() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "schoolhub",
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: "Error parsing form" });
        }

        // Handle uploaded image
        let filename = "placeholder.png"; // default
        if (files.image) {
          const oldPath = files.image.filepath;
          filename =
            Date.now() + "_" + files.image.originalFilename.replace(/\s+/g, "_");
          const newPath = path.join(process.cwd(), "public/schoolImages", filename);

          // Move file
          fs.renameSync(oldPath, newPath);
        }

        // Extract fields
        const { name, email_id, address, city, state, contact } = fields;

        // Save into DB
        const db = await connectDB();
        await db.execute(
          "INSERT INTO schools (name, email_id, address, city, state, contact, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, email_id, address, city, state, contact, filename]
        );

        res.status(200).json({ message: "School added successfully!" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const db = await connectDB();
      const [rows] = await db.execute("SELECT * FROM schools");
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
