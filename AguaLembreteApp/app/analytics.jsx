import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupNotifications, updateNotifications } from "../utils/notifications";
import { useTheme } from "../utils/themeContext";
import AguaAnalise from "../components/agua_analise";

const HISTORICO_AGUA = "waterHistory";

export default function AnalyticsScreen(){
    const { theme } = useTheme()
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return(
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.primaryDark }]}>
                Análise d'água
            </Text>
            <AguaAnalise />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
})