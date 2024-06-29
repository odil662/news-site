import React, { useState } from 'react';
import { fetchComments } from '../services/api.ts';
import styles from '../pages/News.module.css';
import type { Comment } from '../types/types.ts';
const CommentItem: React.FC<{ comment: Comment, depth: number }> = ({ comment, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [childComments, setChildComments] = useState<Comment[]>([]);
  
  const toggleExpand = async () => {
    if (!isExpanded && comment.kids) {
      const fetchedComments = await fetchComments(comment.kids);
      setChildComments(fetchedComments);
    }
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={styles.comment} style={{ marginLeft: `${depth * 20}px` }}>
      <p dangerouslySetInnerHTML={{ __html: comment.text }} />
      <p>By: {comment.by} | Score: { comment?.score || 0 }</p>
      {comment.kids && (
        <button onClick={toggleExpand} className={styles.expandButton}>
          {isExpanded ? '▼' : '►'} {comment.kids.length} replies
        </button>
      )}
      {isExpanded && childComments.map(childComment => (
        <CommentItem key={childComment.id} comment={childComment} depth={depth + 1} />
      ))}
    </div>
  );
};

export default CommentItem;
