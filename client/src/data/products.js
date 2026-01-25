// Utility functions only - mock product data removed

export const categories = [
  "All",
  "Serums",
  "Moisturizers",
  "Cleansers",
  "Lip Care",
  "Face Oils",
  "Masks",
  "Eye Care",
  "Body Care",
];

export const formatPrice = (price) => {
  const safePrice = Number(price) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safePrice);
};
