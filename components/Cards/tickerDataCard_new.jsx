// check if card updates when changes are made to entry, else have to useEffect 

import React from 'react';
import { useState, useEffect, useContext } from 'react'
import DataContext from '../../context/DataContext';
import { StyleSheet, Text, View, Image, SafeAreaView, Dimensions, Button, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';
const _ = require('underscore')

export default function tickerDataCard(props) {
    
    const {investmentContext, userContext ,investmentTickerContext,tickerAndPriceContext } = useContext(DataContext)
    const [fetchedInvestmentEntries,setFetchedInvestmentEntries] = investmentContext
    const [tickerAndPrice,setTickerAndPrice] = tickerAndPriceContext
    // const [tickerData,setTickerData] = investmentTickerContext
    const [user, setUser] = userContext

    const screenWidth = Dimensions.get('screen').width
    const screenHeight = Dimensions.get('screen').height

    const styles = StyleSheet.create({
    wrapper: {
    flexDirection:'column',
    width: screenWidth*0.90,
    height: screenHeight*0.20,
    backgroundColor: '#F7F6F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: '5%',
    shadowColor: "#000",
    shadowOffset: {
    width: 2,
    height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    },
    // pressableWrapper: {
    // display:'flex',
    // height:'30%',
    // width:'100%',
    // flexDirection:'row',
    // alignItems:'stretch',
    // justifyContent:'center',
    // borderRadius: 5,
    // margin: '5%',
    // },
    // pressable: {
    // flex:1,
    // backgroundColor: '#F4E6E6',
    // justifyContent:'center',
    // alignItems:'center',
    // borderRadius: 5,
    // padding: '2%',
    // marginLeft: '2%',
    // marginRight: '2%',
    // },
    })

    let tickerData = 
    {
        'ticker':"",
        'currentPrice':"",
        'costBasis':"",
        'currentStockQty':"",
        'totalAmountPaid':"",
        'unrealizedPL':"",
      }

    const RenderTickerCardData = () => {


        // array of objects containing transaction data
        const transactionHistory = fetchedInvestmentEntries[props.selectedTickerAndPrice.ticker]
        const entriesByDay = _(transactionHistory).groupBy((element)=>{
        const groupedDate = element.investmentsentry.date
        const formattedGroupedDate = moment(groupedDate, moment.ISO_8601).format('YYYY-MM-DD')
        return formattedGroupedDate
        })

        // sorting the dates by lastest first (at the top)
        const allDatesAscending = Object.keys(entriesByDay).sort()
        const allDates = allDatesAscending.reverse()


        // avg price per stock, needed to find new totalAmountPaid
        // cost basis for one BUY transaction can be derived by price bought * qty
        // to get a moving cost basis, we need to get the average of all costBasis up to that buy transaction
        
        let costBasis = 0
        
        // for every SELL txn, we need minus costBasis * qty sold off from total amount paid to find total amount paid for remaining qty of shares
        let totalAmountPaid = 0
        
        let currentStockQty = 0
        
        
        ///// TO FIND UNREALIZED P/L /////
        
        // HANDLING SELL/BUY TXN
        // for every SELL txn:
        // 1) get new totalAmountPaid [totalAmountPaid -= qtysold * current costBasis till that transaction]
        // 2) update total qty of stocks left [currentStockQty -= qtysold]
        // cost basis does not change when you sell because ratio of totalAmountPaid being minus/totalqty decreased will be a constant 
        
        // for every BUY txn:
        // 1) update totalAmountPaid [totalAmountPaid += buy in price * qty bought]
        // 2) update total qty of stocks left [currentStockQty += qtybought]
        // 3) update cost basis [totalAmountPaid/currentStockQty]
        
        // Finally to get unrealized P/L, 
        // loop through the whole list in chronological order and then use the formula as follows: 
        // unrealizedPL = currentStockQty*currentprice - totalAmountPaid
        
        
        const stockDataCalculationFunction = allDates.map((date,index)=>{
        entriesByDay[date].forEach((entry,index)=>{ // will have to use loop instead of (for txn of arr) in order to access the index. index is needed to single out the first buy in price to not get the average of the first buy in price. index 1 onwards will have to be divided by 2, but not index 0. 
        console.log('entriesbydate:',entriesByDay[date])
         if(entry.investmentsentry.transaction==='Buy'){
            totalAmountPaid+=entry.investmentsentry.price*entry.investmentsentry.quantity
            currentStockQty+=entry.investmentsentry.quantity
            
            // update cost basis after totalAmountPaid and currentStockQty is updated 
            if (index === 0){
                costBasis=entry.investmentsentry.price
            }
            else{
                costBasis=totalAmountPaid/currentStockQty // this statement is not true for the first transaction 
            }
         }
         if(entry.investmentsentry.transaction==='Sell'){
            totalAmountPaid-=entry.investmentsentry.quantity*costBasis
            currentStockQty-=entry.investmentsentry.quantity
        
          }   
        })
        })
        
        // assuming current price is $20 (from API)
        let unrealizedPL = (currentStockQty*props.selectedTickerAndPrice.value)-totalAmountPaid
        
        // console.log('costBasis:',costBasis)
        // console.log('totalAmountPaid:',totalAmountPaid)
        // console.log('currentstockqty:',currentStockQty)
        // console.log('unrealized P/L:',unrealizedPL)
        
        // linking to cash page
        // for all sell transactions, to add into cash balance 
        // for all buy transactions, to deduct from cash balance 
        
        
          // const monthOfExpense = moment(investmentMonth, moment.ISO_8601).format('YYYY-MM')
        
           
          // do this last when you have all info
          // similar to the investmenttickercards, if you save as state, it will only rerender the 2nd cycle, so on first render at tickerDataCard it will be empty unless forcedtorerender again. 
        
        tickerData = 
          {
            'ticker':props.selectedTickerAndPrice.ticker,
            'currentPrice':props.selectedTickerAndPrice.value,
            'costBasis':costBasis,
            'currentStockQty':currentStockQty,
            'totalAmountPaid':totalAmountPaid,
            'unrealizedPL':unrealizedPL,
          }
        
        
          console.log('tickerData:',tickerData) // will input array [] for first render but state is already set, just not refreshed for console.log
        }
        
    useEffect(()=>{
    
        RenderTickerCardData()
        console.log('tickercard data rendered')
    
    },[fetchedInvestmentEntries])
    
    const navigation = useNavigation()
        

    return (
        <View style={styles.wrapper}>
           <Text>{tickerData.ticker}</Text>
               <View>
                    <Text>Current Price: ${tickerData.currentPrice}</Text>
                    <Text>Cost Basis: ${tickerData.costBasis}</Text>
                    <Text>Quantity: {tickerData.currentStockQty} units</Text>
                    <Text>Total Amount Paid: ${tickerData.totalAmountPaid}</Text>
                    <Text>Unrealized P/L: ${tickerData.unrealizedPL}</Text>
                </View>
                  {/* renderTickerData() */}
        </View>
             
    )
  }
