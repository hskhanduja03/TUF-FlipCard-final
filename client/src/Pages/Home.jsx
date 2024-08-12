import React from 'react'

function Home() {
  return (
    <div className='bg-gray-600 h-screen flex flex-col justify-center items-center text-white'>
      <h1>This is Home Page</h1>
      <p className='border p-2 my-2'><span className='font-bold'>Note:  </span>Do not refresh after login as "token" might get deleted</p>
    </div>
  )
}

export default Home