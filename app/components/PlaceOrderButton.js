import { useState } from 'react';
import { placeOrder } from '../api'; // Adjust the import path as needed
import styles from './PlaceOrderButton.module.css'; // Import the CSS module for styling

const PlaceOrderButton = ({ userId, cartItems, totalAmount, onOrderPlaced }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      await placeOrder(userId, cartItems.map(item => item._id), totalAmount);
      alert('Order placed successfully');
      onOrderPlaced(); // Notify parent component to update the UI
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={loading}
      className={styles.placeOrderButton}
    >
      {loading ? 'Placing Order...' : 'Place Order'}
    </button>
  );
};

export default PlaceOrderButton;
