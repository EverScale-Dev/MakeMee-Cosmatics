import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

// Context Providers
import { AuthProvider, useAuth, setCartSyncCallback } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
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
import TermsAndConditions from "./pages/TermsAndConditions";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Auth redirect wrapper - redirects logged-in users away from login/signup
function AuthRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/account" replace />;
  }
  return children;
}

// 404 Not Found page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <a href="/" className="px-6 py-3 bg-[#FC6CB4] text-white rounded-full hover:bg-[#e55a9f]">
          Go Home
        </a>
      </div>
    </div>
  );
}


function AppLayout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { syncWithBackend } = useCart();

  // Set up cart sync callback for auth
  useEffect(() => {
    setCartSyncCallback(syncWithBackend);
  }, [syncWithBackend]);

  const hideNavbarRoutes = [
    "/account",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="flex flex-col min-h-screen">
       <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={3000}
      />
      
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
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders/:id" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/profile" element={<Navigate to="/account" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><SignUp /></AuthRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppLayout />
            <Toaster position="top-right" richColors />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
