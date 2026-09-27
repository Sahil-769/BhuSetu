
import "./globals.css";

export const metadata = {
  title: "BHOOMI - AI",
  description: "Suggestion From AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}