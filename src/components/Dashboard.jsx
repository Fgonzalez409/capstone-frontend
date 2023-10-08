import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
// import getSavedParks from './getSavedParks';
import './Dashboard.css';

const Dashboard = () => {

  const [data, setData] = useState([]);//holds the list of national parks
  const [selectedPark, setSelectedPark] = useState('');//tracks current selected park
  // const [images, setImages] = useState([]);//stores images associated with selected park
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);//tracks index of selected image
  const [cachedData, setCachedData] = useState(null);  // Define a state variable to cache the fetched data
  const [parksData, setParksData] = useState([])//my saved parks 
  useEffect(()=>{
    // console.log(selectedPark,' hello selected park')
  },[selectedPark])

  const handleDropdown = (event) => {
    const selectedParkName = event.target.value;
    const selectedParkObject = data.find((park) => park.fullName === selectedParkName);
    setSelectedPark(selectedParkObject);
    fetchParkImages(selectedParkName);
  };



  useEffect(() => {
    const fetchData = async () => {
      // Check if data is already cached
      if (cachedData) {
        setData(cachedData);
      } else {
        try {
          const response = await axios.get(
            `https://developer.nps.gov/api/v1/parks?&api_key=yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG`
          );

          const fetchedData = response.data.data;

          // Cache the fetched data
          setCachedData(fetchedData);

          setData(fetchedData);
        } catch (error) {
          console.error('Error fetching park data:', error);
        }
      }
    };
    fetchData();
  }, [cachedData]);

  const fetchParkImages = (parkName) => {
    const selectedParkData = data.find((park) => park.fullName === parkName);

    if (selectedParkData && selectedParkData.images.length > 0) {
      setImages(selectedParkData.images);
      setSelectedImageIndex(0);
    } else {
      setImages([]);
    }
  };

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };

  const visitedPark = document.getElementById("selectedPark")



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



  const parksPerRow = 3; // Number of parks to display per row

  return (
    <>
      <div className="dashboard-container">
        <div className="park-list">
          {data.map((park, index) => (
            <div key={park.id} className="park-item">
              <img
                src={park.images[0].url} // Assuming the first image is used as a preview
                alt={`Park ${park.fullName}`}
                className="park-image"
              />
              <h3>{park.fullName}</h3>
              <button onClick={() => handleImageChange(index)}>View Images</button>
              {/* Add more details/buttons as needed */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default Dashboard;