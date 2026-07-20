import "./globals.css"
import { AuthProvider } from "../context/AuthContext"

export const metadata = {
  title: "TekNova | Campus Resource Exchange",
  description: "A verified marketplace built exclusively for students. Exchange textbooks, tech, and dorm essentials with your campus community.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Geist:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                tailwind.config = {
                  darkMode: "class",
                  theme: {
                    extend: {
                      colors: {
                        "on-primary-fixed": "#00201d",
                        "outline": "#6d7a77",
                        "secondary-fixed": "#ffddb8",
                        "error": "#ba1a1a",
                        "background": "#f8f9ff",
                        "tertiary-fixed": "#e1e0ff",
                        "on-secondary-fixed-variant": "#653e00",
                        "surface-container-low": "#eff4ff",
                        "surface-tint": "#006a61",
                        "on-surface": "#121c2a",
                        "on-background": "#121c2a",
                        "on-tertiary-fixed-variant": "#2f2ebe",
                        "surface-container-lowest": "#ffffff",
                        "surface": "#f8f9ff",
                        "on-surface-variant": "#3d4947",
                        "surface-variant": "#d9e3f6",
                        "error-container": "#ffdad6",
                        "on-tertiary-container": "#fffbff",
                        "on-primary-fixed-variant": "#005049",
                        "primary": "#00685f",
                        "on-secondary": "#ffffff",
                        "inverse-on-surface": "#eaf1ff",
                        "on-primary": "#ffffff",
                        "inverse-primary": "#6bd8cb",
                        "tertiary": "#4648d4",
                        "on-secondary-container": "#684000",
                        "surface-container-high": "#dee9fc",
                        "outline-variant": "#bcc9c6",
                        "surface-container-highest": "#d9e3f6",
                        "primary-fixed-dim": "#6bd8cb",
                        "inverse-surface": "#27313f",
                        "surface-container": "#e6eeff",
                        "on-primary-container": "#f4fffc",
                        "secondary-fixed-dim": "#ffb95f",
                        "tertiary-fixed-dim": "#c0c1ff",
                        "primary-container": "#008378",
                        "secondary-container": "#fea619",
                        "on-error-container": "#93000a",
                        "secondary": "#855300",
                        "surface-dim": "#d0dbed",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-fixed": "#07006c",
                        "primary-fixed": "#89f5e7",
                        "surface-bright": "#f8f9ff",
                        "on-secondary-fixed": "#2a1700",
                        "on-error": "#ffffff",
                        "tertiary-container": "#6063ee"
                      },
                      borderRadius: {
                        DEFAULT: "0.25rem",
                        lg: "0.5rem",
                        xl: "0.75rem",
                        full: "9999px"
                      },
                      spacing: {
                        "container-max": "1280px",
                        "base": "8px",
                        "margin-desktop": "64px",
                        "margin-mobile": "16px",
                        "gutter": "24px",
                        "margin-tablet": "32px"
                      },
                      fontFamily: {
                        "headline-lg": ["Plus Jakarta Sans"],
                        "display-md": ["Plus Jakarta Sans"],
                        "display-lg": ["Plus Jakarta Sans"],
                        "body-lg": ["Inter"],
                        "label-md": ["Geist"],
                        "headline-md": ["Plus Jakarta Sans"],
                        "label-sm": ["Geist"],
                        "body-md": ["Inter"]
                      },
                      fontSize: {
                        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
                        "display-md": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "display-lg": ["64px", {"lineHeight": "72px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
                      }
                    }
                  }
                }
              } catch (_e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

