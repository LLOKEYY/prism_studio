import { useState, useEffect, useRef } from 'react'
import ColorBends from './components/ColorBends'
import DomeGallery from './components/DomeGallery/DomeGallery'

// ─── Shared helpers ────────────────────────────────────────────────────────────

const COLORS = ['#ff5c7a', '#8a5cff', '#00ffd1']

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function useFadeIn() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = e => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

// Gradient text helper
function Grad({ children, colors = '#ff5c7a, #8a5cff, #00ffd1', style = {} }) {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${colors})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}>
      {children}
    </span>
  )
}

const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.35rem 1rem',
  borderRadius: '100px',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '1.5rem',
}

// ─── Navigation ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work'     },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
]

function Nav() {
  const scrolled = useScrolled(40)
  const isMobile = useIsMobile()
  const [hover, setHover] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const logoEl = (
    <a
      href="#"
      onClick={() => setMenuOpen(false)}
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '8px',
        background: 'linear-gradient(135deg, #ff5c7a, #8a5cff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', fontWeight: 900, color: '#fff',
      }}>◈</div>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: '1.15rem',
        letterSpacing: '-0.03em',
        background: 'linear-gradient(90deg, #fff 30%, rgba(255,255,255,0.65))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        PRISM <span style={{ fontWeight: 300 }}>STUDIO</span>
      </span>
    </a>
  )

  return (
    <>
      <nav style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        zIndex: 200,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1.25rem, 4vw, 3rem)',
        backdropFilter: scrolled || menuOpen ? 'blur(22px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(22px) saturate(1.4)' : 'none',
        background: scrolled || menuOpen ? 'rgba(8,8,18,0.85)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      }}>
        {logoEl}

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2.5vw, 2rem)' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onMouseEnter={() => setHover(label)}
                onMouseLeave={() => setHover(null)}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: hover === label ? '#00ffd1' : 'rgba(255,255,255,0.6)',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              style={{
                textDecoration: 'none',
                padding: '0.55rem 1.4rem',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #ff5c7a 0%, #8a5cff 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                boxShadow: '0 0 24px rgba(138,92,255,0.35)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 36px rgba(138,92,255,0.55)'; e.currentTarget.style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(138,92,255,0.35)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Let's Talk
            </a>
          </div>
        )}

        {/* Hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: 36,
              height: 36,
            }}
          >
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              borderRadius: 2,
              background: '#fff',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              borderRadius: 2,
              background: '#fff',
              transition: 'opacity 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              borderRadius: 2,
              background: '#fff',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          inset: '70px 0 0 0',
          zIndex: 199,
          backdropFilter: 'blur(28px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
          background: 'rgba(8,8,18,0.92)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '2rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'rgba(255,255,255,0.75)',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                width: '100%',
                textAlign: 'center',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#00ffd1'; e.currentTarget.style.background = 'rgba(0,255,209,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: '1rem',
              textDecoration: 'none',
              padding: '0.9rem 2.5rem',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #ff5c7a 0%, #8a5cff 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.04em',
              boxShadow: '0 0 32px rgba(138,92,255,0.4)',
            }}
          >
            Let's Talk
          </a>
        </div>
      )}
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '120px clamp(1.25rem, 6vw, 4rem) 80px',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '860px' }}>
        <div style={pill}>
          <span style={{ color: '#00ffd1' }}>✦</span> Award-winning creative studio
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 7vw, 6rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '0 0 1.5rem',
          color: '#fff',
        }}>
          We Make Brands{' '}
          <br />
          <Grad>Unforgettable</Grad>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.75,
          maxWidth: '560px',
          margin: '0 auto 2.5rem',
        }}>
          We craft bold identities, immersive experiences, and digital campaigns that stop the scroll and start the conversation.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#work"
            style={{
              textDecoration: 'none',
              padding: '0.9rem 2.4rem',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #ff5c7a, #8a5cff)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 8px 32px rgba(138,92,255,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(138,92,255,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(138,92,255,0.4)' }}
          >
            View Our Work
          </a>
          <a
            href="#services"
            style={{
              textDecoration: 'none',
              padding: '0.9rem 2.4rem',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            Our Services
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: '4.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.28)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          <span>Scroll</span>
          <div style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
          }} />
        </div>
      </div>
    </section>
  )
}

// ─── Services ──────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: '◈',
    color: '#ff5c7a',
    title: 'Brand Strategy',
    desc: 'We dig deep into your market, audience, and competitors to forge a positioning so clear and compelling your brand becomes the obvious choice.',
    tags: ['Positioning', 'Identity', 'Naming'],
  },
  {
    icon: '◉',
    color: '#8a5cff',
    title: 'Creative Design',
    desc: 'From logo systems to full visual identities, our designers build aesthetics that resonate emotionally and hold up across every touchpoint.',
    tags: ['Visual Identity', 'UI/UX', 'Motion'],
  },
  {
    icon: '◎',
    color: '#00ffd1',
    title: 'Digital Campaigns',
    desc: 'Data-informed creative campaigns that perform. We blend storytelling with analytics to build audiences that actually convert.',
    tags: ['Social', 'Paid Media', 'Content'],
  },
]

function Services() {
  const [ref, visible] = useFadeIn()

  return (
    <section id="services" ref={ref} style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(1.25rem, 6vw, 4rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={pill}><span style={{ color: '#8a5cff' }}>✦</span> What we do</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: 0,
          }}>
            Built for impact,{' '}
            <Grad>designed to last</Grad>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {SERVICES.map(svc => <ServiceCard key={svc.title} {...svc} />)}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon, color, title, desc, tags }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: hovered ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '2.25rem',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 60px ${color}22` : 'none',
      }}
    >
      <div style={{
        width: 52, height: 52,
        borderRadius: '14px',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
        color,
        marginBottom: '1.5rem',
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
        color: '#fff',
        margin: '0 0 0.75rem',
        letterSpacing: '-0.02em',
      }}>{title}</h3>

      <p style={{
        color: 'rgba(255,255,255,0.52)',
        lineHeight: 1.75,
        fontSize: '0.95rem',
        margin: '0 0 1.5rem',
      }}>{desc}</p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <span key={t} style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: `${color}14`,
            color,
            border: `1px solid ${color}25`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Selected Work (DomeGallery) ───────────────────────────────────────────────

const DOME_PROJECTS = [
  { src: 'https://picsum.photos/800/600?random=1',  alt: 'Lumina',   projectName: 'Lumina',   projectCategory: 'Brand Identity'      },
  { src: 'https://picsum.photos/800/600?random=2',  alt: 'Orbit',    projectName: 'Orbit',    projectCategory: 'Digital Campaign'    },
  { src: 'https://picsum.photos/800/600?random=3',  alt: 'Solaris',  projectName: 'Solaris',  projectCategory: 'Brand Strategy'      },
  { src: 'https://picsum.photos/800/600?random=4',  alt: 'Nexus',    projectName: 'Nexus',    projectCategory: 'UI/UX Design'        },
  { src: 'https://picsum.photos/800/600?random=5',  alt: 'Vela',     projectName: 'Vela',     projectCategory: 'Motion & Film'       },
  { src: 'https://picsum.photos/800/600?random=6',  alt: 'Dusk',     projectName: 'Dusk',     projectCategory: 'Brand Identity'      },
  { src: 'https://picsum.photos/800/600?random=7',  alt: 'Praxis',   projectName: 'Praxis',   projectCategory: 'Digital Campaign'    },
  { src: 'https://picsum.photos/800/600?random=8',  alt: 'Zeno',     projectName: 'Zeno',     projectCategory: 'Creative Direction'  },
]

function SelectedWork() {
  const [ref, visible] = useFadeIn()
  const [linkHover, setLinkHover] = useState(false)

  return (
    <section
      id="selected-work"
      ref={ref}
      style={{
        background: 'rgba(5, 5, 12, 0.94)',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(48px, 6vw, 80px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* Heading */}
      <div style={{
        textAlign: 'center',
        padding: '0 clamp(1.25rem, 6vw, 4rem)',
        marginBottom: '2.5rem',
      }}>
        <div style={pill}><span style={{ color: '#ff5c7a' }}>✦</span> Our portfolio</div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          letterSpacing: '-0.03em',
          color: '#fff',
          margin: '0 0 0.65rem',
        }}>
          Selected <Grad colors="#ff5c7a, #8a5cff, #00ffd1">Work</Grad>
        </h2>
        <p style={{
          fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
          color: 'rgba(255,255,255,0.3)',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          A glimpse into what we've built
        </p>
      </div>

      {/* Gallery */}
      <div style={{ width: '100%', height: 'clamp(420px, 65vh, 660px)', position: 'relative' }}>
        <DomeGallery
          images={DOME_PROJECTS}
          overlayBlurColor="#05050c"
          grayscale={false}
          fit={0.5}
        />
      </div>

      {/* View All link */}
      <div style={{ textAlign: 'center', marginTop: '2.25rem', padding: '0 clamp(1.25rem, 6vw, 4rem)' }}>
        <a
          href="#contact"
          onMouseEnter={() => setLinkHover(true)}
          onMouseLeave={() => setLinkHover(false)}
          style={{
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: linkHover ? '#fff' : 'rgba(255,255,255,0.45)',
            borderBottom: `1px solid ${linkHover ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}`,
            paddingBottom: '2px',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          View All Projects →
        </a>
      </div>
    </section>
  )
}

// ─── Work ──────────────────────────────────────────────────────────────────────

const PROJECTS = [
  { title: 'Nova Collective',  cat: 'Brand Identity',   gradient: 'linear-gradient(135deg, #ff5c7a55, #8a5cff55)', accent: '#ff5c7a', num: '01' },
  { title: 'Pulse Finance',    cat: 'Digital Campaign',  gradient: 'linear-gradient(135deg, #8a5cff55, #00ffd155)', accent: '#8a5cff', num: '02' },
  { title: 'Meridian Foods',   cat: 'Brand Strategy',    gradient: 'linear-gradient(135deg, #00ffd155, #ff5c7a55)', accent: '#00ffd1', num: '03' },
  { title: 'Orbit Studios',    cat: 'Creative Design',   gradient: 'linear-gradient(135deg, #ff5c7a44, #00ffd155)', accent: '#ff5c7a', num: '04' },
]

function Work() {
  const [ref, visible] = useFadeIn()

  return (
    <section id="work" ref={ref} style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(1.25rem, 6vw, 4rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={pill}><span style={{ color: '#ff5c7a' }}>✦</span> Selected work</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: 0,
            }}>
              Work that{' '}
              <Grad colors="#00ffd1, #8a5cff">speaks volumes</Grad>
            </h2>
          </div>
          <a href="#contact" style={{
            textDecoration: 'none',
            padding: '0.7rem 1.6rem',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.85rem',
            fontWeight: 600,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.04)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          >
            View All Projects →
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {PROJECTS.map(p => <ProjectTile key={p.num} {...p} />)}
        </div>
      </div>
    </section>
  )
}

function ProjectTile({ title, cat, gradient, accent, num }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: hovered ? `1px solid ${accent}44` : '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 24px 60px ${accent}22` : 'none',
      }}
    >
      {/* Placeholder image area */}
      <div style={{
        height: '220px',
        background: gradient,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }} />
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          fontSize: '5rem',
          color: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
          transition: 'color 0.3s',
        }}>{num}</span>

        <div style={{
          position: 'absolute',
          top: '1rem', right: '1rem',
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0.7)',
          transition: 'all 0.25s',
          color: '#fff',
          fontSize: '1rem',
        }}>↗</div>
      </div>

      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: '0.4rem',
        }}>{cat}</div>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#fff',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>{title}</h3>
      </div>
    </div>
  )
}

// ─── About ─────────────────────────────────────────────────────────────────────

const STATS = [
  { num: '120+', label: 'Brands launched' },
  { num: '8yr',  label: 'In the industry' },
  { num: '94%',  label: 'Client retention' },
]

function About() {
  const [ref, visible] = useFadeIn()

  return (
    <section id="about" ref={ref} style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(1.25rem, 6vw, 4rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{
        maxWidth: '1160px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
      }}>
        {/* Text */}
        <div>
          <div style={pill}><span style={{ color: '#00ffd1' }}>✦</span> Our story</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 0 1.5rem',
          }}>
            A studio obsessed<br />with{' '}
            <Grad colors="#ff5c7a, #8a5cff">the craft</Grad>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontSize: '1rem', margin: '0 0 1.25rem' }}>
            Prism Studio was founded on a simple belief: great branding isn't decoration — it's the difference between a company that survives and one that thrives. We're a tight-knit team of strategists, designers, and storytellers who genuinely care about the work.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 2.5rem' }}>
            Based in New York with clients across 18 countries, we bring global thinking and local depth to every engagement — from early-stage startups finding their voice to legacy brands ready to evolve.
          </p>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: '2.2rem',
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, #ff5c7a, #8a5cff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{num}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team photo placeholder */}
        <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '4/5',
          maxHeight: '480px',
          background: 'linear-gradient(145deg, rgba(138,92,255,0.15), rgba(255,92,122,0.1), rgba(0,255,209,0.08))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 60% 30%, rgba(138,92,255,0.15) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(0,255,209,0.1) 0%, transparent 60%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {['◆', '◉', '◈'].map((icon, i) => (
                <div key={i} style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  background: `rgba(255,255,255,${0.05 + i * 0.02})`,
                  border: '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: [COLORS[0], COLORS[1], COLORS[2]][i],
                }}>
                  {icon}
                </div>
              ))}
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.04em',
            }}>The Prism Team</div>
            <div style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.25)',
              marginTop: '0.4rem',
              letterSpacing: '0.06em',
            }}>New York · Remote</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ───────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, visible] = useFadeIn()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = e => { e.preventDefault(); setSent(true) }

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '0.875rem 1.1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.42)',
    marginBottom: '0.5rem',
  }

  return (
    <section id="contact" ref={ref} style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(1.25rem, 6vw, 4rem)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <div style={pill}><span style={{ color: '#ff5c7a' }}>✦</span> Get in touch</div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          letterSpacing: '-0.03em',
          color: '#fff',
          margin: '0 0 1rem',
        }}>
          Ready to <Grad>stand out?</Grad>
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.75,
          marginBottom: '2.5rem',
          fontSize: '1rem',
        }}>
          Tell us about your project and let's figure out how to make something remarkable together.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          textAlign: 'left',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff5c7a, #8a5cff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1.5rem',
              }}>✦</div>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#fff',
                margin: '0 0 0.75rem',
              }}>Message received!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                We'll be in touch within 24 hours. Can't wait to hear more about your project.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Chen"
                    required
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = 'rgba(138,92,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    required
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = 'rgba(138,92,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, goals, and timeline..."
                  required
                  rows={5}
                  style={{ ...inputBase, resize: 'vertical', minHeight: '120px' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(138,92,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff5c7a 0%, #8a5cff 60%, #00ffd1 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.02em',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: '0 8px 32px rgba(138,92,255,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(138,92,255,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(138,92,255,0.35)' }}
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      padding: '2.5rem clamp(1.25rem, 6vw, 4rem)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(0,0,0,0.2)',
    }}>
      <div style={{
        maxWidth: '1160px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: '1rem',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #ff5c7a, #8a5cff, #00ffd1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>PRISM STUDIO</span>

        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Prism Studio. All rights reserved.
        </span>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
            <a key={s} href="#" style={{
              color: 'rgba(255,255,255,0.32)',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#00ffd1'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.32)'}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fixed animated background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#08080f' }}>
        <ColorBends
          colors={COLORS}
          speed={0.2}
          mouseInfluence={1}
          parallax={0.5}
          autoRotate={0}
          transparent
        />
      </div>

      {/* Scrollable content layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Hero />
        <Services />
        <SelectedWork />
        <Work />
        <About />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
