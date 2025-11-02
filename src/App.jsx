import React from 'react'
import { BrowserRouter,Route,Router,Routes } from 'react-router-dom'
import Navbar from './component/Navbar'
import ListOfVideos from './component/ListOfVideos'
import Login from './component/Login'
import SignUp from './component/SignUp'
import UserDetials from './component/UserDetials'
import PublicProfile from './component/PublicProfile'
import SearchList from './component/SearchList'


const App = () => {
  return (
    <BrowserRouter>
    <Navbar></Navbar>

    <main>

      <Routes>
        <Route element={<ListOfVideos/>} path="/" />
        <Route element={<ListOfVideos/>} path="/ListOfVideos" />
        <Route element={<Login/>} path='/Login' ></Route>
        <Route element={<SignUp/>} path='SignUp' ></Route>
        <Route element={<UserDetials/>} path='/UserDetials/:abc'/>
        <Route element={<PublicProfile/>} path='/PublicProfile/:abc' ></Route>
        <Route element={<SearchList/>} path='/SearchList/:xyz' />
        
    </Routes>


    </main>



    
    </BrowserRouter>
  )
}

export default App