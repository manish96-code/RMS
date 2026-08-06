import React from 'react'
import Home from './pages/Home'
import Create from './pages/Create'

const App = () => {

  

  return (
    <div>
      <Home/>

      <Route path="/create" element={<Create/>} />
    </div>
  )
}

export default App
