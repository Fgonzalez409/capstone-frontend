import React, { useState } from 'react'
import { useEffect } from 'react'



const Dashboard = () => {

  const API_URL = "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key="
  const API_KEY = "yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG"

    const [data,setData] = useState([])
    useEffect(() => {
        fetch(`"https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=" + ${API_KEY}`)
        .then((res) => res.json())
        .then((data) => setData(data))
    }, [])

  return (
    <div>{data.map((x) => (
        <h2 key={x.id}>TEST{x.email}</h2>
  ))}</div>
  )
}

export default Dashboard