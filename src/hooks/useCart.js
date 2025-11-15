import { useCallback, useEffect, useState } from "react";
import authApiClient from "../services/auth-api-client";

const useCart = () => {
  const [authToken] = useState(
    () => JSON.parse(localStorage.getItem("authTokens"))?.access
  );
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(() => localStorage.getItem("cartId"));
  const [loading, setLoading] = useState(false);

  const getOrCreateCart = useCallback(async () => {
    setLoading(true);

    let currentCartId = localStorage.getItem("cartId");

    if (currentCartId) {
      try {
        const response = await authApiClient.get(`/carts/${currentCartId}/`);
        setCart(response.data);
        setCartId(response.data.id);
        setLoading(false);
        return response.data;
      } catch {
        localStorage.removeItem("cartId");
        currentCartId = null;
      }
    }

    if (!currentCartId) {
      try {
        const response = await authApiClient.post("/carts/");
        setCart(response.data);
        setCartId(response.data.id);
        localStorage.setItem("cartId", response.data.id);
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error("Failed to create cart:", error);
        setLoading(false);
      }
    }
  }, [authToken]);

  const addCartItem = useCallback(
    async (productId, quantity) => {
      setLoading(true);
      let currentCart = cart;

      if (!currentCart) {
        currentCart = await getOrCreateCart();
        if (!currentCart) return;
      }

      try {
        await authApiClient.post(`/carts/${currentCart.id}/items/`, {
          food_id: productId,
          quantity,
        });
        await getOrCreateCart();
      } catch (error) {
        console.error("Error adding item to cart:", error);
      } finally {
        setLoading(false);
      }
    },
    [cart, getOrCreateCart]
  );

  const updateCartItemQuantity = useCallback(
    async (itemId, quantity) => {
      if (!cart?.id) return;

      const prevCart = { ...cart };
      try {
        setCart((currentCart) => {
          const updatedItems = currentCart.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  total_price: item.food.price * quantity,
                }
              : item
          );

          return {
            ...currentCart,
            items: updatedItems,
            total_price: updatedItems.reduce(
              (sum, item) => sum + item.total_price,
              0
            ),
          };
        });

        await authApiClient.patch(`/carts/${cart.id}/items/${itemId}/`, {
          quantity,
        });
      } catch (error) {
        console.error("Error updating cart items", error);
        setCart(prevCart);
      }
    },
    [cart]
  );

  const deleteCartItems = useCallback(
    async (itemId) => {
      if (!cart?.id) return;
      try {
        await authApiClient.delete(`/carts/${cart.id}/items/${itemId}/`);
        await getOrCreateCart();
      } catch (error) {
        console.error(error);
      }
    },
    [cart, getOrCreateCart]
  );

  useEffect(() => {
    if (!cart && cartId) {
      getOrCreateCart();
    } else if (!cart && !cartId) {
      getOrCreateCart();
    }
  }, [getOrCreateCart, cart, cartId]);

  return {
    cart,
    loading,
    cartId,
    getOrCreateCart,
    addCartItem,
    updateCartItemQuantity,
    deleteCartItems,
  };
};

export default useCart;
