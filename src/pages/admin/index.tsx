import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [tenantId, setTenantId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Saving...')
    const res = await fetch('/api/announce', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ tenant_id: tenantId, title, body })
    })
    const data = await res.json()
    if (!res.ok) setStatus('Error: ' + (data.error || 'unknown'))
    else setStatus('Saved! Announcement ID: ' + data.id)
  }

  if (!session) return <main><p>Please <a href="/login">login</a>.</p></main>

  return (
    <main>
      <h1>Admin — Create Announcement</h1>
      <p><b>Note:</b> paste your <code>tenant_id</code> from Supabase → <i>tenants</i> table.</p>
      <form onSubmit={submit}>
        <label>Tenant ID</label>
        <input value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="uuid" required />
        <label>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
        <label>Body</label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={6} required />
        <button type="submit">Publish</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  )
}
