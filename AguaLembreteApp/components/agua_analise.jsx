import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/themeContext";
import { useFocusEffect } from "expo-router"

const HISTORICO_AGUA = "waterHistory";

export default function AguaAnalise(){
    const { theme } = useTheme()
    const [mean, setMean] = useState(0)
    const [bDay, setBDay] = useState(0)

    const getWeekDay = (dateString) => {
      const [day, month, year] = dateString.split("/")
      const date = new Date(`${year}-${month}-${day}`)
      const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
      return daysOfWeek[date.getDay()]
    }

    const getStartOfWeek = (date) => {
      const d = new Date(date)
      const day = d.getDay()
      d.setDate(d.getDate() - day)
      d.setHours(0, 0, 0, 0)
      return d
  };
  
  const getEndOfWeek = (date) => {
      const d = new Date(getStartOfWeek(date))
      d.setDate(d.getDate() + 6)
      d.setHours(23, 59, 59, 999)
      return d
  };

    const getHistory = async () => {
        const savedHistory = await AsyncStorage.getItem(HISTORICO_AGUA);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          // const history = {"Domingo": 0, "Segunda-feira": 0, "Terça-feira": 0, "Quarta-feira": 0, "Quinta-feira": 0, "Sexta-feira": 0, "Sábado": 0}

          const today = new Date()
          const startOfWeek = getStartOfWeek(today)
          const endOfWeek = getEndOfWeek(today)

          const thisWeekRecords = parsed.filter(entry => {
            const [day, month, year] = entry.date.split("/")
            const entryDate = new Date(`${year}-${month}-${day}`)
            return entryDate >= startOfWeek && entryDate <= endOfWeek
          })
          if(thisWeekRecords.length > 0){
            const bestDay = parsed.reduce((prev, curr) => prev.count > curr.count ? prev : curr)
            setBDay({"date": getWeekDay(bestDay.date), "count": bestDay.count})
          }
          const mean = parsed.reduce((acc, curr) => acc + curr.count, 0) / parsed.length
          setMean(mean)
        }
    }

    useFocusEffect(
      useCallback(() => {
        getHistory();
      }, [])
    );

    return (
        <View style={[styles.counterCard, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.cardContent}>
                <View style={styles.item2}>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>Média Geral: </Text>
                  <Text style={[styles.counter2, { color: theme.secondaryText }]}>{mean} copos</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.item2}>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>Melhor dia dessa semana:  </Text>
                  <Text style={[styles.counter2, { color: theme.secondaryText }]}>{bDay.date} -> {bDay.count} copos</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    counterCard: {
      flexDirection: "col",
      padding: 20,
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardContent: {
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      justifyContent: "center",
      marginBottom: 30,
      backgroundColor: "#fff",
      width: "100%",
      borderRadius: 10,
      padding: 15
    },
    counter: {
      fontSize: 46,
      fontWeight: "bold",
    },
    counter2: {
      fontSize: 23,
      fontWeight: "bold",
    },
    counterText: {
      fontSize: 24,
      fontWeight: "600",
    },
    item: {
      width: "100%",
      flexDirection: "row",
    },
    item2: {
      width: "100%",
      flexDirection: "col",
    }
});
