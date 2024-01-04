import { useState } from "react"
import { getExpenseByDate } from "./firebaseUtil"

const TYPES = ['Today', 'Expected', 'This Month', 'Due Sum',]

const TotalBox = ({amount, title, color, sub }) => {

  // const [amount, setAmount] = useState(0)
  switch (title) {
    case TYPES[0]:
      const date= new Date()
      
      // getExpenseByDate(date.toLocaleDateString())
      break;

    default:
      break;
  }
  return (<div
    style={{
      background: 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      '--tw-gradient-from': `${color} var(--tw-gradient-from-position)`,
      '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
      '--tw-gradient-to': `${color}22 var(--tw-gradient-to-position)`,
    }}
    className={` h-32 w-40 p-2 rounded-2xl bg-opacity-10 border-2 text-light-1 flex flex-col justify-between items-center`}>
    <h2 className='font-semibold tracking-wider text-md capitalize text-center'>{title}</h2>
    <div>
      <p className="text-xs font-thin text-center">{sub}</p>
      <p className='font-bold text-3xl'>৳{amount}</p>
    </div>
  </div>)
}
export default TotalBox