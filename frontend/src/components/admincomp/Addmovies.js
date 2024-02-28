import React, { useState } from 'react';
import '../../index.css';

const Addmovies = () => {
  const [Mname, setMname] = useState('');
  const [genre_ids, setGenreIds] = useState([]);
  const [rating, setRating] = useState('');
  const [Overview, setOverview] = useState('');
  const [Popularity, setPopularity] = useState('');
  const [Release_date, setReleaseDate] = useState('');
  const [Original_language, setOriginalLanguage] = useState('');
  const [Trailer_url, setTrailerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  // Function to handle adding or removing genre values
  const handleAddGenre = (e, genre) => {
    e.preventDefault();
    // Check if the selected genre already exists in genre_ids
    const isSelected = genre_ids.includes(genre);

    // Toggle the selected genre
    if (isSelected) {
      // If the genre is already selected, remove it from genre_ids
      setGenreIds(genre_ids.filter((g) => g !== genre));
    } else {
      // If the genre is not selected, add it to genre_ids
      setGenreIds([...genre_ids, genre]);
    }
  };

  const handleSignup = async () => {
    try {
      const formData = new FormData();
      // Append file to FormData
      formData.append("file", file);
      // Append other form fields
      formData.append("Mname", Mname);
      formData.append("genre_ids", JSON.stringify(genre_ids)); // Convert array to JSON string
      formData.append("rating", rating);
      formData.append("Overview", Overview);
      formData.append("Popularity", Popularity);
      formData.append("Release_date", Release_date);
      formData.append("Original_language", Original_language);
      formData.append("Trailer_url", Trailer_url);

      setLoading(true);

      const response = await fetch('http://localhost:4000/moviesUpload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response contains the movie ID
        setSignupSuccess(true);
        setError('');
        console.log('Signup successful!');
        // Call a function to add the movie ID to the selected genres
        addMovieToGenres(data.movieId);
      } else {
        setSignupSuccess(false);
        setError('Signup failed. Please try again.');
        console.error('Signup failed');
      }
    } catch (error) {
      setSignupSuccess(false);
      setError(`Error during signup: ${error.message}`);
      console.error('Error during signup:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add movie ID to selected genres
  const addMovieToGenres = async (movieId) => {
    try {
      // Fetch the selected genres and add the movie ID to each genre
      for (const genreId of genre_ids) {
        const trimmedGenreId = genreId.split(/["[\]]/).join('');
        // console.log("trim="+trimmedGenreId)



        const response = await fetch('http://localhost:4000/addMovieToGenre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trimmedGenreId, movieId }),
        });
        if (!response.ok) {
          console.error(`Failed to add movie to genre with ID ${trimmedGenreId}`);
        }
      }
      console.log('Movie added to genres successfully');
    } catch (error) {
      console.error('Error adding movie to genres:', error.message);
    }
  };

  // Array of genre values
  const genres = [
    'Action', 'Thriller', 'Romance', 'Family',
    'Sci-fi', 'Fantasy', 'Horror', 'Crime', 'Sports'
  ];

  return (
    <div className="signup-container">
      <h1>Addmovies</h1><hr />
      <form className="signup-form">
        <div>
          <h4>File Upload</h4>
          <input type="file" onChange={(event) => setFile(event.target.files[0])} />
        </div>
        <label>Movie Name:</label>
        <input type="text" value={Mname} onChange={(e) => setMname(e.target.value)} />

        <label>Genre:</label>
        {/* Buttons to add genre values dynamically */}
        <div>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={(e) => handleAddGenre(e, genre)}
              style={{
                backgroundColor: genre_ids.includes(genre) ? '#4CAF50' : '#f2f2f2', // Change background color based on selection
                color: genre_ids.includes(genre) ? 'white' : 'black' // Change text color based on selection
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        <label>Rating:</label>
        <input type="Number" value={rating} onChange={(e) => setRating(e.target.value)} />

        <label>Overview:</label>
        <input type="text" value={Overview} onChange={(e) => setOverview(e.target.value)} />

        <label>Popularity:</label>
        <input type="Number" value={Popularity} onChange={(e) => setPopularity(e.target.value)} />

        <label>Release Date:</label>
        <input type="date" value={Release_date} onChange={(e) => setReleaseDate(e.target.value)} />

        <label>Original Language:</label>
        <input type="text" value={Original_language} onChange={(e) => setOriginalLanguage(e.target.value)} />

        <label>Trailer URL:</label>
        <input type="text" value={Trailer_url} onChange={(e) => setTrailerUrl(e.target.value)} />

        <button type="button" onClick={handleSignup} disabled={loading}>
          {loading ? 'Adding movies...' : 'Add movies'}
        </button>

        {signupSuccess && <p className="success-message">Signup successful!</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Addmovies;
