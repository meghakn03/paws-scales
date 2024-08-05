"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClipboardList, faSadTear } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

type ProductItem = {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  subCategory: string;
};

type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type OrderItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const categories = [
  { name: 'Dog Food', value: 'Dog Food' },
  { name: 'Dog Toys', value: 'Dog Toys' },
  { name: 'Dog Grooming', value: 'Dog Grooming' },
  { name: 'Dog Beds and Accessories', value: 'Dog Beds and Accessories' }
];

export default function DogSuppliesPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);
  
  useEffect(() => {
    if (selectedProduct) {
      fetch('http://localhost:5000/api/products/products/by-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'Dog Supplies',
          subCategory: selectedProduct,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setFilteredProducts(data);
          scrollToDynamicProducts(); // Auto-scroll to dynamic section
        })
        .catch(error => console.error('Error fetching filtered products:', error));
    }
  }, [selectedProduct]);

  const handleViewMoreClick = (subCategory: string) => {
    setSelectedProduct(subCategory);
  };

  const handleCloseClick = () => {
    setSelectedProduct(null);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = (product: ProductItem) => {
    const newCartItem: CartItem = {
      id: product.id,
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
          <source src="/dog-hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Top Dog Supplies</h1>
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
              onClick={scrollToDynamicProducts}
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
            {categories.map(category => (
              <div key={category.value} className={`${styles.productCategory} flex-1 max-w-xs`}>
                <Image src={`/${category.value}.jpg`} alt={category.name} width={500} height={500} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="mt-2 text-gray-600">Description for {category.name}</p>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewMoreClick(category.value)}
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
            <h2 className="text-2xl font-bold text-center mb-6">{selectedProduct.replace('-', ' ').toUpperCase()} Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-white shadow rounded-lg p-4">
                    <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-full h-32 object-cover" />
                    <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-gray-900 font-bold mt-2">${product.price}</p>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                      className="mt-2 p-2 border rounded"
                    />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <p>No products found in this category.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
