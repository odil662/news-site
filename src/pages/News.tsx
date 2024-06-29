import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchItem, fetchComments } from '../services/api';
import styles from './News.module.css';
import CommentItem from '../components/CommentItem'
import type { Comment } from '../types/types.ts';
interface NewsItem {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  kids?: number[];
}

const News: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadNewsAndComments = async () => {
      if (id) {
        const item = await fetchItem(parseInt(id));
        setNewsItem(item);
        if (item.kids) {
          const commentData = await fetchComments(item.kids);
          setComments(commentData);
        }
        setLoading(false);
      }
    };
    loadNewsAndComments();
  }, [id]);
  
  if (loading) return <div>Loading.</div>;
  
  
  return (
    <div className={styles.newsContainer}>
      <h1>{newsItem?.title}</h1>
      <p>Score: {newsItem?.score} | By: {newsItem?.by}</p>
      <a href={newsItem?.url} target="_blank" rel="noopener noreferrer">Read full article</a>
      <h2>Comments:</h2>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
};

export default News;
