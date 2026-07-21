"use client"

import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext({
  cart: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
})

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load guest cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nearshare_cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (_e) {
      // Ignore localStorage errors
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem("nearshare_cart", JSON.stringify(cart))
    } catch (_e) {
      // Ignore localStorage errors
    }
  }, [cart, isInitialized])

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id)
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) => {
          if (i.id === itemId) {
            const newQty = (i.quantity || 1) + delta
            return newQty > 0 ? { ...i, quantity: newQty } : null
          }
          return i
        })
        .filter(Boolean)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
