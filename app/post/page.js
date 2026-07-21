"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"

const CATEGORIES = [
  { id: "Books", label: "Books", icon: "menu_book" },
  { id: "Electronics", label: "Electronics", icon: "devices" },
  { id: "Cycles", label: "Cycles", icon: "pedal_bike" },
  { id: "Lab Gear", label: "Lab Gear", icon: "science" },
  { id: "Furniture", label: "Furniture", icon: "chair" },
  { id: "Clothing", label: "Clothing", icon: "checkroom" },
]

const CONDITIONS = [
  { id: "Like New", label: "Like New" },
  { id: "Good", label: "Good" },
  { id: "Fair", label: "Fair" },
]

const LISTING_TYPES = [
  { id: "Sell", label: "Sell" },
  { id: "Rent", label: "Rent" },
  { id: "Giveaway", label: "Giveaway" },
]

const RENT_DURATIONS = [
  { id: "/ hr", label: "/ hr (Per Hour)" },
  { id: "/ day", label: "/ day (Per Day)" },
]

const LOCATIONS = [
  "Student Hub",
  "Main Library",
  "North Gate",
  "Science Building Atrium",
  "Dorm Quad",
]

export default function PostItemPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { wishlistCount } = useWishlist()
  const fileInputRef = useRef(null)

  // Drawers state
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Form State
  const [title, setTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Books")
  const [condition, setCondition] = useState("Good")
  const [listingType, setListingType] = useState("Sell")
  const [price, setPrice] = useState("")
  const [rentDuration, setRentDuration] = useState("/ day")
  const [location, setLocation] = useState("Student Hub")
  const [description, setDescription] = useState("")

  // Photos State (3 Photos Minimum Limit)
  const [photos, setPhotos] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Handle Photo Upload (Convert to persistent Base64 Data URLs)
  const handleFilesAdded = (fileList) => {
    setErrorMsg("")
    Array.from(fileList).forEach((file, idx) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        setPhotos((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${idx}-${file.name}`,
            name: file.name,
            url: dataUrl
          }
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files)
    }
  }

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!title.trim()) {
      setErrorMsg("Please enter an item title.")
      return
    }

    if (listingType !== "Giveaway" && (!price || parseFloat(price) <= 0)) {
      setErrorMsg("Please enter a valid price.")
      return
    }

    if (photos.length < 3) {
      setErrorMsg(`Photo limit not met: Please upload at least 3 photos of your item (Currently ${photos.length}/3).`)
      return
    }

    setIsSubmitting(true)

    const finalPrice = listingType === "Giveaway" ? 0 : parseFloat(price) || 0
    const primaryImage = photos[0]?.url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"

    const payload = {
      seller_id: user?.id || "guest-student-id",
      seller_name: user ? `${user.email.split("@")[0]} (Verified Student)` : "Campus Student",
      title: title.trim(),
      category: selectedCategory,
      listing_type: listingType,
      price: finalPrice,
      price_unit: listingType === "Rent" ? rentDuration : "",
      condition,
      location,
      description: description.trim() || "No description provided.",
      image_url: primaryImage,
      photos_count: photos.length,
      verified_student: true,
      created_at: "Just now"
    }

    const newItem = {
      ...payload,
      id: `custom-${Date.now()}`
    }

    try {
      const existing = JSON.parse(localStorage.getItem("teknova_custom_listings") || "[]")
      localStorage.setItem("teknova_custom_listings", JSON.stringify([newItem, ...existing]))
    } catch (_e) { }

    try {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    } catch (_err) { }

    showToast("Listing created successfully! Redirecting...")

    setTimeout(() => {
      router.push("/marketplace")
    }, 1000)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary-fixed-dim">check_circle</span>
          <span className="font-label-md">{toastMessage}</span>
        </div>
      )}

      {/* ── Side Menu Drawer ── */}
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
              <Link
                href="/marketplace"
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container transition-all text-on-surface font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">storefront</span>
                <span>Marketplace</span>
              </Link>

              <Link
                href="/post"
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 text-primary font-label-md font-semibold text-left"
              >
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <span>Post an Item</span>
              </Link>
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

      {/* ── Top Navigation Bar (Identical to Marketplace) ── */}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/marketplace?search=${encodeURIComponent(e.target.value)}`)
                }
              }}
              className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none pl-3 text-on-surface placeholder:text-on-surface-variant/60"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Button */}
            <button
              onClick={() => router.push("/marketplace")}
              className="relative p-2.5 rounded-xl hover:bg-surface-variant/50 transition-all text-on-surface-variant hover:text-primary"
              title="View Marketplace Wishlist"
            >
              <span className="material-symbols-outlined text-2xl">bookmark</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Active Post Item Button */}
            <Link
              href="/post"
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-full hover:bg-primary/90 transition-all font-bold shadow-xs flex items-center gap-1.5 ring-2 ring-primary/40"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="hidden sm:inline">Post Item</span>
            </Link>

            {/* Profile Avatar / Side Drawer Toggle */}
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
      </header>

      {/* ── Main Content (Stitch Design Layout) ── */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-10 flex flex-col md:flex-row gap-8">

        {/* Left Column: Form (8/12 width) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-8/12 flex flex-col gap-6"
        >
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2 font-extrabold">Post a New Listing</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Share your resources with the campus community. Fill out the details below to get started.
            </p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-error-container/80 text-on-error-container text-xs font-semibold flex items-center gap-2 border border-error/40 shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="title">
                Item Title *
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g., Intro to Biology Textbook (4th Ed) or TI-84 Calculator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md py-3 px-4 shadow-2xs transition-all text-on-surface outline-none placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Category Grid */}
            <div className="flex flex-col gap-3">
              <label className="font-label-md text-sm font-semibold text-on-surface">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-[1.02]"
                          : "border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-outline hover:bg-surface-variant/30"
                        }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      <span className="font-label-sm text-xs font-semibold">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Condition & Listing Type (2 Cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Condition Pills */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Condition</label>
                <div className="flex rounded-xl shadow-2xs border border-outline-variant/50 overflow-hidden bg-surface-container-low p-1 gap-1">
                  {CONDITIONS.map((cond) => {
                    const isSelected = condition === cond.id
                    return (
                      <button
                        type="button"
                        key={cond.id}
                        onClick={() => setCondition(cond.id)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${isSelected
                            ? "bg-primary text-on-primary shadow-2xs"
                            : "text-on-surface-variant hover:bg-surface-variant/40"
                          }`}
                      >
                        {cond.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Listing Type Pills (Sell & Rent Only) */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm font-semibold text-on-surface">Listing Type</label>
                <div className="flex rounded-xl shadow-2xs border border-outline-variant/50 overflow-hidden bg-surface-container-low p-1 gap-1">
                  {LISTING_TYPES.map((type) => {
                    const isSelected = listingType === type.id
                    return (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => setListingType(type.id)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${isSelected
                            ? "bg-primary text-on-primary shadow-2xs"
                            : "text-on-surface-variant hover:bg-surface-variant/40"
                          }`}
                      >
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Price & Location (2 Cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Price & Duration */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="price">
                  {listingType === "Sell" ? "Fixed Price (₹ INR)" : listingType === "Rent" ? "Rental Rate (₹ INR)" : "Price"}
                </label>

                {listingType === "Giveaway" ? (
                  <div className="w-full rounded-xl border border-outline-variant/40 py-3 px-4 bg-surface-container-high font-bold text-primary text-sm flex items-center justify-between shadow-2xs">
                    <span>FREE Giveaway</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold border border-primary/20">₹0</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1 rounded-xl shadow-2xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant font-bold">
                        ₹
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        required
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant/60 py-3 pl-8 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md bg-surface-container-low text-on-surface outline-none"
                      />
                    </div>

                    {/* Rent Duration Selector */}
                    {listingType === "Rent" && (
                      <div className="flex rounded-xl border border-outline-variant/60 bg-surface-container-low p-1 gap-1">
                        {RENT_DURATIONS.map((dur) => (
                          <button
                            type="button"
                            key={dur.id}
                            onClick={() => setRentDuration(dur.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${rentDuration === dur.id
                                ? "bg-primary text-on-primary shadow-2xs"
                                : "text-on-surface-variant hover:bg-surface-variant/40"
                              }`}
                          >
                            {dur.id}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="location">
                  Campus Pickup Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/60 py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md bg-surface-container-low text-on-surface outline-none cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the item, any flaws, missing parts, and details about pickup times..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/60 py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md bg-surface-container-low text-on-surface outline-none resize-none placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Drag & Drop Photo Upload Box (3 Photos Minimum Limit) */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-sm font-semibold text-on-surface">
                  Photos <span className="text-error font-bold">*</span>
                </label>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${photos.length >= 3
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-error-container/50 text-error border-error/30"
                  }`}>
                  {photos.length} / 3 Minimum Photos
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesAdded(e.target.files)
                  }
                }}
              />

              {/* Dropzone Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-outline-variant/60 bg-surface-container-low hover:bg-surface-variant/30 hover:border-primary"
                  }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <p className="font-body-md text-sm text-on-surface font-semibold mb-1">
                  <span className="text-primary hover:underline">Click to browse computer</span> or drag & drop photos here
                </p>
                <p className="font-label-sm text-xs text-on-surface-variant/70">
                  PNG, JPG, WEBP or GIF (Minimum 3 high-quality photos required)
                </p>
              </div>

              {/* Photo Previews Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                  <AnimatePresence>
                    {photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative rounded-xl overflow-hidden border border-outline-variant/40 aspect-square group shadow-2xs"
                      >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold backdrop-blur-xs">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removePhoto(photo.id)
                          }}
                          className="absolute top-1.5 right-1.5 bg-error text-on-error p-1 rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow-xs"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-4 mt-4 pt-6 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => router.push("/marketplace")}
                className="px-6 py-3 border border-outline-variant/60 text-on-surface-variant font-label-md text-sm font-semibold rounded-xl hover:bg-surface-variant/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-on-primary font-label-md text-sm rounded-xl shadow-md hover:bg-primary/90 transition-all font-bold active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">publish</span>
                    <span>Post Listing</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

        {/* Right Column: Sidebar Info (4/12 width) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full md:w-4/12 flex flex-col gap-6"
        >
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/50 flex flex-col items-center text-center shadow-xs">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-5xl">nature_people</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Safe Listing Tips</h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">
              Follow these community guidelines to ensure a smooth, secure exchange on campus.
            </p>
            <ul className="text-left space-y-5 w-full">
              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <div>
                  <p className="font-label-md text-sm font-bold text-on-surface">Min 3 Clear Photos</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">Upload at least 3 photos showing different angles and wear.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <p className="font-label-md text-sm font-bold text-on-surface">Meet in Public</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">The Student Hub or Library are great, well-lit spots for handoffs.</p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div>
                  <p className="font-label-md text-sm font-bold text-on-surface">Fair Pricing</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">Set fixed INR for sales or flexible hourly/daily rates for rentals.</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

      </main>
    </div>
  )
}
