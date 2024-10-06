import React from 'react'
import {format} from "date-fns"
const GetMonthly = ({transactions}) => {
    const getMonthYear = (dateStr) => format(new Date(dateStr), 'MMM yyyy');
    const monthlyBreakdown = transactions.reduce((acc, transaction) => {
        const monthYear = getMonthYear(transaction.Date);
    
        if (!acc[monthYear]) {
          acc[monthYear] = { income: 0, expense: 0 };
        }
    
        if (transaction.type =='Income') {
          acc[monthYear].income += transaction.amount;
        } else if (transaction.type =='Expense') {
          acc[monthYear].expense += transaction.amount;
        }
    
        return acc;
      }, {});
  return (
    <div className="container mx-auto p-6">

      {/* Monthly Breakdown */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Monthly Breakdown</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-600">Month</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-600">Total Income</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-600">Total Expenditure</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(monthlyBreakdown).map((monthYear) => (
              <tr key={monthYear} className="text-center borber-b border-gray-200">
                <td className="p-3 text-sm text-gray-600">{monthYear}</td>
                <td className="p-3 text-sm font-bold text-right text-green-600">₹{monthlyBreakdown[monthYear].income.toFixed(2)}</td>
                <td className="p-3 text-sm font-bold text-right text-red-600">₹{monthlyBreakdown[monthYear].expense.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GetMonthly