'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClipboardList, faSadTear } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';
import { useAuth } from '../../contexts/AuthContext'; // Adjust the path as needed


// Types for product data
type ProductItem = {
  _id: string; // Change from number to string
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  subCategory: string;
};

type CartItem = {
  _id: string; // Change from number to string
  name: string;
  price: string;
  imageUrl: string;
};

type OrderItem = {
  _id: string; // Change from number to string
  name: string;
  price: string;
  imageUrl: string;
};

export default function CatSuppliesPage() {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchFilteredProducts();
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/products/by-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Cat Supplies',
          subCategory: selectedProduct,
        }),
      });
      const data = await response.json();
      setFilteredProducts(data);
      scrollToDynamicProducts(); // Auto-scroll to dynamic section
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  const handleViewMoreClick = (subCategory: string) => {
    setSelectedProduct(subCategory);
  };

  const handleCloseClick = () => {
    setSelectedProduct(null);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = async (product: ProductItem) => {
    if (!user) {
      console.log('User is not logged in');
      return; // Ensure user is logged in
    }

    console.log('Adding product to cart:', product._id);

    try {
      // Add product to cart in backend
      await fetch('http://localhost:5000/api/users/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
        }),
      });

      // Update cart items state
      const updatedCartItems = [...cartItems];
      const existingItemIndex = updatedCartItems.findIndex(item => item._id === product._id);

      if (existingItemIndex < 0) {
        updatedCartItems.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        });
      }
      
      setCartItems(updatedCartItems);

      // Update cart in AuthContext
      setUser(prevUser => {
        const updatedUser = prevUser ? {
          ...prevUser,
          cart: {
            ...(prevUser.cart || {}),
            [product._id]: 1,
          },
        } : null;
        console.log('Updated user in context:', updatedUser);
        return updatedUser;
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const fetchCartItems = useCallback(async () => {
    if (cartVisible && user && user.cart.length > 0) {
      try {
        const response = await fetch('http://localhost:5000/api/products/products/by-ids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: user.cart }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const fetchedCartItems: CartItem[] = await response.json();
  
        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
  }, [cartVisible, user]);
  
  

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  

  const scrollToDynamicProducts = () => {
    const section = document.getElementById('dynamic-products');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCartVisibility = () => setCartVisible(!cartVisible);
  const toggleOrdersVisibility = () => setOrdersVisible(!ordersVisible);

  return (
    <div>
      {/* Header with Icons */}
      <header className="fixed top-0 right-0 p-4 flex gap-4 z-50">
      <button className={`${styles.iconButton} p-2 bg-transparent border-none`} onClick={toggleCartVisibility}>
        <FontAwesomeIcon icon={faShoppingCart} size="lg" className={`${styles.icon} text-white`} />
      </button>
      {cartVisible && (
        <div className={styles.dropdown}>
          {cartItems.length > 0 ? (
            <>
              <div className={styles.dropdownScroll}>
                <ul>
                  {cartItems.map(item => (
                    <li key={item._id} className={styles.dropdownItem}>
                      <Image src={item.imageUrl} alt={item.name} width={50} height={50} />
                      <span>{item.name}</span> - <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={styles.placeOrderButton}>Place Order</button>
            </>
          ) : (
            <div className={styles.emptyMessage}>
              <FontAwesomeIcon icon={faSadTear} size="lg" />
              <p>Empty Cart</p>
            </div>
          )}
        </div>
      )}

      <button className={`${styles.iconButton} p-2 bg-transparent border-none`} onClick={toggleOrdersVisibility}>
        <FontAwesomeIcon icon={faClipboardList} size="lg" className={`${styles.icon} text-white`} />
      </button>
      {ordersVisible && (
        <div className={styles.dropdown}>
          {orderItems.length > 0 ? (
            <ul>
              {orderItems.map(item => (
                <li key={item._id} className={styles.dropdownItem}>
                  <Image src={item.imageUrl} alt={item.name} width={50} height={50} />
                  <span>{item.name}</span> - <span>${item.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyMessage}>
              <FontAwesomeIcon icon={faSadTear} size="lg" />
              <p>No Orders</p>
            </div>
          )}
        </div>
      )}
    </header>

      {/* Hero Section with Video */}
      <section className={`${styles.hero} relative`}>
        <video
          className={`${styles.heroVideo} absolute inset-0 w-full h-full object-cover`}
          autoPlay
          muted
          loop
        >
          <source src="/cat-hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Top Cat Supplies</h1>
            <p className="text-lg">Find everything you need for your feline friend.</p>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="py-2 px-4 rounded-lg text-black"
            />
            <button
              className="bg-yellow-500 text-black py-2 px-4 rounded-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Our Products Section */}
      <section id="products" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>
          <div className="flex flex-wrap justify-between gap-6">
            {['Cat Food', 'Cat Toys', 'Cat Grooming', 'Cat Beds and Accessories'].map((subCategory) => (
              <div key={subCategory} className={`${styles.productCategory} flex-1 max-w-xs`}>
                <Image src={`/${subCategory.replace(' ', '-').toLowerCase()}.jpg`} alt={subCategory} width={500} height={500} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{subCategory}</h3>
                  <p className="mt-2 text-gray-600">Description for {subCategory}</p>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewMoreClick(subCategory)}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Products Section */}
      {selectedProduct && (
        <section id="dynamic-products" className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="text-blue-500 hover:underline"
              onClick={handleCloseClick}
            >
              Close
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">
              {selectedProduct} Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                <div key={product._id} className="bg-white shadow rounded-lg p-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover"
                  />
                  <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-gray-900 font-bold mt-2">${product.price}</p>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value, 10))}
                    className="mt-2 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
