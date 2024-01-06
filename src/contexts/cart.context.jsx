import { createContext, useState, useEffect, useReducer } from "react";

const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
    );

    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem.id === productToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }

    return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
    // find the cart item to remove
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    );

    // check if quantity is equal to 1, if it is remove that item from the cart
    if (existingCartItem.quantity === 1) {
        return cartItems.filter(
            (cartItem) => cartItem.id !== cartItemToRemove.id
        );
    }

    // return back cartitems with matching cart item with reduced quantity
    return cartItems.map((cartItem) =>
        cartItem.id === cartItemToRemove.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
    );
};

const clearCartItem = (cartItems, cartItemToClear) =>
    cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0,
});

const initialState = {
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

const CART_ACTION_TYPE = {
    SET_CART_ITEMS: "SET_CART_ITEMS",
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTION_TYPE.SET_CART_ITEMS:
            return { ...state, ...action.payload };
        default:
            throw new Error(`Unhandled this action ${action.type}`);
    }
};
export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [state, dispatch] = useReducer(cartReducer, initialState);
    let { cartItems, cartCount, cartTotal } = state;

    const updateCartStateAsCartItemsChanged = (newCartItems) => {
        const newCartCount = newCartItems.reduce(
            (acc, cartItem) => acc + cartItem.quantity,
            0
        );
        const newCartTotal = newCartItems.reduce(
            (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
            0
        );
        dispatch({
            type: CART_ACTION_TYPE.SET_CART_ITEMS,
            payload: {
                cartItems: newCartItems,
                cartCount: newCartCount,
                cartTotal: newCartTotal,
            },
        });
    };
    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartStateAsCartItemsChanged(newCartItems);
    };

    const removeItemToCart = (cartItemToRemove) => {
        const newCartItems = removeCartItem(cartItems, cartItemToRemove);
        updateCartStateAsCartItemsChanged(newCartItems);
    };

    const clearItemFromCart = (cartItemToClear) => {
        const newCartItems = clearCartItem(cartItems, cartItemToClear);
        updateCartStateAsCartItemsChanged(newCartItems);
    };

    const value = {
        isCartOpen,
        setIsCartOpen,
        addItemToCart,
        removeItemToCart,
        clearItemFromCart,
        cartItems,
        cartCount,
        cartTotal,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
