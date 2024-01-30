import React, { useEffect, useState } from 'react'

const ItemViewer = ({ list }) => {


    const [total, setTotal] = useState(0) 
    useEffect(() => {
        let temp_value=0
        list?.map(el=>{temp_value+=el.quantity *el.unit_price})
        setTotal(temp_value )
    }, [list])
    return (
        <div className='w-40 px-4 space-y-2'>

            <p>Total : <b>{total}</b></p>

            {list?.map(item => {
                return (<div className='text-xs  px-2 '>
                    <hr />
                    <p className='truncate pt-1'>{item.name}</p>
                    <p>{item.quantity} X {item.unit_price}= {item.quantity * item.unit_price}</p>

                </div>)
            })}

        </div>
    )
}

export default ItemViewer