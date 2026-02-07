import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle adding or substracting to cart
  const handleAddToCart = useCallback(
    (productId, delta, quantity, size, color) => {
      const newQuantity = quantity + delta;
      if (newQuantity >= 1) {
        dispatch(
          updateCartItemQuantity({
            productId,
            quantity: newQuantity,
            guestId,
            userId,
            size,
            color,
          }),
        );
      }
    },
    [dispatch, guestId, userId],
  );

  const handleRemoveFromCart = useCallback(
    (productId, size, color) => {
      dispatch(removeFromCart({ productId, guestId, userId, size, color }));
    },
    [dispatch, guestId, userId],
  );

  if (!cart?.products?.length) {
    return (
      <div className="text-center py-12 text-gray-500">Your cart is empty</div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm border"
        >
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-20 h-20 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">
              Size: {product.size} | Color: {product.color}
            </p>
            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color,
                  )
                }
                className="w-10 h-10 border rounded-full flex items-center justify-center mr-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">
                {product.quantity}
              </span>
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    1,
                    product.quantity,
                    product.size,
                    product.color,
                  )
                }
                className="w-10 h-10 border rounded-full flex items-center justify-center ml-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color,
                )
              }
              className="text-red-500 hover:text-red-700 flex items-center mt-2 p-2"
              title="Remove item"
            >
              <RiDeleteBin3Line size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
