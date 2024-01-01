// Dashboard.js
import React from 'react';
import AverageExpense from '../Components/AverageExpense';
import ExpenseChart from '../Components/ExpenseChart';
import FavoriteItems from '../Components/FavoriteItems';
import MonthlyProjection from '../Components/MonthlyProjection';
import TotalBox from '../Components/TotalBox';
import Chart from '../Components/Chart';
import { data } from '../Assets/data';
import { Link } from 'react-router-dom';
import { month } from '../Components/firebaseUtil';

const Dashboard = () => {

  const current_month = month[new Date().getMonth()]

  const current_date = new Date().toLocaleDateString()


  return (
    <div className='px-[10%]'>
      <h1>Dashboard</h1>
      <div className='grid grid-cols-5 '>
        <TotalBox amount={4000} title={'Today'} sub={current_date} color={'#813D37'} />
        <TotalBox amount={4000} title={'This Month'} sub={current_month} color={'#68272E'} />
        <TotalBox amount={4000} title={'Expected '} sub={current_month} color={'#955637'} />
        <TotalBox amount={4000} title={'Due Sum '} sub={current_month} color={'#955637'} />
      </div>
      <div className='h-[30vh] w-full '>
        <Chart data={data} datakey={'expense'} />
      </div>

     <Link to={'/add'}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff"
       className="w-16 h-16 absolute bottom-8 left-8 bg-expense-light rounded-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg> </Link>



      <AverageExpense />
      <ExpenseChart />
      <FavoriteItems />
      <MonthlyProjection />
    </div>
  );
};

export default Dashboard;
