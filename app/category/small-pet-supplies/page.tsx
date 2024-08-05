'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClipboardList, faSadTear } from '@fortawesome/free-solid-svg-icons';
import styles from '../../page.module.css';

type ProductItem = {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  category?: string;
  subCategory?: string;
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

type ProductKey = 'small-animal-food' | 'small-animal-cages';

const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products/products');
  const data = await response.json();
  return data;
};

const fetchFilteredProducts = async (subCategory: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/products/products/by-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Small Animals', subCategory }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return [];
  }
};

export default function SmallAnimalSuppliesPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductKey | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const subCategoryMap: { [key in ProductKey]: string } = {
        'small-animal-food': 'Small Animal Food',
        'small-animal-cages': 'Small Animal Beds',
      };
      const subCategory = subCategoryMap[selectedProduct];

      fetchFilteredProducts(subCategory)
        .then(data => setFilteredProducts(data))
        .catch(error => console.error('Error fetching filtered products:', error));
    }
  }, [selectedProduct]);

  const handleViewMoreClick = (productType: ProductKey) => {
    setSelectedProduct(productType);
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
          <source src="/smallpet-hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Top Small Pets Supplies</h1>
            <p className="text-lg">Find everything you need for your little friend.</p>
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
            {['small-animal-food', 'small-animal-cages'].map(productType => (
              <div key={productType} className={`${styles.productCategory} flex-1 max-w-xs`}>
                <Image src={`/${productType}.jpg`} alt={productType} width={500} height={500} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{productType.replace('-', ' ').toUpperCase()}</h3>
                  <p className="mt-2 text-gray-600">Description for {productType}</p>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewMoreClick(productType as ProductKey)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <h3 className="text-lg font-medium mt-4">{product.name}</h3>
                    <p className="text-gray-600 mt-2">${product.price}</p>
                    <div className="mt-4 flex items-center">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                        onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)}
                      >
                        Add to Cart
                      </button>
                      <input
                        type="number"
                        value={quantities[product.id] || 0}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        className="ml-4 w-16 p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <FontAwesomeIcon icon={faSadTear} size="lg" />
                  <p>No Products Found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
