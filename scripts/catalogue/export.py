import json,re,os
from PIL import Image
S=os.path.dirname(os.path.abspath(__file__)); P='/Users/rajeshbhattarai/Desktop/MyDrive/ocean-catalogue'
d=json.load(open(f'{S}/crops/final.json'))
CATS={'Stemware':'stemware','Tumblers':'tumblers','Shooters':'shooters','Pool Barware':'pool-barware','Beer Glasses':'beer-glasses','Coffee & Tea Cups':'coffee-tea-cups','Carafes':'carafes','Ice Cream Cups':'ice-cream-cups','Pitchers':'pitchers','Plates & Bowls':'plates-bowls','Jars':'jars','Accessories':'accessories'}
seen={}; out=[]
for x in d:
    slug=x['code'].lower(); n=seen.get(slug,0)+1; seen[slug]=n
    if n>1: slug=f'{slug}-{n}'
    im=Image.open(x['photo']).convert('RGB')
    im.save(f'{P}/public/products/{slug}.webp',lossless=True,quality=100,method=6)
    ml=re.search(r'\(\s*([\d,\.]+)\s*ml',x['capacity'] or '')
    name=x['series'] if not x['type'] else f"{x['series']} {x['type']}"
    out.append(dict(id=slug,code=x['code'],series=x['series'],type=x['type'],name=name,category=CATS[x['category']],
        capacity=x['capacity'],ml=float(ml.group(1).replace(',','')) if ml else None,dims=x['dims'],packing=x['packing'],isNew=bool(x['new']),
        img=dict(src=f'/products/{slug}.webp',w=im.width,h=im.height),order=x['page']*1000+x['row']*10+x['col']))
json.dump(out,open(f'{P}/features/catalogue/data/products.json','w'),separators=(',',':'),ensure_ascii=False)
print(len(out),os.popen(f'du -sh {P}/public/products').read())
