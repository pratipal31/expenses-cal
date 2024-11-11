import { useState, useEffect } from "react";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("date");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpense(total);
    setRemainingBudget(budget - total);

    setShowAlert(total > budget * 0.8);
  }, [expenses, budget]);

  const addExpense = () => {
    if (!category || !amount || !date) return;

    const newExpense: Expense = {
      id: expenses.length + 1,
      category,
      amount: parseFloat(amount),
      date,
    };

    setExpenses([...expenses, newExpense]);
    setCategory("");
    setAmount("");
    setDate("");
  };

  const sortExpenses = (option: string) => {
    const sortedExpenses = [...expenses].sort((a, b) => {
      if (option === "amount") return b.amount - a.amount;
      if (option === "category") return a.category.localeCompare(b.category);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setExpenses(sortedExpenses);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Expense Tracker</h1>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Set Monthly Budget</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Enter monthly budget"
            value={budget || ""}
            onChange={(e) => setBudget(parseFloat(e.target.value))}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={() => setRemainingBudget(budget)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Set Budget
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">Remaining Budget: ${remainingBudget.toFixed(2)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={addExpense}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Expense
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Expenses Overview</h3>
        <p className="text-sm text-gray-600">Total Expenses: ${totalExpense.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Remaining Budget: ${remainingBudget.toFixed(2)}</p>
      </div>

      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline"> You have used more than 80% of your budget.</span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Expense List</h3>
        <div className="flex items-center space-x-2 mb-4">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              sortExpenses(e.target.value);
            }}
            className="p-2 border rounded"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}