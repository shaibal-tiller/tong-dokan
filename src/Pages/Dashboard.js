// Dashboard.js
import React, { useEffect, useState } from 'react';
import AverageExpense from '../Components/AverageExpense';
import ExpenseChart from '../Components/ExpenseChart';
import FavoriteItems from '../Components/FavoriteItems';
import MonthlyProjection from '../Components/MonthlyProjection';
import TotalBox from '../Components/TotalBox';
import Chart from '../Components/Chart';
import { data } from '../Assets/data';
import { Link } from 'react-router-dom';
import { getDataByDay, getMonthDetails, initializeBalance, initializeMonthData, month } from '../Components/firebaseUtil';
import Modal from '../Components/Modal';
import { GetContext } from '../Context';

const Dashboard = () => {

  const current_month = month[new Date().getMonth()]
  const myContext = GetContext()
  const current_date = new Date()
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [month_data, set_month_data] = useState([])
  const [today_data, setToday_data] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)

  const handlePlusClick = (e) => {
    setOptionsOpen(!optionsOpen)
  }


  // useEffect(() => {
  //   getMonthDetails(current_date.toLocaleDateString(), set_month_data)
  // }, [])

  useEffect(() => {
    let todaytotal = 0
    let monthtotal = 0;
    const temp_data = myContext.monthExpenseDetails && Object.values(myContext.monthExpenseDetails)?.map(item => {
      item.map(in_item => {
        const data_date = new Date(in_item.date).toLocaleDateString();

        monthtotal += in_item.quantity * in_item.unit_price
        if (data_date == current_date.toLocaleDateString()) {
          todaytotal += in_item.quantity * in_item.unit_price
        }
      })
    })

    setMonthTotal(monthtotal)

    myContext.set_today_data(todaytotal)
  }, [myContext.monthExpenseDetails])


  const initializeSetup = () => {
    initializeBalance(myContext.setBalance)
    initializeMonthData(current_date.toLocaleDateString(), myContext.setMonthExpenseDetails)

    // 2.
  }
  useEffect(() => {
    if (!isModalOpen) {
      initializeSetup()
    }
  }, [isModalOpen])

  useEffect(()=>{
    getDataByDay()
  },[])

  const expetedTotal = (current_total) => {
    const currentDate = new Date();

    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysLeft = lastDayOfMonth.getDate() - currentDate.getDate() ;
    const daysInMonth = lastDayOfMonth.getDate();
    
   const current_average =  (current_total / (daysInMonth-daysLeft)) *daysInMonth
   return Math.ceil(current_average) || 0
  //  const reamaining_days =  
  }

  return (
    <div className={`px-[10%] overflow-hidden `}>
      <div className={` ${isModalOpen ? " blur-sm" : ""}`}>
        <h1 className='text-xl font-semibold text-white'>Dashboard</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4  my-4'>
          <TotalBox amount={myContext.today_data} title={'Today'} sub={current_date.toLocaleDateString()} color={'#813D37'} />
          <TotalBox amount={myContext.balance} title={myContext.balance < 0 ? 'Advance' : 'Due sum'} sub={current_month} color={'#955637'} />
          <TotalBox amount={monthTotal} title={'This Month'} sub={current_month} color={'#68272E'} />
          <TotalBox amount={expetedTotal(monthTotal)} title={'Expected '} sub={current_month} color={'#955637'} />
        </div>
        <div className='h-[30vh] w-full '>
          <Chart data={data} datakey={'expense'} />
        </div>

        <div className=' absolute bottom-8 left-8 w-[5rem] gap-x-2 h-[5rem] rounded-full  right-0'>

          <div onClick={handlePlusClick}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff"
            className="w-full h-full  bg-expense-light rounded-full ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg> </div>
        </div>
        {optionsOpen && <div className='flex flex-col justify-end gap-y-4  items-start absolute  bottom-6 left-36  gap-x-2 h-[5rem] rounded-full   right-0 text-lg text-expense-light'>
          <Link to='/add' className='bg-dark-1 border-2 px-2' >Add Expense</Link >
          <button onClick={(e) => { setIsModalOpen(true) }} className='bg-dark-1 border-2 px-2' >Add payment</button >
          <button className='bg-dark-1 border-2 px-2' >Beta Version</button >
        </div>}
        <AverageExpense />
        <ExpenseChart />
        <FavoriteItems />
        <MonthlyProjection />
      </div>
      {isModalOpen && <Modal onclose={setIsModalOpen} />}
    </div>
  );
};

export default Dashboard;
