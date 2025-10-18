const express = require("express"); // Importerer Express framework til server
const mongoose = require("mongoose"); // Importerer Mongoose til MongoDB
const cors = require("cors"); // Importerer CORS Middleware
require("dotenv").config(); // Loader miljøvariabler fra .env

const MySong = require("./models/my_songs"); // Importerer MySong model
const app = express();

// Middleware
app.use(cors()); // Aktiverer CORS
app.use(express.json()); // Aktiverer JSON parsing

// MongoDB connection
mongoose
  .connect(process.env.URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ----------------- MySongs CRUD Endpoints ----------------------

// CREATE
app.post("/my-songs", async (req, res) => {
  try {
    const song = new MySong(req.body);
    const saved = await song.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// BULK CREATE
app.post("/my-songs/bulk", async (req, res) => {
  try {
    const songs = req.body;
    
    if (!Array.isArray(songs)) {
      return res.status(400).json({ message: "Request body must be an array" });
    }

    const savedSongs = await MySong.insertMany(songs);
    res.status(201).json({
      message: `Added ${savedSongs.length} songs`,
      songs: savedSongs
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ
app.get("/my-songs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};
    const total = await MySong.countDocuments(query);
    const songs = await MySong.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalPages = Math.ceil(total / limit);

    res.json({ songs, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/my-songs/:id", async (req, res) => {
  try {
    const updated = await MySong.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
app.delete("/my-songs/:id", async (req, res) => {
  try {
    await MySong.findByIdAndDelete(req.params.id);
    res.json({ message: "Sangen er blevet slettet" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
