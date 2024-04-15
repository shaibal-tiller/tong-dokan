import React, { useEffect, useState } from 'react';
import Chart, { Legend, Tooltip } from 'chart.js/auto';
import { GetContext } from '../Context';
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const AnalyticsModal = ({ handleClose }) => {
    const myContext = GetContext();
    const [weeklyData, setWeeklyData] = useState([]);
    const [days_, setDays_] = useState([])
    const [bardata, setbardata] = useState([])

    useEffect(() => {
        // Calculate the past seven days including today
        const currentDate = new Date();
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        setDays_(days)
        // Calculate the sum of amount for each day
        const weeklySum = days.map(day => {
            let sum = 0;
            myContext.monthExpenseDetails.credit.map(transaction => {

                if (new Date(transaction.date).toLocaleDateString() == new Date(day).toLocaleDateString()) {
                    sum += parseInt(transaction.unit_price) + transaction.quantity;

                }
            });
            myContext.monthExpenseDetails.cash.map(transaction => {
                if (new Date(transaction.date).toLocaleDateString() == new Date(day).toLocaleDateString()) {
                    sum += parseInt(transaction.unit_price) + transaction.quantity;

                }
            });
            return sum;
        });

        // Update the state with the weekly data
        setWeeklyData(weeklySum.reverse()); // Reverse the array to maintain the order of days
    }, [myContext.monthExpenseDetails]);

    // Create the chart after rendering
    useEffect(() => {
        setbardata(weeklyData.map((el, index) => {
            return {
                name: days_[index],
                val: el
            }
        }))
    }, [weeklyData]);


    return (
        <div className='left-0 top-20 h-[80vh] overflow-y-auto w-full  absolute z-50 px-[15%] bg-slate-500-200 bg-opacity-50 text-white'>
            <button className='' onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            <button className='font-semibold shadow-md border-b-2 border-b-transparent border-b-expense-light text-expense-light'>Weekly</button>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={"100%"}
                    height={"50%"}
                    data={bardata}
                   
                >
                    
                    <XAxis dataKey="name" />
                    <YAxis />
                 
                    <Legend />
                    <Bar dataKey="val" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>

            <button className='font-semibold shadow-md border-b-2 border-b-transparent border-b-expense-light text-expense-light'>Monthly</button>


        </div>
    );
};

export default AnalyticsModal;
