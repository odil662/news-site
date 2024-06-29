import styles from '../pages/Home.module.css';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Story } from '../types/types.ts';

export const NewsList = ({ stories, loading, setPage, hasMore }: {
  stories: Story[];
  loading: boolean;
  setPage?: (x: (prevPage: number) => number) => void;
  hasMore?: boolean;
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  const lastStoryElementRef = useCallback((node: Element) => {
    if (loading || !setPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage: number) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const toggleFavorite = (storyId: number) => {
    const newFavorites = favorites.includes(storyId)
      ? favorites.filter(id => id !== storyId)
      : [...favorites, storyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <ul className={ styles.storyList }>
      { stories.map((story, index) => (
        <li key={ story.id }
            ref={ index === stories.length - 1 ? lastStoryElementRef as unknown as React.RefObject<HTMLLIElement> : null }>
          <a href={ story?.url } target="_blank" rel="noopener noreferrer">{ story.title }</a>
          <div className={ styles.storyBody }>
            <p>Score: { story.score } | By: { story.by } |<Link
              to={ `/news/${ story.id }` }>{ ' ' + (story?.descendants || 0) } comments</Link>
            </p>
            <button
              onClick={ () => toggleFavorite(story.id) }
              className={ styles.favoriteButton }
            >
              { favorites.includes(story.id) ? '★' : '☆' }
            </button>
          </div>
        </li>
      )) }
    </ul>
  )
}
