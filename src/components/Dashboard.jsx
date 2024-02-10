import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from "cookie"
import GetMySavedParks from './getMySavedParks';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [token, setToken] = useState('');



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
    const cookies = cookie.parse(document.cookie);
    setToken(cookies.token || '');
  }, []);


  const handleViewImages = (park) => {
    try {
      console.log("Received park:", park); // Log the park object received
      if (park.images && park.images.length > 0) {
        console.log("Park images:", park.images); // Log park images to check if they are available
        const mainImage = park.images[0].url;
        let thumbnailImages = [];
  
        // Filter images to ensure they have the required properties
        const validImages = park.images.filter(image => image && image.url);
  
        if (validImages.length > 1) {
          thumbnailImages = validImages.slice(1).map(image => image.url);
        }
  
        setSelectedPark(park);
        if (Array.isArray(thumbnailImages)) { // Ensure thumbnailImages is an array
          setThumbnailImages(thumbnailImages);
        } else {
          setThumbnailImages([]);
        }
        setSelectedImageIndex(0);
  
        if (validImages.length > 0) {
          setSelectedImageDescription(validImages[0].title || 'No description available');
        } else {
          setSelectedImageDescription('No images available');
        }
        setShowImages(true); // Make sure to set showImages to true when images are available
      } else {
        // If the selected park has no images
        setSelectedPark(null);
        setMainImage(null);
        setThumbnailImages([]);
        setSelectedImageDescription('No images available');
        setShowImages(false); // Ensure showImages is set to false when no images are available
      }
    } catch (error) {
      console.error("Error in handleViewImages:", error);
    }
  };
  



  const handleCommentChange = (event, parkId) => {
    // Update the comments state for the specific park ID
    setComments((prevComments) => ({
      ...prevComments,
      [parkId]: event.target.value,
    }));
  };



  const saveComment = (parkId) => {
    const cookies = cookie.parse(document.cookie)
    const comment = comments[parkId]
    const { parkCode:parkCode } = selectedPark;
    axios
        .post('https://capstone-backend-blush.vercel.app/comments', {
          parkCode,
          comment,
        }, {
          headers:{
            Authorization:`Bearer ${cookies.token}`
          }
        })
        .then((response) => {
          console.log('Comment saved successfully:', response.data);
          alert("Comment saved successfully")
        })
        .catch((error) => {
          console.error('Error saving comment:', error);
        });
  };

// console.log(comments)

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
              <input
                type="text"
                placeholder="Add your comment..."
                value={comments[park.id] || ''} // Use comments[park.id] as the value
                onChange={(event) => handleCommentChange(event, park.id)}
                className="comment-input"
              />
              {/* Button to submit comments */}
              <button onClick={() => saveComment(park.id)} className="comment-submit-button">
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
                  {/*Pass images to getMySavedParks component*/}
                  <GetMySavedParks token={token} savedParks={data}/>
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