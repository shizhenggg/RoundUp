import React, {useState, useEffect} from 'react'
import { StyleSheet, TouchableOpacity, Text, TextInput, View, Image, SafeAreaView, Dimensions, Button, ScrollView } from 'react-native'
import {useContext} from "react"
import {EntryContext} from "../../App"


const IndexExpensePage = ({navigation }) => {

  

   // useContext
   const [allExpense, reloadExpense] = useContext(EntryContext)
   

   

   useEffect(() => {
      reloadExpense()
   }, [allExpense])


  
    return (
        
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View>
            <Text>Expense Summary</Text>
             {allExpense.map((ele,i)=>{
               return(
                 <TouchableOpacity key={i} onPress={()=>navigation.navigate("Show Expense Page", ele)}>
                 <View >
                    <Text>Id: {ele._id}</Text>
                    <Text>Username: {ele.username}</Text>
                    <Text>Date: {ele.expensesentry.date}</Text>
                    <Text >Amount: $ {ele.expensesentry.amount}</Text>
                    <Text >Category: {ele.expensesentry.category}</Text>
                    <Text >Description: {ele.expensesentry.description}</Text>
                 </View>
                 </TouchableOpacity>
               )
             })}
     
            </View>

          

            </ScrollView>
        </SafeAreaView>
            
        
    )
    }


    export default IndexExpensePage;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
     
    },
    scrollView:{
      
      marginHorizontal: 20,
    }

})