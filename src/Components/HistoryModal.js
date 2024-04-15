import React, { useEffect, useState } from 'react'
import { getValuesFromDocument, month } from './firebaseUtil';
import { TransactionItem, formatData } from './TransactionHistoryShort';
export const monthYearFormatter = (date = new Date()) => `${month[new Date(date).getMonth()]?.slice(0, 3)}-${new Date(date).getFullYear() % 2000}`;

const HistoryModal = ({ handleClose }) => {
    let allTotal = 0
    const [historyData, setHistoryData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [monthYear, setMonthYear] = useState(monthYearFormatter())
    const [all_total, set_all_total] = useState(0)

    const calculateTotalAmount = (transactions) => {
        let totalAmount = 0;
        for (const transaction of transactions) {
            totalAmount += transaction.amount;
        }
        allTotal += totalAmount

        return totalAmount;
    }
    useEffect(() => {


        setLoading(true)
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
        

    }, [monthYear])
    useEffect(()=>{
        set_all_total(allTotal)
    },[historyData])

    const handleprev = (e) => {

        const mon_index = month.findIndex((element, index, array) => { return element?.slice(0, 3) == monthYear?.slice(0, 3) })
        const year = mon_index == 0 ? parseInt(monthYear?.slice(4)) - 1 : parseInt(monthYear?.slice(4))
        const month_ = mon_index == 0 ? month[11]?.slice(0, 3) : month[mon_index - 1]?.slice(0, 3)

        setMonthYear(`${month_}-${year}`)

    }

    const handlenext = (e) => {

        const mon_index = month.findIndex((element, index, array) => { return element?.slice(0, 3) == monthYear?.slice(0, 3) })
        const year = mon_index == 11 ? parseInt(monthYear?.slice(4)) + 1 : parseInt(monthYear?.slice(4))
        const month_ = mon_index == 11 ? month[0]?.slice(0, 3) : month[mon_index + 1]?.slice(0, 3)

        setMonthYear(`${month_}-${year}`)


    }
    return (
        <div className='left-0 top-20 h-[80vh] overflow-y-auto w-full  absolute z-50 px-[15%] bg-slate-500-200 bg-opacity-50'>
            <div className='flex justify-between text-white py-2 tracking-wider'>
                <button onClick={handleprev}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                </svg>
                </button>
                <button className='' onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <button onClick={handlenext}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
                </button>
            </div>
            <h2 className='text-center font-semibold  text-2xl text-expense-light uppercase'>{monthYear} [**{all_total}**] </h2>
            <div className=' h-full '>

                {!loading && historyData && Object.keys(historyData).length ? (
                    <div className='py-5'>
                        {Object.entries(historyData)?.map(item => {


                            return (<div className='space-y-1'>
                                <div className=' px-1 text-gray-300 grid grid-cols-2  place-items-center'>
                                    <p>{`${new Date(item[0]).toDateString()}`}</p>
                                    <p>{`Total: ${calculateTotalAmount(item[1])}`}</p>
                                </div>
                                {item[1]?.map((transaction, index) => {
                                    /*   temp_item[item[0]] = temp_item[item[0]] + transaction?.amount
                                  
                                      if (index == item[1]?.length - 1) {
                                         setTotal({...total,   ...temp_item })
                                      } */
                                    return <TransactionItem data={transaction} />
                                })}
                            </div>)

                        })}
                    </div>
                ) : !loading ? <div className='text-center text-3xl font-semibold text-red-500'>No Entry</div> : <div className="flex justify-center items-center mt-20">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>}
            </div>
        </div>
    )
}

export default HistoryModal