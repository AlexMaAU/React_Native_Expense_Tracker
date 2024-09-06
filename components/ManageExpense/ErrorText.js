import { StyleSheet, Text } from "react-native";

export default function ErrorText({ errorText }) {
  return <Text style={styles.errorText}>{errorText}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: "white",
    textAlign: "center",
  },
});

