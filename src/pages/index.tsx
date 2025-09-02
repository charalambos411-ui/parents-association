import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Home(){
  const [session, setSession] = useState<any>(null)
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setSession(data.session))
    const { data: l } = supabase.auth.onAuthStateChange((_e, s)=>setSession(s)); return ()=>l.subscription.unsubscribe() },[])
  return <main><h1>Parents Association</h1>{!session ? <p><Link href='/login'>Login</Link></p> : <><p>Signed in as {session.user.email}</p><p><Link href='/admin'>Go to Admin</Link></p><button onClick={()=>supabase.auth.signOut()}>Sign out</button></>}</main>
}
