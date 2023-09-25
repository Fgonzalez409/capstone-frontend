import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'


const Dashboard = () => {

  const [parks, setParks] = useState({
    name: "",
    state: ""
  })

    const [data,setData] = useState([])
    // useEffect(() => {
    //     fetch("https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG")
    //     .then((res) => res.json())
    //     .then((data) => setData(data.id))
    // }, [])

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
  // console.log(data.data)
  return (

    
    <>
      <select>
        
      
          {data.map((x, i) => (
            <option key={x.id} value={x.fullName}>
              {x.fullName}

            </option>
            
          ))}
        
      </select>
  </>
  )
}

export default Dashboard