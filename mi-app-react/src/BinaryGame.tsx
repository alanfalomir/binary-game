import { useState } from 'react'
import './BinaryGame.css'

const BIT_VALUES = [8, 4, 2, 1]

function randomTarget(previous: number | null) {
  let next = Math.floor(Math.random() * 16)
  while (next === previous) {
    next = Math.floor(Math.random() * 16)
  }
  return next
}

function bitsToDecimal(bits: boolean[]) {
  return bits.reduce((sum, on, i) => sum + (on ? BIT_VALUES[i] : 0), 0)
}

type Feedback = 'idle' | 'correct' | 'wrong'
type Stage = 'intro' | 'game'

function BrandHeader() {
  return (
    <header className="site-header">
      <div className="site-header-top">
        <div className="site-header-left">
          <div className="site-header-logo-crop">
            <img src="/logo-uc.jpeg" alt="Universidad Cuauhtémoc" />
          </div>
          <span className="site-header-divider" />
          <div className="site-header-titles">
            <h1>Universidad Cuauhtemoc</h1>
            <p>Campus Aguascalientes</p>
          </div>
        </div>
        <h2 className="site-header-page-title">El Sistema Binario</h2>
      </div>
      <div className="site-header-bottom">
        <span>Fundamentos de Computación</span>
        <span>Ing. Alan Heraclio Hernandez Falomir</span>
      </div>
    </header>
  )
}

function IntroScreen({ onPlay }: { onPlay: () => void }) {
  const [demoBits, setDemoBits] = useState<boolean[]>([true, false, true, false])
  const demoValue = bitsToDecimal(demoBits)

  function toggleDemoBit(index: number) {
    setDemoBits((prev) => prev.map((on, i) => (i === index ? !on : on)))
  }

  return (
    <section className="binary-game binary-game-intro">
      <h1>¿Cómo funciona el binario?</h1>
      <p className="binary-game-instructions">
        La computadora solo entiende dos estados: apagado (0) y encendido
        (1). Con 4 interruptores puedes representar cualquier número del 0
        al 15. Cada interruptor tiene un valor fijo: 8, 4, 2 y 1. Súmalos
        cuando estén encendidos y obtendrás el número decimal.
      </p>

      <div className="binary-game-bits">
        {BIT_VALUES.map((value, index) => (
          <button
            key={value}
            type="button"
            className={`binary-bit ${demoBits[index] ? 'on' : 'off'}`}
            onClick={() => toggleDemoBit(index)}
            aria-pressed={demoBits[index]}
          >
            <span className="binary-bit-value">{value}</span>
            <span className="binary-bit-digit">{demoBits[index] ? 1 : 0}</span>
          </button>
        ))}
      </div>

      <p className="binary-game-instructions">
        Prueba a mover los interruptores. Ahora mismo tienes el binario{' '}
        <strong>{demoBits.map((b) => (b ? 1 : 0)).join('')}</strong>, que
        equivale a <strong>{demoValue}</strong> en decimal.
      </p>

      <button type="button" className="binary-game-submit" onClick={onPlay}>
        Jugar
      </button>
    </section>
  )
}

function BinaryGame() {
  const [stage, setStage] = useState<Stage>('intro')
  const [target, setTarget] = useState<number>(() => randomTarget(null))
  const [bits, setBits] = useState<boolean[]>([false, false, false, false])
  const [feedback, setFeedback] = useState<Feedback>('idle')
  const [score, setScore] = useState(0)
  const [rounds, setRounds] = useState(0)

  const guess = bitsToDecimal(bits)

  function toggleBit(index: number) {
    if (feedback !== 'idle') return
    setBits((prev) => prev.map((on, i) => (i === index ? !on : on)))
  }

  function checkAnswer() {
    if (feedback !== 'idle') return
    const isCorrect = guess === target
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setRounds((r) => r + 1)
    if (isCorrect) setScore((s) => s + 1)
  }

  function nextRound() {
    setTarget((prev) => randomTarget(prev))
    setBits([false, false, false, false])
    setFeedback('idle')
  }

  if (stage === 'intro') {
    return (
      <div className="binary-game-page">
        <BrandHeader />
        <IntroScreen onPlay={() => setStage('game')} />
      </div>
    )
  }

  return (
    <div className="binary-game-page">
      <BrandHeader />

      <section className="binary-game">
        <h1>Juego de Binario</h1>
        <p className="binary-game-instructions">
          Activa los interruptores para representar el número decimal en
          binario de 4 dígitos.
        </p>

      <div className="binary-game-score">
        Puntaje: {score} / {rounds}
      </div>

      <div className="binary-game-target">
        Número a representar: <span>{target}</span>
      </div>

      <div className="binary-game-bits">
        {BIT_VALUES.map((value, index) => (
          <button
            key={value}
            type="button"
            className={`binary-bit ${bits[index] ? 'on' : 'off'}`}
            onClick={() => toggleBit(index)}
            aria-pressed={bits[index]}
          >
            <span className="binary-bit-value">{value}</span>
            <span className="binary-bit-digit">{bits[index] ? 1 : 0}</span>
          </button>
        ))}
      </div>

      <div className="binary-game-guess">
        Tu binario: <strong>{bits.map((b) => (b ? 1 : 0)).join('')}</strong> ={' '}
        <strong>{guess}</strong>
      </div>

      {feedback === 'idle' && (
        <button type="button" className="binary-game-submit" onClick={checkAnswer}>
          Comprobar
        </button>
      )}

      {feedback === 'correct' && (
        <div className="binary-game-feedback correct">
          ¡Correcto! 🎉
          <button type="button" className="binary-game-next" onClick={nextRound}>
            Siguiente
          </button>
        </div>
      )}

      {feedback === 'wrong' && (
        <div className="binary-game-feedback wrong">
          Incorrecto. {target} en binario es{' '}
          {target
            .toString(2)
            .padStart(4, '0')}
          .
          <button type="button" className="binary-game-next" onClick={nextRound}>
            Siguiente
          </button>
        </div>
      )}
      </section>
    </div>
  )
}

export default BinaryGame
