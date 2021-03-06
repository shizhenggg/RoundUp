import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import { useContext } from "react";
import DataContext from "../../../context/DataContext";

const IndexInvestmentPage = ({ navigation }) => {
  // useContext
  const { investmentQContext  } = useContext(DataContext);
  const [allInvestment] = investmentQContext;
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
            
          {allInvestment.map((entry, i) => {
            return (
              
              <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate("Show Investment Page", {entry})}
              >
              
                <View style={styles.entry}>
                  
                  <Text>Id: {entry._id}</Text>
                  <Text>Username: {entry.username}</Text>
                  <Text>Date: {entry.investmentsentry.date}</Text>
                  <Text>Price: $ {entry.investmentsentry.price}</Text>
                  <Text>Quantity: {entry.investmentsentry.quantity}</Text>
                  <Text>Category: {entry.investmentsentry.category}</Text>
                  <Text>Ticker: {entry.investmentsentry.ticker}</Text>
                  <Text>Transaction: {entry.investmentsentry.transaction}</Text>
                </View>
              </TouchableOpacity>
             
     
            );
          })}
        </View>
        <Button
                  title="Back"
                  onPress={() => navigation.navigate("Home")}
                />
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexInvestmentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    marginHorizontal: 20,
  },
  entry:{
    paddingBottom: 10,
    paddingTop: 10
  }
});
