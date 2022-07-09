import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import firebaseConfig from './fire.config';
import { useState } from 'react';


// Initialize Firebase
const app = initializeApp(firebaseConfig);


function App() {
  const auth = getAuth(app);
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    name : "",
    email : "",
    password : "",
    error : "",
    photo: "",
    sucess: false
  })

// <-------Email validation------>
  const handleBlur = (e)=> {
    let isFieldValid = true;
    if(e.target.name === "email") {
      const isEmailValid = /\S+@\S+\.\S+/.test (e.target.value);
      isFieldValid = isEmailValid;
    }

    if(e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNum = /\d/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNum;   
    }

    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  // <----Submit form----->
  const handleSubmit = (e)=> {
    // -------For New User---------
    if(newUser && user.email && user.password) {
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {  
        const newUserInfo = {...user};
        newUserInfo.error = ""; 
        newUserInfo.sucess = true;  
        setUser(newUserInfo); 
        updateUserName(user.name);
         
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.sucess = false;
        setUser(newUserInfo);
      });
    }

    // -------For old User---------
    if(!newUser && user.email && user.password) {
      signInWithEmailAndPassword(auth, user.email, user.password )
      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = ""; 
        newUserInfo.sucess = true;  
        setUser(newUserInfo);
        console.log(res.user, 'sign in user info');
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.sucess = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }

  // ----Update User Name----
  const updateUserName = name => {
    updateProfile(auth.currentUser, {
      displayName: name,      
    })
    .then(() => {
      console.log('updated user name');
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className='container'>
      <h2>Our owen Authentication</h2>
        <h3>Name : {user.name}</h3>
        <h5>Email : {user.email}</h5>
        <h5>Password : {user.password}</h5>
        
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name='newUser' />
        <label htmlFor="newUser">New User Sign UP</label>

        <form onSubmit={handleSubmit}>
          {
            newUser && <input type="text" name='name' onBlur={handleBlur} placeholder='name' />
          }
          <br />
          <input type="text" name='email' onBlur={handleBlur}  placeholder='email' /><br />
          <input type="password" name='password' onBlur={handleBlur}  placeholder='password' /><br />
          <input className='btn' type="submit" value={newUser ? 'Sign Up' : 'Sign in'} /><br /><br />
        </form>
      
        <p style={{color: "red"}}>{user.error}</p>
        {
          user.sucess && <p style={{color: "green"}}>User {newUser ? "Account created" : "Logged In"} Successfully.</p>
        }

    </div>
  );
}

export default App;
