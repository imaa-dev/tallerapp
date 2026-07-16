import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  images: string[];
  onAdd: () => void;
  onRemove?: (index: number) => void;
  maxImages?: number;
};

export default function AppPhotoGrid({
  images,
  onAdd,
  onRemove,
  maxImages = 9,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.grid}>
      {images.map((image, index) => (
        <View key={index} style={styles.item}>
          <Image
            source={{ uri: image }}
            style={styles.image}
          />

          {onRemove && (
            <Pressable
              style={styles.removeButton}
              onPress={() => onRemove(index)}
            >
              <Ionicons
                name="close"
                size={16}
                color="#FFF"
              />
            </Pressable>
          )}
        </View>
      ))}

      {images.length < maxImages && (
        <Pressable
          onPress={onAdd}
          style={[
            styles.addButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons
            name="camera-outline"
            size={34}
            color={colors.primary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  item: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: 'rgba(0,0,0,.65)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    width: 100,
    height: 100,

    borderRadius: 12,

    borderWidth: 1,
    borderStyle: 'dashed',

    justifyContent: 'center',
    alignItems: 'center',
  },
});