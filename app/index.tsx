// app/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

type Task = {
    id: number;
    text: string;
    priority: string;
    status: string;
};

type TaskPosition = {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
};


export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const [status, setStatus] = useState<string>('Created');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editTask, setEditTask] = useState<string>('');
    const [editPriority, setEditPriority] = useState<string>('Low');
    const [editStatus, setEditStatus] = useState<string>('Created');
    const [taskPositions, setTaskPositions] = useState<TaskPosition[]>([]);

    // Handle adding a new task
    const handleAddTask = () => {
        if (task.trim()) {
            setTasks([...tasks, { text: task, id: Date.now(), priority, status }]);
            setTask('');
            setPriority('Low');
            setStatus('Created');
        }
    };

    // Handle deleting a task
    const handleDelete = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Handle editing a task
    const handleEdit = (id: number, currentTask: string, currentPriority: string, currentStatus: string) => {
        setEditIndex(id);
        setEditTask(currentTask);
        setEditPriority(currentPriority);
        setEditStatus(currentStatus);
    };

    // Save the edited task
    const handleSaveEdit = () => {
        if (editIndex !== null) {
            setTasks(tasks.map((t) => (t.id === editIndex ? { ...t, text: editTask, priority: editPriority, status: editStatus } : t)));
            setEditIndex(null);
            setEditTask('');
            setEditPriority('Low');
            setEditStatus('Created');
        }
    };

    const getPriorityColor = (priority: string): [string, string] => {
        switch (priority) {
            case 'High':
                return ['#FF6B6B', '#FF8787'] as [string, string];
            case 'Medium':
                return ['#4DABF7', '#74C0FC'] as [string, string];
            case 'Low':
                return ['#51CF66', '#69DB7C'] as [string, string];
            default:
                return ['#CED4DA', '#DEE2E6'] as [string, string];
        }
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case 'Created':
                return '#868E96';
            case 'Started':
                return '#4C6EF5';
            case 'In Progress':
                return '#FAB005';
            case 'Completed':
                return '#40C057';
            default:
                return '#CED4DA';
        }
    };

    const measureTask = (id: number, event: any) => {
        const { width, height, x, y } = event.nativeEvent.layout;
        const newPosition = { id, x, y, width, height };

        setTaskPositions(prev => {
            // Check for collisions with existing tasks
            const others = prev.filter(p => p.id !== id);
            let adjustedPosition = { ...newPosition };

            // If there's a collision, adjust the position
            while (others.some(other => checkCollision(adjustedPosition, other))) {
                adjustedPosition.y += 20; // Move down if collision detected
                if (adjustedPosition.y > 400) { // If reaching bottom, reset and move right
                    adjustedPosition.y = 0;
                    adjustedPosition.x += 20;
                }
            }

            return [...others, adjustedPosition];
        });
    };

    const checkCollision = (pos1: TaskPosition, pos2: TaskPosition) => {
        return !(
            pos1.x + pos1.width < pos2.x ||
            pos1.x > pos2.x + pos2.width ||
            pos1.y + pos1.height < pos2.y ||
            pos1.y > pos2.y + pos2.height
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#6C63FF', '#4C46B9']}
                style={styles.header}
            >
                <Text style={styles.headerText}>Vision Task Board</Text>
            </LinearGradient>

            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    value={task}
                    onChangeText={setTask}
                    placeholder="Enter Task Title"
                    placeholderTextColor="#ADB5BD"
                />

                <View style={styles.dropdownContainer}>
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownLabel}>Priority</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={priority}
                                onValueChange={setPriority}
                                style={styles.picker}
                            >
                                <Picker.Item label="Low" value="Low" />
                                <Picker.Item label="Medium" value="Medium" />
                                <Picker.Item label="High" value="High" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownLabel}>Status</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={status}
                                onValueChange={setStatus}
                                style={styles.picker}
                            >
                                <Picker.Item label="Created" value="Created" />
                                <Picker.Item label="Started" value="Started" />
                                <Picker.Item label="In Progress" value="In Progress" />
                                <Picker.Item label="Completed" value="Completed" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTask}
                >
                    <Text style={styles.addButtonText}>Add Task</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={styles.visionBoard}>
                <Text style={styles.sectionTitle}>Vision Board</Text>
                <View style={styles.board}>

                    {tasks.map((task) => (
                        <LinearGradient
                            key={task.id}
                            colors={getPriorityColor(task.priority)}
                            onLayout={(e) => measureTask(task.id, e)}
                            style={[
                                styles.taskInBoard,
                                {
                                    left: taskPositions.find(p => p.id === task.id)?.x ?? `${(task.id * 13.37) % 70}%`,
                                    top: taskPositions.find(p => p.id === task.id)?.y ?? `${(task.id * 7.91) % 80}%`,
                                },
                            ]}
                        >
                            <Text style={styles.taskInBoardText}>{task.text}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(task.status) }]}>
                                <Text style={styles.statusText}>{task.status}</Text>
                            </View>
                        </LinearGradient>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.taskList}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Tasks list</Text>
                <FlatList
                    data={tasks}
                    renderItem={({ item }) => (
                        <View style={styles.taskContainer}>
                            {editIndex === item.id ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={editTask}
                                        onChangeText={setEditTask}
                                    />

                                    <View style={styles.dropdownContainer}>
                                        <View style={styles.dropdown}>
                                            <Text>Priority</Text>
                                            <Picker selectedValue={editPriority} onValueChange={setEditPriority} style={styles.picker}>
                                                <Picker.Item label="Low" value="Low" />
                                                <Picker.Item label="Medium" value="Medium" />
                                                <Picker.Item label="High" value="High" />
                                            </Picker>
                                        </View>

                                        <View style={styles.dropdown}>
                                            <Text>Status</Text>
                                            <Picker selectedValue={editStatus} onValueChange={setEditStatus} style={styles.picker}>
                                                <Picker.Item label="Created" value="Created" />
                                                <Picker.Item label="Started" value="Started" />
                                                <Picker.Item label="In Progress" value="In Progress" />
                                                <Picker.Item label="Completed" value="Completed" />
                                            </Picker>
                                        </View>
                                    </View >
                                    <View style={styles.buttonGroup}>
                                        <Button title="Save" onPress={handleSaveEdit} />
                                        <Button
                                            title="Cancel"
                                            color="red"
                                            onPress={() => {
                                                setEditIndex(null); // Exit edit mode
                                                setEditTask(''); // Reset the input field
                                                setEditPriority('Low'); // Reset priority
                                                setEditStatus('Created'); // Reset status
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.taskContent}>
                                    <Text style={styles.taskTitle}>{item.text}</Text>
                                    <View style={styles.taskMeta}>
                                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority)[0] }]}>
                                            <Text style={styles.badgeText}>{item.priority}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(item.status) }]}>
                                            <Text style={styles.badgeText}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.taskActions}>
                                        <TouchableOpacity
                                            style={[styles.button, styles.editButton]}
                                            onPress={() => handleEdit(item.id, item.text, item.priority, item.status)}
                                        >
                                            <Text style={styles.buttonText}>Edit</Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.button, styles.deleteButton]}
                                            onPress={() => handleDelete(item.id)}
                                        >
                                            <Text style={styles.buttonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputSection: {
        height: '25%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dropdown: {
        width: '48%',
    },
    dropdownLabel: {
        marginBottom: 3,
        color: '#495057',
        fontWeight: '600',
    },
    pickerContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',

    },
    picker: {
        height: 50,
    },
    addButton: {
        backgroundColor: '#6C63FF',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    visionBoard: {
        height: '50%',
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    board: {
        height: 500,
        padding: 15,
        position: 'relative',
    },
    taskInBoard: {
        position: 'absolute',
        padding: 15,
        borderRadius: 10,
        maxWidth: '45%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    taskInBoardText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    taskList: {
        height: '25%',
        padding: 5,
    },
    taskContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 8,
    },
    taskMeta: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#4C6EF5',
    },
    deleteButton: {
        backgroundColor: '#FA5252',
    },
    saveButton: {
        backgroundColor: '#40C057',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    editContainer: {
        flex: 1,
    },
    editInput: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#FA5252',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,

        width: '80%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',

    },

});