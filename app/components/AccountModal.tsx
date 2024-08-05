import React from 'react';
import styles from './AccountModal.module.css'; // Import the updated CSS module

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.header}>Account Details</h2>
        <p className={styles.text}><strong className={styles.bold}>Name:</strong> {user.name}</p>
        <p className={styles.text}><strong className={styles.bold}>Email:</strong> {user.email}</p>
        <button onClick={onClose} className={styles.button}>Close</button>
      </div>
    </div>
  );
};

export default AccountModal;
