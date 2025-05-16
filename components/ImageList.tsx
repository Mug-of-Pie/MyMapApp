import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { ImageListProps } from '../utils/props';

export default function ImageList({ marker, onAddImage, onRemoveImage }: ImageListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Фотографии</Text>
        <Pressable style={styles.addButton} onPress={onAddImage}>
          <Text style={styles.addButtonText}>＋</Text>
        </Pressable>
      </View>

      {(!marker.images || marker.images.length === 0) && (
        <Text style={styles.emptyText}>Нет добавленных изображений</Text>
      )}

      <FlatList
        data={marker.images || []}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Pressable style={styles.removeButton} onPress={() => onRemoveImage(item)}>
              <Text style={styles.removeButtonText}>Удалить</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  addButton: {
    backgroundColor: '#007AFF', // сохранённый фирменный цвет
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageWrapper: {
    marginBottom: 20,
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  removeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
});
