import { useEffect, useState } from 'react'
import {Routes, Route, Navigate, Link} from "react-router-dom"
import Dashboard from './components/Dashboard'
import TestHeader from './components/TestHeader'
import GetMySavedParks from './components/GetMySavedParks'
import AuthForm from './components/Forms/AuthForm'
import './App.css'



const checkAuth = (token) => {
  if(token.length){
    return true
  }
  return false
}

const ProtectedRoute = (props) => {
  const {component: Component, token, ...rest} = props
  return checkAuth(token) === true ? (<Component {...rest}/>): (<Navigate to="/signin"/>)
}

function App() {

  const [token, setToken] = useState("")
  return (
    <>
        <TestHeader/>
        {!token && (
          <>
            <Link to="/signup">Signup form</Link>
            <br />
            <Link to="/signin">Signin form</Link>
          </>
        )}
        <Routes>
          <Route path="/signup" element={<AuthForm formType="signup"/>}/>
          <Route path="/signin" element={<AuthForm setToken={setToken} formType="signin" />}/>
          <Route path="/" element={<ProtectedRoute component={Dashboard} token={token}/>}/>
          <Route path="/getMySavedParks" element={<GetMySavedParks token={token}/>} />
        </Routes>
    </>
  )
}

export default App
