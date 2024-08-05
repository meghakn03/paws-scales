import './globals.css';
import { AuthProvider } from './contexts/AuthContext'; // Import the AuthProvider
import { ProductProvider } from './contexts/ProductContext';


export const metadata = {
  title: 'Pet E-commerce',
  description: 'An e-commerce site to buy pet products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <ProductProvider>
          {children}
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
