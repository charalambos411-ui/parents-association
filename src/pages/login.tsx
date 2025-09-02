import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Login(){
  const [email,setEmail]=useState(''); const [sent,setSent]=useState(false); const [err,setErr]=useState<string|null>(null)
  const send=async(e:any)=>{e.preventDefault(); setErr(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: typeof window!=='undefined'?window.location.origin:undefined }});
    if(error) setErr(error.message); else setSent(true) }
  return <main><h1>Login</h1>{sent? <p>Check your email for a magic link.</p> : <form onSubmit={send}><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} required/><button type='submit'>Send magic link</button>{err&&<p style={{color:'crimson'}}>{err}</p>}</form>}</main>
}
