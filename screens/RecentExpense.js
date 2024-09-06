import { useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useExpensesContext } from "../store/expensesContext";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

import ErrorOverlay from "../components/UI/ErrorOverlay";
import LoadingOverlay from "../components/UI/LoadingOverlay";

function RecentExpense() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const { expenses, setExpenses } = useExpensesContext();

  useEffect(() => {
    // 在App初次加载时从API读取全部的数据
    // 读取后App的数据操作都从local context中进行，这样不但可以实现数据的即时性，而且可以减少API调用
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses();
        setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      } finally {
        setIsFetching(false);
      }
    }
    getExpenses();
  }, []);

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date > date7DaysAgo && expense.date <= today;
  });

  function errorHandler() {
    setError("");
  }

  if (error && !isFetching)
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;

  // Add loading spinner
  if (isFetching) return <LoadingOverlay />;

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensePeriod="Last 7 Days"
      fallbackText="No expenses added in 7 days"
    />
  );
}

export default RecentExpense;

