import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import News from './components/News'
import BostonDynamicVideo from './components/BostonDynamicsVideo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div className="bg-red-500 font-mono text-white p-4 !important">
  R O B O T <br></br><span className='font-bold text-black'>T R A C K E R</span>   
</div>
    <div className='overflow-x-hidden'>   
      <BostonDynamicVideo/>
      <News/>
    
    </div>
    
    </>
  )
}

export default App
