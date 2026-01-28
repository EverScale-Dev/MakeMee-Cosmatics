import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Customers from "./Customers";
import Reviews from "./Reviews";
import Coupons from "./Coupons";
import Settings from "./Settings";
import ContactSubmissions from "./ContactSubmissions";
import AdminAccess from "./AdminAccess";

const pages = {
  Dashboard,
  Orders,
  Products,
  Customers,
  Reviews,
  Coupons,
  Messages: ContactSubmissions,
  Settings,
  "Admin Access": AdminAccess
};

export default pages;
