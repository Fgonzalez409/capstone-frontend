import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
// import getSavedParks from './getSavedParks';
import './Dashboard.css';

const Dashboard = () => {

  const [data, setData] = useState([]);//holds the list of national parks
  const [selectedPark, setSelectedPark] = useState('');//tracks current selected park
  const [showImages, setShowImages] = useState([]);//stores images associated with selected park
  const [images, setImages] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);//tracks index of selected image
  const [cachedData, setCachedData] = useState(null);  // Define a state variable to cache the fetched data
  const [parksData, setParksData] = useState([])//my saved parks 

  useEffect(()=>{
    // console.log(selectedPark,' hello selected park')
  },[selectedPark])





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
    setSelectedPark(park);
    fetchParkImages(park.fullName);
    setShowImages(true);
  };


  const fetchParkImages = (parkName) => {
    const selectedParkData = data.find((park) => park.fullName === parkName);

    if (selectedParkData && selectedParkData.images.length > 0) {
      setImages(selectedParkData.images);
      setSelectedImageIndex(0);
    } else {
      setImages([]);
    }
  };

  // const handleImageChange = (park) => {
  //   setSelectedPark(park);
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
          </div>
        ))}
      </div>

      {showImages && selectedPark && (
        <div className="selected-park-images">
          <h2>{selectedPark.fullName} Images</h2>
          {images.length > 0 ? (
            <img src={images[selectedImageIndex].url} alt={`Park ${selectedImageIndex + 1}`} />
          ) : (
            <p>No images available for this park.</p>
          )}
        </div>
      )}
    </div>
  );
};


export default Dashboard;