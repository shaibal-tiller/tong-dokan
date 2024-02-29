import React, { useEffect, useState } from 'react'
import { getValuesFromDocument, month } from './firebaseUtil';
import { TransactionItem, formatData } from './TransactionHistoryShort';
export const monthYearFormatter = (date = new Date()) => `${month[new Date(date).getMonth()]?.slice(0, 3)}-${new Date(date).getFullYear() % 2000}`;
const HistoryModal = ({ handleClose }) => {

    const [historyData, setHistoryData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [monthYear, setMonthYear] = useState({ current: monthYearFormatter(), modal: monthYearFormatter() })

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

    }, [])
    const handleprev = (e) => {
        // console.log(monthYear.current==monthYear.modal);
        const mon_index = month.findIndex((element, index, array)=>{return element.slice(0,3)==monthYear.modal.slice(0,3)})
        console.log(month[mon_index-1]);
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
                <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>
                </button>
            </div>
            <div className=' h-full '>
                {!loading && historyData ? (
                    <div className='py-5'>
                        {Object.entries(historyData)?.map(item => {


                            return (<div className='space-y-1'>
                                <div className=' px-1 text-gray-300 grid grid-cols-2  place-items-center'>
                                    <p>{`${new Date(item[0]).toDateString()}`}</p>
                                    {/* <p>{`Total: ${total['item[0]']}`}</p>  */}
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
                ) : <div class="flex justify-center items-center mt-20">
                    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>}
            </div>
        </div>
    )
}

export default HistoryModal