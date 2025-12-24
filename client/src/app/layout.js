import "../styles/globals.css";
import Providers from "../components/Providers";
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
        {/* SEO */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <meta name="keywords" content={defaultKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="MakeMee Cosmetics Team" />

        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Open Graph */}
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDescription} />
        <meta name="twitter:image" content={defaultImage} />

        {/* 🔥 GOOGLE TAG MANAGER */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MWCZ223N');
          `}
        </Script>
      </head>

      <body>
        {/* GTM (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MWCZ223N"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
