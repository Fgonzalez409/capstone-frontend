import { useEffect, useState } from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import Dashboard from './components/Dashboard'
import TestHeader from './components/TestHeader'
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
      {/* <AuthProvider> */}
        <TestHeader/>
        <Routes>
          <Route path="/signup" element={<AuthForm formType="signup"/>}/>
          <Route path="/signin" element={<AuthForm setToken={setToken} formType="signin" />}/>
          <Route path="/" element={<ProtectedRoute component={Dashboard} token={token}/>}/>
          {/* <Route path="/" element={ <Dashboard token={token}/>}/> */}

        </Routes>
      {/* </AuthProvider> */}
    </>
  )
}

export default App
