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


  

User
I need assistance with my code. I am trying to fetch the images to each respective national park when I click the "View Images" button. Nothing happens when I click the button. Could you assist? Here is my code below: import React, { useState, useEffect } from 'react';
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
      setShowImages(true);

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
ChatGPT
Your code seems to be mostly correct, but there are a few potential issues that could be causing the "View Images" button not to display the images as expected:

State Management: Ensure that the state variables related to images (showImages, mainImage, thumbnailImages, selectedImageDescription) are being updated correctly when the button is clicked.

Conditional Rendering: Check if the condition to render the selected park's images is correctly set and updated. You're already using showImages && selectedPark && selectedPark.id === park.id, which looks fine, but ensure that showImages is being toggled appropriately.

Event Handling: Confirm that the handleViewImages function is being called correctly when the "View Images" button is clicked.

Let's make some minor modifications to ensure these aspects are correctly handled:

javascript
Copy code
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
    setShowImages(true); // Make sure to set showImages to true when images are available
  } else {
    // If the selected park has no images
    setSelectedPark(null);
    setMainImage(null);
    setThumbnailImages([]);
    setSelectedImageDescription('No images available');
    setShowImages(false); // Ensure showImages is set to false when no images are available
  }
};
With this modification, showImages will be set to true only when there are images available for the selected park, and it will be set to false otherwise.

Make sure your handleViewImages function is called correctly when the "View Images" button is clicked, and that the state updates are reflected in the rendering. If these adjustments don't resolve the issue, further debugging might be needed to pinpoint the problem.

User
I've copied this code and am not getting a new error
ChatGPT
If the code I provided didn't resolve the issue, let's explore other potential causes:

Network Requests: Ensure that the network request to fetch park data is successful and that the park data contains the necessary image information.

Image Paths: Double-check that the image URLs fetched from the API are correct and accessible.

Rendering Logic: Verify that the conditional rendering logic for displaying the images is working as expected. Ensure that the state variables (showImages, mainImage, thumbnailImages, selectedImageDescription) are correctly set and updated.

Event Handling: Confirm that the handleViewImages function is being called correctly when the "View Images" button is clicked.

Let's try to isolate the issue further:

Console Logs: Add console logs in strategic places to see if the code execution reaches those points and what values the variables hold.

Error Handling: Implement error handling in the handleViewImages function and in the rendering logic to catch any potential errors.

Check API Response: Log the response from the API to ensure that it contains the expected park data, including image information.

Here's how you can implement these suggestions:

javascript
Copy code
const handleViewImages = (park) => {
  if (park.images && park.images.length > 0) {
    console.log("Park images:", park.images); // Log park images to check if they are available
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
    setShowImages(true); // Make sure to set showImages to true when images are available
  } else {
    // If the selected park has no images
    setSelectedPark(null);
    setMainImage(null);
    setThumbnailImages([]);
    setSelectedImageDescription('No images available');
    setShowImages(false); // Ensure showImages is set to false when no images are available
  }
};

console.log("Data:", data); // Log park data to check if it's available

// Add console logs in other relevant places as needed to track the flow and values of variables

With these console logs, you can check whether the park data and image information are being correctly retrieved, and whether the handleViewImages function is called appropriately. If you encounter any unexpected behavior or errors, the console logs will provide valuable information for further debugging.

User
This is the error displayed on the console
ChatGPT
If you're encountering an error in the console, it's crucial to investigate it to understand the root cause. Could you please provide the specific error message displayed in the console? Once I have more information about the error, I can assist you in diagnosing and fixing the issue.

User
TypeError: Cannot read properties of undefined (reading 'map')
    at index-1b61a764.js:74:2782
ChatGPT
The error message indicates that you're trying to call the map function on an undefined value. This commonly occurs when trying to map over an array that hasn't been properly initialized or when attempting to access properties of an undefined object.

Based on the error message and the line number provided (index-1b61a764.js:74:2782), it seems the issue is likely within the handleViewImages function or the subsequent rendering logic.

Here's the line of code causing the error:

javascript
Copy code
const thumbnailImages = park.images.slice(1).map(image => image.url);
To troubleshoot this issue:

Check Park Data: Ensure that the park object passed to handleViewImages function has a property named images and that it is an array.

Ensure Data Structure: Verify that park.images is initialized and contains the expected data structure before calling the map function on it. If park.images is undefined or null, attempting to call map on it will result in the error you encountered.

Error Handling: Implement error handling to gracefully handle cases where park.images is undefined or null. You can use conditional checks (if statements) or optional chaining (?.) to safely access properties and methods.

Here's an updated version of the handleViewImages function with added error handling:

javascript
Copy code
const handleViewImages = (park) => {
  if (park.images && park.images.length > 0) {
    console.log("Park images:", park.images); // Log park images to check if they are available
    const mainImage = park.images[0].url;
    const thumbnailImages = park.images.length > 1 ? park.images.slice(1).map(image => image.url) : [];

    setSelectedPark(park);
    setThumbnailImages(thumbnailImages);
    setSelectedImageIndex(0);

    if (park.images[0].title) {
      setSelectedImageDescription(park.images[0].title);
    } else {
      setSelectedImageDescription('No description available');
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
};
In this updated version, before calling map on park.images, it first checks if park.images.length is greater than 1 to ensure that map is only called when there are multiple images available. If park.images is undefined or empty, it sets thumbnailImages to an empty array to prevent the map function from being called on undefined.

User
I am getting this error index-635e54c0.js:40 TypeError: Cannot read properties of undefined (reading 'map')
    at index-635e54c0.js:74:2782
ChatGPT
The error message indicates that you're encountering an issue with accessing the map function on an undefined value. It appears that the problem persists despite the changes made. Let's try another approach to handle this error and ensure that the map function is called only when park.images is defined and an array.

Here's how you can update the handleViewImages function to handle this error:

javascript
Copy code
const handleViewImages = (park) => {
  if (park.images && park.images.length > 0) {
    console.log("Park images:", park.images); // Log park images to check if they are available
    const mainImage = park.images[0].url;
    let thumbnailImages = [];

    if (park.images.length > 1) {
      thumbnailImages = park.images.slice(1).map(image => image.url);
    }

    setSelectedPark(park);
    setThumbnailImages(thumbnailImages);
    setSelectedImageIndex(0);

    if (park.images[0].title) {
      setSelectedImageDescription(park.images[0].title);
    } else {
      setSelectedImageDescription('No description available');
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
};
In this updated version, I've added an additional check to ensure that the map function is only called on park.images.slice(1) when park.images is defined and its length is greater than 1. If park.images is undefined or its length is less than or equal to 1, thumbnailImages will remain an empty array.

Please give this a try and let me know if it resolves the issue or if you encounter any further errors.

User
I am getting the same error
ChatGPT
If you're still encountering the same error despite the updates, we need to dig deeper to find the root cause. The error message suggests that the issue might be related to accessing properties of an undefined value during the mapping operation.

To troubleshoot this further, let's add more console logs to pinpoint the exact source of the error and verify the structure of the park object and its images property.

Here's an updated version of the handleViewImages function with additional console logs:

javascript
Copy code
const handleViewImages = (park) => {
  console.log("Received park:", park); // Log the park object received
  if (park.images && park.images.length > 0) {
    console.log("Park images:", park.images); // Log park images to check if they are available
    const mainImage = park.images[0].url;
    let thumbnailImages = [];

    if (park.images.length > 1) {
      thumbnailImages = park.images.slice(1).map(image => image.url);
    }

    setSelectedPark(park);
    setThumbnailImages(thumbnailImages);
    setSelectedImageIndex(0);

    if (park.images[0].title) {
      setSelectedImageDescription(park.images[0].title);
    } else {
      setSelectedImageDescription('No description available');
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
};
By adding these logs, we'll be able to see the structure of the park object and whether the images property is defined or not. This will help us identify why the map function is failing.

Please run your code again with these additional logs and check the console for the output. Let me know what you find, and we can proceed from there to resolve the issue.

User
Ok the website is still crashing. These are the error logs: Received park: {id: '6DA17C86-088E-4B4D-B862-7C1BD5CF236B', url: 'https://www.nps.gov/acad/index.htm', fullName: 'Acadia National Park', parkCode: 'acad', description: 'Acadia National Park protects the natural beauty o…of hiking trails, and 45 miles of carriage roads.', …}
index-38b51555.js:113 Park images: (4) [{…}, {…}, {…}, {…}]0: {credit: 'NPS / Kristi Rugg', title: "Acadia's rocky coastline", altText: 'Large puffy clouds dot a brilliant blue sky as wave crash against the rocky coastline of Acadia.', caption: 'Millions of people come to Acadia for our distinctive rocky coastline.', url: 'https://www.nps.gov/common/uploads/structured_data/3C7B45AE-1DD8-B71B-0B7EE131C7DFC2F5.jpg'}1: {credit: 'NPS / Kristi Rugg', title: 'Heavy snow-laden trees', altText: 'Hiking tracks carved through three feet of snow wind through a heavy snow-laden forest.', caption: 'During the colder months snows transform our landscape into a winter wonderland.', url: 'https://www.nps.gov/common/uploads/structured_data/3C7B4BEC-1DD8-B71B-0B2CF833F93140FF.jpg'}2: {credit: 'NPS / Kristi Rugg', title: 'Sunset atop Cadillac Mountain', altText: 'A brilliant sunset filled with hues of blue, red, orange, magenta, and purple highlight the sky.', caption: 'As the tallest point on the eastern seaboard Cadillac Mountain provides fantastic viewpoints.', url: 'https://www.nps.gov/common/uploads/structured_data/3C7B477B-1DD8-B71B-0BCB48E009241BAA.jpg'}3: {credit: 'NPS / Kristi Rugg', title: 'Climbing The Precipice', altText: 'Two hikers ascend a sheer cliff trail by way of historic iron rung ladders.', caption: "Whether it's a stroll along Ocean Path or a diffic… Precipice, there are hiking trails for everyone!", url: 'https://www.nps.gov/common/uploads/structured_data/3C7B48F9-1DD8-B71B-0BD3B413E58978F8.jpg'}length: 4[[Prototype]]: Array(0)
index-38b51555.js:74 Park retrieved successfully: (21) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
index-38b51555.js:74 API response {data: Array(21), status: 200, statusText: '', headers: Qa, config: {…}, …}
index-38b51555.js:40 TypeError: Cannot read properties of undefined (reading 'map')
ChatGPT
Thank you for providing the logs. It seems like the issue is happening because the park.images array is defined, but one or more elements within it might be missing the expected properties (url, credit, title, etc.), which causes the map function to fail.

To address this issue, we need to ensure that each element in the park.images array has the necessary properties before attempting to access them. We can achieve this by adding additional checks within the handleViewImages function.

Here's how you can update the function to handle missing properties:

javascript
Copy code
const handleViewImages = (park) => {
  console.log("Received park:", park); // Log the park object received
  if (park.images && park.images.length > 0) {
    console.log("Park images:", park.images); // Log park images to check if they are available
    const mainImage = park.images[0].url;
    let thumbnailImages = [];

    // Filter images to ensure they have the required properties
    const validImages = park.images.filter(image => image.url);

    if (validImages.length > 1) {
      thumbnailImages = validImages.slice(1).map(image => image.url);
    }

    setSelectedPark(park);
    setThumbnailImages(thumbnailImages);
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