import './globals.css';
import { AuthProvider } from './contexts/AuthContext'; // Import the AuthProvider

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
