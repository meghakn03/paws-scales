'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClipboardList, faSadTear } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

type ProductItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  subCategory: string;
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

const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products');
  const data = await response.json();
  return data;
};

export default function ReptileSuppliesPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    if (selectedSubCategory) {
      const section = document.getElementById('dynamic-products');
      section?.scrollIntoView({ behavior: 'smooth' });

      const filtered = products.filter((product) => product.subCategory === selectedSubCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedSubCategory, products]);

  const handleViewMoreClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  const handleCloseClick = () => {
    setSelectedSubCategory(null);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = (item: ProductItem) => {
    const newCartItem: CartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
    };

    setCartItems((prevCartItems) => {
      const itemExists = prevCartItems.find((cartItem) => cartItem.id === item._id);
      if (itemExists) {
        return prevCartItems.map((cartItem) =>
          cartItem.id === item._id ? newCartItem : cartItem
        );
      } else {
        return [...prevCartItems, newCartItem];
      }
    });
  };

  const scrollToProducts = () => {
    const section = document.getElementById('products');
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
                {cartItems.map((item) => (
                  <li key={item.id} className={styles.dropdownItem}>
                    <Image src={item.image} alt={item.name} width={50} height={50} />
                    <span>{item.name}</span> - <span>${item.price}</span>
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
                {orderItems.map((item) => (
                  <li key={item.id} className={styles.dropdownItem}>
                    <Image src={item.image} alt={item.name} width={50} height={50} />
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
          <source src="/reptile-hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Top Reptile Supplies</h1>
            <p className="text-lg">Find everything you need for your scaly friend.</p>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="py-2 px-4 rounded-lg text-black"
            />
            <button
              className="bg-yellow-500 text-black py-2 px-4 rounded-lg"
              onClick={scrollToProducts}
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
            {['Reptile Food', 'Reptile Habitats'].map((productType) => (
              <div key={productType} className={`${styles.productCategory} flex-1 max-w-xs`}>
                <Image src={`/images/${productType}.jpg`} alt={productType} width={500} height={500} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{productType}</h3>
                  <p className="mt-2 text-gray-600">Description for {productType}</p>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewMoreClick(productType)}
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
      {selectedSubCategory && (
        <section id="dynamic-products" className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="text-blue-500 hover:underline"
              onClick={handleCloseClick}
            >
              Close
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">{selectedSubCategory}</h2>
            <div className="flex flex-wrap gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                    <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-full h-48 object-cover mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-2 text-gray-600">${product.price.toFixed(2)}</p>
                    <button
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center w-full py-10">
                  <FontAwesomeIcon icon={faSadTear} size="lg" />
                  <p className="mt-2 text-gray-600">No products found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
