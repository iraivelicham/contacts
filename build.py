import openpyxl, json, re, sys
wb=openpyxl.load_workbook(sys.argv[1],read_only=True)
rows=list(wb['Contacts'].iter_rows(values_only=True))
h=rows[0]; out=[]; nophone=0
def key(r):
    m=re.search(r'\d+',str(r.get('memberId') or '')); return int(m.group()) if m else 99999
recs=[dict(zip(h,r)) for r in rows[1:] if r and r[h.index('name')]]
recs.sort(key=key)
for r in recs:
    phones=[str(p).strip() for p in (r['phone1'],r['phone2']) if p and str(p).strip()]
    if not phones: nophone+=1
    out.append({'n':str(r['name']).strip(),'p':phones})
if len(sys.argv)>2:  # extra.json: phones/new contacts from later PDF lists
    ex=json.load(open(sys.argv[2])); have={re.sub(r'\D','',x)[-10:] for c in out for x in c['p']}
    for nm,ph in ex['fill']:
        c=next(c for c in out if c['n']==nm and not c['p']); c['p']=[ph]; nophone-=1; have.add(re.sub(r'\D','',ph)[-10:])
    for nm,ph in ex['add']:
        if re.sub(r'\D','',ph)[-10:] not in have: out.append({'n':nm,'p':[ph]}); have.add(re.sub(r'\D','',ph)[-10:])
print(len(out),'contacts,',nophone,'without phone',file=sys.stderr)
print(json.dumps(out,ensure_ascii=False))
