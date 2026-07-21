"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"

// Mock campus listings seed data (prices in INR ₹)
const SEED_LISTINGS = [
  {
    id: "1",
    title: "Introduction to Algorithms (4th Ed) - CLRS",
    category: "Books",
    listing_type: "Sell",
    price: 450,
    original_price: 1200,
    discount: "-62% OFF",
    condition: "Good",
    location: "North Campus Library",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    seller_name: "Alex M. (CS Senior)",
    verified_student: true,
    description: "Lightly used textbook, no highlighting or torn pages. Essential for CS201/CS301.",
    created_at: "2 hours ago"
  },
  {
    id: "2",
    title: "TI-84 Plus CE Color Graphing Calculator",
    category: "Electronics",
    listing_type: "Rent",
    price: 150,
    price_unit: "/ mo",
    condition: "Like New",
    location: "Science Block B",
    image_url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=800&auto=format&fit=crop",
    seller_name: "Sarah K. (Engineering)",
    verified_student: true,
    description: "Includes charging cable and slide case. Pre-loaded with math programs.",
    created_at: "5 hours ago"
  },
  {
    id: "3",
    title: "Urban Speed 21-Gear Hybrid Campus Cycle",
    category: "Cycles",
    listing_type: "Sell",
    price: 3500,
    original_price: 8000,
    discount: "-56% OFF",
    condition: "Good",
    location: "Dorm Quad 4",
    image_url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop",
    seller_name: "David L. (Junior)",
    verified_student: true,
    description: "Freshly tuned brakes and new tires. Comes with heavy-duty U-lock.",
    created_at: "1 day ago"
  },
  {
    id: "4",
    title: "Complete Arduino & Robotics Starter Kit",
    category: "Lab Gear",
    listing_type: "Sell",
    price: 750,
    original_price: 1500,
    discount: "-50% OFF",
    condition: "Like New",
    location: "Tech Innovation Hub",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    seller_name: "Rohan P. (ECE)",
    verified_student: true,
    description: "Includes UNO board, breadboards, sensors, stepper motors, and jumper wires.",
    created_at: "3 hours ago"
  },
  {
    id: "5",
    title: "Ergonomic Mesh Study Chair (Adjustable)",
    category: "Furniture",
    listing_type: "Sell",
    price: 1200,
    original_price: 3200,
    discount: "-62% OFF",
    condition: "Good",
    location: "East Hall Dorms",
    image_url: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?q=80&w=800&auto=format&fit=crop",
    seller_name: "Maya S. (Design)",
    verified_student: true,
    description: "Super comfortable for late-night study sessions. High lumbar support.",
    created_at: "1 day ago"
  },
  {
    id: "6",
    title: "Official Campus Hoodie (Size M, Navy)",
    category: "Clothing",
    listing_type: "Share",
    price: 0,
    condition: "Fair",
    location: "Student Center",
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    seller_name: "Chris T. (Senior)",
    verified_student: true,
    description: "Free giveaway! Graduating this term and passing down campus merch.",
    created_at: "4 hours ago"
  },
  {
    id: "7",
    title: "Sony WH-1000XM4 Noise Canceling Headphones",
    category: "Electronics",
    listing_type: "Sell",
    price: 4500,
    original_price: 12000,
    discount: "-62% OFF",
    condition: "Like New",
    location: "Main Library Study Hub",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    seller_name: "Priya V. (BioTech)",
    verified_student: true,
    description: "Perfect noise cancellation for studying in busy halls. Includes travel case.",
    created_at: "6 hours ago"
  },
  {
    id: "8",
    title: "Organic Chemistry Model Kit & Study Guide",
    category: "Lab Gear",
    listing_type: "Sell",
    price: 350,
    original_price: 850,
    discount: "-58% OFF",
    condition: "Like New",
    location: "Chem Lab Annex",
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
    seller_name: "Jordan K. (Pre-Med)",
    verified_student: true,
    description: "Complete 240-piece molecular model set. Helped me get an A in Orgo!",
    created_at: "12 hours ago"
  }
]

function MarketplaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut } = useAuth()
  const { wishlist, wishlistCount, wishlistTotal, addToWishlist, removeFromWishlist, updateQuantity, isWishlistOpen, setIsWishlistOpen } = useWishlist()

  // State
  const [listings, setListings] = useState(SEED_LISTINGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All") // All, Sell, Rent, Share
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000)
  const [bookmarkedIds, setBookmarkedIds] = useState([])

  // Drawers & Modals
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [authGateModal, setAuthGateModal] = useState({ open: false, actionTitle: "" })
  const [toastMessage, setToastMessage] = useState("")

  // Fetch listings from API (fallback to seed data)
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setListings(data)
          }
        }
      } catch (_err) {
        // Fallback to SEED_LISTINGS
      }
    }
    fetchListings()
  }, [])

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Trigger gated action check
  const executeGatedAction = (actionTitle, onAuthenticatedSuccess) => {
    if (!user) {
      setAuthGateModal({ open: true, actionTitle })
    } else {
      onAuthenticatedSuccess()
    }
  }

  // Handle Bookmarks
  const toggleBookmark = (id) => {
    executeGatedAction("Save item to bookmarks", () => {
      setBookmarkedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
      showToast(bookmarkedIds.includes(id) ? "Removed from saved items" : "Item saved to bookmarks!")
    })
  }

  // Categories
  const categories = [
    { name: "All", icon: "apps" },
    { name: "Books", icon: "menu_book" },
    { name: "Electronics", icon: "devices" },
    { name: "Cycles", icon: "pedal_bike" },
    { name: "Lab Gear", icon: "science" },
    { name: "Furniture", icon: "chair" },
    { name: "Clothing", icon: "checkroom" },
  ]

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesType = selectedType === "All" || item.listing_type === selectedType
    const matchesCondition = selectedCondition === "All" || item.condition === selectedCondition
    const matchesPrice = item.price <= maxPriceFilter

    return matchesSearch && matchesCategory && matchesType && matchesCondition && matchesPrice
  })

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      {/* ── Toast Notification (Ping) ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary-fixed-dim">check_circle</span>
          <span className="font-label-md">{toastMessage}</span>
        </div>
      )}

      {/* ── Auth Gate Modal ── */}
      {authGateModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl p-8 max-w-md w-full border border-outline-variant/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">lock</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-background">Sign In Required</h3>
              <p className="font-body-md text-on-surface-variant">
                You need to log in or create an account to <strong className="text-primary">{authGateModal.actionTitle}</strong>.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent("/marketplace")}`)}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                Log In / Create Account
              </button>
              <button
                onClick={() => setAuthGateModal({ open: false, actionTitle: "" })}
                className="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md py-3 rounded-xl font-semibold hover:bg-surface-variant transition-all"
              >
                Continue Browsing as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Blinkit-Style Side Menu Drawer ── */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsSideMenuOpen(false)}></div>
          <aside className="relative w-80 max-w-full bg-surface-container-lowest h-full shadow-2xl flex flex-col z-10 border-l border-outline-variant/30 p-6">
            <div className="flex justify-between items-center pb-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
                  {user ? user.email[0].toUpperCase() : "G"}
                </div>
                <div>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface line-clamp-1">
                    {user ? user.email.split("@")[0] : "Guest Student"}
                  </h4>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {user ? "Verified Student" : "Exploring Marketplace"}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsSideMenuOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-2">
              <button
                onClick={() => {
                  setIsSideMenuOpen(false)
                  executeGatedAction("access Your Items", () => showToast("Opening Your Listed Items..."))
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container transition-all text-on-surface font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <span>Your Items</span>
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false)
                  executeGatedAction("access Messages & Chat", () => showToast("Opening Chat Conversations..."))
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container transition-all text-on-surface font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                <span>Messages & Chat</span>
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false)
                  executeGatedAction("create a new Post", () => router.push("/post"))
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container transition-all text-on-surface font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <span>Post an Item</span>
              </button>

              <button
                onClick={() => {
                  setIsSideMenuOpen(false)
                  executeGatedAction("access Settings", () => showToast("Opening Account Settings..."))
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container transition-all text-on-surface font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">settings</span>
                <span>Settings</span>
              </button>
            </nav>

            <div className="pt-6 border-t border-outline-variant/20">
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    setIsSideMenuOpen(false)
                    showToast("Logged out successfully")
                  }}
                  className="w-full bg-error-container text-on-error-container font-label-md text-label-md py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false)
                    router.push("/login")
                  }}
                  className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined">login</span>
                  Log In / Sign Up
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ── Slide-Over Wishlist Drawer ── */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsWishlistOpen(false)}></div>
          <aside className="relative w-96 max-w-full bg-surface-container-lowest h-full shadow-2xl flex flex-col z-10 border-l border-outline-variant/30 p-6">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">bookmark</span>
                <h3 className="font-headline-md text-headline-md text-on-background">Your Wishlist</h3>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">{wishlistCount}</span>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <span className="material-symbols-outlined text-6xl text-outline-variant">bookmark_border</span>
                  <p className="font-body-lg text-on-surface-variant">Your wishlist is empty</p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="bg-primary/10 text-primary font-label-md px-6 py-2 rounded-xl font-semibold hover:bg-primary hover:text-on-primary transition-all"
                  >
                    Explore Listings
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-3">
                    <div className="flex gap-3 items-center">
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-label-md text-on-surface font-bold truncate">{item.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-primary font-extrabold text-sm">₹{item.price}</span>
                          <span className="text-xs text-on-surface-variant font-medium">{item.seller_name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-md bg-surface-variant flex items-center justify-center font-bold hover:bg-outline-variant/40">-</button>
                          <span className="text-xs font-bold">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-md bg-surface-variant flex items-center justify-center font-bold hover:bg-outline-variant/40">+</button>
                          <button onClick={() => removeFromWishlist(item.id)} className="text-error hover:bg-error-container/40 p-1 rounded-lg ml-auto" title="Remove item">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Individual Proceed with Booking Button for this wishlist item */}
                    <button
                      onClick={() =>
                        executeGatedAction(`Book Purchase for ${item.title}`, () => {
                          showToast(`Booking deposit initiated for ${item.title.slice(0, 20)}...!`)
                        })
                      }
                      className="w-full bg-primary text-on-primary font-label-md text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Proceed with Booking</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center font-headline-md text-headline-md">
                <span className="text-sm font-bold text-on-surface-variant">Wishlist Total ({wishlistCount} items):</span>
                <span className="text-primary font-extrabold text-lg">₹{wishlistTotal.toFixed(0)}</span>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-xs">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="font-headline-md text-headline-md font-bold text-primary group-hover:scale-105 transition-transform">
              NearShare
            </span>
            <span className="hidden sm:inline bg-primary-container/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
              CAMPUS MARKETPLACE
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-surface-container-low border border-outline-variant/50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input
              type="text"
              placeholder="Search textbooks, calculators, cycles, lab gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none pl-3 text-on-surface placeholder:text-on-surface-variant/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">cancel</span>
              </button>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Button (Opens Wishlist Drawer on Demand) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-surface-variant/50 transition-all text-on-surface-variant hover:text-primary"
              title="View Wishlist"
            >
              <span className="material-symbols-outlined text-2xl">bookmark</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Post Item Button (Gated) */}
            <button
              onClick={() => executeGatedAction("Post a new item", () => router.push("/post"))}
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-full hover:bg-primary/90 transition-all font-bold shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="hidden sm:inline">Post Item</span>
            </button>

            {/* Side Menu Drawer Toggle (Profile Avatar) */}
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-primary-container/40 text-primary border-2 border-primary/20 flex items-center justify-center hover:scale-105 transition-transform overflow-hidden shadow-xs"
              title="Menu & Profile"
            >
              {user ? (
                <span className="font-bold text-sm">{user.email[0].toUpperCase()}</span>
              ) : (
                <span className="material-symbols-outlined text-on-primary-container">menu</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-margin-mobile pb-3">
          <div className="flex items-center bg-surface-container-low border border-outline-variant/50 rounded-full px-4 py-2">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input
              type="text"
              placeholder="Search campus resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none pl-2 text-on-surface"
            />
          </div>
        </div>
      </header>

      {/* ── Category Quick Bar ── */}
      <div className="w-full border-b border-outline-variant/20 bg-surface-container-lowest shadow-2xs">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${selectedCategory === cat.name
                    ? "bg-primary text-on-primary font-bold shadow-xs scale-105"
                    : "bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Marketplace Content ── */}
      <main className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full flex gap-8">
        {/* ── Left Sidebar Filters (Desktop) ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
                Filters
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory("All")
                  setSelectedType("All")
                  setSelectedCondition("All")
                  setMaxPriceFilter(5000)
                }}
                className="text-primary font-label-sm text-xs hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Listing Type Filter */}
            <div className="space-y-3">
              <h4 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">Listing Type</h4>
              {["All", "Sell", "Rent", "Share"].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="listingType"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="font-body-md text-sm text-on-surface group-hover:text-primary transition-colors">
                    {type === "Share" ? "Share (Free Giveaway)" : type}
                  </span>
                </label>
              ))}
            </div>

            {/* Condition Filter */}
            <div className="space-y-3 border-t border-outline-variant/20 pt-4">
              <h4 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">Condition</h4>
              {["All", "Like New", "Good", "Fair"].map((cond) => (
                <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="conditionFilter"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="font-body-md text-sm text-on-surface group-hover:text-primary transition-colors">
                    {cond}
                  </span>
                </label>
              ))}
            </div>

            {/* Max Price Filter (INR ₹) */}
            <div className="space-y-3 border-t border-outline-variant/20 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">Max Price</h4>
                <span className="text-primary font-bold text-sm">₹{maxPriceFilter}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* ── Right Content Area ── */}
        <div className="flex-1 space-y-8">
          {/* Quick Deals Hero Banner */}
          <section className="bg-gradient-to-r from-primary/10 via-surface-container-high to-surface-container-low rounded-3xl p-6 sm:p-8 border border-primary/20 shadow-xs relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm">bolt</span>
                QUICK CAMPUS DEALS
              </div>
              <h2 className="font-display-md text-headline-lg text-on-surface font-extrabold">
                Verified Peer-to-Peer Exchange
              </h2>
              <p className="font-body-md text-on-surface-variant text-sm sm:text-base">
                Save up to 70% on textbooks, lab gear, and dorm essentials directly from verified students on campus.
              </p>
            </div>
            <button
              onClick={() => setSelectedType("Sell")}
              className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all flex-shrink-0"
            >
              Explore Hot Deals
            </button>
          </section>

          {/* Active Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {selectedCategory === "All" ? "All Campus Listings" : `${selectedCategory} Listings`}
              </h3>
              <span className="text-on-surface-variant text-sm font-semibold bg-surface-container-high px-2.5 py-0.5 rounded-full">
                {filteredListings.length} items
              </span>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-sm font-semibold text-on-surface"
              >
                <option value="All">All Types</option>
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
                <option value="Share">Free Giveaway</option>
              </select>
            </div>
          </div>

          {/* Product Listing Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl p-16 text-center space-y-4 border border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">No matching listings found</h3>
              <p className="text-on-surface-variant max-w-md mx-auto text-sm">
                Try adjusting your search criteria or clearing filters to discover more items on campus.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedType("All")
                  setSelectedCondition("All")
                  setMaxPriceFilter(5000)
                }}
                className="bg-primary/10 text-primary font-label-md px-6 py-2.5 rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Listing Badge */}
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    {item.discount && (
                      <span className="bg-error text-on-error font-label-sm text-[10px] px-2 py-1 rounded-md font-bold shadow-xs">
                        {item.discount}
                      </span>
                    )}
                    {item.listing_type === "Rent" && (
                      <span className="bg-secondary-container text-on-secondary-container font-label-sm text-[10px] px-2 py-1 rounded-md font-bold shadow-xs">
                        RENTAL
                      </span>
                    )}
                    {item.listing_type === "Share" && (
                      <span className="bg-primary-container text-on-primary-container font-label-sm text-[10px] px-2 py-1 rounded-md font-bold shadow-xs">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button (Gated) */}
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary shadow-xs transition-transform active:scale-95"
                    title="Save Item"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${bookmarkedIds.includes(item.id) ? "text-primary fill" : ""}`}>
                      bookmark
                    </span>
                  </button>

                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full bg-surface relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Verified Student
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">location_on</span> {item.location}
                        </span>
                      </div>

                      <h3 className="font-headline-md text-base font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <span className="font-headline-md text-lg text-on-surface font-extrabold">
                          {item.price === 0 ? "FREE" : `₹${item.price}`}
                        </span>
                        {item.price_unit && (
                          <span className="text-xs text-on-surface-variant font-semibold ml-1">{item.price_unit}</span>
                        )}
                        {item.original_price && (
                          <span className="text-xs text-on-surface-variant/60 line-through ml-2">₹{item.original_price}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add to Wishlist Icon Button (Ping only, no drawer auto-open) */}
                        <button
                          onClick={() => {
                            addToWishlist(item)
                            showToast(`Added ${item.title.slice(0, 20)}... to Wishlist!`)
                          }}
                          className="bg-surface-variant/60 text-on-surface hover:bg-primary hover:text-on-primary p-2.5 rounded-xl transition-colors"
                          title="Add to Wishlist"
                        >
                          <span className="material-symbols-outlined text-sm">bookmark_add</span>
                        </button>

                        {/* Book Purchase Button (Adds to Wishlist + Ping notification) */}
                        <button
                          onClick={() => {
                            addToWishlist(item)
                            showToast(`Added ${item.title.slice(0, 20)}... to Wishlist!`)
                          }}
                          className="bg-primary text-on-primary hover:bg-primary/90 font-label-md text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>Book Purchase</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-inverse-surface text-surface-variant mt-16 border-t border-outline-variant/10 py-10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-headline-md font-bold text-inverse-on-surface text-lg">NearShare Campus Exchange</span>
            <p className="text-xs opacity-70">© 2026 Sustainable Student Peer-to-Peer Network.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <Link href="/" className="hover:text-primary-fixed-dim transition-colors">Landing Page</Link>
            <button onClick={() => executeGatedAction("access Safety Tips", () => { })} className="hover:text-primary-fixed-dim transition-colors">Campus Safety</button>
            <button onClick={() => executeGatedAction("access Help Center", () => { })} className="hover:text-primary-fixed-dim transition-colors">Help Center</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Marketplace() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-headline-md text-headline-md font-bold">Loading Campus Marketplace...</p>
        </div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  )
}
