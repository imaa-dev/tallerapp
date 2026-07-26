import React, { useMemo, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';

import { ServiceRecord } from '@/types/servi/servi.type';

export interface ServiceAction {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: (service: ServiceRecord) => void;
    danger?: boolean;
}

interface Props {
    service: ServiceRecord;
    actions: ServiceAction[];
}

export function ActionBottomSheet({
                                      service,
                                      actions,
                                  }: Props) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => [150, 250], []);

    const open = () => {
        console.log('Opening bottom sheet');
        bottomSheetRef.current?.present();
    };

    const close = () => {
        console.log('Closing bottom sheet');
        bottomSheetRef.current?.dismiss();
    };

    return (
        <>
            <TouchableOpacity onPress={open}>
                <MaterialIcons
                    name="more-vert"
                    size={24}
                    color="black"
                />
            </TouchableOpacity>

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                enablePanDownToClose={true}
                enableOverDrag={true}
                onDismiss={close}
                backdropComponent={() => (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.backdrop}
                        onPress={close}
                    />
                )}
            >
                <View style={styles.container}>
                    {actions.map(action => (
                        <TouchableOpacity
                            key={action.title}
                            style={styles.item}
                            onPress={() => {
                                close();
                                action.onPress(service);
                            }}
                        >
                            <MaterialIcons
                                name={action.icon}
                                size={22}
                                color={action.danger ? '#dc2626' : '#444'}
                            />

                            <Text
                                style={[
                                    styles.text,
                                    action.danger && styles.danger,
                                ]}
                            >
                                {action.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    modal: {
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    text: {
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    danger: {
        color: '#dc2626',
    },
});