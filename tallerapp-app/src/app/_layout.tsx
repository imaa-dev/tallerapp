import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ModalProvider } from '@/context/ModalContextForm';
import { LoadingProvider } from '@/context/LoadingContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import { ToastProvider } from '@/context/ToastContext';
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

const queryClient = new QueryClient();

export default function RootLayout(){
    const scheme = useColorScheme() ?? "dark";
    const colors = Colors[scheme];
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider  client={queryClient}>
                <BottomSheetModalProvider>
                    <LoadingProvider>
                        <ToastProvider>    
                            <ModalProvider>
                                <AuthProvider>
                                    <StatusBar style="auto" />
                                    <Stack
                                        screenOptions={{
                                            headerStyle: {
                                            backgroundColor: colors.background,
                                            },

                                            headerTintColor: colors.text,

                                            headerTitleStyle: {
                                            color: colors.text,
                                            fontWeight: "600",
                                            },

                                            contentStyle: {
                                            backgroundColor: colors.background,
                                            },

                                            animation: "slide_from_right",
                                        }}
                                    >
                                        <Stack.Screen 
                                            name="(protected)"
                                            options={{
                                                headerShown: false
                                            }}
                                        />
                                    </Stack>
                                    <LoadingOverlay />
                                </AuthProvider>
                            </ModalProvider>
                        </ToastProvider>
                    </LoadingProvider>
                </BottomSheetModalProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    )
}