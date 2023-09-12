import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <h1>Portfolio Builder</h1>
      <nav>
        <ul>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/signin">Signin</Link></li>
          <li><Link to="/">Dashboard</Link></li>
        </ul>
      </nav>
        Header
    </header>
  )
}

export default Header