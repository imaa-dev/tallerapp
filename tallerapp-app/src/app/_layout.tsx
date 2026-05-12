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

const queryClient = new QueryClient();

export default function RootLayout(){
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider  client={queryClient}>
                <BottomSheetModalProvider>
                    <ModalProvider>
                        
                    <AuthProvider>
                        <StatusBar style="auto" />
                        <Stack>
                            <Stack.Screen 
                                name="(protected)"
                                options={{
                                    headerShown: false
                                }}
                            />
                        </Stack>
                    </AuthProvider>

                    </ModalProvider>
                </BottomSheetModalProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    )
}