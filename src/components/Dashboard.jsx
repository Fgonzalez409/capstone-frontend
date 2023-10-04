import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
import './Dashboard.css';

const Dashboard = () => {

  const [data, setData] = useState([]);//holds the list of national parks
  const [selectedPark, setSelectedPark] = useState('');//tracks current selected park
  const [images, setImages] = useState([]);//stores images associated with selected park
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);//tracks index of selected image
  const [parksData, setParksData] = useState([])
  const [cachedData, setCachedData] = useState(null);  // Define a state variable to cache the fetched data

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



  const getPark = async(user_id) => {
    try {
      const response = await axios.post('https://capstone-backend-blush.vercel.app/getParks',{
      user_id,
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
      const { id:park_id } = selectedPark;
      axios
        .post('https://capstone-backend-blush.vercel.app/park', {
          park_id,
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
    <>
      <div className="dashboard-container">
        <select id="selectedPark" value={selectedPark} onChange={handleDropdown}>
          <option value="" disabled>Select a Park</option>
          {data.map((park, i) => (
            <option key={park.id} value={park.fullName}>
              {park.fullName}
            </option>
          ))}
        </select>

        {images.length > 0 && (
          <>
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className={index === selectedImageIndex ? 'selected' : ''}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
            <img
              src={images[selectedImageIndex].url}
              alt={`Selected Park`}
              className="park-image"
            />
          </>
        )}
        <button onClick={savePark}>Click to save</button>
        <br />
        <button onClick={getPark}>Cick to display parks</button>
        {console.log({getPark})}

        {parksData.length > 0 && (
          <div className='savedParks'>
            <h2>Saved Parks</h2>
              <ul>
                {parksData.map((park, index) => (
                  <li key={index}>
                    <strong>{park.fullName}</strong>
                  </li>
                ))}
              </ul>
          </div>
        )}
      </div>
  </>
  );
};

export default Dashboard;





















