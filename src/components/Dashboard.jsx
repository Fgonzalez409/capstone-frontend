import React, { useState } from 'react'
import { useEffect } from 'react'



const Dashboard = () => {

  const API_KEY = "yAIutPvgJDxgqt83ZQLp8WCKfrmMtQ5BDQE7x9iG"
    const [data,setData] = useState([])
    useEffect(() => {
        fetch("https://capstone-backend-blush.vercel.app/users")
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