import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MarkerActionProps } from '../utils/props';

export default function MarkerAction({ onInfoPress, onDeletePress, onCancelPress }: MarkerActionProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>Действия с маркером</Text>
        <TouchableOpacity style={styles.actionButton} onPress={onInfoPress}>
          <Text style={styles.actionText}>Информация</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDeletePress}>
          <Text style={styles.actionText}>Удалить маркер</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancelPress}>
        <Text style={styles.cancelText}>Отмена</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 24,
    marginVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
