import json,re,os,shutil,collections
from PIL import Image
S=os.path.dirname(os.path.abspath(__file__))
P='/Users/rajeshbhattarai/Desktop/MyDrive/ocean-catalogue'
raw=json.load(open(f'{S}/crops/all2.json'))
rawby={r['id']:r for p in raw.values() for r in p['products'] if 'id' in r}
CODE=re.compile(r'^(?=.*\d)[0-9A-Z]{5,14}$')
DIMKEYS=['TD','BD','FD','MD','H','MAXD','TD:AC','BD:AC','MD:AC','TD:L','BD:L','MD:L','H:L','AC','L','W']
def fixcode(c): return re.sub(r'\s','',c).upper().replace('O','0').replace('I','1') if c else c
def nice(t):
    if not t: return t
    t=t.replace('Ó','O').strip().strip('.')
    t=re.sub(r"(?<=[a-z])(?=[A-Z])",' ',t)
    t=re.sub(r"Hi 'Ball","Hi Ball",t); t=t.replace('&',' & ')
    t=re.sub(r'\bg(?=Glass)','',t); t=t.replace('gGlass','Glass')
    t=re.sub(r'(\d)\"+',r'\1"',t); t=t.replace('*"','"').replace('Long g Drink','Long Drink')
    t=re.sub(r'(?<=[A-Za-z])(\d)',r' \1',t)
    t=re.sub(r'\s+',' ',t).strip()
    return t
def cap(t):
    if not t: return None
    t=t.replace('Oz','oz')
    t=re.sub(r'(\d+)(\d)/([248])',r'\1 \2/\3',t) if re.search(r'\d\d/[248]',t) else t
    t=re.sub(r'(\d)\s*oz',r'\1 oz',t); t=re.sub(r'oz\(',r'oz (',t); t=re.sub(r'(\d)\s*ml',r'\1 ml',t)
    t=re.sub(r'\s+',' ',t).strip()
    return t
def parse(ls):
    ls=[l.strip() for l in ls if l.strip()]
    d=dict(code=None,series=None,type=None,capacity=None,dims={},packing=None)
    cand=fixcode(ls[0]) if ls else ''
    rest=ls
    if CODE.match(cand): d['code']=cand; rest=ls[1:]
    ci=next((i for i,l in enumerate(rest) if re.search(r'\boz\b|\bml\b|\bcl\b|\d\s*oz|ml\)|\d\s*[Oo]z$',l)),None)
    di=next((i for i,l in enumerate(rest) if re.match(r'^(TD|BD|FD|MD|H\d|MAX|L\d)',l.replace(' ',''))),None)
    nend=ci if ci is not None else (di if di is not None else len(rest))
    names=rest[:nend]
    if names: d['series']=nice(names[0]); d['type']=nice(' '.join(names[1:])) or None
    tail_start=(ci+1) if ci is not None else nend
    if ci is not None: d['capacity']=cap(rest[ci])
    tail=' '.join(rest[tail_start:])
    m=re.search(r'Packing\s*(\d+(?:\s*/\s*\d+)?)',tail,re.I)
    if m: d['packing']=m.group(1).replace(' ','')
    body=re.sub(r'Packing.*','',tail)
    for k,v in re.findall(r'((?:MAX\s*)?[A-Z]{1,2}(?::[A-Z]{1,2})?)\s*:?\s*(\d+(?:\.\d+)?)\s*(?:mm|r|m)?',body):
        k=k.replace(' ','')
        if k=='D': k='MAXD'
        if k in DIMKEYS and k not in d['dims']: d['dims'][k]=float(v)
    return d
def main_cat(page,series):
    s=(series or '').lower()
    if page in (4,5): return 'Stemware'
    if page in (6,7,8,9,10): return 'Tumblers'
    if page==11: return 'Pool Barware' if s.startswith(('element','classy')) else 'Shooters'
    if page==12: return 'Beer Glasses'
    if page==13: return 'Coffee & Tea Cups'
    if page==14: return 'Carafes' if s.startswith(('tempo','bistro')) else 'Ice Cream Cups'
    if page==15: return 'Pitchers'
    if page==16: return 'Plates & Bowls'
    if page==17: return 'Accessories' if ('coaster' in s or s.startswith('reya') or 'coaster' in (s)) else 'Jars'
OVERRIDE={
 'p07_r0_c2':dict(code='P03162',series='Centique',type='Hi Ball',capacity='13 oz (370 ml)',dims={'TD:L':89.0,'BD':41.0,'MD:L':89.0,'H':133.0},packing='6/48'),
 'p09_r2_c3':dict(code='B02313',series='Pyramid',type='Long Drink',capacity='13 1/4 oz (380 ml)',dims={'TD:AC':67.0,'BD:AC':67.0,'MD:AC':67.0,'H':145.0},packing='6/72',new=False),
 'p06_r3_c3':dict(type='Mixing Glass'),
 'p05_r4_c3':dict(dims={'TD':45.0,'FD':71.0,'MD':61.0,'H':230.0}),
 'p17_r1_c5':dict(series='Coaster',type='3 3/8"',dims={'TD':85.0,'BD':74.0,'MD':85.0,'H':18.5}),
}
DROP={'p16_r2_c0','p16_r2_c1'}
SERIES_FIX={'Sante':'Santé','Sante Stemless':'Santé Stemless','Caffe':'Caffé','Thezoning':'The Zoning','Thezoning ':'The Zoning','The Zoning':'The Zoning','Space Wave':'Space Wave','Sanmarino':'San Marino','San Marino':'San Marino','Newyork':'New York','New York':'New York','Sweetbell':'Sweet Bell','Sweet Bell':'Sweet Bell','Thepalette':'The Palette','The Palette':'The Palette','The Zoning':'The Zoning','The Rhythm':'The Rhythm','Craftmhan':'CraftMhan','Patiopitcher':'Patio Pitcher','lvory':'Ivory'}
def fixseries(s):
    if not s: return s
    s=nice(s)
    return SERIES_FIX.get(s,SERIES_FIX.get(s.replace(' ','').title(),s))
out=[]
for pno in range(4,18):
    for r in json.load(open(f'{S}/crops/p{pno:02d}.json')):
        if 'id' not in r or r['id'] in DROP: continue
        d=parse(rawby[r['id']]['raw'])
        d.update(OVERRIDE.get(r['id'],{}))
        d['series']=fixseries(d['series'])
        if not d['code']: print('NOCODE',r['id']); continue
        d.update(id=r['id'],page=pno,row=r['row'],col=r['col'],new=OVERRIDE.get(r['id'],{}).get('new',r['new']),photo=f"{S}/crops/{r['id']}_photo.png")
        d['category']=main_cat(pno,d['series'])
        out.append(d)
print(len(out))
json.dump(out,open(f'{S}/crops/final.json','w'),indent=1)
