import { useEffect, useState } from 'react'
import {Routes, Route, Navigate, Link} from "react-router-dom"
import Dashboard from './components/Dashboard'
import TestHeader from './components/TestHeader'
import GetMySavedParks from './components/getMySavedParks'
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
        <Routes>
          <Route path="/signup" element={<AuthForm formType="signup"/>}/>
          <Route path="/signin" element={<AuthForm setToken={setToken} formType="signin" />}/>
          <Route path="/" element={<ProtectedRoute component={Dashboard} token={token}/>}/>
          <Route path="/getMySavedParks" element={<GetMySavedParks token={token}/>} />
        </Routes>
        
        <TestHeader/>
        {!token && (
          <div className="auth-links-container">
          <Link to="/signup" className="auth-button">Sign Up</Link>
          <Link to="/signin" className="auth-button">Sign In</Link>
        </div>
        )}
    </>
  )
}

export default App
