import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,diagnose,makePlan,demoReply} from '../public/domain.js';
import {createServer} from '../server.mjs';
test('El diagnóstico prioriza la habilidad fallada y conserva todos los módulos',()=>{
 const answers=questions.map(q=>q.correct);answers[2]=2;
 const result=diagnose(answers);
 assert.deepEqual(result.scores,[100,100,0,100]);assert.equal(result.order[0],'comunicacion');
 const plan=makePlan({diagnostic:result,completed:{comunicacion:true}});
 assert.equal(plan.length,4);assert.equal(plan[0].done,true);assert.equal(new Set(plan.map(x=>x.id)).size,4);
});
test('El semáforo de la demo no asigna verde automáticamente y detecta un ejemplo de riesgo',()=>{
 assert.equal(demoReply('¿Cómo intervengo un equipo energizado?').level,'red');
 assert.equal(demoReply('¿Cómo preparo mi entrevista?').level,'amber');
 assert.match(demoReply('¿Cómo estudio?').text,/recuperación activa/);
 assert.match(demoReply('pregunta ajena a las categorías').text,/sin un modelo de IA conectado/);
});
test('HTTP sirve la aplicación, valida entradas, simula chat y protege archivos privados',async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  let res=await fetch(base);assert.equal(res.status,200);assert.match(await res.text(),/Nexo/);
  assert.equal((await fetch(`${base}/health`)).status,200);
  assert.equal((await fetch(`${base}/.env`)).status,404);
  assert.equal((await fetch(`${base}/server.mjs`)).status,404);
  res=await fetch(`${base}/api/chat`,{method:'POST',body:'{}'});assert.equal(res.status,400);
  res=await fetch(`${base}/api/chat`,{method:'POST',body:'broken json'});assert.equal(res.status,400);
  res=await fetch(`${base}/api/chat`,{method:'POST',body:JSON.stringify({message:'¿Cómo verifico una fuente de IA?'})});
  assert.equal(res.status,200);const body=await res.json();assert.equal(body.mode,'demo');assert.equal(body.level,'amber');assert.match(body.text,/fuente primaria/);
  res=await fetch(`${base}/api/chat`,{method:'POST',body:JSON.stringify({message:'a'.repeat(2100)})});assert.equal(res.status,400);
  for(let i=0;i<20;i++)res=await fetch(`${base}/api/chat`,{method:'POST',body:JSON.stringify({message:'hola'})});assert.equal(res.status,429);
 }finally{await new Promise(r=>server.close(r));}
});
