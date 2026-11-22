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
print(len(out),'contacts,',nophone,'without phone',file=sys.stderr)
print(json.dumps(out,ensure_ascii=False))
