import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
import './Dashboard.css';
import "./Map.css"
import Map from './Map';


const Dashboard = () => {
  const [data, setData] = useState([]);//Stores the list of parks fetched from the API.
  const [selectedPark, setSelectedPark] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [selectedImageDescription, setSelectedImageDescription] = useState('');
  const [comments, setComments] = useState('');



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
      const mainImage = park.images[0].url;
      const thumbnailImages = park.images.slice(1).map(image => image.url);
  
      setSelectedPark(park);
      setThumbnailImages(thumbnailImages);
      setSelectedImageIndex(0);
  
      if (park.images[0].title) {
        setSelectedImageDescription(park.images[0].title);
      } else {
        setSelectedImageDescription('No description available');
      }
    } else {
      // If the selected park has no images
      setSelectedPark(null);
      setMainImage(null);
      setThumbnailImages([]);
      setSelectedImageDescription('No images available');
    }
  
    setShowImages(true);
  };



  const handleCommentChange = (event, parkId) => {
    // Update the comments state for the specific park ID
    setComments((prevComments) => ({
      ...prevComments,
      [parkId]: event.target.value,
    }));
  };


  const submitComment = (parkId) => {
    // Get the comment for the specific park ID
    const comment = comments[parkId];
    
    // Handle the comment for the specific park (e.g., send it to the server, etc.)
    console.log(`Submitted Comment for Park ${parkId}:`, comment);
    
    // Clear the comment input field after submission
    setComments((prevComments) => ({
      ...prevComments,
      [parkId]: '', // Clear the comment for the specific park ID
    }));
  };
  


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
          alert("park saved successfully")
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
      <div className="Map"> <Map/></div>
      <div className="park-list">
        {data.map((park) => (
          <div key={park.id} className="park-item">
            <h3>{park.fullName}</h3>
            {/* <p>{park.parkCode}</p> */}
            <p>{park.description}</p>

            {park.images && park.images.length > 0 && (
              <img
                src={park.images[0].url}
                alt={`First Park`}
                className="first-park-image"
              />
            )}

            <div className="comment-box">
              {/* Input field for adding comments */}
              <input
                type="text"
                placeholder="Add your comment..."
                value={comments[park.id] || ''} // Use comments[park.id] as the value
                onChange={(event) => handleCommentChange(event, park.id)}
                className="comment-input"
              />
              {/* Button to submit comments */}
              <button onClick={() => submitComment(park.id)} className="comment-submit-button">
                Submit Comment
              </button>
            </div>

            {comments[park.id] && <p>Comment: {comments[park.id]}</p>}
              
          {showImages && selectedPark && selectedPark.id === park.id && (
              <div className="selected-park-images">
                  {mainImage && <img src={mainImage} alt={`Main Park`} className="main-image" />}
                  <p>{selectedImageDescription}</p>


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
            <button onClick={() => handleViewImages(park)}>View Images</button>
            <button onClick={() => savePark()}>Save Park</button>
          </div>
        ))}
      </div>
      
    </div>
  );
};
export default Dashboard; 