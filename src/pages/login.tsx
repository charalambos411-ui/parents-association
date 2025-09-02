import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient' // <-- ΑΥΤΟ

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined }
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main>
      <h1>Login</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <form onSubmit={sendMagicLink}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"/>
          <button type="submit">Send magic link</button>
          {error && <p style={{color:'crimson'}}>{error}</p>}
        </form>
      )}
    </main>
  )
}
