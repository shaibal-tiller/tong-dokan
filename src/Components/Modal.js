import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { getTimeStamp, updateCash } from './firebaseUtil'
import { db } from './firebaseConfig'

const Modal = ({ onclose }) => {


    const [pay_amount, set_pay_amount] = useState(0)

    const handlePayment = async (e) => {
        const date = new Date()

        const formdata = { date: date.toISOString(), amount: pay_amount }
        try {
           
            const payCollectionRef = collection(db, 'payments')
          
            const newDocref = doc(payCollectionRef, `${getTimeStamp(date.toLocaleDateString(), date.toLocaleTimeString())}`)
          
            await setDoc(newDocref, formdata)
            
            updateCash(pay_amount)
            set_pay_amount(0)
            onclose(false)
            
        } catch (error) {

            console.log(error);
        }


    }
    const handleChange = (e) => {

        set_pay_amount(parseInt(e.target.value))
    }
    const handlebody = (e) => {
        e.target.classList[0] == 'modal-container' && onclose(false)
    }
    return (
        <div className='modal-container h-screen w-full absolute top-0 left-0 bg-dark-1 bg-opacity-40 
        px-[20%] flex justify-center items-center  !blur-none !z-50' onClick={handlebody}/* {()=>onclose(false)} */>
            <div className='lg:px-[36%] relative w-full h-72 bg-[#f2f2f2ff] flex flex-col justify-center items-center !blur-0 rounded-md'>
                <label>Add Payment Amount</label>
                <div className='grid grid-cols-3 gap-4 py-2'>
                    <button onClick={(e) => set_pay_amount(50)} className={`${pay_amount == 50 ? "text-expense-light " : " text-white"} active:scale-95 text-center bg-income-light  px-2 rounded-md `}>50</button>
                    <button onClick={(e) => set_pay_amount(100)} className={`${pay_amount == 100 ? "text-expense-light " : "  text-white"} active:scale-95 text-center bg-income-light  px-2 rounded-md `}>100</button>
                    <button onClick={(e) => set_pay_amount(200)} className={`${pay_amount == 200 ? "text-expense-light " : "  text-white"} active:scale-95 text-center bg-income-light  px-2 rounded-md `}>200</button>
                    <button onClick={(e) => set_pay_amount(500)} className={`${pay_amount == 500 ? "text-expense-light " : "  text-white"} active:scale-95 text-center bg-income-light  px-2 rounded-md `}>500</button>
                    <button onClick={(e) => set_pay_amount(1000)} className={`${pay_amount == 1000 ? "text-expense-light " : "  text-white"} active:scale-95 text-center bg-income-light px-2 rounded-md `}>1000</button>
                </div>

                <input onChange={handleChange} type='number' value={parseInt(pay_amount)} className='font-mono  px-1 bg-opacity-10 outline-none mx-auto rounded-md font-semibold' />
                <div className='flex items-center w-full px-[20%]  gap-2'>
                    <button className='w-full  px-1 text-center bg-slate-400 rounded-md mt-2 active:scale-95 hover:bg-slate-300 font-semibold ' onClick={(e) => handlePayment(e)}>Pay</button>
                    <button className='w-full  px-1 text-center bg-slate-400 rounded-md mt-2 active:scale-95 hover:bg-slate-300 font-semibold ' onClick={() => onclose(false)}>Cancel</button>
                </div>

                <button className='absolute top-2 text-red-400 right-6 hover:scale-105' onClick={() => onclose(false)}>X</button>
            </div>
        </div>
    )
}

export default Modal