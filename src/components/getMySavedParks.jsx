import axios from 'axios'
import React, { useState, useEffect } from 'react';


const GetMySavedParks = () => {
  const [savedPark, setSavedPark] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://capstone-backend-blush.vercel.app/getSavedParks`)
      .then((response) => {
        const retrievedPark = response.data;
        console.log('Park retrieved successfully:', retrievedPark);
        console.log("API response", response)
        setSavedPark(retrievedPark);
      })
      .catch((error) => {
        console.error('Error retrieving park fe:', error);
        setError(error);
      });
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (error) {
    return <div>Error retrieving park: {error.message}</div>;
  }

  return (
    <div>
      {savedPark ? (
        <div id="park-info-container">
          <h2>{savedPark.name}</h2>
          <p>Park Code: {savedPark.parkCode}</p>
          {/* Display other park properties as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GetMySavedParks


  