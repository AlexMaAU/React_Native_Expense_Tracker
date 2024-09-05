import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useExpensesContext } from "../store/expensesContext";
import { getDateMinusDays } from "../util/date";

function RecentExpense() {
  const { expenses } = useExpensesContext();

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date > date7DaysAgo;
  });

  return (
    <ExpensesOutput expenses={recentExpenses} expensePeriod="Last 7 Days" />
  );
}

export default RecentExpense;

