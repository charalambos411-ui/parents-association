import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [tenantId, setTenantId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Saving...')

    // 1) optional upload
    let fileUrl: string | null = null
    if (file) {
      const path = announcements/${Date.now()}-${file.name}
      const { data, error } = await supabase
        .storage
        .from('public-files')
        .upload(path, file)

      if (error) {
        setStatus('Upload error: ' + error.message)
        return
      }

      const { data: urlData } = supabase
        .storage
        .from('public-files')
        .getPublicUrl(data.path)

      fileUrl = urlData.publicUrl
    }

    // 2) create announcement (includes file_url if present)
    const res = await fetch('/api/announce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_id: tenantId, title, body, file_url: fileUrl })
    })
    const json = await res.json()
    if (!res.ok) setStatus('Error: ' + (json.error || 'unknown'))
    else {
      setStatus('Saved! Announcement ID: ' + json.id)
      setTitle('')
      setBody('')
      setFile(null)
    }
  }

  if (!session) return <main><p>Please <a href="/login">login</a>.</p></main>

  return (
    <main>
      <h1>Admin — Create Announcement</h1>
      <p><b>Note:</b> paste your <code>tenant_id</code> from Supabase → <i>tenants</i> table.</p>

      <form onSubmit={submit}>
        <label>Tenant ID</label>
        <input value={tenantId} onChange={e=>setTenantId(e.target.value)} placeholder="tenant uuid" required />

        <label>Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />

        <label>Body</label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={6} required />

        <label>Attachment (PDF/Word)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button type="submit">Publish</button>
      </form>

      {status && <p>{status}</p>}
    </main>
  )
}
