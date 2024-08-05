import { useState, useEffect, useCallback } from 'react';
import styles from './YourProductsModal.module.css';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext
import { useProduct } from '../contexts/ProductContext'; // Import useProduct

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
  const { user } = useAuth(); // Access user from context
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { productsUpdated, setProductsUpdated } = useProduct(); // Use context


  const fetchProducts = useCallback(async () => {
    if (isOpen && user && user.products.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/products/products/by-ids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: user.products }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const fetchedProducts: Product[] = await response.json();
        setProducts(fetchedProducts);
        setProductsUpdated(false); // Reset the update flag
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, user, productsUpdated]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleReload = () => {
    fetchProducts();
  };

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
          <button className={styles.reloadButton} onClick={handleReload}>
            Reload
          </button>
          {loading && <p>Loading products...</p>}
          {error && <p>Error: {error}</p>}
          {products.length === 0 && !loading ? (
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
