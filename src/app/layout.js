export const metadata = {
  title: 'Mon App Pipeline',
  description: 'Atelier Pipeline as Code - EPSI PPCE836',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
