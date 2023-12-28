import React, { useEffect, useState } from 'react';
import '../Assets/form.css';
import card from '../Assets/card.png';
import cash from '../Assets/cash.png';
import credit from '../Assets/credit.png';
import { categories, products } from '../Assets/data';
import DatePicker from '../Components/DatePicker';
const InputBlock = () => {
    const [selected_cat_id, setSelected_cat_id] = useState(1);
    const [selected_product, setSelected_product] = useState(null);
    const [qty, setQty] = useState(1);

    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-5 gap-2'>
                {categories.map(item => {
                    return <div className={`bg-slate-400 bg-opacity-50 p-2  active:scale-95
                    border-2  ${selected_cat_id==item?.id?" border-light-1":" border-transparent"} `}onClick={(e)=>setSelected_cat_id(item?.id)}>
                 <img className='h-16 w-16 mx-auto' src={item?.image} /></div>
                })}
            </div>
            <div className='grid grid-cols-5 gap-2'>
                {products.filter(item => item?.cat_id == selected_cat_id).map(item => {
                    return <div className={`bg-slate-400 bg-opacity-50 p-2 active:scale-95
                    border-2 ${selected_product?.name==item?.name?" border-light-1":" border-transparent"} `} onClick={(e)=>setSelected_product(item)}>
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

const ItemCard = ({ itemName, quantity, price }) => (
    <div>
        <p>{itemName}</p>
        <p>{quantity}</p>
        <p>{price}</p>
    </div>
);
const modes = [{ name: "credit", name_bn: "বাকি", image: credit }, { name: "cash", name_bn: "নগদ", image: cash }, { name: "card", name_bn: "কার্ড", image: card }]


const AddExpense = () => {

    const [formData, setFormdata] = useState(null)
    const [itemList, setItemList] = useState(null)
    const [pay_mode, setPay_mode] = useState('credit')
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleAddItem = (e) => {
        e.stopPropagation()
    }
    const handleDateChange = (newDate) => {
        setFormdata({ ...formData, date: newDate });
    };

    useEffect(() => {
        // Initialize form data
        const date = new Date();
        setFormdata({ date: date.toISOString(), time: date.toLocaleTimeString() });
    }, []);


    const handleModeChange = (e, mode_name) => {
        setPay_mode(mode_name);
    }
    return (
        <div className="px-[8%] text-light-1 ">
            <h2 className="text-3xl py-4 tracking-wider font-semibold"> Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <InputBlock />
                </div>
                <button type='submit'
                    className=' py-2 font-semibold text-sm px-6 bg-expense-light bg-opacity-60 my-2 shadow-lg rounded-md active:scale-95'>Add Item</button>
            </form>
            <div>
                {itemList ? itemList.map(item => <ItemCard property={item} />) : <></>}
            </div>


        </div>
    )
}

export default AddExpense