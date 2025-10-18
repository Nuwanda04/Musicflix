import styles from "./Search.module.css";

export default function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="🔍 Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}
