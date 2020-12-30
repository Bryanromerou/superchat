import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAtV7Vc8GE7VWF7GEgJdK1rgCBnR87geHc",
  authDomain: "superchat-824c2.firebaseapp.com",
  projectId: "superchat-824c2",
  storageBucket: "superchat-824c2.appspot.com",
  messagingSenderId: "637993392766",
  appId: "1:637993392766:web:9e09999835be905fadd62f",
  measurementId: "G-2LGNPK3LHT"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/>:<SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick ={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField:'id'});

  const [formValue, setFormValue] = useState("");

  const dummy = useRef()

  const sendMessage = async(e)=>{
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue("")
    dummy.current.scrollIntoView({ behavior : 'smooth' })

  }

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} messages = {msg}/>)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
        <button type="submit" >send</button>
      </form>
    </>
  )

}

function ChatMessage(props){
  const { text, uid, photoURL } = props.messages;

  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';


  return (
    <div className = {`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )

}

export default App;