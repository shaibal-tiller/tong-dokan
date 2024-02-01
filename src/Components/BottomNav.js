import React, { useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const BottomNav = () => {
    const [openTab, setOpenTab] = useState('Dashboard');

    const handleTabClick = (tab) => {
        setOpenTab(tab);
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-gray-800 rounded-t-full border-expense-light border-[1px]">
            <div className="grid grid-cols-3 place-items-center text-gray-300 overflow-hidden w-full rounded-t-full">
                <Link
                    to="/"
                    onClick={() => handleTabClick('Dashboard')}
                    className={`w-full text-center py-2 transition duration-800 ${openTab === 'Dashboard' ? 'bg-blue-500' : ''}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/add"
                    onClick={() => handleTabClick('Expense')}
                    className={`w-full text-center py-2 transition duration-800 ${openTab === 'Expense' ? 'bg-red-500' : ''}`}
                >
                    Expense
                </Link>
                <Link
                    to="/pay"
                    onClick={() => handleTabClick('Pay')}
                    className={`w-full text-center py-2 transition duration-800 ${openTab === 'Pay' ? 'bg-green-500' : ''}`}
                >
                    Pay
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;