// SignIn.js
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Components/firebaseConfig'; // Import initialized Firebase app
import google from '../Assets/google.png'
import login_animation from '../Assets/home.gif'
const SignIn = () => {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const signInWithGoogle = async (e) => {

        const provider = new GoogleAuthProvider();

        try {
            signInWithPopup(auth, provider).then(res => {
                setUser(res);
                setLoading(false)
            })
                .catch(e => {
                    setLoading(false)
                    console.log(e);
                })
        } catch (error) {
            setLoading(false)
            console.log(error.message);
        }


    };

    return (
        <div className='text-center w-3/4 md:w-1/2 bg-white h-[40vh] bg-opacity-90 mx-auto  rounded-md mt-8'>

            <img src={login_animation} className='h-1/2 mx-auto' />


            {!loading ? <button className='py-1 hover:border-expense-light border-dark-1 hover:bg-dark-1 bg-opacity-30 hover:scale-105 active:scale-95 z-10 mx-auto flex  items-center rounded-md border-2 bg-gray-300  font-semibold font-mono mt-6'
                onClick={(e) => { setLoading(true); signInWithGoogle() }}>
                <span className='w-2/5 '><img className=' h-10' src={google} /></span><p className='w-[150%] '>Sign in with Google</p></button> :
                <div class="relative flex justify-center items-center mt-12 text-center">
                    <p className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-expense-light text-lg'>Loading</p>
                    <div class="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-dark-1">  </div>
                </div>}
        </div>
    );
};

export default SignIn;
