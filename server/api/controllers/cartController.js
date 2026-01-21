const Cart = require('../../models/Cart');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.User._id });

    if (!cart) {
      return res.status(200).json({ items: [], totalQuantity: 0 });
    }

    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      items: cart.items.map((item) => ({
        id: item.productId.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
        selectedSize: item.selectedSize || null,
      })),
      totalQuantity,
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Merge guest cart with user cart on login
exports.mergeCart = async (req, res) => {
  const { guestCart } = req.body; // Array of { id, name, price, quantity, image, weight, selectedSize }

  if (!guestCart || !Array.isArray(guestCart)) {
    return res.status(400).json({ message: 'Invalid guest cart data' });
  }

  try {
    let cart = await Cart.findOne({ user: req.User._id });

    if (!cart) {
      cart = new Cart({ user: req.User._id, items: [] });
    }

    // Merge guest cart items
    for (const guestItem of guestCart) {
      // Match by productId AND selectedSize.ml (if sizes exist)
      const existingItemIndex = cart.items.findIndex((item) => {
        const sameProduct = item.productId.toString() === guestItem.id;
        const sameSize = (!item.selectedSize && !guestItem.selectedSize) ||
          (item.selectedSize?.ml === guestItem.selectedSize?.ml);
        return sameProduct && sameSize;
      });

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        cart.items.push({
          productId: guestItem.id,
          name: guestItem.name,
          price: guestItem.price,
          quantity: guestItem.quantity,
          image: guestItem.image,
          weight: guestItem.weight,
          selectedSize: guestItem.selectedSize || null,
        });
      }
    }

    await cart.save();

    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      message: 'Cart merged successfully',
      items: cart.items.map((item) => ({
        id: item.productId.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
        selectedSize: item.selectedSize || null,
      })),
      totalQuantity,
    });
  } catch (error) {
    console.error('Error merging cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart (add/remove/update items)
exports.updateCart = async (req, res) => {
  const { action, item } = req.body;
  // action: 'add', 'remove', 'update', 'clear'
  // item: { id, name, price, quantity, image, weight, selectedSize }

  try {
    let cart = await Cart.findOne({ user: req.User._id });

    if (!cart) {
      cart = new Cart({ user: req.User._id, items: [] });
    }

    // Helper to find item by productId AND selectedSize
    const findItemIndex = (items, itemId, selectedSize) => {
      return items.findIndex((i) => {
        const sameProduct = i.productId.toString() === itemId;
        const sameSize = (!i.selectedSize && !selectedSize) ||
          (i.selectedSize?.ml === selectedSize?.ml);
        return sameProduct && sameSize;
      });
    };

    switch (action) {
      case 'add': {
        if (!item || !item.id) {
          return res.status(400).json({ message: 'Item data required' });
        }

        const existingIndex = findItemIndex(cart.items, item.id, item.selectedSize);

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity = item.quantity;
        } else {
          cart.items.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            weight: item.weight,
            selectedSize: item.selectedSize || null,
          });
        }
        break;
      }

      case 'remove': {
        if (!item || !item.id) {
          return res.status(400).json({ message: 'Item ID required' });
        }
        const removeIndex = findItemIndex(cart.items, item.id, item.selectedSize);
        if (removeIndex > -1) {
          cart.items.splice(removeIndex, 1);
        }
        break;
      }

      case 'update': {
        if (!item || !item.id) {
          return res.status(400).json({ message: 'Item data required' });
        }

        const itemIndex = findItemIndex(cart.items, item.id, item.selectedSize);

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = item.quantity;
          if (item.quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          }
        }
        break;
      }

      case 'clear': {
        cart.items = [];
        break;
      }

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await cart.save();

    const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    res.status(200).json({
      items: cart.items.map((i) => ({
        id: i.productId.toString(),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        weight: i.weight,
        selectedSize: i.selectedSize || null,
      })),
      totalQuantity,
    });
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
