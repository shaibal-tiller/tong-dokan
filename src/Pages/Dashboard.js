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
import { fetchDataByMonthAndYear, getDataByDay, getMonthDetails, getValuesFromDocument, initializeBalance, initializeMonthData, month, } from '../Components/firebaseUtil';
import Modal from '../Components/Modal';
import { GetContext } from '../Context';
import TransactionHistoryShort from '../Components/TransactionHistoryShort';
import BottomNav from '../Components/BottomNav';
import HistoryModal from '../Components/HistoryModal';

const Dashboard = () => {

  const current_month = month[new Date().getMonth()]
  const myContext = GetContext()
  const current_date = new Date()
  const [historyOn, setHistoryOn] = useState(false)

  // const [month_data, set_month_data] = useState([])
  // const [today_data, setToday_data] = useState(0)
  const [monthTotal, setMonthTotal] = useState(0)




  // useEffect(() => {
  //   getMonthDetails(current_date.toLocaleDateString(), set_month_data)
  // }, [])

  useEffect(() => {
    let todaytotal = 0
    let monthtotal = 0;

    const temp_data = myContext.monthExpenseDetails && Object.values(myContext.monthExpenseDetails)?.map(item => {

      item.map((in_item, index) => {
        const data_date = new Date(in_item.date).getDate()

        monthtotal += in_item.quantity * in_item.unit_price

        if (data_date == current_date.getDate()) {

          todaytotal += in_item.quantity * in_item.unit_price
        }
      })
    })

    setMonthTotal(monthtotal)

    myContext.set_today_data(todaytotal)
  }, [myContext.monthExpenseDetails])


  const initializeSetup = () => {
    initializeBalance(myContext.setBalance)
    initializeMonthData(current_date, myContext.setMonthExpenseDetails)

  }
  useEffect(() => {
    initializeSetup()

  }, [])

  useEffect(() => {
    getDataByDay()
    fetchDataByMonthAndYear('Jan','24')
  }, [])
  const expetedTotal = (current_total) => {
    const currentDate = new Date();

    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysLeft = lastDayOfMonth.getDate() - currentDate.getDate();
    const daysInMonth = lastDayOfMonth.getDate();

    const current_average = (current_total / (daysInMonth - daysLeft)) * daysInMonth
    return Math.ceil(current_average) || 0
    //  const reamaining_days =  
  }



  return (
    <div className={`px-[10%] overflow-hidden `}>
      <div className={''/* ` ${isModalOpen ? " blur-sm" : ""}` */}>
        <h1 className='text-xl font-semibold text-white'>Dashboard</h1>

        <div className={`${historyOn?"blur-md":""} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4  my-4`}>
          <TotalBox amount={myContext.today_data} title={'Today'} sub={current_date.toLocaleDateString()} color={'#813D37'} />
          <TotalBox amount={myContext.balance} title={myContext.balance < 0 ? 'Advance' : 'Due sum'} sub={current_month} color={'#955637'} />
          <TotalBox amount={monthTotal} title={'This Month'} sub={current_month} color={'#68272E'} />
          <TotalBox amount={expetedTotal(monthTotal)} title={'Expected '} sub={current_month} color={'#955637'} />
        </div>
        <div className='hidden h-[30vh] w-full '>
          <Chart data={data} datakey={'expense'} />
        </div>

        {/*     <div className=' absolute bottom-8 left-8 w-[5rem] gap-x-2 h-[5rem] rounded-full  right-0'>
          <div onClick={handlePlusClick}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff"
            className="w-full h-full  bg-expense-light rounded-full ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg> </div>
        </div> */}

        <TransactionHistoryShort historyOn={historyOn} allListHandler={(e) => {console.log("ajhdjh"); setHistoryOn(true)}} />
        {/*    <BottomNav /> */}

        {/*         <AverageExpense />
        <ExpenseChart />
        <FavoriteItems />
        <MonthlyProjection /> */}
      </div>
     {historyOn ?  <HistoryModal  handleClose={() => setHistoryOn(false)}/>:<></>}
    </div>
  );
};

export default Dashboard;
