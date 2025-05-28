// database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);'
    );
  });
};

export const saveMenuItems = (items) => {
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
        [item.name, item.price, item.description, item.image, item.category]
      );
    });
  });
};

export const getMenuItems = (setMenuItems) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM menu;', [], (_, { rows }) => {
      setMenuItems(rows._array);
    });
  });
};

export const filterMenuItems = (categories, searchQuery, setMenuItems) => {
  let query = 'SELECT * FROM menu WHERE 1=1';
  let params = [];

  if (categories.length > 0) {
    query += ` AND category IN (${categories.map(() => '?').join(', ')})`;
    params = [...categories];
  }

  if (searchQuery) {
    query += ' AND name LIKE ?';
    params.push(`%${searchQuery}%`);
  }

  db.transaction(tx => {
    tx.executeSql(query, params, (_, { rows }) => {
      setMenuItems(rows._array);
    });
  });
};
