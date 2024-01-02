import React from 'react'

const Modal = ({onclose }) => {
    console.log("hello");
    return (
        <div className='h-screen w-full absolute top-0 left-0 bg-dark-1 bg-opacity-40 px-[20%] flex justify-center items-center'>
            <div className='w-full h-72 bg-[#f2f2f2ff] flex flex-col justify-center items-center'>
                <label>Add Payment Amount</label>
                <input  className='bg-opacity-10 outline-none mx-auto' />
                <button onClick={()=>onclose(false)}>Pay</button>
            </div>
        </div>
    )
}

export default Modal