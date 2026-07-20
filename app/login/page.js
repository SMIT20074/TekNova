"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, user } = useAuth()

  const [mode, setMode] = useState("login") // 'login' or 'signup'
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleAuth = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    try {
      if (mode === "login") {
        await signIn(email, password)
        setSuccessMsg("Logged in successfully! Redirecting...")
        setTimeout(() => router.push("/"), 1000)
      } else {
        await signUp(email, password, { first_name: firstName, last_name: lastName })
        setSuccessMsg("Account created! Check your email to verify your account.")
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Top Navigation / Brand Anchor ── */}
      <header className="fixed top-0 w-full z-50 px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center bg-surface/80 backdrop-blur-xl transition-all">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img
              alt="NearShare Logo"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrO3qfjxyEhKygtskB7DHu0llTkVePB_39FaTbHRH7MZ2CRN8g0dNeTpbPID8Kh6L2cdi93WgL-M9UQBnUkUeeUGPlupEs_wfCCUl_d7hpHhLxvuTxU-plUZG4bZcKz4ysgD4PxBMy7dBmNz7bc-DYfGzgz14bUya5ttw-4FrGQoYN95_dOrsVErupRCIuam1OMJgvr_xDRoPXy4lN6PLvNIgmDzMLPRNTEVRTahKnZF80_KxKkx-977yWyGHq-DCtoX2zCdwqwio"
            />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary">NearShare</span>
        </Link>
      </header>

      {/* ── Main Auth Canvas ── */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 min-h-screen">
        <div className="max-w-container-max w-full px-margin-mobile md:px-margin-desktop">
          <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-xl border border-outline-variant/30 min-h-[700px]">
            {/* ── Left Side: Branded Visual Section ── */}
            <section className="md:w-1/2 bg-surface-container-low relative flex flex-col justify-center p-12 lg:p-20 overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-fixed/20 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary-fixed/10 blur-3xl"></div>

              <div className="relative z-10 space-y-8">
                <div className="w-48 lg:w-64 transform hover:scale-105 transition-transform duration-500">
                  <img
                    alt="Campus Community Graphic"
                    className="w-full drop-shadow-2xl"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLsZv_5vj4d537BsPShGFLEbAp2g3-MPyTItKiysA-8kZnuBA2ptwCOss6qZ-bqfSnJmpQ1EdsB1PFhnizZ1PLx-09uw-M-xFKrKAHKxyqtA2ftlCaIzzJV71IyfpzH_ekFEdYyyro0gmafGsljURh797F5RjmogymehSHbFkWvai7U4p3tnqOF2zAXQ1DPsPgmjkvE1OsdBRapYhp99DpArpw7lKaEhTwC_ensD5sa8lxeJosq5czBeo4g"
                  />
                </div>

                <div className="space-y-4 max-w-md">
                  <h1 className="font-display-md text-display-md text-on-background leading-tight">
                    Join your campus community
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Share Nearby. Save More. The smartest way for students to exchange resources, reduce waste, and build trust.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-low overflow-hidden hover:z-10 hover:scale-110 transition-all">
                      <img
                        alt="Student"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHyNHjeeVCM9yqbI_F7nfLijmKnswZPIglqpC8r-LO_j-twX8p1CM9AzvszugHNnmaGoVlVBQycIgrMX6OqjGSUT1c2wRxla15f5cn99otUEofuDSkd4LRHVJW--bvjtCkORwVULCgU49OtOuu-AV-riHf4gtPYOTwp0IHdkxW8i4UqZ3R0Zc5bKXAaIApx5c6Ts0UU9N30EViqV2kkA5zOPnEUU4N-QdrVcQGnDnEfvz8QPzn3PZF4jNFpDJn_nyv8W5_gOX2YYk"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-low overflow-hidden hover:z-10 hover:scale-110 transition-all">
                      <img
                        alt="Student"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwz1KAihZAXX9sfBowF5qf7rCUA87n0KSr3Xq3m1JslVoCSIhFhhIlrKmHf2z9KCRUFFWIl-VjRgH8Ey-4sgDayZfUs6tqqAK5Da9VPDynX-j2ZUL8zL-TrYkF-5pn7WhpAoVX72PJFE0o6eD4nDohr5DK899jdgZqG8W-DEHBD-nk_HnC6MjW8cUc8NxwzEY1rBMpuoc2Fw96yN8jiXzX1isI-TL04ivh0OEVd7JEVxAXRgVimUePWka8LBU3jm_bstfOxNMjgWY"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface-container-low overflow-hidden hover:z-10 hover:scale-110 transition-all">
                      <img
                        alt="Student"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEeRIypFfh3Rrnyhc-OTy8LJ-9npcAvD5mUewYPKhT8PscdHjJG-eaB9kqJelkA98GClJ5Pzkk3ByRvyfOFq90-gy3IAFicW63ELbNk5s5MI4qtgGOCZcT3p5aSK390hAnfQ0LpTeD5F6H-hjv5WPL9LE1NQ9RwBcD4eGCKquzKD0k0Kn8mWpolLMfbaEAl8nnuFIV17AbE1ebUq6ZOQirHcb2-9z8CpmEP8DMUNQCdIIR-dqCysxcax_2vtoHB4WLGeRo_0JZEoQ"
                      />
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant">Joined by 2,500+ students this week</span>
                </div>
              </div>
            </section>

            {/* ── Right Side: Auth Form ── */}
            <section className="md:w-1/2 bg-white p-10 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Form Tabs */}
                <div className="flex border-b border-outline-variant mb-8">
                  <button
                    className={`flex-1 py-4 font-label-md text-label-md font-bold transition-all ${
                      mode === "login"
                        ? "text-primary border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                    onClick={() => {
                      setMode("login")
                      setErrorMsg("")
                      setSuccessMsg("")
                    }}
                  >
                    Login
                  </button>
                  <button
                    className={`flex-1 py-4 font-label-md text-label-md font-bold transition-all ${
                      mode === "signup"
                        ? "text-primary border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                    onClick={() => {
                      setMode("signup")
                      setErrorMsg("")
                      setSuccessMsg("")
                    }}
                  >
                    Create Account
                  </button>
                </div>

                {/* Feedback Messages */}
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-body-md font-medium flex items-center gap-3">
                    <span className="material-symbols-outlined text-error">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-primary-container/20 text-primary text-body-md font-medium flex items-center gap-3">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                  {mode === "login" ? (
                    /* ── Login Fields ── */
                    <>
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant block">Campus Email Address</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">alternate_email</span>
                          <input
                            className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
                            placeholder="yourname@university.edu"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <p className="text-[11px] text-outline px-1">Verification required for campus access</p>
                      </div>

                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant block">Password</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                          <input
                            className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
                            placeholder="••••••••"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            checked={rememberMe}
                            className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary-container"
                            type="checkbox"
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Remember me</span>
                        </label>
                        <a className="font-label-md text-label-md text-primary hover:underline" href="#">Forgot password?</a>
                      </div>

                      <button
                        disabled={loading}
                        className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                        type="submit"
                      >
                        {loading ? "Signing In..." : "Sign In"}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </>
                  ) : (
                    /* ── Signup Fields ── */
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-label-sm text-label-sm text-on-surface-variant">First Name</label>
                          <input
                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none"
                            placeholder="Alex"
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-label-sm text-label-sm text-on-surface-variant">Last Name</label>
                          <input
                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none"
                            placeholder="Smith"
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                          <label className="font-label-sm text-label-sm text-on-surface-variant">Student Email (.edu required)</label>
                          <input
                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none"
                            placeholder="student@university.edu"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="font-label-sm text-label-sm text-on-surface-variant">Create Password</label>
                          <input
                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary-container outline-none"
                            placeholder="At least 8 characters"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                      </div>

                      <p className="text-[12px] text-on-surface-variant/70 text-center px-4">
                        By joining, you agree to NearShare's <a className="text-primary underline" href="#">Terms of Service</a> and <a className="text-primary underline" href="#">Privacy Policy</a>.
                      </p>

                      <button
                        disabled={loading}
                        className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        type="submit"
                      >
                        {loading ? "Creating Account..." : "Join NearShare"}
                      </button>
                    </>
                  )}
                </form>

                {/* Social Dividers */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/30"></div>
                  </div>
                  <div className="relative flex justify-center text-[12px] uppercase">
                    <span className="bg-white px-4 text-outline font-bold tracking-wider">Or continue with</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-xl hover:bg-surface-container transition-all active:scale-[0.98]">
                    <img
                      alt="Google"
                      className="w-5 h-5"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxrVJB1ZJ4m2QWkNBbZikFY_I6dbV_uELM65YKB8NAkzJJnw2i50iY8LnwF4-cKfUEe1emUarkx8PfeCf9qWYp5uRfB37nA3KY7ufn4wV_1148SK8Ia_WgAvVB58khbtyVw_WluyiqBXG8My0DSipDb47zG5A7d7oUckrv8lszZFEnR_cKr14YhEjslB1YFCROG-KhQou8QYIqNDRFmicQ6Zp75BHKWdlbJyYBp4xfYVlxBtrfcUKgbW9K8z1NrRr45CgkJXechMY"
                    />
                    <span className="font-label-md text-label-md text-on-surface">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-xl hover:bg-surface-container transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-on-surface text-[20px]">account_balance</span>
                    <span className="font-label-md text-label-md text-on-surface">Campus SSO</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-inverse-surface font-body-md text-body-md w-full py-12 border-t border-outline/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="space-y-4">
            <div className="font-headline-md text-headline-md text-on-primary-container flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary-fixed">share_location</span>
              NearShare
            </div>
            <p className="text-surface-variant/70 text-sm max-w-xs">Empowering campus sustainability through shared resources and community trust.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary-fixed-dim font-bold uppercase tracking-widest text-[11px]">Community</h4>
            <ul className="space-y-2 text-surface-variant">
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Campus Directory</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Success Stories</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Events</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary-fixed-dim font-bold uppercase tracking-widest text-[11px]">Resources</h4>
            <ul className="space-y-2 text-surface-variant">
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">How it Works</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Safety Guidelines</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Help Center</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary-fixed-dim font-bold uppercase tracking-widest text-[11px]">Legal</h4>
            <ul className="space-y-2 text-surface-variant">
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-secondary-fixed-dim transition-colors" href="#">Student Data Use</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 pt-8 border-t border-outline/10 text-center md:text-left">
          <p className="text-surface-variant/50 text-xs">© 2026 NearShare. Empowering campus sustainability.</p>
        </div>
      </footer>
    </>
  )
}
