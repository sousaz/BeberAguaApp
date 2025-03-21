import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/themeContext";
import { useFocusEffect } from "expo-router"
import { Audio } from 'expo-av';

const HISTORICO_AGUA = "waterHistory";
const SETTINGS_PATH = "beberagua:notificationSettings";

export default function AguaContador({ copos, setCopos }) {
    const { theme } = useTheme();
    const [goal, setGoal] = useState(0)
    const [sound, setSound] = useState()

    const getGoal = async () => {
      const settings = await AsyncStorage.getItem(SETTINGS_PATH)
      const { goal } = JSON.parse(settings)
      setGoal(goal)
    }

    
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require("../assets/water.mp3"))

      setSound(sound)

      await sound.playAsync()
    }

    useFocusEffect(
      useCallback(() => {
        getGoal()
      }, [])
    )
  
    const adicionar = async () => {
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      setCopos(copos + 1);
      try {
        const historico = await AsyncStorage.getItem(HISTORICO_AGUA);
        const lista = historico ? JSON.parse(historico) : [];
        const coposHoje = lista.find(entry => entry.date === dtAtual);
        if (coposHoje) {
          coposHoje.count += 1;
        } else {
          lista.push({ date: dtAtual, count: 1 });
        }
        await AsyncStorage.setItem(HISTORICO_AGUA, JSON.stringify(lista));
        playSound()
      } catch (e) {
        console.error("Erro ao salvar histórico:", e);
      }
    };
  
    return (
      <View style={[styles.counterCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardContent}>
          <Text style={[styles.counterText, { color: theme.primaryDark }]}>
            Copos Hoje
          </Text>
          <Button title="Bebi um copo!" onPress={adicionar} color={theme.primary} />
        </View>
        <View style={styles.cardFooter}>
          {goal > 0 ?
            <Text style={[styles.counter, { color: theme.secondaryText }]}>{copos}/{goal} 💧</Text> :
            <Text style={[styles.counter, { color: theme.secondaryText }]}>{copos} 💧</Text>
          }
        </View>
      </View>
    );
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
  });