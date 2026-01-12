"use client";

import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoadingOverlay from "../components/LoadingOverlay";
import CartHydrator from "../components/CartHydrator";
import Script from "next/script";

const defaultTitle = "MakeMee Cosmetics | Premium Beauty Products Online";
const defaultDescription =
  "Shop high-quality cosmetics, skincare, and beauty products from MakeMee. Discover the latest trends and best deals for your perfect look.";
const canonicalUrl = "https://makemee.in/";
const defaultKeywords =
  "cosmetics, beauty products, skincare, makeup, online store, MakeMee, beauty shop";
const defaultImage = `${canonicalUrl}social-share-image.jpg`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{defaultTitle}</title>

        {/* SEO Meta */}
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="MakeMee Cosmetics Team" />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />

        {/* Favicon */}
        <link rel="shortcut icon" href="/logo.webp" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Open Graph */}
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="MakeMee Cosmetics" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={defaultImage} />
        <meta
          property="og:image:alt"
          content="MakeMee Cosmetics Logo and Banner"
        />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MakeMeeCosmetics" />
        <meta name="twitter:creator" content="@MakeMeeCosmetics" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultImage} />

        {/* 🔥 Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MWCZ223N');
          `}
        </Script>
      </head>

      <body>
        {/* GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MWCZ223N"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <Provider store={store}>
            <CartHydrator>
              {children}
            </CartHydrator>
            <LoadingOverlay show={false} />
          </Provider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
