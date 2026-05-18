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

const queryClient = new QueryClient();

export default function RootLayout(){
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider  client={queryClient}>
                <BottomSheetModalProvider>
                    <LoadingProvider>
                        <ToastProvider>    
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