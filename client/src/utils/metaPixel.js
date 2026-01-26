// Check if fbq is available
const fbq = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};

// Basic PageView tracking
export const trackPageView = () => {
  fbq("track", "PageView");
};

// Generic event tracking
export const trackEvent = (event, params = {}) => {
  fbq("track", event, params);
};

// AddToCart event
// Fires when a user adds an item to their shopping cart
export const trackAddToCart = (product, quantity = 1) => {
  const price = Number(
    product.selectedSize?.sellingPrice ||
    product.salePrice ||
    product.regularPrice ||
    product.price ||
    0
  );

  fbq("track", "AddToCart", {
    content_name: product.name,
    content_ids: [product._id || product.id],
    content_type: "product",
    value: price * quantity,
    currency: "INR",
    contents: [{
      id: product._id || product.id,
      quantity: quantity,
      item_price: price,
    }],
  });
};

// InitiateCheckout event
// Fires when a user begins the checkout process
export const trackInitiateCheckout = (items, totalValue) => {
  fbq("track", "InitiateCheckout", {
    content_ids: items.map(item => item.product?._id || item.product?.id || item.id),
    content_type: "product",
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    value: totalValue,
    currency: "INR",
  });
};

// Purchase event
// Fires when a user completes a purchase
export const trackPurchase = (orderId, items, totalValue) => {
  fbq("track", "Purchase", {
    content_ids: items.map(item => item.product || item.productId || item.id),
    content_type: "product",
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    value: totalValue,
    currency: "INR",
    order_id: orderId,
  });
};

// AddToWishlist event
// Fires when a user adds an item to their wishlist
export const trackAddToWishlist = (product) => {
  const price = Number(
    product.selectedSize?.sellingPrice ||
    product.salePrice ||
    product.regularPrice ||
    product.price ||
    0
  );

  fbq("track", "AddToWishlist", {
    content_name: product.name,
    content_ids: [product._id || product.id],
    content_type: "product",
    value: price,
    currency: "INR",
  });
};

// ViewContent event (bonus - for product page views)
export const trackViewContent = (product) => {
  const price = Number(
    product.selectedSize?.sellingPrice ||
    product.salePrice ||
    product.regularPrice ||
    product.price ||
    0
  );

  fbq("track", "ViewContent", {
    content_name: product.name,
    content_ids: [product._id || product.id],
    content_type: "product",
    value: price,
    currency: "INR",
  });
};
