// Rebuild PMWA-Contacts.pdf from the DATA in index.html.
// Run: cd ../aiagent && NODE_PATH=node_modules node ../contacts/pdf.js
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const dir=__dirname,src=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const DATA=JSON.parse(src.match(/const DATA=(\[.*?\]);/s)[1]);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=p=>{let d=p.replace(/\D/g,'');if(d.length==12&&d.startsWith('91'))d=d.slice(2);return d.length==10?'+91 '+d.slice(0,5)+' '+d.slice(5):p};
const tel=p=>{let d=p.replace(/[^\d+]/g,'');if(/^\d{10}$/.test(d))d='+91'+d;return d};
const rows=DATA.map((c,i)=>`<tr><td class="no">${i+1}</td><td class="name">${esc(c.n)}</td><td>${c.p.length?c.p.map(p=>`<div><a href="tel:${tel(p)}">${esc(fmt(p))}</a></div>`).join(''):'<span class="none">No number</span>'}</td></tr>`).join('');
const html=`<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#1f2933;margin:0}
h1{color:#0f766e;margin:0 0 2px;font-size:20px}p{margin:0 0 10px;color:#52606d;font-size:12px}table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#0f766e;color:#fff;text-align:left;padding:6px 8px}td{padding:5px 8px;border-bottom:1px solid #e4e7eb;vertical-align:top}tr{break-inside:avoid}
td.no{width:30px;color:#7b8794}td.name{font-weight:600}a{color:#15803d;text-decoration:none;font-variant-numeric:tabular-nums;font-weight:600}.none{color:#9aa5b1}</style>
<h1>PMWA Contacts</h1><p>${DATA.length} contacts · tap a number to call</p><table><thead><tr><th>#</th><th>Name</th><th>Mobile</th></tr></thead><tbody>${rows}</tbody></table>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.setContent(html);
await p.pdf({path:path.join(dir,'PMWA-Contacts.pdf'),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#888">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',margin:{top:'14mm',bottom:'16mm',left:'12mm',right:'12mm'}});await b.close()})();
