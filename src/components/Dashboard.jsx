import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import "./Dashboard.css"


const Dashboard = () => {
  const [data,setData] = useState([])
  const [selectedPark, setSelectedPark] = useState("")
  const [parks, setParks] = useState([])
  const [image, setImage] = useState("")

  const handleDropdown = (event) => {
    const selectedPark = event.target.value
    setSelectedPark(selectedPark)
    fetchParkImage(selectedPark)
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

  const fetchParkImage = (parkName) => {

    const selectedParkData = data.find((park) => park.fullName === parkName)

    if(selectedParkData && selectedParkData.images.length > 0){
      const firstImage = selectedParkData.images[0]
      setImage(firstImage.url)
    }else {
      setImage("No image to display")
    }

    
  }


  return (  
    <>
      <select value ={selectedPark} onChange={handleDropdown}>
          {data.map((park, i) => (
            <option key={park.id} value={park.fullName}>
              {park.fullName}
            </option>
          ))}
      </select>
      
      {image && <img src={image} alt="Selected Park" className='park-image'/>}
  </>
  )
}

export default Dashboard


