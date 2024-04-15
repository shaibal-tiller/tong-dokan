import React, { useEffect, useState } from 'react';
import '../Assets/form.css';
import cash from '../Assets/cash.png';
import credit from '../Assets/credit.png';
import { cat_product_list, categories } from '../Assets/data';
import DatePicker from '../Components/DatePicker';
import ItemViewer from './ItemViewerCard';
import { GetContext } from '../Context';
import { firestoreUpload, updateCash, updateCredit, } from '../Components/firebaseUtil';
import { useLongPress } from 'use-long-press';
const CustomModal = ({ close, product, setter }) => {
    const [customPrice, setCustomPrice] = useState(product?.unit_price || 0)
    return <div className='hide-input-arrow absolute top-0 w-full md:w-1/2 bottom-0 left-0 md:left-1/2 bg-white md:-translate-x-1/2 '>
        <button className='text-xl px-4 py-1 text-red-600' onClick={close}>X</button>
        <div className='flex w-3/5 mx-auto  rounded-md '>
            <input onChange={(e) => setCustomPrice(parseInt(e.target.value))}
                className=' text-black  max-w-40 text-5xl font-bold  outline-none  ' min={0} max={10} value={parseInt(customPrice || '0')} />
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setter({ ...product, unit_price: customPrice }) }}
                className='w-1/3 uppercase font-semibold  text-black text-3xl bg-amber-300 bg-opacity-40 hover:bg-opacity-50 rounded-lg  '>Set</button>
        </div>
    </div>
}

const InputBlock = ({ selected_cat_id, setSelected_cat_id, selected_product, setSelected_product, qty, setQty }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const bind = useLongPress(() => {
        setIsModalOpen(true)
    });



    const [productList, setProductList] = useState(cat_product_list[selected_cat_id]) //myContext.productList ? myContext.productList : getProductlist(db, 'productList', myContext.setProductList)
    useEffect(() => {
        setProductList(cat_product_list[selected_cat_id])
    }, [selected_cat_id])



    const handleProductClick = (event, item) => {
        event.preventDefault()
        event.stopPropagation()
        selected_product?.id == item?.id ? setQty(qty + 1) : setQty(1)
        setSelected_product(item)
    }



    return (
        <div className='space-y-4 relative'>
            <div className='grid grid-cols-6 gap-2'>
                {categories.map(item => {
                    return <div className={`bg-slate-400 bg-opacity-50 p-2  active:scale-95
                    border-2  ${selected_cat_id == item?.id ? " border-light-1" : " border-transparent"} `}
                        onClick={(e) => setSelected_cat_id(item?.id)}>
                        <img className='h-16 w-16 mx-auto' src={item?.image} /></div>
                })}
            </div>
            <div className='grid grid-cols-5 gap-2'>
                {productList && productList.length && productList?.map(item => {
                    return <div className={`bg-slate-400 bg-opacity-50 p-2 active:scale-95
                    border-2 ${selected_product?.name == item?.name ? " border-light-1" : " border-transparent"} `}
                        {...bind()}
                        onClick={(e) => handleProductClick(e, item)}>
                        <img className='h-16 w-16 mx-auto' src={item?.image} /></div>
                })}
            </div>
            <div className=' space-x-2'>
                <label className='w-1/5'>Quantity</label>
                <div className='w-full flex items-center relative'>
                    {/* Use onChange instead of onInput for consistency */}
                    <input
                        className='w-full mx-4 mt-10'
                        type='range'
                        id='rangeInput'
                        name='rangeInput'
                        min={1}
                        max={20}
                        step={1}
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value))}
                    />
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 flex gap-4 items-center'>
                        {/* Use a function for better readability and consistency */}
                        <AdjustQuantityButton onClick={() => setQty(qty - 1)} />
                        <p className=''>{qty}</p>
                        <AdjustQuantityButton onClick={() => setQty(qty + 1)} />
                    </div>
                </div>
            </div>
            {isModalOpen ? <CustomModal product={selected_product} setter={setSelected_product} close={() => setIsModalOpen(false)} /> : <></>}
        </div>
    );
};

const AdjustQuantityButton = ({ onClick }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        onClick={onClick}
        className='w-6 h-6 rounded-full border cursor-pointer bg-expense-light '
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15' />
    </svg>
);

const modes = [{ name: "credit", name_bn: "বাকি", image: credit }, { name: "cash", name_bn: "নগদ", image: cash },]
const AddExpense = () => {
    const [itemList, setItemList] = useState(null)
    const [pay_mode, setPay_mode] = useState('credit')
    const [selected_cat_id, setSelected_cat_id] = useState(1);
    const [selected_product, setSelected_product] = useState(null);
    const [qty, setQty] = useState(1);
    const [time, setTime] = useState(null)
    const [date, setDate] = useState(null)
    const [test_index, set_test_index] = useState(0)
    const myContext = GetContext()
    const setDateTime = (date, time) => {
        
        setDate(date)
        setTime(time)
    }
    useEffect(() => {
        const initial_Date = new Date()
        setDateTime(initial_Date.toISOString(), initial_Date.toLocaleTimeString(),)

    }, [])

    const updateItemList = (formated_data) => {
        if (itemList) {
            const existingItemIndex = itemList.findIndex(item =>
                item.cat_id === formated_data.cat_id &&
                item.pay_mode === formated_data.pay_mode &&
                item.name === formated_data.name
            );


            if (existingItemIndex !== -1) {
                let temp_itemList = [...itemList]
                temp_itemList[existingItemIndex].quantity += formated_data.quantity
                setItemList(temp_itemList)
            }
            else {
                setItemList([...itemList, formated_data])
            }
        }
        else {
            setItemList([formated_data])
        }

    }
    const handleSubmit = (e) => {

        e.preventDefault()
        e.stopPropagation()
        set_test_index(test_index + 1)
        const formated_data = {
            date: date, time: time,
            name: selected_product?.name || 'test' + test_index,
            pay_mode: `${pay_mode}`,
            quantity: qty,
            previous_due: myContext.balance,
            unit_price: selected_product?.unit_price || 0,
            cat_id: selected_product?.cat_id || 1
        }
        updateItemList({ ...formated_data })

        const current_DateTime = new Date()
        setDateTime( current_DateTime.toISOString(),current_DateTime.toLocaleTimeString(),)
    }

    const handleAddtoDatabase = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const total = { credit: 0, cash: 0 }
        try {
            itemList.forEach(async (item, index) => {
                const formattedData = {
                    product_name: item.name || 'test' + index,
                    cat_id: item.cat_id || 1,
                    quantity: item.quantity,
                    pay_mode: item.pay_mode,
                    unit_price: item.unit_price || 1,
                    previous_due: item?.previous_due || 2,
                    time: item.time,
                    date: item.date,
                };
                console.log(formattedData);
                await firestoreUpload(formattedData)
                total[`${formattedData.pay_mode}`] += formattedData?.unit_price * formattedData?.quantity
                if (index == itemList?.length - 1) {
                    const x = total['credit'] && total['credit'] > 0 ? await updateCredit(parseInt(total['credit'])) : null;
                    const y = total['cash'] && total['cash'] > 0 ? await updateCash(total['cash'], true) : null;
                }

            });

            const current_DateTime = new Date()
            setDateTime( current_DateTime.toISOString(),current_DateTime.toLocaleTimeString(),)
            setItemList(null);
        } catch (error) {
            console.error('Error adding transactions:', error);
        }
    }

    const handleDateChange = (newDate) => {
        setDate(newDate)
    };

    const handleModeChange = (e, mode_name) => {
        setPay_mode(mode_name);
    }
    return (
        <div className="px-[8%] text-light-1 ">
            <h2 className="text-3xl py-4 tracking-wider font-semibold"> Add Expense</h2>
            <div className='flex gap-x-2'>
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div>
                        <label>Date </label>
                        <DatePicker onDateChange={handleDateChange} />
                    </div>

                    <div>
                        <label>Pay Mode</label>
                        <div className='flex gap-x-4 lg:w-1/2 ' >
                            {modes.map((pay_item, index) => <div className='relative' onClick={(e) => handleModeChange(e, pay_item.name)}>
                                <img className={` bg-income-light w-40  bg-opacity-50 p-4 hover:bg-opacity-80 hover:cursor-pointer
                            hover:border-2 active:scale-95 active:border-light-1 ${pay_item.name == pay_mode ? 'border-2 border-light-1' : " "}`}
                                    src={pay_item.image} />
                                <p className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-semibold text-lg  ${pay_item.name == pay_mode ? '' : " opacity-50"}`}>{pay_item.name_bn}</p>
                            </div>)}

                        </div>
                    </div>
                    <div>
                        <InputBlock qty={qty} selected_cat_id={selected_cat_id} selected_product={selected_product}
                            setQty={setQty} setSelected_cat_id={setSelected_cat_id} setSelected_product={setSelected_product} />
                    </div>
                    {selected_product && <button type='submit'
                        className=' py-2 font-semibold text-sm px-6 bg-expense-light bg-opacity-60 my-2 shadow-lg rounded-md
                         active:scale-95'>Add Item</button>}
                    {itemList && <button className=' mx-1 py-2 font-semibold text-sm px-6 bg-expense-light bg-opacity-60 my-2 shadow-lg rounded-md active:scale-95'
                        onClick={handleAddtoDatabase}>Send</button>}
                    {/*     <button className=' mx-1 py-2 font-semibold text-sm px-6 bg-expense-light bg-opacity-60 my-2 shadow-lg rounded-md active:scale-95'
                        onClick={handleTest}>Send test</button> */}


                </form>

                <ItemViewer list={itemList} />
            </div>






        </div>
    )
}

export default AddExpense