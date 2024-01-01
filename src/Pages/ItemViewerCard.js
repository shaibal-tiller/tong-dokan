import React, { useEffect, useState } from 'react'

const ItemViewer = ({ list }) => {


    const [total, setTotal] = useState(null)
    useEffect(() => {
        setTotal(list ? parseInt(list[list.length - 1].unit_price * list[list.length - 1].quantity) + total : 0)
    }, [list])
    return (
        <div className='w-40 px-4 space-y-2'>

            <p>Total: <b>{total}</b></p>

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