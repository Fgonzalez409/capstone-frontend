import React, { useState } from 'react'
import { useEffect } from 'react'



const Dashboard = () => {

  const [parks, setParks] = useState({
    name: "",
    state: ""
  })

    // const [data,setData] = useState([])
    // useEffect(() => {
    //     // fetch("https://capstone-backend-blush.vercel.app/users")
    //     .then((res) => res.json())
    //     .then((data) => setData(data.id))
    // }, [])

  return (
    <div>{data.map((x) => (
        <h2 key={x.id}>TEST{x.email}</h2>
  ))}</div>
  )
}

export default Dashboard