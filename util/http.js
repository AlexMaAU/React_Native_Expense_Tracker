import axios from "axios";

// .env中的参数一定要使用EXPO_PUBLIC_为开头，否则无法读取环境变量
const firebaseUrl = process.env.EXPO_PUBLIC_FIREBASE_URL;

export async function storeExpense(expenseData) {
  const response = await axios.post(
    `${firebaseUrl}/expenses.json`,
    expenseData
  );
  // 获取Firebase自动生成的ID，firebase中叫做name
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(`${firebaseUrl}/expenses.json`); // firebase的URL一定要加上.json，官方要求

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }

  return expenses;
}

// 因为不需要返回数据，所以可以不加await，后面没有代码需要用到API调用后返回的数据
export function editExpense(id, expenseData) {
  return axios.put(`${firebaseUrl}/expenses/${id}.json`, expenseData);
}

export function removeExpense(id) {
  return axios.delete(`${firebaseUrl}/expenses/${id}.json`);
}

