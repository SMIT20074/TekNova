"use client"

import { createContext, useContext, useEffect, useState } from "react"

const WishlistContext = createContext({
  wishlist: [],
  isWishlistOpen: false,
  setIsWishlistOpen: () => {},
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  updateQuantity: () => {},
  clearWishlist: () => {},
  wishlistCount: 0,
  wishlistTotal: 0,
})

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load guest wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("nearshare_wishlist")
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    } catch (_e) {
      // Ignore localStorage errors
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem("nearshare_wishlist", JSON.stringify(wishlist))
    } catch (_e) {
      // Ignore localStorage errors
    }
  }, [wishlist, isInitialized])

  const addToWishlist = (item) => {
    setWishlist((prevWishlist) => {
      const existing = prevWishlist.find((i) => i.id === item.id)
      if (existing) {
        return prevWishlist.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        )
      }
      return [...prevWishlist, { ...item, quantity: 1 }]
    })
    // Note: Auto-opening drawer removed per user preference; ping notification handles user feedback.
  }

  const removeFromWishlist = (itemId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setWishlist((prevWishlist) =>
      prevWishlist
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

  const clearWishlist = () => {
    setWishlist([])
  }

  const wishlistCount = wishlist.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const wishlistTotal = wishlist.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0)

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        updateQuantity,
        clearWishlist,
        wishlistCount,
        wishlistTotal,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
