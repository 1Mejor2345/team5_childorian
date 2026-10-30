import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { demoReply } from './public/domain.js';
const assets = new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.js','app.js'],['/domain.js','domain.js'],['/favicon.svg','favicon.svg']]);
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',svg:'image/svg+xml'};
const buckets=new Map();
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
export function createServer() {
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','same-origin');
  res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/health')return json(res,200,{status:'ok'});
  if(path==='/api/config'&&req.method==='GET')return json(res,200,{mode:'demo'});
  if(path==='/api/chat'&&req.method==='POST'){
   const ip=req.socket.remoteAddress; const now=Date.now();
   if(buckets.size>10000)buckets.clear();
   let bucket=buckets.get(ip); if(!bucket||now-bucket.start>60000)bucket={start:now,count:0};
   buckets.set(ip,bucket); if(++bucket.count>20)return json(res,429,{error:'Espera un minuto antes de enviar más preguntas.'});
   try{
    let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>20000)return json(res,413,{error:'Mensaje demasiado largo.'});}
    let body;try{body=JSON.parse(raw);}catch{return json(res,400,{error:'Formato de solicitud inválido.'});}
    if(typeof body.message!=='string'||!body.message.trim()||body.message.length>2000)return json(res,400,{error:'Escribe una pregunta de hasta 2000 caracteres.'});
    return json(res,200,{...demoReply(body.message),mode:'demo'});
   }catch{return json(res,503,{error:'El servicio tardó demasiado o no está disponible. Inténtalo de nuevo.'});}
  }
  if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Método no permitido.'});
  if(!assets.has(path))return json(res,404,{error:'Recurso no encontrado.'});
  try{const file=assets.get(path);const data=await readFile(new URL(`./public/${file}`,import.meta.url));res.writeHead(200,{'Content-Type':mime[file.split('.').pop()],'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);}catch{json(res,500,{error:'No se pudo cargar el recurso.'});}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const server=createServer();server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log(`Nexo listo en http://localhost:${process.env.PORT||3000}`));
 process.on('SIGTERM',()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();});
}
