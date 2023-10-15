import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
// import getMySavedParks from './getMySavedParks';
import './Dashboard.css';

const Dashboard = () => {

  const [data, setData] = useState([]);//Stores the list of parks fetched from the API.
  const [selectedPark, setSelectedPark] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [cachedData, setCachedData] = useState(null);  // Define a state variable to cache the fetched data
  const [parksData, setParksData] = useState([])//my saved parks 





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://developer.nps.gov/api/v1/parks?&api_key=yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG`
        );
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching park data:', error);
      }
    };
    fetchData();
  }, []);

  const handleViewImages = (park) => {
    if (park.images && park.images.length > 0) {
      setMainImage(park.images[0].url);
      setThumbnailImages(park.images.slice(1).map(image => image.url));
    } else {
      setMainImage(null);
      setThumbnailImages([]);
    }
    setSelectedPark(park); // Update the selected park here
    setShowImages(true);
  };

  // const fetchParkImages = (parkName) => {
  //   const selectedParkData = data.find((park) => park.fullName === parkName);

  //   if (selectedParkData && selectedParkData.images.length > 0) {
  //     setImages(selectedParkData.images);
  //     setSelectedImageIndex(0);
  //   } else {
  //     setImages([]);
  //   }
  // };

  // const handleToggleSavedParks = async () => {
  //   try {
  //     const savedParks = await getMySavedParks(); // Fetch saved parks data
  //     setParksData(savedParks); // Update state with saved parks data
  //   } catch (error) {
  //     console.error('Error fetching saved parks:', error);
  //     // Handle error (e.g., show error message to the user)
  //   }
  //   setShowSavedParks(!showSavedParks); // Toggle showSavedParks state to display saved parks
  // };
  

  const getPark = async() => {
    const cookies = cookie.parse(document.cookie)
    console.log(cookies.token)
    try {
      const response = await axios.get('https://capstone-backend-blush.vercel.app/getParks',{
        headers:{
          Authorization:`Bearer ${cookies.token}`
        }
    })
    
      const saveParksData = response.data
      setParksData(saveParksData)
      console.log("saved parks dat", saveParksData)
  } catch(err)  {
      // console.error("Error retrieving", err)
      throw err
    }
  }

  const savePark = () => {
    const cookies = cookie.parse(document.cookie)
    if (selectedPark && cookies.token) {
      const { parkCode:parkCode } = selectedPark;
      axios
        .post('https://capstone-backend-blush.vercel.app/park', {
          parkCode,
          // Include any other data you want to save
        }, {
          headers:{
            Authorization:`Bearer ${cookies.token}`
          }
        })
        .then((response) => {
          console.log('Park saved successfully:', response.data);
          // You can provide feedback to the user here if needed
        })
        .catch((error) => {
          console.error('Error saving park:', error);
          // Handle the error and provide feedback to the user
        });
    } else {
      console.log('No park selected or user not logged in');
      // Provide feedback to the user that no park is selected or user not logged in
    }
  };

  return (
    <div className="dashboard-container">
      <div className="park-list">
        {data.map((park) => (
          <div key={park.id} className="park-item">
            <h3>{park.fullName}</h3>
            <button onClick={() => handleViewImages(park)}>View Images</button>
            <button onClick={() => savePark()}>Save Park</button>
          </div>
        ))}
      </div>

      {showImages && selectedPark && (
        <div className="selected-park-images">
          <h2>{selectedPark.fullName} Images</h2>
          {mainImage && <img src={mainImage} alt={`Main Park`} className="main-image" />}
          <div className="thumbnail-container">
            {thumbnailImages.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(thumbnail)}
                className="thumbnail"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Dashboard;