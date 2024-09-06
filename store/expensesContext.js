import { createContext, useContext, useReducer } from "react";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2024-9-1"),
  },
  {
    id: "e2",
    description: "A pair of glasses",
    amount: 189.99,
    date: new Date("2024-8-1"),
  },
  {
    id: "e3",
    description: "Some bananas",
    amount: 9.99,
    date: new Date("2024-9-2"),
  },
  {
    id: "e4",
    description: "Text books",
    amount: 59.99,
    date: new Date("2024-9-4"),
  },
  {
    id: "e5",
    description: "Another book",
    amount: 29.99,
    date: new Date("2024-8-20"),
  },
];

const ExpensesContext = createContext();

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const id = new Date().toString() + Math.random().toFixed();
      return [{ ...action.payload, id: id }, ...state];
    case "UPDATE":
      const updatedExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatedExpense = state[updatedExpenseIndex];
      const updatedItem = { ...updatedExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatedExpenseIndex] = updatedItem;
      return updatedExpenses;
    case "DELETE":
      const filterExpenses = state.filter(
        (expense) => expense.id !== action.payload
      );
      return filterExpenses;
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [state, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses: state, addExpense, deleteExpense, updateExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpensesContext() {
  const { expenses, addExpense, deleteExpense, updateExpense } =
    useContext(ExpensesContext);

  return { expenses, addExpense, deleteExpense, updateExpense };
}

export default ExpensesContextProvider;

