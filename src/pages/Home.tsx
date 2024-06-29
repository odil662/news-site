import React, { useState, useEffect, useRef } from 'react';
import { fetchStories } from '../services/api';
import styles from './Home.module.css';
import type { Story } from '../types/types.ts';
import { NewsList } from '../components/NewsList.tsx';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 30;
const AUTO_UPDATE_INTERVAL = 30000; // 30 seconds

const Home: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [storyType, setStoryType] = useState<'top' | 'new' | 'best'>('top');
  const [timeLeft, setTimeLeft] = useState(30);
  
  const timerRef = useRef<ReturnType<typeof setInterval>| null>(null);
  const updateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const loadStories = async () => {
    setLoading(true);
    const newStories = await fetchStories(storyType, ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    setStories(prevStories => page === 0 ? newStories : [...prevStories, ...newStories]);
    setHasMore(newStories.length === ITEMS_PER_PAGE);
    setLoading(false);
  };
  
  useEffect(() => {
    loadStories();
  }, [page, storyType]);
  
  useEffect(() => {
    startAutoUpdate();
    return () => stopAutoUpdate();
  }, [storyType]);
  
  const startAutoUpdate = () => {
    stopAutoUpdate();
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setPage(0);
      loadStories();
      setTimeLeft(30);
    }, AUTO_UPDATE_INTERVAL);
    
    updateTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);
  };
  
  const stopAutoUpdate = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
    }
  };
  
  const handleTypeChange = (newType: 'top' | 'new' | 'best') => {
    setStoryType(newType);
    setPage(0);
    setStories([]);
    startAutoUpdate();
  };
  
  const handleManualUpdate = () => {
    setPage(0);
    loadStories();
    startAutoUpdate();
  };
  
  return (
    <div className={ styles.home }>
      <h1>Hacker News</h1>
      <div className={ styles.tabs }>
        <button onClick={ () => handleTypeChange('top') } className={ storyType === 'top' ? styles.active : '' }>Top
        </button>
        <button onClick={ () => handleTypeChange('new') } className={ storyType === 'new' ? styles.active : '' }>New
        </button>
        <button onClick={ () => handleTypeChange('best') }
                className={ storyType === 'best' ? styles.active : '' }>Best
        </button>
        <button onClick={ handleManualUpdate } className={ styles.updateButton }>
          Update Now ({ timeLeft }s)
        </button>
        <Link to='favorites/'><button>Favorites</button></Link>
      </div>
      <NewsList
        stories={ stories }
        setPage={ setPage }
        hasMore={ hasMore }
        loading={ loading }
      />
      { loading && <div>Loading.</div> }
    </div>
  );
};

export default Home;
