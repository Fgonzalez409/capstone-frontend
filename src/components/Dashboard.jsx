import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleDropdown = (event) => {
    const selectedPark = event.target.value;
    setSelectedPark(selectedPark);
    fetchParkImages(selectedPark);
  };

  // Define a state variable to cache the fetched data
  const [cachedData, setCachedData] = useState(null);

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

  function savePark() {
    let p= document.getElementById("selectedPark")
    let value = p.value
    var text = p.options[p.selectedIndex].text

    console.log(text)
  }

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

      </div>

      <button onClick={savePark}>Click to save</button>
  </>
  );
};

export default Dashboard;





















