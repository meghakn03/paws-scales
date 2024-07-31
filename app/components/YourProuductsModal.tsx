import { useState, useEffect } from 'react';
import styles from './YourProductsModal.module.css';

interface YourProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const YourProductsModal: React.FC<YourProductsModalProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Your Products</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product._id} className={styles.productItem}>
                  <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productCategory}>{product.category}</p>
                    <p className={styles.productDescription}>{product.description}</p>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourProductsModal;
