import React, { useState } from 'react'
import { useEffect } from 'react'



const Dashboard = () => {

  const [parks, setParks] = useState({
    name: "",
    state: ""
  })

    const [data,setData] = useState([])
    useEffect(() => {
        fetch("https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG")
        .then((res) => res.json())
        .then((data) => setData(data.id))
    }, [])

  return (
    <div>{data.map((x) => (
        <h2 key={x.id}>TEST{x.email}</h2>
  ))}</div>
  )
}

export default Dashboard