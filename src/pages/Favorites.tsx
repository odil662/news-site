import React, { useState, useEffect } from 'react';
import { fetchItem } from '../services/api';
import styles from './Favorites.module.css';
import { NewsList } from '../components/NewsList.tsx';
import { Story } from '../types/types.ts';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const favoriteStories = await Promise.all(
          favoriteIds.map((id: number) => fetchItem(id))
        );
        setFavorites(favoriteStories);
      }
      setLoading(false);
    };
    loadFavorites();
  }, []);
  
  if (loading) return <div>Loading.</div>;
  
  return (
    <div className={styles.favorites}>
      <h1>Favorite Stories</h1>
      {favorites.length > 0 ? (
        <NewsList stories={favorites} loading={loading}/>
      ) : (
        <p>No favorite stories yet.</p>
      )}
    </div>
  );
};

export default Favorites;
