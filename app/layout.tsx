// app/layout.tsx
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
