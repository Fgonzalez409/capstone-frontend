import axios from 'axios'
import React, { useState, useEffect } from 'react';


const GetMySavedParks = (props) => {
  const {token} = props
  const [savedPark, setSavedPark] = useState(null);
  const [error, setError] = useState(null);

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
        console.log("API response", response)
        setSavedPark(retrievedPark);
      })
      .catch((error) => {
        console.error('Error retrieving park :', error);
        setError(error);
      });
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (error) {
    return <div>Error retrieving park: {error.message}</div>;
  }

  return (
    <div>
      {savedPark ? (
        <div>
          {savedPark.map((park, index) => (
            <div key={index} id="park-info-container">
              
              <p>Park Code: {park.park_id}</p>
              <div>
                {/* Access images from savedParks here */}
                {savedParks.find((savedPark) => savedPark.id === park.park_id) ?.images.map((image, imageIndex) => (
                    <img key={imageIndex} src={image.url} alt={`Park Image ${imageIndex}`}/>
                ))}
              </div>
              {/* Display other park properties as needed */}
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GetMySavedParks


  