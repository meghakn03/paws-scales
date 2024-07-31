'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClipboardList, faSadTear } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

// Types for product data
type ProductItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory: string;
  description: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function CatSuppliesPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const filtered = products.filter(product =>
        product.subCategory === selectedProduct
      );
      setFilteredProducts(filtered);
      scrollToDynamicProducts(); // Auto-scroll to dynamic section
    }
  }, [selectedProduct, products]);

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

  const handleAddToCart = (product: ProductItem) => {
    const newCartItem: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    };
    setCartItems(prevCartItems => [...prevCartItems, newCartItem]);
  };

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
              <ul>
                {cartItems.map(item => (
                  <li key={item.id} className={styles.dropdownItem}>
                    <Image src={item.image} alt={item.name} width={50} height={50} />
                    <span>{item.name}</span> - <span>{item.price}</span>
                  </li>
                ))}
              </ul>
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
                  <li key={item.id} className={styles.dropdownItem}>
                    <Image src={item.image} alt={item.name} width={50} height={50} />
                    <span>{item.name}</span> - <span>{item.price}</span>
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
            <p className="text-lg">Find everything you need for your furry friend.</p>
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map(item => (
                  <div key={item._id} className="bg-white shadow rounded-lg p-4">
                    <Image src={item.imageUrl} alt={item.name} width={200} height={200} className="w-full h-48 object-cover mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                      <input
                        type="number"
                        min="1"
                        value={quantities[item._id] || 1}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No products available.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
