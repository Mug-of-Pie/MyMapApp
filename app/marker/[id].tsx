import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { MarkerData, MarkerImage } from '../../utils/types';
import ImageList from '../../components/ImageList';
import Toast, { ToastConfigParams } from 'react-native-toast-message';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function MarkerDetails() {
  const { marker: markerString } = useLocalSearchParams();
  const marker = JSON.parse(markerString as string) as MarkerData;
  const [currentMarker, setCurrentMarker] = useState<MarkerData>(marker);
  const { getMarkerById, getImages, updateMarker, addImage, deleteImage } = useDatabase();

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const markerData = await getMarkerById(marker.id!);
        const images = await getImages(marker.id!);
        setCurrentMarker({
          ...markerData!,
          images: images,
        });
      } catch (error) {
        console.error('Ошибка при получении данных маркера:', error);
      }
    };

    fetchMarkerData();
  }, [marker.id, getMarkerById, getImages]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Для выбора изображения необходимо предоставить доступ к галерее.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const imageUri = result.assets[0].uri;
        await addImage({ marker_id: currentMarker.id!, uri: imageUri });
        setCurrentMarker((prev) => ({
          ...prev,
          images: [...(prev.images || []), { marker_id: currentMarker.id!, uri: imageUri }],
        }));
        Toast.show({
          type: 'success',
          text1: 'Сохранено',
          text2: 'Изображение добавлено',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Ошибка при добавлении изображения:', error);
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Не удалось добавить изображение',
          position: 'bottom',
        });
      }
    }
  };

  const removeImage = async (image: MarkerImage) => {
    try {
      await deleteImage(image);
      setCurrentMarker((prev) => ({
        ...prev,
        images: prev.images?.filter((img) => img.id !== image.id),
      }));
      Toast.show({
        type: 'success',
        text1: 'Сохранено',
        text2: 'Изображение удалено',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось удалить изображение',
        position: 'bottom',
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateMarker(currentMarker);
      const updatedMarker = await getMarkerById(currentMarker.id!);
      const images = await getImages(currentMarker.id!);
      setCurrentMarker({
        ...updatedMarker!,
        images: images,
      });

      Toast.show({
        type: 'success',
        text1: 'Сохранено',
        text2: 'Маркер успешно обновлен',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Ошибка при сохранении маркера:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось сохранить маркер',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Детали маркера</Text>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Название:</Text>
        <TextInput
          style={styles.input}
          value={currentMarker.title}
          onChangeText={(text) =>
            setCurrentMarker((prev) => ({ ...prev, title: text }))
          }
        />

        <Text style={styles.label}>Описание:</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={currentMarker.description}
          onChangeText={(text) =>
            setCurrentMarker((prev) => ({ ...prev, description: text }))
          }
          multiline
        />

        <Text style={styles.label}>Адрес:</Text>
        <Text style={styles.textValue}>{currentMarker.address}</Text>
      </View>

      <View style={styles.imageListSection}>
        <ImageList
          marker={currentMarker}
          onAddImage={pickImage}
          onRemoveImage={removeImage}
        />
      </View>

      <Toast config={toastConfig} />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    backgroundColor: '#F0F0F5',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 14,
    color: '#222',
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  textValue: {
    fontSize: 16,
    color: '#222',
    backgroundColor: '#F0F0F5',
    borderRadius: 8,
    padding: 10,
  },
  imageListSection: {
    flex: 1,
  },
});


const toastConfig = {
  success: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{ backgroundColor: '#A6E3A1', padding: 14, borderRadius: 8 }}>
      <Text style={{ color: '#1E1E2E', fontWeight: 'bold' }}>{text1}</Text>
      <Text style={{ color: '#1E1E2E' }}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View style={{ backgroundColor: '#F38BA8', padding: 14, borderRadius: 8 }}>
      <Text style={{ color: '#1E1E2E', fontWeight: 'bold' }}>{text1}</Text>
      <Text style={{ color: '#1E1E2E' }}>{text2}</Text>
    </View>
  ),
};
