import mysql from "mysql2/promise";
import multer from "multer";
import nextConnect from "next-connect";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "schoolImages"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function connectDB() {
  return mysql.createPool({
    host: "localhost",
    user: "root",
    password: "yourpassword",
    database: "schoolhub",
  });
}

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("image"));

apiRoute.post(async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;
    let imagePath = "schoolImages/placeholder.png";

    if (req.file) {
      imagePath = `schoolImages/${req.file.filename}`;
    }

    const db = await connectDB();
    await db.query(
      "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, imagePath, email_id]
    );

    res.status(200).json({ success: true, message: "School added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
