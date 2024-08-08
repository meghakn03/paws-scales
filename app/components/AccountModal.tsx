import React, { useEffect, useState } from 'react';
import styles from './AccountModal.module.css';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { _id: string; name: string; email: string; orders: string[]; products: string[] } | null;
}

const emojis = ['😀', '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'];

const hashStringToIndex = (str: string, length: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % length;
};

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, user }) => {
  const [emoji, setEmoji] = useState<string>('');

  useEffect(() => {
    if (user) {
      const emojiIndex = hashStringToIndex(user._id, emojis.length);
      setEmoji(emojis[emojiIndex]);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.header}>Account Details</h2>
        <div className={styles.profileSection}>
          <div className={styles.profileEmoji}>{emoji}</div>
          <div className={styles.profileDetails}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>
        <p className={styles.text}><strong className={styles.bold}>Orders Made:</strong> {user.orders.length}</p>
        <p className={styles.text}><strong className={styles.bold}>Products Sold:</strong> {user.products.length}</p>
        <button onClick={onClose} className={styles.button}>Close</button>
      </div>
    </div>
  );
};

export default AccountModal;
