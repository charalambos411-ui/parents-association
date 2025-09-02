import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  const {tenant_id,title,body}=req.body||{}
  if(!tenant_id||!title||!body) return res.status(400).json({error:'Missing fields'})
  const { data, error } = await supabaseAdmin.from('announcements').insert({tenant_id,title,body}).select('id').single()
  if(error) return res.status(400).json({error:error.message}); return res.status(200).json({id:data.id})
}
