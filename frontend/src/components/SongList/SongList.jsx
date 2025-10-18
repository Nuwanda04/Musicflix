import { motion } from "framer-motion";
import SongCard from "../SongCard/SongCard";
import styles from "./SongList.module.css";

export default function SongList({
  songs,
  currentlyPlayingId,
  setCurrentlyPlayingId,
}) {
  if (!songs.length) {
    return <p className={styles.empty}>No songs found.</p>;
  }

  return (
    <motion.div
      className={styles.grid}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {songs.map((song) => (
        <SongCard
          key={song._id}
          song={song}
          currentlyPlayingId={currentlyPlayingId}
          setCurrentlyPlayingId={setCurrentlyPlayingId}
        />
      ))}
    </motion.div>
  );
}
