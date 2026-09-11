// Isolated PostgreSQL/WASM test. Never reads a connection string or a production database.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
const require = createRequire(import.meta.url);
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const migration = async name => readFile(new URL('../supabase/migrations/'+name, import.meta.url),'utf8');
const report = [];
const admin = '00000000-0000-4000-8000-000000000001';
const member = '00000000-0000-4000-8000-000000000002';
const role = async (name, uid='') => {
  await db.exec('RESET ROLE');
  await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)",[uid]);
  await db.exec('SET ROLE '+name);
};
const submit = async (overrides={}) => {
  const p={token:randomUUID(),via:'arcani',topic:'altro',name:'Test sintetico',email:'qa@example.test',phone:'',message:'Messaggio sintetico per test locali.',privacy:true,company:'',...overrides};
  return (await db.query('SELECT public.submit_contact_inquiry($1,$2,$3,$4,$5,$6,$7,$8,$9) AS id',Object.values(p))).rows[0].id;
};
try {
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated;`);
  const authSQL=await migration('20251027162142_eb420ad1-3418-4b68-a131-d950a1a88227.sql');
  await db.exec(authSQL.split('-- Storage policies')[0]);
  const editorial=await migration('20260316180429_c566cd8b-afa7-42a1-9e2f-378776dc8a9b.sql');
  const triggerFunction=editorial.match(/CREATE OR REPLACE FUNCTION public\.set_updated_at\(\)[\s\S]*?\$\$;/)?.[0];
  assert(triggerFunction); await db.exec(triggerFunction);
  await db.exec(await migration('20260905180000_add_contact_inquiries.sql'));
  await db.exec(await migration('20260909120000_harden_inquiry_retries.sql'));
  await db.query('INSERT INTO auth.users(id,email) VALUES ($1,$2),($3,$4)',[admin,'admin@example.test',member,'member@example.test']);
  await db.query("INSERT INTO public.user_roles(user_id,role) VALUES ($1,'admin')",[admin]);
  report.push('Original migrations + additive hardening: PASS');
  await role('anon');
  await assert.rejects(db.query('SELECT * FROM public.contact_inquiries'));
  await assert.rejects(db.query("INSERT INTO public.contact_inquiries DEFAULT VALUES"));
  for(const input of [{name:'x'}, {message:'short'}, {privacy:false}, {via:'arte'}, {topic:'injected'}, {email:'invalid'}]) {
    await assert.rejects(submit(input),/invalid_contact_inquiry/);
  }
  await submit({company:'bot'});
  const token=randomUUID(); const first=await submit({token,email:' QA@EXAMPLE.TEST '});
  assert.equal(await submit({token}),first);
  await submit({via:'respiro',topic:'lezione-prova'});
  await submit({via:'ispirazione',topic:'contenuti-editoriali'});
  await assert.rejects(submit(),/rate_limit_exceeded/);
  assert.equal(await submit({token}),first,'Retry still succeeds after rate limit');
  report.push('Anonymous RPC, invalid input, honeypot, normalized rate limit, retry: PASS');
  await role('authenticated',member);
  assert.equal((await db.query('SELECT * FROM public.contact_inquiries')).rows.length,0);
  assert.equal((await db.query("UPDATE public.contact_inquiries SET status='archived' RETURNING id")).rows.length,0);
  assert.equal((await db.query('DELETE FROM public.contact_inquiries RETURNING id')).rows.length,0);
  await assert.rejects(db.query('SELECT public.purge_expired_contact_inquiries()'),/insufficient_privilege/);
  await assert.rejects(db.query('TRUNCATE public.contact_inquiries'));
  report.push('Non-admin SELECT/UPDATE/DELETE/purge/TRUNCATE denied: PASS');
  await role('authenticated',admin);
  const rows=(await db.query('SELECT * FROM public.contact_inquiries ORDER BY created_at DESC,id DESC')).rows;
  assert.equal(rows.length,3); assert(rows.every(r=>r.email==='qa@example.test'));
  await db.query("UPDATE public.contact_inquiries SET status='read' WHERE id=$1",[first]);
  await db.query("UPDATE public.contact_inquiries SET status='archived' WHERE id=$1",[first]);
  await db.query("UPDATE public.contact_inquiries SET status='read' WHERE id=$1",[first]);
  assert.equal((await db.query('SELECT status FROM public.contact_inquiries WHERE id=$1',[first])).rows[0].status,'read');
  await db.query("UPDATE public.contact_inquiries SET expires_at=now()-interval '1 day' WHERE id=$1",[first]);
  assert.equal((await db.query('SELECT public.purge_expired_contact_inquiries() AS n')).rows[0].n,1);
  assert.equal((await db.query('DELETE FROM public.contact_inquiries RETURNING id')).rows.length,2);
  report.push('Admin inbox read/status/archive/restore/delete + retention: PASS');
  console.log(JSON.stringify({report,limitation:'PGlite is single-connection: true concurrent transactions and deployed Supabase grants require staging verification.'},null,2));
} finally { if (process.env.QA_SERVE !== '1') await db.close(); }

// Minimal LOCAL transport adapter for browser tests, not a replacement for PostgREST/Auth.
// Auth is synthetic; RPC, data, filtering and RLS below run against the real migration SQL.
if (process.env.QA_SERVE === '1') {
  if (!process.env.QA_TEST_PASSWORD) throw new Error('Set QA_TEST_PASSWORD for the disposable local login fixture.');
  await role('postgres');
  await db.exec('GRANT SELECT ON public.user_roles TO authenticated');
  const user={id:admin,email:'admin@example.test',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
  const token=[{alg:'none',typ:'JWT'},{sub:admin,exp:Math.floor(Date.now()/1000)+3600},'synthetic'].map(v=>Buffer.from(typeof v==='string'?v:JSON.stringify(v)).toString('base64url')).join('.');
  let queue=Promise.resolve();
  createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5173');
    res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,prefer,range');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,HEAD,OPTIONS');
    res.setHeader('Access-Control-Expose-Headers','content-range');
    if(req.method==='OPTIONS') { res.end(); return; }
    let body='';req.on('data',chunk=>{body+=chunk;});req.on('end',()=>{
      queue=queue.then(async()=>{
        const url=new URL(req.url,'http://127.0.0.1:54321');
        const send=(data,status=200)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
        try {
          const p=body?JSON.parse(body):{};
          if(url.pathname==='/auth/v1/token') {
            if(p.email!==user.email || p.password!==process.env.QA_TEST_PASSWORD) return send({message:'Invalid login credentials'},400);
            return send({access_token:token,refresh_token:'local-qa-only',token_type:'bearer',expires_in:3600,user});
          }
          const isAdmin=req.headers.authorization===`Bearer ${token}`;
          if(url.pathname==='/auth/v1/user') return send(isAdmin?user:{message:'Unauthorized'},isAdmin?200:401);
          if(url.pathname==='/auth/v1/logout') return send({});
          await role(isAdmin?'authenticated':'anon',isAdmin?admin:'');
          if(url.pathname==='/rest/v1/rpc/submit_contact_inquiry') {
            const id=await submit({token:p.p_submission_token,via:p.p_via,topic:p.p_topic,name:p.p_name,email:p.p_email,phone:p.p_phone,message:p.p_message,privacy:p.p_privacy_accepted,company:p.p_company});
            console.log('Local browser inquiry: RPC accepted');return send(id);
          }
          if(url.pathname==='/rest/v1/rpc/purge_expired_contact_inquiries') return send((await db.query('SELECT public.purge_expired_contact_inquiries() AS n')).rows[0].n);
          if(url.pathname==='/rest/v1/user_roles') return send((await db.query('SELECT role FROM public.user_roles')).rows);
          if(url.pathname==='/rest/v1/contact_inquiries') {
            const values=[];const clauses=[];
            for(const key of ['id','status','via']) {
              const value=url.searchParams.get(key);
              if(value?.startsWith('eq.')) {values.push(value.slice(3));clauses.push(`${key}=$${values.length}`);}
            }
            const search=url.searchParams.get('or')?.match(/name\.ilike\.([^,]+)/)?.[1];
            if(search) {values.push(search);clauses.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length} OR topic ILIKE $${values.length})`);}
            const where=clauses.length?' WHERE '+clauses.join(' AND '):'';
            if(req.method==='PATCH') {
              const sets=[];
              for(const key of ['status','read_at','archived_at']) if(key in p){values.push(p[key]);sets.push(`${key}=$${values.length}`);}
              await db.query(`UPDATE public.contact_inquiries SET ${sets.join(',')}${where}`,values);return send(null);
            }
            if(req.method==='DELETE'){await db.query('DELETE FROM public.contact_inquiries'+where,values);return send(null);}
            const count=(await db.query('SELECT count(*)::int AS n FROM public.contact_inquiries'+where,values)).rows[0].n;
            const offset=Math.max(0,Number(url.searchParams.get('offset')||0));
            const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||25)));
            const data=(await db.query(`SELECT * FROM public.contact_inquiries${where} ORDER BY created_at DESC,id DESC LIMIT ${limit} OFFSET ${offset}`,values)).rows;
            res.setHeader('Content-Range',`${offset}-${offset+data.length-1}/${count}`);return send(req.method==='HEAD'?null:data);
          }
          return send([]);
        }catch(error){return send({message:error.message,code:error.code||'QA_ERROR'},400);}
      }).catch(error=>{res.statusCode=500;res.end();console.error(error.message);});
    });
  }).listen(54321,'127.0.0.1',()=>console.log('Isolated inquiry QA API: http://127.0.0.1:54321 (synthetic auth only)'));
}
