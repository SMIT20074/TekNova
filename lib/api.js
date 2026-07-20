import { supabase } from './supabaseClient.js'

// =========================================================================
// STEP 4: Authentication (OTP Sign In)
// =========================================================================

/**
 * Sends a One-Time Password (OTP) / Magic Link login email.
 * @param {string} email - The student's college email.
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function signInStudent(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : '', // Redirects back to homepage after clicking link
    }
  })
  return { data, error }
}

/**
 * Logs the current student user session out.
 */
export async function signOutStudent() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// =========================================================================
// STEP 5: Backend API Integration (/api/* endpoints)
// =========================================================================

/**
 * GET /api/listings -> Fetch active marketplace listings with optional filters.
 */
export async function fetchListings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.category) params.append('category', filters.category)
  if (filters.condition) params.append('condition', filters.condition)
  if (filters.min_price) params.append('min_price', filters.min_price)
  if (filters.max_price) params.append('max_price', filters.max_price)

  const url = `/api/listings?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * GET /api/listings/:id -> Fetch details for a specific listing (auto-increments views).
 */
export async function fetchListingById(id) {
  const res = await fetch(`/api/listings/${id}`)
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * POST /api/listings -> Create/post a new marketplace listing.
 */
export async function createListing(listingData) {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData)
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * PATCH /api/listings/:id -> Update listing status (e.g. mark as sold or pending).
 */
export async function updateListingStatus(id, status) {
  const res = await fetch(`/api/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * POST /api/offers -> Make an offer on a listing.
 */
export async function makeOffer(offerData) {
  const res = await fetch('/api/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData)
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * GET /api/offers?listing_id=xxx -> Fetch offers on a specific item (for the seller).
 */
export async function fetchOffersForListing(listingId) {
  const res = await fetch(`/api/offers?listing_id=${listingId}`)
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * GET /api/messages?listing_id=xxx&user_id=yyy -> Fetch chat thread.
 */
export async function fetchChatThread(listingId, userId) {
  const res = await fetch(`/api/messages?listing_id=${listingId}&user_id=${userId}`)
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * POST /api/messages -> Send a chat message.
 */
export async function sendChatMessage(messageData) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * POST /api/transactions -> Start a transaction/handover deal.
 */
export async function initiateTransaction(transactionData) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData)
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * PATCH /api/transactions -> Update/complete a transaction (e.g. after successful scan).
 */
export async function completeTransaction(transactionId, status = 'completed') {
  const res = await fetch('/api/transactions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId, status })
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * POST /api/ratings -> Leave a rating review after a transaction is completed.
 */
export async function submitRating(ratingData) {
  const res = await fetch('/api/ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratingData)
  })
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}

/**
 * GET /api/impact -> Fetch sustainability dashboard stats & top exchange leaders.
 */
export async function fetchImpactData() {
  const res = await fetch('/api/impact')
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
  return await res.json()
}
