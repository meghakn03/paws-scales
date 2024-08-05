import { useState } from 'react';
import axios from 'axios';
import styles from './SellProductModal.module.css'; // Ensure this path is correct
import { useAuth } from '../contexts/AuthContext';

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubCategories = {
  [key: string]: string[];
};

const SellProductModal: React.FC<SellProductModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth(); // Access user from context
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');

  // Define sub-category options with a more flexible type
  const subCategories: SubCategories = {
    'Dog Supplies': ['Dog Beds and Accessories', 'Dog Grooming', 'Dog Toys', 'Dog Food'],
    'Cat Supplies': ['Cat Beds and Accessories', 'Cat Grooming', 'Cat Toys', 'Cat Food'],
    'Small Animals': ['Small Animal Beds', 'Small Animal Grooming', 'Small Animal Toys', 'Small Animal Food'],
    'Reptiles': ['Reptile Habitats', 'Reptile Food', 'Reptile Toys', 'Reptile Bedding'],
    'Fish Supplies': ['Fish Tanks', 'Fish Food', 'Fish Toys', 'Fish Filters'],
    'Bird Supplies': ['Bird Cages', 'Bird Food', 'Bird Toys', 'Bird Accessories'],
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      alert('You must be logged in to upload a product');
      return;
    }

    if (!name || !description || !price || !category || !subCategory || !quantity || !image) {
      alert('Please fill in all fields');
      return;
    }

    const imageUrl = await uploadImage(image);

    const productData = {
      name,
      description,
      price: parseFloat(price.toString()),
      category,
      subCategory,
      imageUrl,
      quantity: parseInt(quantity.toString(), 10),
      userId: user._id // Use the user's _id
    };

    try {
      await axios.post('http://localhost:5000/api/products/products', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Product added to the database!');
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
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory(''); // Reset sub-category when category changes
              }}
              required
            >
              <option value="">Select a category</option>
              <option value="Dog Supplies">Dog Supplies</option>
              <option value="Cat Supplies">Cat Supplies</option>
              <option value="Small Animals">Small Animals</option>
              <option value="Reptiles">Reptiles</option>
              <option value="Fish Supplies">Fish Supplies</option>
              <option value="Bird Supplies">Bird Supplies</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subCategory">Sub-Category:</label>
            <select
              id="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
              disabled={!category} // Disable if no category is selected
            >
              <option value="">Select a sub-category</option>
              {category && subCategories[category]?.map((sub: string, index: number) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
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
