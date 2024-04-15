import React, { useEffect, useState } from 'react'
import { getValuesFromDocument, month } from './firebaseUtil'

export const TransactionItem = ({ data, }) => {

    return (<div className={`  place-items-center w-full py-1 ${data?.pay_mode == 'credit' ? 'text-expense-light' : 'text-income-light'}  bg-gray-300 rounded-md  bg-opacity-10 grid grid-cols-4 `}>
        {/* product_name: 'test0',
        time: '2024-02-01T05:14:07.871Z',
        amount: 13,
        pay_mode: 'credit',
    previous_due: -77 */}
        <div className='text-start text-xs'> {data?.product_name} x {data.quantity}</div>
        <div className='text-xs'>{new Date(data.time)?.toLocaleTimeString() == "Invalid Date" ?
            data.time : new Date(data.time)?.toLocaleTimeString()}</div>
        <div className='text-xs'>{data.amount}</div>
        <div>{data?.previous_due}</div>
    </div>)
}

export const dateSortingFunction = (item_a, item_b) => {
    const dateA = new Date(item_a.date);
    const dateB = new Date(item_b.date);

    // If dates are not equal, sort by date in descending order
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    // If dates are equal, sort by time in descending order
    const timeA = new Date(item_a.time);
    const timeB = new Date(item_b.time);

    if (timeA > timeB) return -1;
    if (timeA < timeB) return 1;

    return 0; // Objects are equal
}


export const formatData = (data) => {
    const sortedData = data.sort(dateSortingFunction)
    const transformedData = {};
    sortedData.forEach(item => {
        const { date, product_name, time, quantity, unit_price, pay_mode, previous_due } = item;

        // Calculate amount
        const amount = quantity * unit_price;

        // Create a key for the date if it doesn't exist in the transformed data object
        if (!transformedData[date]) {
            transformedData[date] = [];
        }

        // Push the transformed item into the array corresponding to its date key
        transformedData[date].push({
            product_name,
            time,
            amount,
            pay_mode,
            unit_price,
            quantity,
            previous_due
        });
    });

    return (transformedData);
}

const currentDate = new Date().toDateString()
const TransactionHistoryShort = ({ allListHandler, historyOn, analyticsOn }) => {

    const [historyData, setHistoryData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState({})

    useEffect(() => {
        // setLoading(true)
        const monthYear = `${month[new Date().getMonth()]?.slice(0, 3)}-${new Date().getFullYear() % 2000}`;

        try {

            getValuesFromDocument(monthYear)
                .then(response => {
                    setHistoryData(formatData(response))
                    setLoading(false)
                })
                .catch(e => {
                    setLoading(false)
                    console.log(e);
                })
        } catch (error) {
            setLoading(false)
            console.log(error);
        }

    }, [])
    const calculateTotalAmount = (transactions) => {
        let totalAmount = 0;
        for (const transaction of transactions) {
            totalAmount += transaction.amount;
        }
        return totalAmount;
    }

    return (
        <div className={`${historyOn ? 'blur-sm ' : ' '} relative h-96 w-full border-2 p-4  rounded-t-2xl space-y-2  overflow-y-auto`}>
            <div className='sticky  top-0 flex justify-end'>
                <div className='flex gap-2 justify-end items-center'>
                    <button onClick={allListHandler} className='bg-gray-300  py-1 px-4 border-2 rounded-full
             text-dark-1 font-semibold text-xs hover:scale-105 active:scale-95 hover:border-expense-light
              active:text-expense-light' >Show All </button>
                    <button onClick={analyticsOn} className='bg-gray-300  py-1 px-4 border-2 rounded-full
             text-dark-1 font-semibold text-xs hover:scale-105 active:scale-95 hover:border-expense-light
              active:text-expense-light' >Analytics</button>
                </div>

                
            </div>
            {!loading && historyData ? (
                <div className='py-5'>
                    {Object.entries(historyData)?.map(item => {


                        return (<div className='space-y-1'>
                            <div className=' px-1 text-gray-300 grid grid-cols-2  place-items-center'>
                                <p>{`${new Date(item[0]).toDateString()}`}</p>
                                <p>{`Total: ${calculateTotalAmount(item[1])}`}</p>
                            </div>
                            {item[1]?.map((transaction, index) => {

                                return <TransactionItem data={transaction} />
                            })}
                        </div>)

                    })}
                </div>
            ) : <div class="flex justify-center items-center mt-20">
                <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>}







        </div>
    )
}

export default TransactionHistoryShort