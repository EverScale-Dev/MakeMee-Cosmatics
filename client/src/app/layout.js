"use client";
import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";
import LoadingOverlay from "../components/LoadingOverlay";

const defaultTitle = "MakeMee Cosmetics | Premium Beauty Products Online";
const defaultDescription =
  "Shop high-quality cosmetics, skincare, and beauty products from MakeMee. Discover the latest trends and best deals for your perfect look.";
const canonicalUrl = "https://www.yourdomain.com/"; // Replace with actual domain
const defaultKeywords =
  "cosmetics, beauty products, skincare, makeup, online store, MakeMee, beauty shop";
const defaultImage = `${canonicalUrl}social-share-image.jpg`; // Replace with actual image

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="MakeMee Cosmetics Team" />

        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        <link rel="shortcut icon" href="/logo.webp" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MakeMee Cosmetics" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:image:alt" content="MakeMee Cosmetics Logo and Banner" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MakeMeeCosmetics" />
        <meta name="twitter:creator" content="@MakeMeeCosmetics" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultImage} />
      </head>
      <body>
        <Provider store={store}>
          {children}
          {/* Show overlay here when you want */}
          <LoadingOverlay show={false} />
        </Provider>
      </body>
    </html>
  );
}
