import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
function Profile() {
  const fileRef=useRef(null)
  const{currentUser}=useSelector(state=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form  className='flex flex-col gap-4'>
      <input
        type='file'
      ref={fileRef}
        hidden
        accept='image/*'
       
      />
   
      <img
        src={currentUser.profilePicture}
        alt='profile'
        className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
        onClick={()=>fileRef.currentUser.click()}

      />
      <p className='text-sm self-center'>
       
          <span className='text-red-700'>
            Error uploading image (file size must be less than 2 MB)
          </span>
       
          <span className='text-slate-700'>{`Uploading: %`}</span>
   
          <span className='text-green-700'>Image uploaded successfully</span>
      
        
      </p>
      <input
   defaultValue={currentUser.username}
        type='text'
        id='username'
        placeholder='Username'
        className='bg-slate-100 rounded-lg p-3'
      
      />
      <input

      defaultValue={currentUser.email}
       
        type='email'
        id='email'
        placeholder='Email'
        className='bg-slate-100 rounded-lg p-3'

      />
      <input
        type='password'
        id='password'
        placeholder='Password'
        className='bg-slate-100 rounded-lg p-3'
        
      />
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>

      </button>
    </form>
    <div className='flex justify-between mt-5'>
      <span

        className='text-red-700 cursor-pointer'
      >
        Delete Account
      </span>
      <span  className='text-red-700 cursor-pointer'>
        Sign out
      </span>
    </div>
    <p className='text-red-700 mt-5'>{ 'Something went wrong!'}</p>
    <p className='text-green-700 mt-5'>
      {'User is updated successfully!'}
    </p>
  </div>
  )
}

export default Profile
