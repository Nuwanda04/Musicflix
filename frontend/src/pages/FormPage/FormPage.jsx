import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./FormPage.module.css";

export default function FormPage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [artist, setArtist] = useState("");
  const [rating, setRating] = useState(1);
  const [duration, setDuration] = useState("");
  const [genres, setGenres] = useState("");
  const [poster, setPoster] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newSong = {
      title,
      year: year ? parseInt(year) : undefined,
      artist,
      rating: rating ? parseInt(rating) : 1,
      duration: duration ? parseInt(duration) : undefined,
      genre: genres ? genres.split(",").map((g) => g.trim()) : [],
      poster,
      audioUrl,
    };

    try {
      const res = await fetch("http://localhost:3000/my-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSong),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create song");
      }

      const data = await res.json();
      setMessage(`Song "${data.title}" has been created!`);
      toast.success(`✅ ${data.title} added!`, {
        position: "top-center",
        autoClose: 3000,
      });

      setTitle("");
      setYear("");
      setArtist("");
      setRating(1);
      setDuration("");
      setGenres("");
      setPoster("");
      setAudioUrl("");
    } catch (err) {
      setMessage(err.message);
      toast.error(`❌ ${err.message}`, {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Song</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            min={1920}
            max={2030}
          />
        </label>

        <label>
          Artist
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </label>

        <label>
          Rating (1-10)
          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>

        <label>
          Duration (seconds)
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>

        <label>
          Genres (comma-separated)
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            required
          />
        </label>

        <label>
          Poster URL
          <input
            type="text"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
          />
        </label>

        <label>
          Insert the song by taking the YouTube share link and converting it from
          <strong>https://www.youtube.com/watch?v=XXXXXX</strong> 
          to
          <strong>youtube/XXXXXX</strong>
          <input
            type="text"
            value={audioUrl}
            placeholder="youtube/XXXXXX"
            onChange={(e) => setAudioUrl(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Song"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
}
