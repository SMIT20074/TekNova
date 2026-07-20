"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    const onMove = (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      setMouse({
        x: (window.innerWidth / 2 - e.pageX),
        y: (window.innerHeight / 2 - e.pageY),
      })
    }

    window.addEventListener("scroll", onScroll)
    window.addEventListener("mousemove", onMove)

    // Scroll-reveal observer
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("active"); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el))

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMove)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── TopNavBar ── */}
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30"
            : "bg-surface/0 border-b border-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
          <div className="flex items-center gap-12">
            <a className="font-headline-md text-headline-md font-bold text-primary transition-transform hover:scale-105 inline-block" href="#">
              NearShare
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-primary border-b-2 border-primary pb-1 font-bold font-label-md text-label-md" href="#">Browse</a>
              <a className="nav-link text-on-surface-variant/80 hover:text-primary transition-colors font-label-md text-label-md" href="#">Requests</a>
              <a className="nav-link text-on-surface-variant/80 hover:text-primary transition-colors font-label-md text-label-md" href="#">Map</a>
              <a className="nav-link text-on-surface-variant/80 hover:text-primary transition-colors font-label-md text-label-md" href="#">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-48 outline-none pl-2" placeholder="Search resources..." type="text" />
            </div>
            <div className="flex items-center gap-4">
              <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all hover:scale-110">notifications</button>
              <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all hover:scale-110">chat_bubble</button>
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold btn-animate">Post Item</button>
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary/20 hover:scale-105 transition-transform">
                <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmgYDBS-9P7NDhjWOB7ZJw4HTpV5TiZnS4pUOxoJxMw8dDq0x6kB6UkGiAyByCxHlhn4UDYeYEAsVscUzs_tP8EhanCszT0gwnYBbLP92Mjj3v98Ob04Jkr62SSXQLE7LQ0LOjt3P3DjC6p6XhTHnbGILi98_mXX5-kOWFYipfDZkiXeLNZ9qWQvxQx0VVvs4XKKZlTBUdbOZHrG6jtye9O1-9YV_JHzhbjB4yNRjyYnnKK6PWwSnS1X_RfKqH0r0wyK96tawgxXPc" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* ── Hero Section ── */}
        <section className="relative pt-24 pb-32 overflow-hidden px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left column — copy */}
            <div className="space-y-8" style={{ animation: "fade-up 1s cubic-bezier(0.2,0.8,0.2,1) forwards" }}>
              <div className="inline-flex items-center gap-2 bg-primary-container/20 text-primary px-4 py-1.5 rounded-full border border-primary/10">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="font-label-md text-label-md">Verified Student-Only Network</span>
              </div>

              <h1 className="font-display-lg text-display-lg text-on-surface">
                Buy Less. <br />
                <span className="text-primary">Share More.</span> <br />
                Waste Less.
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                A verified marketplace built exclusively for students. Exchange textbooks, tech, and dorm essentials with your campus community. Sustainable, secure, and smart.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md font-bold btn-animate">Explore Marketplace</button>
                <button className="bg-transparent border border-primary text-primary px-8 py-4 rounded-xl font-label-md text-label-md font-bold hover:bg-primary/5 transition-all btn-animate">List an Item</button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-variant overflow-hidden hover:z-10 transition-transform hover:scale-110">
                    <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBklC-5BVmfrEi1BYRQGLG6p7V8L8n7n82Em66CDzlNZwhSEm0qGk8NW4T7JIb3_LDeeI6R4wXWtDRCn-LQAb-Bo02o4nFxQEpvXquVaFeh6UoL4gN_zuNSiOxeqwlmBA7B78IXjF2_7U29Nz89NUgqp4ktOS9QGiDDHV0NNjDnrR8D62nwNZb_G3IYapYvmZUwaY5cIpFo0D_Pqo54U9C5bGiMhX4hO69gxkq-qvvJ2j3Jy2bdiFNJ3wHgiymK56lShY2U39qUhqVx" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-variant overflow-hidden hover:z-10 transition-transform hover:scale-110">
                    <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfJVKeWPPS_1kePjsKGmMHCu8xJb0-X8O9-YOPtDUiwI4rX85aGFP9t7WXgCqd28a3Y13i3IwqlFTmIbCeclYhaHp6-YOi-HA0HphVVKZw4sQeyjLuQ02yS2oBJ5U0lE6Zitr4DPDDDQtLN0UBPj3qQcXl6TSPwc1uq5sWK2gYBxYO9JZqV38AM1h7Wzkgu2na_pihPdVHcHrCjx-r7n_q2NrAKH_P1AwgioSW421MGM37vBE9EX0ecXenEb-Qr01BIQ_GSk2sLhiT" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-variant overflow-hidden hover:z-10 transition-transform hover:scale-110">
                    <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdgeCnWyKlx24pWggulfWDNnNXueaVOhbuY2titJ9xEmAZOk2c8IK0hY2IcxhoDOWkbMVewezXT6T9oAWu6lF9Nz3Jyrsp40UpVCk8zccDuJrXZe-GN_2swe3NdPg5x-QkrSeVlO09vH-rxXoGGZWsAL9Qq02yMuJzvHlTVwKdFWq8BTxMP8P8aYm2IPgKD_1_y9Az3WR5dz3MrkwSGhFDjH-UpAp8YbndTgI_5tpRlXih5SwMUZubid2I9xbCsHhWJZwPhGWWBaNS" />
                  </div>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Join 5,000+ students on campus</p>
              </div>
            </div>

            {/* Right column — floating product cards */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Central 3D Logo */}
              <div
                className="absolute top-1/2 left-1/2 w-48 h-48 floating-logo z-0"
                style={{ transform: `translate(calc(-50% + ${mouse.x * 0.02}px), calc(-50% + ${mouse.y * 0.02}px))` }}
              >
                <img alt="NearShare 3D Logo" className="w-full h-full object-contain drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida/AP1WRLsH5jEafGExFeUi8MZD7ye8snLI7UjQdVH0ym4DfTIueqwggJDXht9qf1xhqzRF1G-vo-YTxD5kUjoJS5EPeVKTrKqhT_3v8uq4eflAye-BkUrIsXC_GZ6-BQbErVmrnBVEJYRQ9_cciTiNWpB9ahYvMcJpx-F_rtVlohf9d7R3qeC66LZ1shVEFDat0mRtRgFg3n8UlkMZcQqTCuFPzyJ4zZHF0K26H9hh9eRpavnbK4XRiUyqi5XkW6E" />
              </div>

              {/* Scientific Calculator Card */}
              <div
                className="absolute top-10 left-10 w-64 p-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 card-animate z-20"
                style={{ transform: `translate(${mouse.x * 0.05}px, ${mouse.y * 0.05}px)` }}
              >
                <div className="h-40 rounded-xl overflow-hidden mb-4">
                  <img alt="Calculator" className="w-full h-full object-cover img-zoom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY81upPZbBwZamJJXKGCjBRLBFwEIIJtmZHeymwS-buBou2BHAnKKdmhwpjMhFNNAb6A07xmokuIeW4UOMqNCEnuxqtbIHMBSI2UNzZT_FSP9yTxHzhwXy_l7dNRHLTVGxfDgRZKzqz09_QHJVRWlDR_w0T_5XCAZ__26036qC76Q_LyQyiZWVNWuYqJIA2t02a5WbKrTGt9pB6fCRalQsT5dHTm9pbGYrX0MysKlgEO0H1X14CafuwSUWfdhp9OEVaPC6B9J5YhEh" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface">Scientific Calculator</h3>
                    <p className="text-primary font-bold">₹1,200</p>
                  </div>
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-1 rounded font-bold">EXCELLENT</span>
                </div>
              </div>

              {/* Engineering Books Card */}
              <div
                className="absolute top-1/2 right-0 -translate-y-1/2 w-72 p-4 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 card-animate z-10"
                style={{ transform: `translateY(-50%) translate(${mouse.x * 0.03}px, ${mouse.y * 0.03}px)` }}
              >
                <div className="h-48 rounded-xl overflow-hidden mb-4">
                  <img alt="Books" className="w-full h-full object-cover img-zoom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7EbisYyU1oIQtleR-p4QcJUBCxB5m_hgmWgFNIADcUlcazQj2FDinOJy4QdIohzdSAcAdTXjm9bfeHzm1ZdYxepoJlmLtGrGoZVl-INXX0xoDEhOnLuUnGuszFKCxx6yw6KBprq2Zw_Jc2emi-HhaGg4WxXGVh03yHkLpRZ3q6phrKRHLVYI2JAjgKUI1Ebs8lv3D6bx7rHtUwv81TR2QYm-KB1WumTrGLFUNe1dunfLFStst9R8rGCLwtqMRzsRfG_RViSXXpxjy" />
                </div>
                <div>
                  <h3 className="font-headline-md text-[18px] text-on-surface">Engineering Essentials</h3>
                  <p className="text-on-surface-variant font-label-md text-[12px] mb-2">Set of 4 Semester 3 Books</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-bold">GIVEAWAY</span>
                    <span className="text-outline text-[12px] font-medium">Free for Freshers</span>
                  </div>
                </div>
              </div>

              {/* Cycle Card */}
              <div
                className="absolute bottom-4 left-1/4 w-60 p-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 card-animate z-30"
                style={{ transform: `translate(${mouse.x * 0.06}px, ${mouse.y * 0.06}px)` }}
              >
                <div className="h-36 rounded-xl overflow-hidden mb-3">
                  <img alt="Cycle" className="w-full h-full object-cover img-zoom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhLh8j5vwVWqqOFjwHMMxTSmBLPnIB-Fup2gCMr5K6Krdq0P9xxC5V551IPn8Qm_CkIvxgdL0MC3CbVNdqmLAglUV0YAu0B9EUespcM0PdkDCYY_VdSUBKiLxjBBcX1QOgGyTDZgxqq1yCqWTK4ez7nwjf5I5C4Lnddu98SlMGYlbVCPnwgkgeSG54b25Rk97LkNt_z4tRQEPzwAJ0KFenDpx_CyoHCFdGy7g7ofvvO5MP3r5dPGpC8EWCVSajXIeDY_ZQM9IYBlNN" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-[16px] text-on-surface">Urban Cycle</h3>
                  <p className="text-primary font-bold">₹4,500</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Impact Stats ── */}
        <section className="bg-inverse-surface py-20 px-margin-mobile md:px-margin-desktop reveal">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="text-center space-y-2 p-8 md:border-r border-outline-variant/10">
                <h2 className="font-display-md text-display-md text-primary-fixed-dim">12.4K</h2>
                <p className="font-body-md text-body-md text-surface-variant">Resources Successfully Reused</p>
              </div>
              <div className="text-center space-y-2 p-8 md:border-r border-outline-variant/10">
                <h2 className="font-display-md text-display-md text-primary-fixed-dim">₹2.8M</h2>
                <p className="font-body-md text-body-md text-surface-variant">Total Student Savings</p>
              </div>
              <div className="text-center space-y-2 p-8">
                <h2 className="font-display-md text-display-md text-primary-fixed-dim">8.5 Tons</h2>
                <p className="font-body-md text-body-md text-surface-variant">CO2 Emissions Prevented</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto reveal">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-display-md text-display-md text-on-surface">How the Exchange Works</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Three simple steps to save money and the planet. Verified campus-only transactions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "add_circle", title: "List Your Item", desc: "Snap a photo, set a price (or list as free), and post it. Verification ensures only students see your listing." },
              { icon: "handshake", title: "Connect Safely", desc: "Chat with interested buyers using our secure in-app messenger. No phone numbers shared until you're ready." },
              { icon: "location_on", title: "Swap on Campus", desc: "Meet at designated campus safety zones for the hand-off. Quick, convenient, and built on community trust." },
            ].map((step, i) => (
              <div key={i} className="group relative p-8 bg-surface-container-low rounded-3xl border border-outline-variant/30 card-animate shadow-sm hover:shadow-xl transition-all duration-300" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{step.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="mb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto reveal">
          <div className="relative bg-primary overflow-hidden rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="relative z-10 space-y-6 max-w-xl">
              <h2 className="font-display-md text-display-md text-on-primary">Ready to declutter your dorm?</h2>
              <p className="font-body-lg text-body-lg text-on-primary-container/80">
                Join your campus peers in building a more sustainable university experience. Start sharing today.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-headline-md text-[18px] btn-animate">Get Started Now</button>
                <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-headline-md text-[18px] border border-on-primary-container/20 hover:bg-on-primary-container/10 transition-all btn-animate">View Campus Map</button>
              </div>
            </div>
            <div className="relative z-10 hidden lg:block">
              <div className="w-80 h-80 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center p-8 border border-white/20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                <div className="text-center text-on-primary">
                  <span className="material-symbols-outlined text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                  <p className="font-headline-md text-headline-md">Sustainability First</p>
                  <p className="text-[14px] opacity-80 mt-2">Our mission is zero-waste campuses.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full mt-auto bg-inverse-surface">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
          <div className="space-y-6">
            <span className="font-headline-md text-headline-md font-bold text-on-primary-container inline-block hover:scale-105 transition-transform cursor-default">NearShare</span>
            <p className="font-body-md text-body-md text-surface-variant">© 2026 Campus Resource Exchange. Sustainable sharing for the student community.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">Community</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Ambassadors</a>
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Partnerships</a>
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Events</a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Safety Tips</a>
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Pricing Guide</a>
              <a className="text-surface-variant hover:text-secondary-fixed-dim transition-colors font-body-md inline-block hover:translate-x-1" href="#">Help Center</a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-surface-container-highest/20 flex items-center justify-center text-surface-variant hover:bg-primary hover:text-on-primary transition-all hover:scale-110" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="w-10 h-10 rounded-full bg-surface-container-highest/20 flex items-center justify-center text-surface-variant hover:bg-primary hover:text-on-primary transition-all hover:scale-110" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
              <a className="w-10 h-10 rounded-full bg-surface-container-highest/20 flex items-center justify-center text-surface-variant hover:bg-primary hover:text-on-primary transition-all hover:scale-110" href="#"><span className="material-symbols-outlined">camera</span></a>
            </div>
            <p className="text-label-sm text-surface-variant/60 font-label-sm mt-6">Made with love for students everywhere.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
