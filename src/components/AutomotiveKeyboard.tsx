import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AutomotiveKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  visible: boolean;
}

export function AutomotiveKeyboard({ onKeyPress, onBackspace, onClear, visible }: AutomotiveKeyboardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!visible) return null;

  const alphabetKeys = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['V', 'W', 'X', 'Y', 'Z']
  ];

  const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const KeyButton = ({ key, onPress, style = {} }: { key: string; onPress: () => void; style?: any }) => (
    <TouchableOpacity
      style={[styles.keyButton, { backgroundColor: colors.background }, style]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Key ${key}`}
      accessibilityRole="button"
    >
      <Text style={[styles.keyText, { color: colors.text }]}>{key}</Text>
    </TouchableOpacity>
  );

  const ActionButton = ({ title, onPress, style = {} }: { title: string; onPress: () => void; style?: any }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: colors.tint }, style]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Text style={[styles.actionText, { color: colors.background }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>Station Search</Text>
      
      {/* Numbers Row */}
      <View style={styles.row}>
        {numberKeys.map((key) => (
          <KeyButton
            key={key}
            onPress={() => onKeyPress(key)}
          />
        ))}
      </View>

      {/* Alphabet Grid */}
      {alphabetKeys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <KeyButton
              key={key}
              onPress={() => onKeyPress(key)}
            />
          ))}
        </View>
      ))}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <ActionButton
          title="SPACE"
          onPress={() => onKeyPress(' ')}
          style={styles.spaceButton}
        />
        <ActionButton
          title="⌫"
          onPress={onBackspace}
          style={styles.backspaceButton}
        />
        <ActionButton
          title="CLEAR"
          onPress={onClear}
          style={styles.clearButton}
        />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const keySize = Math.min(width / 10, 60); // Responsive key size for automotive displays

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    minHeight: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 12,
  },
  keyButton: {
    width: keySize,
    height: keySize,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  keyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  spaceButton: {
    minWidth: 120,
  },
  backspaceButton: {
    minWidth: 60,
  },
  clearButton: {
    minWidth: 80,
  },
});