import React from "react";
import TrackingTimeline from "@/components/OrderUserProfile/order-history";
import {
  Home,
  Package,
  Ship,
  Warehouse,
  ClipboardCheck,
  PackageCheck,
} from "lucide-react";

const orderHistoryItems = [
  {
    id: 1,
    status: "completed",
    title: "Order Placed",
    date: "20 Jun 2024, 08:45",
    icon: <ClipboardCheck className="h-4 w-4 text-white" />,
  },
  {
    id: 2,
    status: "completed",
    title: "Order Processed",
    date: "21 Jun 2024, 02:30",
    icon: <Package className="h-4 w-4 text-white" />,
  },
  {
    id: 3,
    status: "completed",
    title: "Pick up",
    date: "22 Jun 2024, 12:34",
    icon: <Warehouse className="h-4 w-4 text-white" />,
  },
  {
    id: 4,
    status: "in-progress",
    title: "Out for shipment",
    date: "Today",
    icon: <Ship className="h-4 w-4 text-primary" />,
  },
  {
    id: 5,
    status: "pending",
    title: "Out for Delivery",
    date: "24 Jun 2024",
    icon: <PackageCheck className="h-4 w-4 text-muted-foreground/50" />,
  },
  {
    id: 6,
    status: "pending",
    title: "Delivered",
    date: "24 Jun 2024",
    icon: <Home className="h-4 w-4 text-muted-foreground/50" />,
  },
];

const OrderTrackingPage = () => {
  return (
    <div className="min-h-screen bg-background p-6 mt-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-2xl font-bold">Order Tracking</h2>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Timeline Section */}
          <div className="md:col-span-2 rounded-lg border bg-card p-6 shadow-sm">
            <TrackingTimeline items={orderHistoryItems} />
          </div>

          {/* Order Summary Section */}
          <div className="h-fit rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">#ORD-45821</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">Smart Watch Pro</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">1</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium text-green-600">
                  Paid (Online)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Address</span>
                <span className="text-right font-medium">
                  Kolhapur, Maharashtra
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">₹4,999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
