import styles from "./Pagination.module.css";

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={styles.button}
      >
        Prev
      </button>

      <span className={styles.page}>
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={styles.button}
      >
        Next
      </button>
    </div>
  );
}
