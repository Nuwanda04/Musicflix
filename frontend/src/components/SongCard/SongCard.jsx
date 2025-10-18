import { useRef, useEffect, useState } from "react";
import { MediaPlayer, MediaProvider, isYouTubeProvider } from "@vidstack/react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import styles from "./SongCard.module.css";

export default function SongCard({ song, currentlyPlayingId, setCurrentlyPlayingId }) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  
  // Check if THIS song is the one currently playing
  const isThisSongPlaying = currentlyPlayingId === song._id;

  // Format duration from seconds to minutes:seconds
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Add a 0 in front if seconds is less than 10
    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  // YouTube setup
  function setupYouTube(provider) {
    if (isYouTubeProvider(provider)) {
      provider.cookies = true;
    }
  }

  // If another song starts, pause this one
  useEffect(() => {
    if (!isThisSongPlaying && playing) {
      const player = playerRef.current;
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
      setPlaying(false);
    }
  }, [isThisSongPlaying, playing]);

  // Play or stop the song
  async function togglePlay() {
    const player = playerRef.current;
    
    if (!player) {
      return;
    }

    // Stop if already playing
    if (playing) {
      player.pause();
      player.currentTime = 0;
      setPlaying(false);
      setCurrentlyPlayingId(null);
      toast.info(`⏹ Stopped`, { position: "bottom-right", autoClose: 2000 });
      return;
    }

    // Start playing
    setCurrentlyPlayingId(song._id);
    setPlaying(true);

    try {
      await player.play();
      toast.info(`🎵 ${song.title}`, { position: "bottom-right", autoClose: 3000 });
    } catch (err) {
      toast.error(`Failed to play`, { position: "bottom-right", autoClose: 2000 });
      setPlaying(false);
      setCurrentlyPlayingId(null);
    }
  }

  // Reset when song ends
  function onSongEnd() {
    setPlaying(false);
    setCurrentlyPlayingId(null);
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {song.poster ? (
        <img src={song.poster} alt={song.title} className={styles.poster} />
      ) : (
        <div className={styles.noPoster}>No poster</div>
      )}

      <div className={styles.content}>
        <h3>{song.title}</h3>

        {song.artist && (
          <p className={styles.artist}>
            <span className={styles.label}>Artist:</span> {song.artist}
          </p>
        )}

        <div className={styles.playerContainer}>
          <MediaPlayer
            ref={playerRef}
            src={song.audioUrl}
            className={styles.player}
            viewType="audio"
            onProviderChange={setupYouTube}
            onEnded={onSongEnd}
          >
            <MediaProvider />
            <div className={styles.controls}>
              <button className={styles.playButton} onClick={togglePlay}>
                {playing ? "⏹" : "▶"}
              </button>
            </div>
          </MediaPlayer>
        </div>

        <div className={styles.details}>
          {song.year && (
            <p>
              <span className={styles.label}>Year:</span> {song.year}
            </p>
          )}
          
          {song.duration && (
            <p>
              <span className={styles.label}>Duration:</span> {formatTime(song.duration)}
            </p>
          )}
          
          {song.genre && (
            <p className={styles.genres}>
              <span className={styles.label}>Genre:</span> {song.genre.join(", ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
