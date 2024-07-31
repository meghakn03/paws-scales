import { useState } from 'react';
import axios from 'axios';
import styles from './SellProductModal.module.css'; // Ensure this path is correct
import '../page.module.css';

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellProductModal: React.FC<SellProductModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description || !price || !category || !quantity || !image) {
      alert('Please fill in all fields');
      return;
    }

    // Convert image to URL
    const imageUrl = await uploadImage(image);

    const productData = {
      name,
      description,
      price: parseFloat(price.toString()),
      category,
      imageUrl,
    };

    try {
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Product added to the database!');
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Failed to add product');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl; // Adjust according to the response structure
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Sell Your Product</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Dog Supplies">Dog Supplies</option>
              <option value="Cat Supplies">Cat Supplies</option>
              <option value="Small Animals">Small Animals</option>
              <option value="Reptiles">Reptiles</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Product Image:</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className={styles.fileButton} // Updated className for file input
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SellProductModal;
