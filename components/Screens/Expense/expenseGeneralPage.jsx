import * as React from "react";
import { NativeBaseProvider, View, Box } from "native-base";
import { Dimensions } from "react-native";
import Carousel from "pinar";
import ExpenseLineChartComponent from "../../Charts/expenseLineChartDaily";
import PieChartComponent from "../../Charts/expensePieChart";
import AccordionList from "../../Accordion/expenseAccordion";
import MonthSelector from "../../Picker/monthPicker";
import yearlyExpense from "../../api/yearlyExpense";

export default function GeneralBreakdownPage({navigation}) {

  const screenHeight = Dimensions.get("screen").height;
  const carouselHeight = screenHeight * 0.34;

  const styles = {
    dotStyle: {
      backgroundColor: "#F5E0EE",
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
    activeDotStyle: {
      backgroundColor: "#F49BD6",
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
  };

  return (
    <NativeBaseProvider>
      <Box bgColor="#fff" height="100%">
        <Carousel
          height={carouselHeight}
          showsControls={false}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
        >
          <View pl={2.5}>
            <PieChartComponent />
          </View>
          <View>
            <ExpenseLineChartComponent />
          </View>
        </Carousel>
        <Box height="10%" px={6}>
          <MonthSelector navigation={navigation} type={yearlyExpense} dir="Add Money Out"/>
        </Box>
        <Box height="50%" px={6}>
          <AccordionList />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}