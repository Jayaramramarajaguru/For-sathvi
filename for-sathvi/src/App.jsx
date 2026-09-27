import { useState, useEffect, useRef, useCallback } from 'react'

const QUOTES = [
  "You don't have to be okay right now. I'm not going anywhere.",
  "Whatever it is, it's smaller than the two of us together.",
  "Take your time. I'll still be here when you're ready to smile again.",
  "You're allowed to have a hard day. You're not allowed to face it alone.",
  "Some storms just need someone to sit with you until they pass. That's me.",
  "You have me — not just on the good days, on this one too.",
]

// Drop your photos into public/photos/ named 1.png .. 5.png
const PHOTOS = [
  { src: '1.png', caption: 'Where your smile first learned to undo me.' },
  { src: '2.png', caption: 'Still finding new ways to be soft, aren\u2019t you.' },
  { src: '3.png', caption: 'Flowers in your hair, but you outshine them anyway.' },
  { src: '4.png',caption: 'Ordinary street, extraordinary you.'  },
  { src: '5.png', caption: 'Every swing of that chain, my heart went with it.' },
]

const GIFTS = [
  {
    emoji: '💝',
    label: 'A promise',
    text: "I promise to be patient with you — on your loud days, your quiet days, and the days you don't have words at all. I'm not going anywhere.",
  },
  {
    emoji: '🎧',
    label: 'A memory',
    text: 'Every silly voice note, every 12 a.m. call, every song we made ours — I keep them all, like little pieces of you I get to carry around.',
  },
  // {
  //   emoji: '🕊️',
  //   label: 'No rush',
  //   text: "You asked me for some time, and honestly — take all of it. I'd rather wait and get this right with you than rush and risk losing what's already becoming my favourite thing. You're worth being patient for.",
  // },
]

// Try the song's own cover art first, then fall back to a photo of her,
// then fall back to a plain gold label if neither file is found.
const COVER_CANDIDATES = ['/audio/kannana-kanne.jpg', `/photos/${PHOTOS[0].src}`]
// This MUST exactly match the mp3 filename inside public/audio/ (case + spelling).
const SONG_SRC = '/audio/kannana-kanne.mp3'
// A little original verse for the song slide — not the song's actual lyrics.
const SONG_POEM =
  "Kannana kanne — the eyes that truly see me.\nIf this song had a face, it would be yours;\nif our story had a soundtrack, this would be the only track on it."

/* ---------- Typewriter ---------- */
function Typewriter({ text, speed = 32, startDelay = 0, onDone, className = '', showCaret = true }) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplay('')
    setDone(false)
    let i = 0
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setDisplay(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
          onDone && onDone()
        }
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <span className={className}>
      {display}
      {showCaret && !done && <span className="caret">|</span>}
    </span>
  )
}

/* ---------- Slides ---------- */
function HeroSlide() {
  return (
    <div className="slide hero-slide">
      <p className="eyebrow">for</p>
      <p className="eyebrow">my dear</p>
      <h1 className="name">Sathvi</h1>
      <p className="nickname">❤️my fav noise✨😍</p>
      <p className="hint">swipe or tap the arrow →</p>
    </div>
  )
}

function LetterSlide() {
  const paras = [
    "Dear My Fav Noise😍",
    "I know today's been heavy, and I wish I could just sit next to you right now and take some of that weight off your shoulders.",
    "Since I can't be there in person just yet, I made you this instead — a little pink corner of the internet that says the thing I keep meaning to tell you.",
    "Whatever you're carrying, you don't have to carry it alone anymore.",
    "You have me. So please, don't worry.",
  ]
  const [stage, setStage] = useState(0)
  return (
    <div className="slide">
      <div className="card letter">
        {paras.map((p, i) => (
          <p key={i} style={{ opacity: i <= stage ? 1 : 0.15 }}>
            {i < stage && p}
            {i === stage && (
              <Typewriter text={p} speed={26} onDone={() => setStage((s) => s + 1)} />
            )}
            {i > stage && '\u00A0'}
          </p>
        ))}
        {stage >= paras.length && (
          <p className="signature reveal">— always in your corner, Jai</p>
        )}
      </div>
    </div>
  )
}

function GallerySlide() {
  const [i, setI] = useState(0)
  const touchX = useRef(null)
  const go = (dir) => setI((v) => Math.min(Math.max(v + dir, 0), PHOTOS.length - 1))

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const p = PHOTOS[i]

  return (
    <div className="slide gallery-slide">
      <p className="slide-label">a few of my favourites</p>
      <div className="gallery-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button className="g-arrow left" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous photo">‹</button>
        <figure className="photo-card" key={p.src}>
          <div className="photo-box">
            <img className="photo" src={`/photos/${p.src}`} alt="" />
          </div>
          <figcaption>{p.caption}</figcaption>
        </figure>
        <button className="g-arrow right" onClick={() => go(1)} disabled={i === PHOTOS.length - 1} aria-label="Next photo">›</button>
      </div>
      <div className="g-dots">
        {PHOTOS.map((_, j) => (
          <span key={j} className={`g-dot ${j === i ? 'active' : ''}`} onClick={() => setI(j)} />
        ))}
      </div>
    </div>
  )
}

function QuotesSlide() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 4800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="slide">
      <div className="card quote-card">
        <Typewriter key={i} text={QUOTES[i]} speed={30} className="quote-text" />
        <div className="dots">
          {QUOTES.map((_, j) => (
            <span key={j} className={`dot ${j === i ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GiftBox({ gift, opened, onOpen }) {
  return (
    <button className={`gift-box ${opened ? 'opened' : ''}`} onClick={onOpen} disabled={opened}>
      {!opened ? (
        <span className="gift-emoji">🎁</span>
      ) : (
        <>
          <span className="gift-emoji small">{gift.emoji}</span>
          <span className="gift-label">{gift.label}</span>
        </>
      )}
    </button>
  )
}

function SurpriseSlide() {
  const [opened, setOpened] = useState([false, false, false])
  const [activeText, setActiveText] = useState(null)

  const open = (idx) => {
    setOpened((o) => o.map((v, i) => (i === idx ? true : v)))
    setActiveText(GIFTS[idx])
  }

  return (
    <div className="slide">
      <p className="slide-label">a few surprises, just for you</p>
      <div className="card surprise-card">
        <p className="surprise-hint">tap one to unwrap 👇</p>
        <div className="gift-row">
          {GIFTS.map((g, i) => (
            <GiftBox key={i} gift={g} opened={opened[i]} onOpen={() => open(i)} />
          ))}
        </div>
        <div className="gift-reveal">
          {activeText && (
            <Typewriter key={activeText.label} text={activeText.text} speed={20} className="gift-text" />
          )}
        </div>
      </div>
    </div>
  )
}

function SongSlide() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)
  const [errDetail, setErrDetail] = useState('')
  const [coverIdx, setCoverIdx] = useState(0)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
      return
    }
    a.play()
      .then(() => setPlaying(true))
      .catch((err) => {
        setMissing(true)
        setErrDetail(err?.message || 'playback blocked')
        setPlaying(false)
      })
  }

  const handleAudioError = () => {
    const a = audioRef.current
    const code = a?.error?.code
    const reasons = {
      1: 'loading was aborted',
      2: 'network error',
      3: 'the file is corrupted or an unsupported format',
      4: `file not found at ${SONG_SRC} — check the exact filename in public/audio`,
    }
    setErrDetail(reasons[code] || 'unknown error — check the browser console')
    setMissing(true)
  }

  return (
    <div className="slide">
      <div className="card song-card">
        <p className="slide-label light">Fav song of us and imagine this that Im singing it now for you </p>
        <p className="slide-label light">Naan Paadura mari imagine panumbothu konjam siripa tha irukum adjust panikoma😂😂 </p>


        <div className="turntable">
          <div className="turntable-glow" style={{ opacity: playing ? 1 : 0 }} />
          <div className="cd-wrap">
            <div className={`cd ${playing ? 'spin' : ''}`}>
              <div className="cd-shine" />
              {coverIdx < COVER_CANDIDATES.length && (
                <img
                  className="cd-label"
                  src={COVER_CANDIDATES[coverIdx]}
                  alt=""
                  onError={() => setCoverIdx((v) => v + 1)}
                />
              )}
              <div className="cd-pin" />
            </div>
            <div className={`tonearm ${playing ? 'active' : ''}`}>
              <div className="tonearm-arm" />
              <div className="tonearm-head" />
            </div>
            {playing && (
              <div className="notes" aria-hidden="true">
                <span className="note n1">♪</span>
                <span className="note n2">♫</span>
                <span className="note n3">♪</span>
              </div>
            )}
          </div>
          <div className="turntable-deck" />
        </div>

        <h2 className="song-title">Kannana Kanne</h2>

        <p className="song-poem">
          <Typewriter text={SONG_POEM} speed={26} />
        </p>

        <button className="play-btn" onClick={toggle}>
          {playing ? '⏸ pause' : '▶ play'}
        </button>

        {missing && (
          <p className="missing-note">
            Couldn't play the song — {errDetail}. Make sure the file at{' '}
            <code>{SONG_SRC}</code> exists in <code>public/audio</code> and the name matches exactly (no spaces, matching case).
          </p>
        )}

        <audio
          ref={audioRef}
          src={SONG_SRC}
          onEnded={() => setPlaying(false)}
          onError={handleAudioError}
        />
      </div>
    </div>
  )
}

const POETIC_LINE =
  "You have me — in the quiet and in the noise, in the version of you that's unsure, and the one that's healing.\nNo rush, no conditions. Just someone choosing you, gently, for as long as you'll let me."

function ClosingSlide() {
  const [stage, setStage] = useState(0)
  return (
    <div className="slide hero-slide">
      <p className="eyebrow">last thing</p>
      <h2 className="closing-title">
        <Typewriter text="You have me." speed={70} onDone={() => setStage(1)} />
      </h2>
      {stage >= 1 && (
        <p className="poetic-text reveal">
          <Typewriter text={POETIC_LINE} speed={22} onDone={() => setStage(2)} />
        </p>
      )}
      {stage >= 2 && (
        <p className="hint reveal">
          <Typewriter text="🫶 don't worry, okay? Naan irukum naazh varaikum nee azhuga koodathey 🫰 🩷" speed={40} onDone={() => setStage(3)} />
        </p>
      )}
      {stage >= 3 && <p className="jai-signature reveal">— by yours, Jai</p>}
    </div>
  )
}

const SLIDES = [HeroSlide, LetterSlide, GallerySlide, QuotesSlide, SurpriseSlide, SongSlide, ClosingSlide]

export default function App() {
  const [index, setIndex] = useState(0)
  const touchX = useRef(null)

  const go = useCallback((dir) => {
    setIndex((v) => Math.min(Math.max(v + dir, 0), SLIDES.length - 1))
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const Slide = SLIDES[index]

  return (
    <div className="app" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="hearts-bg" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDuration: `${9 + (i % 6)}s`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${0.9 + (i % 3) * 0.3}rem`,
            }}
          >
            {['💗', '🩷', '💕', '♡'][i % 4]}
          </span>
        ))}
      </div>

      <div className="slide-viewport" key={index}>
        <Slide />
      </div>

      <nav className="nav">
        <button
          className="arrow"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="progress-dots">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          className="arrow"
          onClick={() => go(1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </div>
  )
}
