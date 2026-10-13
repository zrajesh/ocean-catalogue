import numpy as np, json, os, re, sys
from PIL import Image
from scipy import ndimage as ndi
from rapidocr_onnxruntime import RapidOCR
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from crop import process
S=os.path.dirname(os.path.abspath(__file__))
ocr=RapidOCR()
def lines(path):
    r,_=ocr(path); return [x[1] for x in (r or [])]
def headings(pno):
    im=np.array(Image.open(f'{S}/pages/p{pno:02d}.png').convert('RGB')).astype(int)
    R,G,B=im[...,0],im[...,1],im[...,2]
    blue=(abs(R-0)<16)&(abs(G-114)<16)&(abs(B-188)<16)
    blue2=(abs(R-0)<30)&(abs(G-114)<30)&(abs(B-188)<30)
    d=ndi.binary_dilation(blue,structure=np.ones((3,25)))
    lab,_=ndi.label(d); out=[]
    for i,s in enumerate(ndi.find_objects(lab)):
        h=s[0].stop-s[0].start; w=s[1].stop-s[1].start
        if 28<=h<=110 and w>=60 and blue[s].sum()>300:
            y0,y1,x0,x1=s[0].start,s[0].stop,s[1].start,s[1].stop
            m=blue2[max(y0-8,0):y1+8,max(x0-8,0):x1+8]
            o=np.where(m,0,255).astype('uint8')
            img=Image.fromarray(o).resize((o.shape[1]*3,o.shape[0]*3),Image.LANCZOS)
            pad=Image.new('L',(img.width+80,img.height+80),255); pad.paste(img,(40,40)); pad.save(f'{S}/crops/tmp.png')
            t=' '.join(lines(f'{S}/crops/tmp.png'))
            out.append(dict(x=int(x0),y0=int(y0),y1=int(y1),w=int(w),raw=t))
    # merge same-row neighbours
    out.sort(key=lambda h:(h['y0']//40,h['x']))
    merged=[]
    for h in out:
        if merged and abs(merged[-1]['y0']-h['y0'])<40 and h['x']-(merged[-1]['x']+merged[-1]['w'])<110 and h['raw'].startswith('(') or (merged and h['raw'].startswith('(FINE') and abs(merged[-1]['y0']-h['y0'])<60 and h['x']-(merged[-1]['x']+merged[-1]['w'])<250):
            merged[-1]['raw']+=' '+h['raw']; merged[-1]['w']=h['x']+h['w']-merged[-1]['x']
        else: merged.append(h)
    return [m for m in merged if re.search(r'[A-Z]{3,}',m['raw'])]
CODE=re.compile(r'^[A-Z]{0,3}\d{3,6}[A-Z]?\d{0,3}$')
def parse(ls):
    ls=[l.strip() for l in ls if l.strip()]
    d=dict(code=None,series=None,type=None,capacity=None,dims={},packing=None,raw=ls)
    if ls and CODE.match(ls[0].replace(' ','')): d['code']=ls[0].replace(' ',''); rest=ls[1:]
    else: rest=ls
    ci=next((i for i,l in enumerate(rest) if re.search(r'\bml\b|\boz\b|\bcl\b|ml\)',l)),None)
    names=rest[:ci] if ci is not None else []
    if names: d['series']=names[0]; d['type']=' '.join(names[1:]) or None
    if ci is not None:
        d['capacity']=rest[ci]; tail=' '.join(rest[ci+1:])
    else: tail=' '.join(rest)
    m=re.search(r'Packing\s*(\d+\s*/\s*\d+)',tail,re.I)
    if m: d['packing']=m.group(1).replace(' ','')
    for k,v in re.findall(r'([A-Z]{1,2}(?::[A-Z]{2})?)\s*:?\s*(\d+(?:\.\d+)?)\s*(?:mm)?',re.sub(r'Packing.*','',tail)):
        d['dims'][k]=float(v)
    return d
if __name__=='__main__':
    only=[int(a) for a in sys.argv[1:]] or range(4,19)
    allp={}
    for pno in only:
        res,rows=process(f'{S}/pages/p{pno:02d}.png',f'{S}/crops',pno)
        for r in res:
            if 'err' in r: continue
            r.update(parse(lines(f"{S}/crops/{r['id']}_text.png")))
        hs=headings(pno)
        allp[pno]=dict(products=res,headings=hs)
        print(pno,len(res),[h['raw'] for h in hs])
    json.dump(allp,open(f'{S}/crops/all2.json','w'))
