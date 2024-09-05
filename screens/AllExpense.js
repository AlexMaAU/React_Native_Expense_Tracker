import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useExpensesContext } from "../store/expensesContext";

function AllExpense() {
  const { expenses } = useExpensesContext();

  return <ExpensesOutput expenses={expenses} expensePeriod="Total" />;
}

export default AllExpense;

