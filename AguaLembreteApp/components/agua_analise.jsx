import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/themeContext";
import { useFocusEffect } from "expo-router"

const HISTORICO_AGUA = "waterHistory";

export default function AguaAnalise(){
    const { theme } = useTheme()
    const [mean, setMean] = useState(0)

    const getHistory = async () => {
        const savedHistory = await AsyncStorage.getItem(HISTORICO_AGUA);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          parsed.reduce((acc, curr) => acc + curr.count, 0)
          console.log(parsed)
        }
    }

    useFocusEffect(
      useCallback(() => {
        getHistory();
      }, [])
    );

    return (
        <View style={[styles.counterCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.cardContent}>
                <View style={styles.item}>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>Média: </Text>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>12</Text>
                </View>
                <View style={styles.item}>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>Melhor dia:  </Text>
                  <Text style={[styles.counter, { color: theme.secondaryText }]}>13</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    counterCard: {
      flexDirection: "row",
      padding: 20,
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardContent: {
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    },
    counter: {
      fontSize: 46,
      fontWeight: "bold",
    },
    counterText: {
      fontSize: 24,
      fontWeight: "600",
    },
    item: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
    }
});