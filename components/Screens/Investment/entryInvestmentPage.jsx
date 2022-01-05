import React, {useState, useEffect, useMemo} from 'react';
import {useContext} from "react"
import DataContext from '../../../context/DataContext';
import { StyleSheet, Pressable, Text, TextInput,View, Picker, SafeAreaView, Button, Modal, Dimensions, ScrollView } from 'react-native';
import DatePicker from "@react-native-community/datetimepicker"
import { ModalTickerPicker } from './modalInvestTickerPicker';
import { ModalCatPicker} from "./modalInvestCatPicker"
import {ModalTransactionPicker} from "./modalInvestTransactionPicker"
import Autocomplete from "react-native-autocomplete-input"


import {
  NativeBaseProvider,
  KeyboardAvoidingView,
  Input,
  useTypeahead,
  Typeahead,
  Icon,
  IconButton,
  Center,
  Box,
  
} from "native-base";



const EntryInvestmentPage = ({navigation}) => {

  
   // useContext
   const { userContext, investmentEntryContext, expenseForceRenderContext } = useContext(DataContext)
   const [userId, setUserId]=userContext
   const [dateInvestment,setDateInvestment,
          priceInvestment,setPriceInvestment,
          categoryInvestment,setCategoryInvestment,
          tickerInvestment,setTickerInvestment, 
          qtyInvestment, setQtyInvestment,
          transaction, setTransaction] = investmentEntryContext

   const [expenseForceRender,setExpenseForceRender] = expenseForceRenderContext

   // useState
   const [show, setShow] = useState(false);

    // Modal for category
    const [isModalVisibleCat, setIsModalVisibleCat] = useState(false)

    const changeModalVisibilityCat = (bool) =>{
    setIsModalVisibleCat(bool)
    }

    const setDataCat = (option) =>{
      setCategoryInvestment(option)
    }

   // Modal for ticker
   const [isModalVisibleTicker, setIsModalVisibleTicker] = useState(false)

   const changeModalVisibilityTicker = (bool) =>{
    setIsModalVisibleTicker(bool)
   }

   const setDataTicker = (option) =>{
     setTickerInvestment(option)
   }


  // Modal for transaction
  const [isModalVisibleTransaction, setIsModalVisibleTransaction] = useState(false)

  const changeModalVisibilityTransaction = (bool) =>{
  setIsModalVisibleTransaction(bool)
  }

  const setDataTransaction = (option) =>{
    setTransaction(option)
  }

    //autocomplete
    // For Filtered Data
    const [filteredTicker, setFilteredTicker] = useState([]);
    // For Selected Data
    const [selectedValue, setSelectedValue] = useState({});

  // fetch crypto for ticker
  useEffect(()=>{
    const loadCoin = async() =>{
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list")
        const data = await res.json()
        console.log(data)
        setTickerInvestment(data)
    }
    loadCoin()
    }, [])


    const findTicker = (query) => {
      // Method called every time when we change the value of the input
      if (query) {
        // Making a case insensitive regular expression
        const regex = new RegExp(`${query.trim()}`, 'i');
        // Setting the filtered film array according the query
        setFilteredTicker(
            tickerInvestment.filter((ticker) => ticker.id.search(regex) >= 0)
        );
      } else {
        // If the query is null then return blank
        setFilteredTicker([]);
      }
    };



   
   // clear states onload at entryinvestment page
  useEffect(()=>{
    const resetPage = navigation.addListener("focus", ()=>{
      setDateInvestment(new Date())
      setPriceInvestment([])
      setCategoryInvestment("Select Category...")
      setQtyInvestment([])
      setTickerInvestment("Select Ticker...")
      setTransaction("Select Buy or Sell...")
    })
     return resetPage
  }, [expenseForceRender])


    // Date Picker
    const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate || new Date(dateInvestment);
      setDateInvestment(currentDate);
      
    };


    const handleSubmit = async (event) => {
      try{

        event.preventDefault();
        const res = await fetch("https://roundup-api.herokuapp.com/data/investment", {
         
          method: "POST",
          body: JSON.stringify(
            { 
              username: userId,
              investmentsentry:
                { 
                  
                  date: dateInvestment,
                  price: priceInvestment,
                  category: categoryInvestment,
                  ticker: tickerInvestment,
                  quantity: qtyInvestment,
                  transaction: transaction  }
                
                 
            }
            ),
          headers: {
            "Content-Type": "application/json",
          },
        })
        if(res.status!==200){
          console.error('create data investment failed')
        }
        
      setExpenseForceRender(!expenseForceRender)

      } catch(err){
        console.log(err)
      }
        
        navigation.navigate("Index Investment Page")
        
      }
    return (
      <NativeBaseProvider>
          <KeyboardAvoidingView

                h={{
                  base: "100%",
                  lg: "auto",
                }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
      >
 
      <SafeAreaView style={styles.container} >
        <View style={styles.inner}>
            
            {/* date */}
            <View style={styles.wrapper} >
                <DatePicker
                  style={styles.datepicker}
                  value={new Date(dateInvestment)}
                  onChange={onChangeDate}
                  />
                  
                  </View>

                 {/* price */}
                <View style={styles.wrapper} >
                  <TextInput
                      style={styles.textinput}
                      type="submit" 
                      name="price"
                      placeholder="Enter Price"
                      value={priceInvestment.toString()}
                      onChangeText={(text) => setPriceInvestment(text)}
                        />   
                        <Button
                          title="Clear"
                          onPress={()=>setPriceInvestment([])}
                          />
                    </View>

                  {/* quantity */}
                  <View style={styles.wrapper} >
                      <TextInput
                          style={styles.textinput}
                          type="submit" 
                          name="quantity"
                          placeholder="Enter Quantity"
                          value={qtyInvestment.toString()}
                          onChangeText={(text) => setQtyInvestment(text)}
                            />   
                            <Button
                              title="Clear"
                              onPress={()=>setQtyInvestment([])}
                              />
                    </View>
        
              

                        {/* category */}
                        <View style={styles.wrapper}>

                        <Pressable 
                            style={styles.pressable}
                            onPress={()=> changeModalVisibilityCat(true)}
                            >
                            <Text style={styles.catText}>{categoryInvestment}</Text>

                        </Pressable>
                        <Modal
                            transparent={true}
                            animationType='fade'
                            visible={isModalVisibleCat}
                            onRequestClose={()=> changeModalVisibilityCat(false)}

                        >
                            <ModalCatPicker 
                              changeModalVisibilityCat={changeModalVisibilityCat}
                              setDataCat={setDataCat}
                            />
                            
                        </Modal>
                      
                        </View>


                    {/* Ticker */}
                    {/* <View style={styles.wrapper}>

                          <Pressable 
                            style={styles.pressable}
                            onPress={()=> changeModalVisibilityTicker(true)}
                            >
                            <Text style={styles.catText}>{tickerInvestment}</Text>

                          </Pressable>
                          <Modal
                            transparent={true}
                            animationType='fade'
                            visible={isModalVisibleTicker}
                            onRequestClose={()=> changeModalVisibilityTicker(false)}

                          >
                            <ModalTickerPicker 
                              changeModalVisibilityTicker={changeModalVisibilityTicker}
                              setDataTicker={setDataTicker}
                              setTickerInvestment={setTickerInvestment}
                              tickerInvestment={tickerInvestment}
                            />
                            
                          </Modal>

                          </View> */}

                        {/* Autocomplete ticker */}

                      

                        <View style={styles.container2}>
                                  <Autocomplete
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    containerStyle={styles.autocompleteContainer}
                                    // Data to show in suggestion
                                    data={filteredTicker}
                                    // Default value if you want to set something in input
                                    defaultValue={
                                      JSON.stringify(selectedValue) === '{}' ?
                                      '' :
                                      selectedValue.id
                                    }
                                    // Onchange of the text changing the state of the query
                                    // Which will trigger the findFilm method
                                    // To show the suggestions
                                    onChangeText={(text) => findTicker(text)}
                                    placeholder="Enter ticker"
                                    renderItem={({item}) => (
                                      // For the suggestion view
                                      <TouchableOpacity
                                        onPress={() => {
                                          setSelectedValue(item);
                                          setFilteredTicker([]);
                                        }}>
                                        <Text style={styles.itemText}>
                                            {item.id}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  />
                                  <View style={styles.descriptionContainer}>
                                    {tickerInvestment.length > 0 ? (
                                      <>
                                        <Text style={styles.infoText}>
                                            Selected Data
                                        </Text>
                                        <Text style={styles.infoText}>
                                          {JSON.stringify(selectedValue)}
                                        </Text>
                                      </>
                                    ) : (
                                      <Text style={styles.infoText}>
                                          Enter The Ticker
                                      </Text>
                                    )}
                                  </View>
                                </View>
                 
              
                         


                          {/* Transaction */}
                    <View style={styles.wrapper}>

                          <Pressable 
                            style={styles.pressable}
                            onPress={()=> changeModalVisibilityTransaction(true)}
                            >
                            <Text style={styles.catText}>{transaction}</Text>

                          </Pressable>
                          <Modal
                            transparent={true}
                            animationType='fade'
                            visible={isModalVisibleTransaction}
                            onRequestClose={()=> changeModalVisibilityTransaction(false)}

                          >
                            <ModalTransactionPicker 
                              changeModalVisibilityTransaction={changeModalVisibilityTransaction}
                              setDataTransaction={setDataTransaction}
                            />
                            
                          </Modal>

                          </View>


                         

         
               
                
                <View style={styles.button}>
                    <Button title="Submit" onPress={handleSubmit} />
                    <Button
                      title="Back"
                      onPress={() => navigation.navigate("Home")
                         }
                    />
                </View>
                
            </View>
                  
               
        </SafeAreaView>
         </KeyboardAvoidingView>
     </NativeBaseProvider>
            
        
    )
}

export default EntryInvestmentPage;

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#e6e2d3',
        // alignItems: 'center',
        // justifyContent: 'center',
        // marginTop: 100
        
    },  
    datepicker:{
      paddingVertical: 100,
      paddingHorizontal: 10,
      width: "100%",
           
      // borderColor: "gray",
      // borderWidth: 1,
      right: 100,
      
    },
    textinput:{
      paddingVertical: 1,
      paddingHorizontal: 1,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 20
      
      // borderColor: "gray",
      // borderWidth: 1,
    },
    picker:{
      justifyContent: "center",
      // left: 60,
    },
    button:{
      flexDirection: "row",
      alignSelf: "center"
    },
    inner: {
      padding: 20,
      flex: 1,
      // justifyContent: "flex-end",
    },
    catText: {
      marginVertical: 10,
      fontSize: 22,
      textAlign: "center"
    },
    pressable:{
      backgroundColor: "#80ced6",
      alignSelf: "stretch",
      paddingHorizontal: 10,
      marginHorizontal: 10,
      borderRadius: 15
    
    },
    wrapper: {
      fontSize: 20,
      flex: 0.15,
      textAlign: "center",
      flexDirection:'column',
      width: screenWidth*0.86,
      backgroundColor: '#d5f4e6',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      paddingTop: 1,
      margin: '1%',
      shadowColor: "#000",
      shadowOffset: {
      width: 2,
      height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: .22,
      elevation: 3,
      },



      container2: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        padding: 16,
        marginTop: 40,
      },
      autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
      },
      descriptionContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      itemText: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
      },
      infoText: {
        textAlign: 'center',
        fontSize: 16,
      },
     
 
})


