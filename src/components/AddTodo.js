import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Alert, Keyboard } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { THEME } from '../theme'

export const AddTodo = ({ onSubmit }) => {
  const [value, setValue] = useState('')

  const pressHandler = () => {
    if (value.trim()) {
      onSubmit(value)
      setValue('')
      Keyboard.dismiss()
    } else {
      Alert.alert('Type something')
    }
  }
  //value.trim() - строка, отличная от пустой
  return (
    <View style={styles.block}>
      <TextInput
        style={styles.input}
        onChangeText={setValue}
        value={value}
        placeholder="Enter the name of the case"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <AntDesign.Button onPress={pressHandler} name="pluscircle">
        Add
      </AntDesign.Button>
    </View>
  )
}
//onChangeText{(text) => setValue(text)}  ===   onChangeText={setValue}     {setValue}- референс

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    width: '70%',
    padding: 10,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: THEME.MAIN_COLOR,
  },
})
