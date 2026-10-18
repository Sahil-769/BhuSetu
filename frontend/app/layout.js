
import "./globals.css";

export const metadata = {
  title: "BhuSetu | Land Acquisition Intelligence",
  description: "AI-powered land acquisition intelligence for identifying delay risks and enabling timely action.",
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