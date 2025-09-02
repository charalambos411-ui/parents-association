import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient' // <-- ΑΥΤΟ
import { useEffect, useState } from 'react'

export default function Home() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: authListener } = supabase.auth.onAuthStateChange((_evt, sess) => setSession(sess))
    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <main>
      <h1>Parents Association</h1>
      {!session ? (
        <p><Link href="/login">Login with email</Link></p>
      ) : (
        <>
          <p>Signed in as {session.user.email}</p>
          <p><Link href="/admin">Go to Admin</Link></p>
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        </>
      )}
    </main>
  )
}
