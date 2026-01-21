import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";


function AppLayout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const hideNavbarRoutes = [
    "/account",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && (
        <Navbar
          isAuthenticated={isLoggedIn}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders/:id" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppLayout />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
