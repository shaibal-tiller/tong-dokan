// SignIn.js
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Components/firebaseConfig'; // Import initialized Firebase app
import logo from '../Assets/mman_logo.png'
import google from '../Assets/google.png'
const SignIn = () => {
    const signInWithGoogle = async () => {

        const provider = new GoogleAuthProvider();

        try {
            signInWithPopup(auth, provider).then(res => {

            })
                .catch(e => {
                    console.log(e);
                })
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className='text-center'>
           
          <img/>
            <button className='mx-auto flex  items-center rounded-md border-2 bg-gray-300  font-semibold font-mono mt-6' 
            onClick={signInWithGoogle}>
                <span className='w-2/5 '><img className=' h-10' src={google}/></span><p className='w-[150%] '>Sign in with Google</p></button>
        </div>
    );
};

export default SignIn;
