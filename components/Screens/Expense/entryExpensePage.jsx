import React, { useState, useEffect } from "react";
import { useContext } from "react";
import DataContext from "../../../context/DataContext";
import {
  NativeBaseProvider,
  Pressable,
  Text,
  Button,
  Modal,
  Center,
  Container,
  Input,
  View,
  KeyboardAvoidingView,
} from "native-base";
import DatePicker from "react-native-neat-date-picker";
import { ModalPicker } from "./modalExpensePicker";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";

const EntryExpensePage = ({ navigation }) => {
  // click handler loading
  const [clicked, setClicked] = useState(false);

  // useContext
  const { userContext, expenseEntryContext, expenseForceRenderContext } =
    useContext(DataContext);
  const [userId, setUserId] = userContext;
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

  // validation
  const [isAmountValid, setIsAmountValid] = useState(true)

  const validateNum = (price) =>{
   const  re = /^[0-9]*$/
   
   // const result = re.test(price)
   // console.log("result", result)
   return re.test(String(price).toLowerCase())
 
 }

 const onAmountBlur = (bool) =>{
   const isAmountValid = validateNum(bool)
   setIsAmountValid(isAmountValid) //set as true or false

 }

  // useState
  const [show, setShow] = useState(false);

  // Modal for category
  const [isModalVisible, setIsModalVisible] = useState(false);

  const changeModalVisibility = (bool) => {
    setIsModalVisible(bool);
  };

  const setData = (option) => {
    setCategory(option);
  };

  // clear states onload at entryexpense page
  useEffect(() => {
    const resetPage = navigation.addListener("focus", () => {
      setDate(new Date());
      setAmount([]);
      setCategory("Shopping");
      setDescription("");
    });
    return resetPage;
  }, [expenseForceRender]);

  // Date Picker
  const onCancel = () => {
    setShow(false);
  };

  const onConfirm = (date) => {
    setShow(false);
    setDate(date);
  };

  // to show and hide date picker
  const showDatepicker = () => {
    setShow(true);
  };

  const formattedDate = moment(date, moment.ISO_8601).format("YYYY-MM-DD");


  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const res = await fetch(
        "https://roundup-api.herokuapp.com/data/expense",
        {
          method: "POST",
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
        //console.error("create data expense failed");
        // validation
        if (isAmountValid === false){
          alert("One of the fields is invalid. Create failed!")
          setClicked(false);
          return navigation.navigate("Add Money Out")
        }
      // no field validation error
      if (amount.length < 1 || description.length < 1 ){
        alert("One of the fields is empty. Create failed!")
        setClicked(false);
        return navigation.navigate("Add Money Out")
      }
      }

      setExpenseForceRender(!expenseForceRender);
      

    } catch (err) {
      console.log(err);
    }
    setClicked(false);
    navigation.navigate("Money Out");
  };

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        h={{
          base: "100%",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Center flex={1} bgColor="#fff">
          <View width="90%" paddingRight={5} alignItems="flex-end">
            <Pressable
              onPress={() => {
                navigation.navigate("Money Out");
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </Pressable>
          </View>
          <Container width="90%" pt="0" p="4" bgColor="#fff">
            <Text fontSize="sm" fontWeight="bold">
              Date
            </Text>
            <Pressable width="100%" onPress={showDatepicker}>
              <Text
                fontSize="sm"
                mt="1"
                borderRadius="sm"
                borderColor="coolGray.200"
                borderWidth="1"
                p="2"
              >
                {formattedDate}
              </Text>
            </Pressable>
            <DatePicker
              isVisible={show}
              mode={"single"}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          </Container>
          <Container width="90%" px="4" bgColor="#fff">
            <Text fontSize="sm" fontWeight="bold">
              Amount
            </Text>
            <Input
              width="100%"
              fontSize="sm"
              mt="1"
              color="coolGray.600"
              placeholder="amount"
              value={amount.toString()}
              onChangeText={(text) => setAmount(text)}
              onBlur={() =>onAmountBlur(amount)}
            />
            {isAmountValid ? "" : <Text color="red.600">Invalid Amount</Text>}
          </Container>
          <Container width="90%" px="4" bgColor="#fff">
            <Text fontSize="sm" fontWeight="bold">
              Category
            </Text>
            <Pressable width="100%" onPress={() => changeModalVisibility(true)}>
              <Text
                fontSize="sm"
                mt="1"
                borderRadius="sm"
                borderColor="coolGray.200"
                borderWidth="1"
                p="2"
              >
                {category}
              </Text>
            </Pressable>
            <Modal
              isOpen={isModalVisible}
              defaultIsOpen="false"
              onClose={() => changeModalVisibility(false)}
              size="sm"
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header
                  _text={{
                    fontWeight: "bold",
                    fontSize: "sm",
                  }}
                >
                  Category
                </Modal.Header>
                <Modal.Body>
                  <ModalPicker
                    changeModalVisibility={changeModalVisibility}
                    setData={setData}
                  />
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Container>
          <Container width="90%" px="4" pt="4" bgColor="#fff">
            <Text fontSize="sm" fontWeight="bold">
              Description
            </Text>
            <Input
              width="100%"
              fontSize="sm"
              mt="1"
              color="coolGray.600"
              placeholder="description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </Container>
          <Button
            size="sm"
            variant="outline"
            bgColor="white"
            colorScheme="light"
            onPressIn={()=>setClicked(true)} 
            isLoading={clicked ? true : false}
            onPress={handleSubmit}
            mt="5"
          >
            <Text>Add Money Out</Text>
          </Button>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};

export default EntryExpensePage;
