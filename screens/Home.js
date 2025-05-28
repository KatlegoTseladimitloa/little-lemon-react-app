import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createTable, getMenuItems, filterMenuItems } from '../database';
import debounce from 'lodash.debounce';

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const Home = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    createTable();
    getMenuItems(setMenuItems);
  }, []);

  useEffect(() => {
    filterMenuItems(selectedCategories, searchQuery, setMenuItems);
  }, [selectedCategories, searchQuery]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const debouncedSetSearch = debounce((text) => {
    setSearchQuery(text);
  }, 500);

  const handleSearchChange = (text) => {
    debouncedSetSearch(text);
  };

  const renderCategory = (item) => (
    <TouchableOpacity
      key={item}
      onPress={() => toggleCategory(item)}
      style={[
        styles.category,
        selectedCategories.includes(item) && styles.categorySelected
      ]}
    >
      <Text style={[
        styles.categoryText,
        selectedCategories.includes(item) && styles.categoryTextSelected
      ]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Little Lemon</Text>
        <Text style={styles.bannerSubtitle}>Fine Mediterranean dining</Text>
        <Image
          source={{ uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/hero.jpg?raw=true' }}
          style={styles.bannerImage}
        />
        <TextInput
          placeholder="Search dishes..."
          onChangeText={handleSearchChange}
          style={styles.search}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderCategory(item)}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Menu Items */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name} - ${item.price}</Text>
            <Text>{item.description}</Text>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  banner: { padding: 10, backgroundColor: '#F4CE14', marginBottom: 10, borderRadius: 10 },
  bannerTitle: { fontSize: 24, fontWeight: 'bold' },
  bannerSubtitle: { fontSize: 16 },
  bannerImage: { width: '100%', height: 120, borderRadius: 10, marginVertical: 10 },
  search: { backgroundColor: '#fff', borderRadius: 5, padding: 8 },
  categoryContainer: { flexDirection: 'row', marginVertical: 10 },
  category: { padding: 10, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  categorySelected: { backgroundColor: '#495E57' },
  categoryText: { color: '#495E57' },
  categoryTextSelected: { color: '#fff' },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemTitle: { fontWeight: 'bold' },
  itemImage: { width: '100%', height: 120, marginTop: 8, borderRadius: 8 }
});

export default Home;
