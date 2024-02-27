import axios from 'axios'
import React, { useState, useEffect } from 'react';


const GetMySavedParks = (props) => {
  const {token} = props
  const [savedPark, setSavedPark] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("This is the saved park data", savedPark);
  }, [savedPark]); // Run this effect whenever savedPark changes
  
  useEffect(() => {
    axios
      .get(`https://capstone-backend-blush.vercel.app/getSavedParks`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then((response) => {
        const retrievedPark = response.data;
        console.log('Park retrieved successfully:', retrievedPark);
        console.log("API response", response);
        setSavedPark(retrievedPark);
      })
      .catch((error) => {
        console.error('Error retrieving park:', error);
        setError(error);
      });
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (error) {
    return <div>Error retrieving park: {error.message}</div>;
  }

  return (
  <div>
    <h2>These are the parks you have visited!</h2>
    {savedPark ? (

      savedPark.map((park, index) => (
        <div key={index}>
          {/* Render park information here */}
          <p>Park Code: {park.park_id}</p>
          {/* Render other park details as needed */}
        </div>
      ))
    ) : (
      <div>Loading...</div>
    )}
  </div>
);
};

export default GetMySavedParks


  