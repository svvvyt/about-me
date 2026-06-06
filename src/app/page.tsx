'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import GlitchText from '@/components/GlitchText';
import Cursor from '@/components/Cursor';

// Load Three.js scene client-side only
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

const TECH_STACK = [
  'JavaScript',
  'TypeScript',
  'React',
  'Redux Toolkit',
  'RTK Query',
  'Next.js',
  'AntD',
  'Tailwind CSS',
  'Three.js / WebGL',
  'Framer Motion',
  'Shadcn/ui',
  'Vite',
  'Figma',
  'Storybook',
];

const CONTACTS = [
  { label: 'svvvyt@proton.me', href: 'mailto:svvvyt@proton.me' },
  { label: 't.me/sv_y_ttt', href: 'https://t.me/sv_y_ttt' },
  { label: 'github/svvvyt', href: 'https://github.com/svvvyt' },
];

const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

export default function Home() {
  return (
    <>
      <Cursor />
      <Scene />

      {/* Vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.82) 100%)',
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          height: '1px',
          background: 'rgba(124,111,255,0.07)',
          animation: 'none',
          pointerEvents: 'none',
          boxShadow: '0 0 12px 1px rgba(124,111,255,0.12)',
        }}
      />

      {/* Main content */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 2.5rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* ── Name & Title ─────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial='hidden'
          animate='show'
          style={{ marginBottom: '2.6rem' }}
        >
          <motion.h1
            variants={fade}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-syne, Syne, sans-serif)',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 8vw, 5.6rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#f0ecff',
              marginBottom: '0.1em',
            }}
          >
            <GlitchText text='Svyat Korolyov' />
          </motion.h1>

          <motion.p
            variants={fade}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-syne, Syne, sans-serif)',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 8vw, 5.6rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(90,78,130,1)',
            }}
          >
            Frontend Dev
          </motion.p>

          <motion.p
            variants={fade}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: '1.8rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              color: '#8a82a8',
              lineHeight: 1.8,
              maxWidth: '400px',
            }}
          >
            Software engineer specialized in{' '}
            <span style={{ color: '#c5bfdf' }}>frontend development</span>
            .
            <br />
            Turning design systems into living, breathing products —
            <br />
            one pixel, one animation, one commit at a time.
          </motion.p>
        </motion.div>

        {/* ── Divider ───────────────────────────────────────── */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1px',
            marginBottom: '2.2rem',
            background:
              'linear-gradient(90deg, #7c6fff44 0%, #7c6fff 40%, #4dffd844 100%)',
          }}
        />

        {/* ── Tech stack ────────────────────────────────────── */}
        <motion.div
          initial='hidden'
          animate='show'
          variants={stagger}
          style={{ marginBottom: '2.4rem' }}
        >
          <motion.p
            variants={fade}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#3d3654',
              textTransform: 'uppercase',
              marginBottom: '0.9rem',
            }}
          >
            Tech stack
          </motion.p>

          <motion.div
            variants={stagger}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          >
            {TECH_STACK.map((tech) => (
              <TechPill key={tech} label={tech} />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Contacts ──────────────────────────────────────── */}
        <motion.div initial='hidden' animate='show' variants={stagger}>
          <motion.p
            variants={fade}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#3d3654',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            Contact
          </motion.p>

          <motion.div
            variants={stagger}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem 2rem' }}
          >
            {CONTACTS.map((c) => (
              <motion.a
                key={c.label}
                href={c.href}
                variants={fade}
                whileHover={{ x: 4 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  color: '#8a82a8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c5bfdf')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8a82a8')}
              >
                <ContactDot />
                {c.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────

function TechPill({ label }: { label: string }) {
  return (
    <motion.div
      variants={fade}
      whileHover={{ y: -2, borderColor: '#7c6fff' }}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '11px',
        padding: '5px 12px',
        border: '1px solid #2a2444',
        borderRadius: '2px',
        color: '#a89ecc',
        background: '#0d0b18',
        letterSpacing: '0.04em',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#f0ecff';
        e.currentTarget.style.background = '#141028';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#a89ecc';
        e.currentTarget.style.background = '#0d0b18';
      }}
      data-hover='true'
    >
      {label}
    </motion.div>
  );
}

function ContactDot() {
  return (
    <span
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#7c6fff',
        flexShrink: 0,
        display: 'inline-block',
        transition: 'background 0.15s',
      }}
    />
  );
}
