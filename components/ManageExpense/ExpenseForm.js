import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import Input from "./Input";
import Button from "../../components/UI/Button";
import { useExpensesContext } from "../../store/expensesContext";
import ErrorText from "./ErrorText";
import { editExpense, storeExpense } from "../../util/http";
import LoadingOverlay from "../UI/LoadingOverlay";

export default function ExpenseForm({
  isEditing,
  editedExpenseId,
  isLoading,
  setIsLoading,
}) {
  const { expenses, addExpense, updateExpense } = useExpensesContext();
  const navigation = useNavigation();

  const [amountValue, setAmountValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [submitIsInValid, setSubmitIsInValid] = useState({
    inValid: false,
    label: [],
    message: "",
  });

  useEffect(() => {
    if (editedExpenseId) {
      const currentExpenseIndex = expenses.findIndex(
        (expense) => expense.id === editedExpenseId
      );
      const currentExpense = expenses[currentExpenseIndex];

      setAmountValue(currentExpense.amount.toString());
      setDateValue(
        `${currentExpense.date.getFullYear()}-${
          currentExpense.date.getMonth() + 1
        }-${currentExpense.date.getDate()}`
      );
      setDescriptionValue(currentExpense.description);
    }
  }, []);

  function amountChangedHandler(enteredText) {
    setAmountValue(enteredText);
  }

  function dateChangedHandler(enteredText) {
    setDateValue(enteredText);
  }

  function descriptionChangedHandler(enteredText) {
    setDescriptionValue(enteredText);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler() {
    const expenseData = {
      amount: Number(amountValue),
      date: new Date(dateValue),
      description: descriptionValue,
    };

    // Data validation
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      const newLabels = [];
      const messages = [];

      if (!amountIsValid) {
        newLabels.push("amount");
        messages.push("Amount is invalid");
      }

      if (!dateIsValid) {
        newLabels.push("date");
        messages.push("Date is invalid");
      }

      if (!descriptionIsValid) {
        newLabels.push("description");
        messages.push("Description is invalid");
      }

      // 更新状态
      setSubmitIsInValid({
        inValid: true,
        label: newLabels,
        message: messages[0],
      });

      return;
    }

    if (isEditing) {
      await editExpense(editedExpenseId, expenseData);
      updateExpense(editedExpenseId, expenseData);
      setIsLoading(false);
    } else {
      // 把新加的数据post到firebase
      const id = await storeExpense(expenseData);
      // 更新local context - 这样就可以即时显示新添加的数据
      addExpense({ ...expenseData, id: id });
      setIsLoading(false);
    }

    navigation.goBack();
  }

  if (isLoading) return <LoadingOverlay />;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>

      <View style={styles.inputsRow}>
        <Input
          label="amount"
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: amountChangedHandler,
            value: amountValue,
          }}
          errorStyle={
            submitIsInValid.label.includes("amount") && styles.errorRowInput
          }
          style={styles.rowInput}
        />
        <Input
          label="date"
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: dateChangedHandler,
            value: dateValue,
          }}
          errorStyle={
            submitIsInValid.label.includes("date") && styles.errorRowInput
          }
          style={styles.rowInput}
        />
      </View>

      <Input
        label="description"
        textInputConfig={{
          multiline: true,
          autoCorrect: false, //default: true
          autoCapitalize: "none", // default: sentence
          onChangeText: descriptionChangedHandler,
          value: descriptionValue,
        }}
        errorStyle={
          submitIsInValid.label.includes("description") && styles.errorRowInput
        }
      />

      {submitIsInValid.inValid && (
        <ErrorText errorText={submitIsInValid.message} />
      )}

      {/* React Native里没有像传统 HTML 表单那样的内置 <Form> 组件，所以可以通过按钮点击后的onPress事件进行实现 */}
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="flat" onPress={cancelHandler}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 24,
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorRowInput: {
    backgroundColor: "pink",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
