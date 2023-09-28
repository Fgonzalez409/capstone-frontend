import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import "./Dashboard.css"


const Dashboard = () => {
  const [data,setData] = useState([])
  const [selectedPark, setSelectedPark] = useState("")
  const [parks, setParks] = useState([])
  const [images, setImages] = useState("")//stores the images for the selected park
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)//index of selected Image

  const handleDropdown = (event) => {
    const selectedPark = event.target.value
    setSelectedPark(selectedPark)
    fetchParkImages(selectedPark)
  }
    
    

    useEffect(() => {
      axios
        .get("https://developer.nps.gov/api/v1/parks?&api_key=yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG")
        .then((response) => {
          console.log(response.data.data)
          setData(response.data.data)
        })
        .catch((error) => {
          console.log("ERROR", error)
        })
    }, [])

  const fetchParkImages = (parkName) => {

    const selectedParkData = data.find((park) => park.fullName === parkName);

    if (selectedParkData && selectedParkData.images.length > 0) {
      // Set all images for the selected park
      setImages(selectedParkData.images);
      // Select the first image by default
      setSelectedImageIndex(0);
    } else {
      setImages([]); // Clear the images if no images are found for the park
    }
  }

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };



  return (
    <div className="dashboard-container">
      <select value={selectedPark} onChange={handleDropdown}>
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
  );
}

export default Dashboard