import React, { useState, useContext } from "react";
import {
  FormControl,
  Stack,
  Input,
  Heading,
  Center,
  NativeBaseProvider,
  Button,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Icon,
} from "native-base";
import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import loginAuth from "../api/loginAuth";
import getUserId from "../api/getUserId";
import DataContext from "../../context/DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage({ navigation }) {
  // useState
  const [isLoginValid, setIsLoginValid] = useState("pass");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [clicked, setClicked] = useState(false);

  // useContext
  const { userContext } = useContext(DataContext);
  const [user, setUser] = userContext;

  // password state
  const [show, setShow] = useState(false);
  const passwordHandler = () => setShow(!show);

  //check login
  async function loginHandler() {
    setClicked(true)
    const checkUserAuth = await loginAuth(username, password);
    setIsLoginValid(
      checkUserAuth.error
        ? checkUserAuth.error == "invalid user"
          ? "invalid user"
          : "invalid password"
        : "pass"
    );
    try {
      // store tokens in FE
      await AsyncStorage.setItem("accessToken", checkUserAuth.accessToken);
      await AsyncStorage.setItem("refreshToken", checkUserAuth.refreshToken);
      const userId = await getUserId(checkUserAuth.refreshToken);
      setUser(userId);
      console.log(userId);
      navigation.navigate("Drawer");
    } catch (err) {
      console.log("Login error", err);
      navigation.navigate("Login");
    }
    setClicked(false)
  }

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        h={{
          base: "100%",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Center flex={1} px="3">
          <Stack
            space={2}
            w={{
              base: "75%",
              md: "25%",
            }}
          >
            <Center>
              <Image source={require("../../assets/rounduplogo.png")} />
              <Heading mb="5">Round Up</Heading>
              <Text color={"red.600"}>
                {isLoginValid == "pass"
                  ? ""
                  : isLoginValid == "invalid user"
                  ? "invalid user"
                  : "invalid password"}
              </Text>
            </Center>
            <FormControl isRequired>
              <Input
                size="md"
                placeholder="username or email"
                onChangeText={(text) => setUsername(text)}
              />
              <Input
                type={show ? "text" : "password"}
                size="md"
                onChangeText={(text) => setPassword(text)}
                InputRightElement={
                  <Pressable onPress={passwordHandler}>
                    <Icon
                      as={Entypo}
                      name={show ? "eye" : "eye-with-line"}
                      color="coolGray.600"
                      size={5}
                      marginRight={3}
                    />
                  </Pressable>
                }
                placeholder="password"
              />
            </FormControl>
            <Button onPress={loginHandler} small primary isLoading={clicked?true:false}>
              <Text>Log In</Text>
            </Button>
            <Center>
              <Text>
                Don't have an account?{" "}
                <Text
                  color={"cyan.600"}
                  fontWeight={"bold"}
                  onPress={() => navigation.navigate("Sign Up")}
                >
                  Sign up
                </Text>
              </Text>
            </Center>
          </Stack>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
