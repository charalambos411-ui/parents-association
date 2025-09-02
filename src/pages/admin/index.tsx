import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function Admin(){
  const [session,setSession]=useState<any>(null)
  const [tenantId,setTenantId]=useState('')
  const [title,setTitle]=useState(''); const [body,setBody]=useState(''); const [status,setStatus]=useState<string|null>(null)
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setSession(data.session)) },[])
  const submit=async(e:any)=>{e.preventDefault(); setStatus('Saving...')
    const r=await fetch('/api/announce',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tenant_id:tenantId,title,body})})
    const d=await r.json(); setStatus(r.ok?('Saved! ID: '+d.id):('Error: '+(d.error||'unknown'))) }
  if(!session) return <main><p>Please <a href='/login'>login</a>.</p></main>
  return <main><h1>Admin — Create Announcement</h1><p>Paste your <code>tenant_id</code> from Supabase → tenants table.</p>
    <form onSubmit={submit}><input value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder='tenant uuid' required/>
    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' required/>
    <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder='Body' rows={6} required/>
    <button>Publish</button></form>{status && <p>{status}</p>}</main>
}
