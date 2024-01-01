import React from 'react'
import { testFirestore } from '../Components/firebaseUtil'

const SendToFirebase = () => {
const dummy =
    {
        "date": "2024-12-01T00:00:00.000Z",
        "time": "2024-12-01T08:42:12.802Z",
        "name": "B&H",
        "pay_mode": "credit",
        "quantity": 1,
        "unit_price": "17",
        "cat_id": 1
    }
    const handleSend =(e)=>{
        testFirestore(dummy)
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <button onClick={handleSend} className='px-2 py-1 bg-expense-light active:scale-95'>Send</button>
        </div>
    )
}

export default SendToFirebase