import * as React from "react";
import DataContext from "../context/DataContext";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Picker,
  SafeAreaView,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeBaseProvider, KeyboardAvoidingView } from "native-base";

const EditExpensePage = ({ navigation, route }) => {
  const { entry } = route.params;

  // useContext
  const { userContext, expenseEntryContext, expenseForceRenderContext } = React.useContext(DataContext);
  const [userId, setUserId] = userContext;
  
  // useState
  const [show, setShow] = React.useState(false);

  const [
    date,
    setDate,
    amount,
    setAmount,
    category,
    setCategory,
    description,
    setDescription,
  ] = expenseEntryContext;
  const [expenseForceRender, setExpenseForceRender] = expenseForceRenderContext;

  const handleSubmit = async (expense) => {
    try {
      // event.preventDefault();
      const res = await fetch(
        `https://roundup-api.herokuapp.com/data/expense/${expense._id}/edit`,
        {
          method: "PUT",
          body: JSON.stringify({
            username: userId,
            expensesentry: {
              date: date,
              amount: amount,
              category: category,
              description: description,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status !== 200) {
        console.error("edit data expense failed");
      }
      
      const data = await res.json();
      // pass the data into params entry so that showpage will show latest updated data
      navigation.navigate("Show Expense Page", { entry: data });
    } catch (err) {
      console.log(err);
    }
  };

    // Date Picker
    const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate || new Date(date);
      setDate(currentDate);
      //setShow(false)
    };

  // to show and hide date picker
  // const showDatepicker = () => {
  //   setShow(true);
  // };

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        h={{
          base: "100%",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.inner}>
            
            <DateTimePicker
              style={styles.datepicker}
              value={new Date(date)}
              onChange={onChangeDate}
            />
            {/* <View>
              <Button
                onPress={showDatepicker}
                title={new Date(date).toString().substr(0,15)}
              />
            </View> */}
            {/* {show && (
              <DateTimePicker
                value={date}
                // value={new Date(date)}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )} */}
            <TextInput
              style={styles.textinput}
              name="amount"
              placeholder="Enter Amount"
              value={amount.toString()}
              onChangeText={(text) => setAmount(text)}
            />

            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setCategory(itemValue)
              }
            >
              <Picker.Item label="Shopping" value="Shopping" />
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item label="Transportation" value="Transportation" />
              <Picker.Item label="Household" value="Household" />
            </Picker>

            <TextInput
              style={styles.textinput}
              type="text"
              name="description"
              placeholder="Enter Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />

            <View style={styles.button}>
              <Button
                title="Update"
                onPress={() => {
                  handleSubmit(entry);
                  // this is needed to force showpage to re-render as it will not mount again
                  //setExpenseForceRender(!expenseForceRender) //not needed
                }}
              />
              <Button
                title="Back"
                onPress={() =>
                  navigation.navigate("Show Expense Page", { entry: entry })
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};

export default EditExpensePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  datepicker: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderColor: "gray",
    // borderWidth: 1,
    right: 100,
  },
  textinput: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  picker: {
    justifyContent: "center",
    // left: 60,
  },
  button: {
    flexDirection: "row",
    alignSelf: "center",
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-end",
  },
});
