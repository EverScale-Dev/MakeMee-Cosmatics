import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import ContactPage from "./pages/Contact";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Whishlist";
import TrackOrder from "./pages/OrderTrackingPage";
import Orders from "./pages/AllOrders";


function AppLayout() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/account",
    "/orders", // covers /orders/:id
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && (
        <Navbar
          isAuthenticated={true}
          cartCount={3}
          wishlistCount={1}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders/:id" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}


function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AppLayout />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
