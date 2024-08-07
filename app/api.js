// api.js or a similar file for API calls
export const placeOrder = async (userId, products, totalAmount) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, products, totalAmount }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }
      return data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };
  