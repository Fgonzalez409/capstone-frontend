import axios from 'axios'
import cookie from "cookie"


const getMySavedParks = async () => {

    const cookies = cookie.parse(document.cookie)
        console.log(cookies.token)
        try {
          const response = await axios.get('https://capstone-backend-blush.vercel.app/getSavedParks',{
            headers:{
              Authorization:`Bearer ${cookies.token}`
            }
        })
          const savedParksData = response.data
          return savedParksData
      } catch(err)  {
          throw err
        }
  
}

export default getMySavedParks