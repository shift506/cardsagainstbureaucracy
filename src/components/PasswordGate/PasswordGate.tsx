import { useState } from 'react'
import styles from './PasswordGate.module.css'
import logoUrl from '@/assets/WEB/WEB/Landscape/ShiftFlow-Logo-Landscape-FullColour-DarkBackground-2500x930px-72dpi.png'

const STORAGE_KEY = 'cab_alpha_auth'
const PASSWORD = import.meta.env.VITE_ALPHA_PASSWORD as string

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (!PASSWORD || authed) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <img src={logoUrl} alt="ShiftFlow" className={styles.logo} />
        <p className={styles.label}>Alpha Preview — enter access code</p>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type="password"
          placeholder="Access code"
          value={value}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setError(false) }}
        />
        {error && <p className={styles.error}>Incorrect code</p>}
        <button className={styles.button} type="submit">Enter</button>
      </form>
    </div>
  )
}
