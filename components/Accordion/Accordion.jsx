// flexbox for pricing component 
// category in accordion box? 
// spacing for accordion with graph 

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Accordion, NativeBaseProvider, Center, Box, Divider } from 'native-base';
import { createNavigatorFactory } from '@react-navigation/native';
const _ = require('underscore')


const cashentry = [
    {
      date: '01/01/22',
      amount: 5.55,
      category: 'food',
      desc:'A cup of coffee and a lot of christmas present and maybe for new year as well'
    },
    {
      date: '01/01/22',
      amount: 10,
      category: 'food',
      desc:'A cup of coffee and a lot of christmas present and maybe for new year as well'
    },
    {
      date: '01/01/22',
      amount: 10,
      category: 'food',
      desc:'A cup of coffee and a lot of christmas present and maybe for new year as well'
    },
    {
      date: '02/01/22',
      amount: 6,
      category: 'food',
      desc:'A cup of coffee and a lot of christmas present and maybe for new year as well'
    },
    {
      date: '03/01/22',
      amount: 10,
      category: 'food',
      desc:'A cup of coffee and a lot of christmas present and maybe for new year as well'
    },
  ]
  

  const styles = StyleSheet.create({
    entryWrapper: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // backgroundColor:'blue'
    },
    entryDesc: {
        flex: 1,
        // backgroundColor:'green',
    },
    entryPrice: {
        flex: 1,
        textAlign:'right',
        // backgroundColor:'yellow'
    },
    divider:{
        backgroundColor:'#D8D8D8',
    }


})

// grouping logic
const entriesByDay = _.groupBy(cashentry,'date')
const allDates = Object.keys(entriesByDay)

function AccordionComponent() {

const entries = allDates.map((date,index)=>{

// method for calculating total amount for each day
let totalAmount = 0
entriesByDay[date].forEach((entry)=>{
    totalAmount += entry.amount
})

return(
<Accordion.Item key={index}>
    <Accordion.Summary _expanded={{backgroundColor:'#DFD3C3'}}>
    {date}
    {`$ ${totalAmount}`}
    {/* <Accordion.Icon />  */}
    {/* replace icon with total amount  */}
    </Accordion.Summary>
    {entriesByDay[date].map((entry,index)=>{
    return(
    <Accordion.Details key={index}>
        <Text style={styles.entryDesc}>{entry.desc}</Text>
        <Text style={styles.entryPrice}>{`$ ${entry.amount}`}</Text>
    <Divider my={2} style={styles.divider}/>
    </Accordion.Details>
    )})}
</Accordion.Item>
)
})

return (
    <Box>
    <Accordion index={[0]}>
    {entries}
    </Accordion>
    </Box>
    )
}

 
export default function AccordionList () {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <AccordionComponent/>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
}