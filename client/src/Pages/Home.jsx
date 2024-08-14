import React from 'react'

function Home() {
  return (
    <div className='bg-gray-600 h-screen flex flex-col justify-center items-center text-white'>
      <h1>This is Home Page</h1>
      <p className='border p-2 my-2'><span className='font-bold'>Note:  </span>
        <br/>
        1.Do not refresh after login as "token" might get deleted
        <br/>
        2. You might have to reload a few times to see questions as backend is on "RENDER - FREE Version"
      </p>
    </div>
  )
}

export default Home
