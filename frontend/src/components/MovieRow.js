import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const[isMatched,setIsmatched]=useState(false);
  const navigate = useNavigate();
  // const [isSearching, setIsSearching] = useState(false);

  // Define an array of genres
  const genres = [
    'Action', 'Thriller', 'Romance', 'Family',
    'Sci-fi', 'Fantasy', 'Horror', 'Crime', 'Sports'
  ];

  // Function to handle search submission
  const handleSearch = async () => {
    
    if (searchQuery.trim() === '') {
      // If search query is empty, show default homepage
      setSearchResults([]);
      setIsmatched(false);
      // setIsSearching(false);
      return;
    }

    // Call backend API to search for movies
    try {
      console.log(`search=${searchQuery}`)
      // setIsSearching(true);
      const response = await fetch("http://localhost:4000/searchMovies",{
        method :'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({movieString:searchQuery}),
      });
      if(response.ok){
        const data = await response.json();
        setIsmatched(true);
        setSearchResults(data.movies);
        if(searchResults.length==0){
          setIsmatched(false);
        }
      }
      console.log(searchResults)      
    } catch (error) {
      console.error('Error searching for movies:', error);
      // Handle error
    }
  };

  return (
    <div style={styles.homePage}>
      {/* Search section */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      
      {isMatched?<div>
          {/* Display default homepage */}
          {searchResults.map((movie, index) => (
            <Nav key={movie}>
            <div style={styles.card}>
              <Nav.Link as={Link} to={`/movies/${movie._id}`}>
                <img src={movie.M_url} alt={movie.Mname} style={styles.image} />
              </Nav.Link>
              <div style={styles.details}>
                <h3 style={styles.title}>{movie.Mname}</h3>
                <p style={styles.genre}>Genre: {movie.genre_ids}</p>
                <p style={styles.rating}>Rating: {movie.rating}</p>
                {/* <button onClick={() => addWatchList(movie._id)}>Add To WatchList</button> */}
              </div>
            </div>
          </Nav>
          ))}
        </div>:<div>
          {/* Display default homepage */}
          {genres.map((genre, index) => (
            <div key={index} style={styles.genreSection}>
              <h2 style={styles.genreTitle}>{genre}</h2>
              <MovieCard genre={genre} /> {/* Pass genre as a prop to MovieCard */}
            </div>
          ))}
        </div>}
      
    </div>
  );
};

const styles = {
  homePage: {
    background: '#111', // Dark background color
    color: '#fff', // Light text color
    padding: '20px',
  },
  searchSection: {
    marginBottom: '20px',
  },
  genreSection: {
    marginBottom: '30px',
  },
  genreTitle: {
    fontSize: '24px',
    marginBottom: '10px',
  },
};

export default HomePage;
