// SignIn.js
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Components/firebaseConfig'; // Import initialized Firebase app
import google from '../Assets/google.png'
import login_animation from '../Assets/home.gif'
const SignIn = () => {

    const [loading, setLoading] = useState(false)
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
        <div className='text-center w-3/4 md:w-1/2 bg-white h-[40vh] bg-opacity-90 mx-auto  rounded-md mt-8'>

            <img src={login_animation} className='h-1/2 mx-auto' />


            <button className='py-1 hover:border-expense-light border-dark-1 hover:bg-dark-1 bg-opacity-30 hover:scale-105 active:scale-95 z-10 mx-auto flex  items-center rounded-md border-2 bg-gray-300  font-semibold font-mono mt-6'
                onClick={signInWithGoogle}>
                <span className='w-2/5 '><img className=' h-10' src={google} /></span><p className='w-[150%] '>Sign in with Google</p></button>
        </div>
    );
};

export default SignIn;
