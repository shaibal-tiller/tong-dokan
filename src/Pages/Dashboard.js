// Dashboard.js
import React from 'react';
import AverageExpense from '../Components/AverageExpense';
import ExpenseChart from '../Components/ExpenseChart';
import FavoriteItems from '../Components/FavoriteItems';
import MonthlyProjection from '../Components/MonthlyProjection';
import TotalBox from '../Components/TotalBox';
import Chart from '../Components/Chart';
import { data } from '../Assets/data';

const Dashboard = () => {
  const month = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
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
        <Chart data={data} datakey={'expense'}/>
      </div>


      <AverageExpense />
      <ExpenseChart />
      <FavoriteItems />
      <MonthlyProjection />
    </div>
  );
};

export default Dashboard;
