import {BrowserRouter,Routes,Route} from "react-router-dom";
import React,{ReactDOM} from 'react'
import { Toaster } from "react-hot-toast";
import './App.css'
import Home from "./pages/Home.jsx";
import Editor from "./pages/Editor.jsx";
  function App() {
 
  
    

  
  return (
    <>
    
    
    <div>
      <Toaster
      position="top-center"
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
      
        style: {
          background: '#363636',
          color: '#fff',
        }
      }}
      ></Toaster>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="editor/:roomid" element={<Editor/>}/>
        
     
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
