import React from 'react'
import { Link } from 'react-router-dom'
import "../styles/Header.css"

const Header = () => {
  return (
    <header>
      <h1>National Park Blog</h1>
      <nav>
        <ul>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/signin">Signin</Link></li>
          <li><Link to="/">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

// const Header = () => {
//   // State to track the user's sign-in status
//   const [isSignedIn, setIsSignedIn] = useState(false);

//   return (
//     <header>
//       <h1>National Park Blog</h1>
//       <nav>
//         <ul>
//           <li><Link to="/signup">Signup</Link></li>
//           <li><Link to="/signin">Signin</Link></li>
//           <li><Link to="/">Dashboard</Link></li>
//         </ul>
//       </nav>
//       {/* Conditionally render the message based on the user's sign-in status */}
//       {isSignedIn && <p>Choose a national park you have visited.</p>}
//     </header>
//   );
// };