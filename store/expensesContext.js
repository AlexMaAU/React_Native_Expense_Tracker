import { createContext, useContext, useReducer } from "react";

const ExpensesContext = createContext();

function expensesReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload.reverse();
    case "ADD":
      return [action.payload, ...state];
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
  const [state, dispatch] = useReducer(expensesReducer, []);

  // 负责在App初次加载时从API读取全部的数据
  function setExpenses(expense) {
    dispatch({ type: "SET", payload: expense });
  }

  // 读取后App的数据操作都从local context中进行，这样不但可以实现数据的即时性，而且可以减少API调用
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
      value={{
        expenses: state,
        setExpenses,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpensesContext() {
  const { expenses, setExpenses, addExpense, deleteExpense, updateExpense } =
    useContext(ExpensesContext);

  return { expenses, setExpenses, addExpense, deleteExpense, updateExpense };
}

export default ExpensesContextProvider;

