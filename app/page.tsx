'use client'; // Ensure this component is a client component

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaUserCircle, FaBox, FaSadTear, FaSearch, FaPlus, FaSignInAlt } from 'react-icons/fa';
import styles from './page.module.css';
import SellProductModal from './components/SellProductModal';
import YourProductsModal from './components/YourProuductsModal';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal'; // Import AccountModal
import { useAuth } from './contexts/AuthContext'; // Adjust the path as needed
import PlaceOrderButton from './components/PlaceOrderButton';
import Lottie from 'react-lottie';
import loadingAnimation from './animations/loadingAnimation.json';
import LottieLoader from './components/LottieLoader';

type OrderItem = {
  _id: string; // Change from number to string
  name: string;
  price: string;
  imageUrl: string;
  createdAt: string; // Assuming it's a date string, change type if needed
  status: string;
  totalAmount: number;
  products: CartItem[]; // Added to hold products for this order
};

type CartItem = {
  _id: string; // Change from number to string
  name: string;
  price: string;
  imageUrl: string;
};


type User = {
  _id: string;
  name: string;
  email: string;
  products: string[]; // Array of product IDs
  cart: string[]; // Array of product IDs
  orders: string[]; // Array of order IDs
}

export default function Home() {
  const { user, setUser } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For hamburger menu
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYourProductsModalOpen, setIsYourProductsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true); // Auth modal initially open
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false); // State for AccountModal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Show login prompt after logout
  const [cartVisible, setCartVisible] = useState(false);
  const [showNoItemsMessage, setShowNoItemsMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);




  const cartRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null); // For menu

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openYourProductsModal = () => setIsYourProductsModalOpen(true);
  const closeYourProductsModal = () => setIsYourProductsModalOpen(false);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  // const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);


  const toggleCart = () => {
    setCartOpen(!cartOpen);
    setCartVisible(!cartVisible); // Trigger cart items fetching
    fetchCartItems(); // Ensure it is called

  };
  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleOrders = () => {
    setOrdersOpen(!ordersOpen);
    if (!ordersOpen) {
      fetchOrderItems(); // Fetch orders when opening dropdown
    }
  };
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowLoginPrompt(false); // Hide login prompt when logged in
    setProfileOpen(false); // Ensure profile dropdown does not reopen

  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setProfileOpen(false); // Close the profile dropdown
    closeAuthModal()
    setShowLoginPrompt(true); // Show login prompt after logout
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
    setProfileOpen(false); // Close the profile dropdown
  };

  const handleLoginPrompt = () => {
    setIsAuthModalOpen(true);
  };

  const fetchCartItems = useCallback(async () => {
    console.log('Fetching cart items:', user?.cart);
    if (cartVisible && user && user.cart.length > 0) {
      setLoadingCart(true); // Set loadingCart to true
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
      } finally {
        setLoadingCart(false); // Set loadingCart to false
      }
    } else {
      // Set cartItems to an empty array if there are no items in the cart
      setCartItems([]);
    }
  }, [cartVisible, user]);

  const fetchOrderItems = useCallback(async () => {
    if (user && user.orders.length > 0) {
      setLoadingOrders(true);
      try {
        // Fetch orders by user ID
        const ordersResponse = await fetch(`http://localhost:5000/api/users/${user._id}/orders`);
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();

        // Extract product IDs from orders
        const productIds = ordersData.flatMap((order: any) => order.products);

        // Fetch products by IDs
        const productsResponse = await fetch('http://localhost:5000/api/products/products/by-ids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: productIds }),
        });
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await productsResponse.json();

        setOrders(ordersData.map((order: any) => ({
          ...order,
          products: products.filter((product: any) => order.products.includes(product._id)),
        })));
      } catch (error) {
        console.error('Error fetching orders and products:', error);
      } finally {
        setLoadingOrders(false);
      }
    } else {
      setOrders([]);
    }
  }, [user]);



  useEffect(() => {
    console.log('User Orders:', user?.orders);
    fetchOrderItems();
  }, [user, fetchOrderItems]);


  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems, cartVisible]); // Add cartVisible to dependencies if needed


  const handleOrderPlaced = async () => {
    try {
      // Clear cart items in the frontend
      setCartItems([]);

      // Directly update the user object in context
      if (user) {
        const updatedUser = { ...user, cart: [] }; // Set cart to empty
        setUser(updatedUser);
      }

      setShowNoItemsMessage(true);
    } catch (error) {
      console.error('Error handling order placement:', error);
    }
  };

  const handleOrderClick = async (order: any) => {
    try {
      setLoading(true); // Set loading state

      // If the clicked order is already selected, close the dropdown
      if (selectedOrder?._id === order._id) {
        setSelectedOrder(null);
        return;
      }

      const productsResponse = await fetch('http://localhost:5000/api/products/products/by-ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: order.products }),
      });

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }

      const products = await productsResponse.json();
      setSelectedOrder({ ...order, products });

    } catch (error) {
      console.error('Error fetching order products:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };





  // Close the dropdowns and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (ordersRef.current && !ordersRef.current.contains(event.target as Node)) {
        setOrdersOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = () => {
    setLoadingCategory(true);
    // Simulate a network request or perform actual loading
    setTimeout(() => setLoadingCategory(false), 2000); // Example delay
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative z-20"> {/* Ensure this has a higher z-index */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-gray-900">Paws&Scales</h1>
          {isLoggedIn && (
            <div className="flex items-center space-x-4">


              {/* Cart Dropdown */}
              <div className={`relative flex flex-col items-center ${styles.iconContainer}`}>
                <div className="flex flex-col items-center cursor-pointer" onClick={() => { toggleCart(); fetchCartItems(); }}>
                  <FaShoppingCart className="text-2xl text-gray-900" />
                  <span className="text-xs text-gray-900">Cart</span>
                </div>
                {cartOpen && (
                  <div ref={cartRef} className={`${styles.dropdown} ${styles.dropdownScroll}`}>
                    {loadingCart ? ( // Check if loadingCart is true to show the loader
                      <LottieLoader /> // Display the loader
                    ) : cartItems.length === 0 ? (
                      <div className={`${styles.emptyMessage}`}>
                        <FaSadTear className="text-3xl text-gray-500 mx-auto" />
                        <p className="text-gray-500">{showNoItemsMessage ? 'No more items in cart' : 'Cart is empty'}</p>
                      </div>
                    ) : (
                      <>
                        <ul>
                          {cartItems.map((item) => (
                            <li key={item._id} className={`${styles.dropdownItem}`}>
                              <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="w-12 h-12 object-cover" />
                              <div>
                                <p className="text-gray-900 font-medium">{item.name}</p>
                                <p className="text-gray-600">${item.price}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {user && ( // Ensure user is defined before rendering PlaceOrderButton
                          <PlaceOrderButton
                            userId={user._id}
                            cartItems={cartItems}
                            totalAmount={cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}
                            onOrderPlaced={handleOrderPlaced} // Pass the callback
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

             
              {/* Orders Dropdown */}
              <div className={`relative flex flex-col items-center ${styles.iconContainer}`}>
                <div className="flex flex-col items-center cursor-pointer" onClick={toggleOrders}>
                  <FaBox className="text-2xl text-gray-900" />
                  <span className="text-xs text-gray-900">Orders</span>
                </div>
                {ordersOpen && (
                  <div ref={ordersRef} className={`${styles.ordersDropdown}`}>
                    {loadingOrders ? (
                      <LottieLoader /> // Display the loader
                    ) : orders.length === 0 ? (
                      <div className={styles.emptyMessage}>You have no orders</div>
                    ) : (
                      <ul className={styles.orderList}>
                        {orders.map((order) => (
                          <li key={order._id} className={`${styles.orderItem} ${selectedOrder?._id === order._id ? styles.selectedOrder : ''}`}>
                            <div className={styles.orderDetails} onClick={() => handleOrderClick(order)}>
                              <div className={styles.orderId}>Order ID: {order._id}</div>
                              <div className={styles.orderDate}>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                              <div className={styles.orderStatus}>Status: {order.status}</div>
                              <div className={styles.orderAmount}>Total: ${order.totalAmount.toFixed(2)}</div>
                            </div>
                            {selectedOrder?._id === order._id && selectedOrder.products && (
                              <div className={styles.orderProductsDropdown}>
                                {selectedOrder.products.map((product) => (
                                  <div key={product._id} className={styles.orderProductItem}>
                                    <Image src={product.imageUrl} alt={product.name} width={50} height={50} />
                                    <div className={styles.orderProductDetails}>
                                      <div className={styles.orderProductName}>{product.name}</div>
                                      <div className={styles.orderProductPrice}>${product.price}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>


 {/* Profile Dropdown */}
 <div className={`relative flex flex-col items-center ${styles.iconContainer}`}>
                <div className="flex flex-col items-center cursor-pointer" onClick={toggleProfile}>
                  <FaUserCircle className="text-2xl text-gray-900" />
                  <span className="text-xs text-gray-900">Profile</span>
                </div>
                {profileOpen && (
                  <div ref={profileRef} className={`${styles.dropdown} absolute right-0 mt-2`}>
                    {loadingProfile ? ( // Check if loadingProfile is true to show the loader
                      <LottieLoader /> // Display the loader
                    ) : (
                      <ul>
                        <li className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100" onClick={openAccountModal}>Account</li>
                        <li className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">Privacy and Security</li>
                        <li className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">Help</li>
                        <li className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100">Customer Contact</li>
                        <li className="p-4 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>Log Out</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>



              {/* Sell Product Dropdown */}
              <div className={`relative flex flex-col items-center ${styles.iconContainer}`}>
                <div className="flex flex-col items-center cursor-pointer" onClick={openModal}>
                  <FaPlus className="text-2xl text-gray-900" />
                  <span className="text-xs text-gray-900">Sell Product</span>
                </div>
              </div>

              {/* Your Products Dropdown */}
              <div className={`relative flex flex-col items-center ${styles.iconContainer}`}>
                <div className="flex flex-col items-center cursor-pointer" onClick={openYourProductsModal}>
                  <FaBox className="text-2xl text-gray-900" />
                  <span className="text-xs text-gray-900">Your Products</span>
                </div>
              </div>
            </div>
          )}
          {!isLoggedIn && (
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                onClick={handleLoginPrompt}
              >
                <FaSignInAlt className="text-lg text-gray-900" />
                <span className="text-gray-900">Log In</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Video */}
      <section className={`${styles.hero} relative z-0`}>
        <video
          className={`${styles.heroVideo} absolute inset-0 w-full h-full object-cover`}
          autoPlay
          muted
          loop
        >
          <source src="/heroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">The Ultimate Pet Store You Ever Need</h1>
            <p className="text-lg">Find everything you need for your pet friend.</p>
          </div>
        </div>
      </section>
      <main>
        <div className={`${styles.categoriesContainer} py-10`}>
          <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
            {loadingCategory ? (
              <LottieLoader /> // Show loader when loading
            ) : (
              <>
                <Link href="/category/dog-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/dog-supplies.jpg" alt="Dog Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Dog Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your dog.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/category/cat-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/cat-supplies.jpg" alt="Cat Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Cat Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your cat.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/category/bird-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/bird-supplies.jpg" alt="Bird Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Bird Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your bird.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/category/fish-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/fish-supplies.jpg" alt="Fish Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Fish Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your fish.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/category/reptile-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/reptile-supplies.jpg" alt="Reptile Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Reptile Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your reptile.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/category/small-pet-supplies">
                  <div className={styles.categoryCard} onClick={handleCategoryClick}>
                    <Image src="/small-pet-supplies.jpg" alt="Small Pet Supplies" width={500} height={500} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Small Pet Supplies</h3>
                      <p className="mt-2 text-gray-600">All essentials for your small pet.</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      {/* Sell Product Modal */}
      {isModalOpen && <SellProductModal isOpen={isModalOpen} onClose={closeModal} />}
      {/* Your Products Modal */}
      <YourProductsModal isOpen={isYourProductsModalOpen} onClose={closeYourProductsModal} />
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} onLogin={handleLogin} />

      <AccountModal isOpen={isAccountModalOpen} onClose={closeAccountModal} user={user} />

    </div>
  );
}
