import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TodoListItem = ({ todo, onEdit, onDelete }) => (
    <View style={[styles.container, { backgroundColor: todo.color }]}>
        <Text style={styles.title}>{todo.title}</Text>
        <Text style={styles.priority}>Priority: {todo.priority}</Text>
        <Text style={styles.status}>Status: {todo.status}</Text>
        <View style={styles.actions}>
            <Button title="Edit" onPress={() => onEdit(todo)} />
            <Button title="Delete" onPress={() => onDelete(todo)} color="red" />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    priority: {
        fontSize: 14,
    },
    status: {
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default TodoListItem;
