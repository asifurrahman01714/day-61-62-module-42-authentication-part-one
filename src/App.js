import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);


function App() {

  const [newUser,setNewUser] = useState(false);
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUsers] = useState({
    isSignedIn : false,
    name : '',
    email: '',
    password: '',
    photo: '',
    error: ''
  });


  const handleSignIn = () =>{
    console.log('sign in clicked');


    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      const {displayName, photoURL, email} = user;

      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }

      setUsers(signedInUser);
      console.log(displayName, photoURL, email);
    })
  }

  console.log(user);

  const handleSignOut =()=>{
    console.log('sign out clicked');

    firebase.auth().signOut().then(() => {
      const signedOutUser ={
        isSignedIn : false,
        name : '',
        email: '',
        photo: '',
        success: false
      };

      setUsers(signedOutUser);
    }).catch((error) => {
      // An error happened.
    });
  }


  const handleBlur = (e) =>{
    const values = e.target.value;
    const name = e.target.name;
    console.log(name, values);


    const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    let isFieldValid = true;
    if(name === 'email'){
      const isFieldValid = regexEmail.test(values);
      console.log(isFieldValid);
    }

    if(name === 'password'){
      const isFieldValid = values.length> 6 && /[0-9]/.test(values);
      console.log(isFieldValid);
    }

    if (isFieldValid) {
      const newUserInfo = {...user};
      console.log(newUserInfo);
      newUserInfo[e.target.name] = e.target.value;
      setUsers(newUserInfo);
      
    }
  }

  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if(newUser && user.email && user.password){
      console.log('submitting');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error ='';
        newUserInfo.success = true;
        setUsers(newUserInfo);
        console.log(res);
        updateUserName(user.name);
      })
      .catch((error) => {

        const userNewInfo = {...user};
        userNewInfo.error = error.message;
        userNewInfo.success = false;
        setUsers(userNewInfo);

        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error ='';
        newUserInfo.success = true;
        setUsers(newUserInfo);
        console.log(res.user);
      })
      .catch((error) => {

        const userNewInfo = {...user};
        userNewInfo.error = error.message;
        userNewInfo.success = false;
        setUsers(userNewInfo);

        var errorCode = error.code;
        var errorMessage = error.message;
        
        // ..
      });
    }

    e.preventDefault();
  }

  const updateUserName = (name) =>{
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name,
    
    }).then(function() {
      console.log('Update successful.');
    }).catch(function(error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick ={handleSignOut}>Sign Out</button> 
                        : <button onClick ={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
                            <h1>Welcome, {user.name}</h1>
                            <h3>Your Email {user.email}</h3>
                            <img src={user.photo} alt=""/>
                          </div>
      }

      <p>User Name : {user.name}</p>
      <p>User Email : {user.email}</p>
      <p>User Password : {user.password}</p>
      
      <input type="checkbox" name="newUser" onChange={()=> setNewUser(!newUser)} id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form action="" onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter your name" id=""/>}
        <br/>
        <input type="text" name="email" id="" onBlur={handleBlur} required placeholder="Enter your email address"/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} required placeholder="Enter your password" id=""/>
        <br/>
        <button type="submit">{newUser ? 'Sign Up' : 'Sign In'}</button>
      </form>

      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success &&  <p style={{color: 'green'}}>User {newUser ? 'created' : 'logged'} In successfully</p>
      }
    </div>
  );
}

export default App;
