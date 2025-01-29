import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('shoppingDB', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('shoppingList', {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        store.createIndex('name', 'name', { unique: false });
                        console.log("Banco de dados de Lista de Compras criado!");
                }
            }
        });
        console.log("Banco de dados aberto.");
    } catch (e) {
        console.log("Erro ao criar o banco de dados: " + e.message);
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("addItem").addEventListener("click", addData);
    document.getElementById("btnListar").addEventListener("click", getData);
    document.getElementById("btnRemover").addEventListener("click", remover);
});

async function getData() {
    if (!db) {
        console.log("O banco de dados está fechado");
        return;
    }
    const tx = await db.transaction('shoppingList', 'readonly');
    const store = tx.objectStore('shoppingList');
    const value = await store.getAll();
    if (value) {
        const listagem = value.map(item => {
            return `<div>
                <p>Item: ${item.name}</p>
            </div>`;
        });
        document.getElementById("itemList").innerHTML = listagem.join('');
    } else {
        console.log("Não há itens na lista de compras!");
    }
}

async function addData() {
    let name = document.getElementById("itemInput").value;
    if (!name) return;
    const tx = await db.transaction('shoppingList', 'readwrite');
    const store = tx.objectStore('shoppingList');
    try {
        await store.add({ name: name });
        await tx.done;
        console.log('Item adicionado com sucesso!');
        getData();
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        tx.abort();
    }
}

async function remover() {
    let name = document.getElementById("itemInput").value;
    const tx = await db.transaction('shoppingList', 'readwrite');
    const store = tx.objectStore('shoppingList');
    try {
        let index = store.index('name');
        let cursor = await index.openCursor(IDBKeyRange.only(name));
        if (cursor) {
            await store.delete(cursor.primaryKey);
            console.log('Item removido com sucesso!');
            getData();
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
        tx.abort();
    }
}
