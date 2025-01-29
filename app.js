import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { openDB } from 'idb';

let db;

async function createDB() {
    db = await openDB('shoppingDB', 1, {
        upgrade(db) {
            const store = db.createObjectStore('shoppingList', {
                keyPath: 'id',
                autoIncrement: true
            });
            store.createIndex('name', 'name', { unique: false });
        }
    });
}

export default function App() {
    const [item, setItem] = useState('');
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        createDB().then(getData);
    }, []);

    async function getData() {
        if (!db) return;
        const tx = await db.transaction('shoppingList', 'readonly');
        const store = tx.objectStore('shoppingList');
        const items = await store.getAll();
        setShoppingList(items);
    }

    async function addItem() {
        if (!item) return;
        const tx = await db.transaction('shoppingList', 'readwrite');
        const store = tx.objectStore('shoppingList');
        await store.add({ name: item });
        setItem('');
        getData();
    }

    async function removeItem(id) {
        const tx = await db.transaction('shoppingList', 'readwrite');
        const store = tx.objectStore('shoppingList');
        await store.delete(id);
        getData();
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Lista de Compras 🛒</Text>
            <TextInput
                style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
                placeholder="Adicionar item"
                value={item}
                onChangeText={setItem}
            />
            <Button title="Adicionar Item" onPress={addItem} />
            <FlatList
                data={shoppingList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 }}>
                        <Text>{item.name}</Text>
                        <Button title="Remover" onPress={() => removeItem(item.id)} />
                    </View>
                )}
            />
        </View>
    );
}
