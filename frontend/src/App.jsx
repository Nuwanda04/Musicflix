import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SongList from "./components/SongList/SongList";
import Pagination from "./components/Pagination/Pagination";
import Search from "./components/Search/Search";
import FormPage from "./pages/FormPage/FormPage";

import styles from "./App.module.css";

export default function App() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const searchText = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Get songs from the backend
  useEffect(() => {
    // Only run on the home page
    if (location.pathname !== "/") return;

    async function loadSongs() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/my-songs?page=${currentPage}&limit=20&search=${searchText}`
        );
        const data = await response.json();

        setSongs(data.songs || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error loading songs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSongs();
  }, [searchText, currentPage, location.pathname]);

  function handleSearch(value) {
    setSearchParams({ search: value, page: 1 });
  }

  function handlePageChange(newPage) {
    setSearchParams({ search: searchText, page: newPage });
  }

  const onHomePage = location.pathname === "/";
  const onAddPage = location.pathname === "/add-song";

  return (
    <div className={styles.container}>
      <h1>MusicFlix</h1>

      <div className={styles.tabs}>
        <Link to="/?page=1" className={onHomePage ? "active" : ""}>
          My Songs
        </Link>
        <Link to="/add-song" className={onAddPage ? "active" : ""}>
          Add Song
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Search searchTerm={searchText} setSearchTerm={handleSearch} />
              {loading ? (
                <p className={styles.loading}>Loading songs...</p>
              ) : (
                <SongList
                  songs={songs}
                  currentlyPlayingId={currentlyPlayingId}
                  setCurrentlyPlayingId={setCurrentlyPlayingId}
                />
              )}
              <Pagination
                page={currentPage}
                setPage={handlePageChange}
                totalPages={totalPages}
              />
            </>
          }
        />
        <Route path="/add-song" element={<FormPage />} />
      </Routes>
      
      <ToastContainer />
    </div>
  );
}
