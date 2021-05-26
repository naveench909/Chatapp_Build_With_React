import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyB06YeXeICCsZprtd56qQ93xkHYcyiuGXU",
  authDomain: "chatapp-35861.firebaseapp.com",
  databaseUrl: "https://chatapp-35861-default-rtdb.firebaseio.com/",
  projectId: "chatapp-35861",
  storageBucket: "chatapp-35861.appspot.com",
  messagingSenderId: "772044927454",
  appId: "1:772044927454:web:55599fd552028854f7ed4f",
  measurementId: "G-D70PW45NEE"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {


  const[user] = useAuthState(auth) 
  return (
    <div className="App">
      <header >
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}


function SignIn () {
  const SignInWithGoggle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return(
    <button onClick={SignInWithGoggle}>Sign in with Google</button>
  );
}

function SignOut () {
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom () {
  const dummy = React.useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  
  const[messages] = useCollectionData(query , {idField: 'id'});

  const[formValue , setFormValue] = React.useState('');

  const sendMessage = async (e)=>{
    e.preventDefault();
    if(formValue === ''){
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }else{
      const{uid , photoURL } = auth.currentUser;
      console.log(photoURL);
      await messagesRef.add({
        text:formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId:uid,
        photo:photoURL
      });
      
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage  key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input  
        value={formValue}
        onChange={(e)=>setFormValue(e.target.value)}/>

        <button type="submit">🕊️</button>

      </form>
    </>
  );
}

function ChatMessage (props) {
  const {text , uid , photoURL} = props.message;
  // console.log(text)
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="photo" />
      <p>{text}</p>
    </div>
  )
}

export default App;
