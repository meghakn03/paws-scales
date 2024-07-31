'use client'; // Mark this as a Client Component

import { useRouter } from 'next/navigation'; // Import from next/navigation
import Image from 'next/image';
import styles from '../../page.module.css';

export default function CategoryPage() {
  const router = useRouter();
  
  // Use router as needed

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`${styles.header} bg-white shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Category Page</h1>
        </div>
      </header>
      <main>
        <div className={`${styles.categoryContainer} py-10`}>
          <h2 className="text-2xl font-bold text-center mb-6">Category Details</h2>
          {/* Add your category content here */}
        </div>
      </main>
    </div>
  );
}
