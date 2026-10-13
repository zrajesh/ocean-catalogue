import numpy as np, sys, json, os
from PIL import Image
from scipy import ndimage as ndi
sys.path.insert(0,os.path.dirname(__file__))
from seg import dots_of

def blobs(mask, lo, hi, minfill):
    lab,_=ndi.label(mask); out=[]
    for i,s in enumerate(ndi.find_objects(lab)):
        h=s[0].stop-s[0].start;w=s[1].stop-s[1].start
        if lo<=h<=hi and lo<=w<=hi and abs(h-w)<=12 and (lab[s]==i+1).sum()>=minfill*h*w:
            out.append((s[1].start,s[0].start,s[1].stop,s[0].stop))
    return out

OVR={'p12_r0_c2':dict(dil=1),'p09_r4_c5':dict(maxw=170),'p09_r4_c6':dict(maxw=170),'p09_r1_c3':dict(maxw=110),'p09_r2_c3':dict(maxw=110),'p05_r0_c6':dict(pick='bottom'),'p07_r0_c2':dict(pick='top')}

def process(page_png, outdir, pno):
    img=Image.open(page_png).convert('RGB'); im=np.array(img).astype(int)
    R,G,B=im[...,0],im[...,1],im[...,2]
    orange=(R>225)&(G>100)&(G<170)&(B<90)
    badges=blobs(orange,50,130,0.5)
    blue=(abs(R-0)<16)&(abs(G-114)<16)&(abs(B-188)<16)
    blue=ndi.binary_dilation(blue,iterations=3)
    work=im.copy()
    for x0,y0,x1,y1 in badges: work[y0-3:y1+3,x0-3:x1+3]=255
    sink=((work.min(axis=2)<190)&~blue&~ndi.binary_dilation(orange,iterations=3))
    ink=((work.min(axis=2)<251)&~blue)
    dots=sorted(dots_of(im),key=lambda d:(d[1]//150,d[0]))
    # group rows
    rows=[]
    for d in sorted(dots,key=lambda d:d[1]):
        if rows and abs(rows[-1][0][1]-d[1])<60: rows[-1].append(d)
        else: rows.append([d])
    def text_end(cx,cy,half):
        x0=int(cx-half); x1=int(cx+half)
        rr=ink[cy:cy+500,x0:x1].sum(axis=1)>0
        y=0; last=0
        while y<len(rr):
            if rr[y]: last=y
            elif y-last>40: break
            y+=1
        return cy+last+6
    halves={}
    for row in rows:
        for cx,cy in row:
            gaps=[abs(cx-o[0]) for o in row if o[0]!=cx]
            halves[(cx,cy)]=min(min(gaps)/2 if gaps else 300,300)
    tends={d:text_end(d[0],d[1],h) for d,h in halves.items()}
    res=[]
    for ri,row in enumerate(rows):
        row.sort()
        for ci,(cx,cy) in enumerate(row):
            gaps=[abs(cx-o[0]) for o in row if o[0]!=cx]
            half=min(min(gaps)/2 if gaps else 300, 300)
            x0=int(cx-half); x1=int(cx+half)
            sr_=sink[:cy-5,x0:x1].sum(axis=1)>0
            y=cy-6; ttop=cy-6; prev_top=None
            # walk up over strict-ink text lines (height<=36, gaps<=20)
            while y>0:
                if sr_[y]:
                    e=y
                    while y>0 and sr_[y]: y-=1
                    h_=e-y
                    if (prev_top is not None and prev_top-e>20) or cy-y>135: break
                    prev_top=y+1; ttop=y+1
                else:
                    if prev_top is not None and prev_top-y>20: break
                    y-=1
                    if prev_top is None and cy-y>120: break
            ink_lim=ttop-3
            r=ink[:ink_lim,x0:x1].sum(axis=1)>0
            y=ink_lim-1; segs=[]
            while y>0 and len(segs)<8:
                if r[y]:
                    e=y
                    while y>0 and r[y]: y-=1
                    segs.append((y+1,e))
                else: y-=1
            photo=next(((a,b) for a,b in segs if b-a>=45),None)
            if not photo: res.append(dict(page=pno,row=ri,col=ci,cx=cx,cy=cy,err='nophoto')); continue
            a,b=photo
            for sa,sb in segs:
                bound=max([tends[d] for d in tends if d[1]<cy-300 and abs(d[0]-cx)<half*1.6] or [0])
                if sb<a and a-sb<=55 and b-sa<=420 and sa>bound: a=sa
            def region_cols(xa,xb):
                c=np.where(ink[a:b+1,max(xa,0):xb].sum(axis=0)>0)[0]
                return c
            xa,xb=x0,x1
            c=region_cols(xa,xb)
            if len(c) and (c.min()<=1 or c.max()>=(xb-max(xa,0))-2):
                w2=min(half*1.7,480); xa=int(cx-w2); xb=int(cx+w2)
            a0=a
            pid=f'p{pno:02d}_r{ri}_c{ci}'
            ov=OVR.get(pid,{}); dil=ov.get('dil',3)
            reg=ink[a:b+1,max(xa,0):xb]
            lab_,nl=ndi.label(ndi.binary_dilation(reg,iterations=dil))
            areas=ndi.sum(reg,lab_,range(1,nl+1)); objs_=ndi.find_objects(lab_)
            dark=(255-work[a0:a0+reg.shape[0],max(xa,0):max(xa,0)+reg.shape[1]].min(axis=2))*reg
            weights=ndi.sum(dark,lab_,range(1,nl+1))
            if ov.get('pick')=='bottom': mi=max(range(nl),key=lambda i:(objs_[i][0].stop if areas[i]>200 else -1))
            elif ov.get('pick')=='top': mi=min(range(nl),key=lambda i:(objs_[i][0].start if areas[i]>200 else 10**9))
            else: mi=int(np.argmax(areas if 'maxw' in ov else weights))
            ms=objs_[mi]
            mtop,mbot,mleft,mright=ms[0].start,ms[0].stop,ms[1].start,ms[1].stop
            keep=np.zeros_like(reg)
            if 'maxw' in ov:
                lc=np.where(reg.sum(axis=0)>0)[0].min(); reg=reg.copy(); reg[:,lc+ov['maxw']:]=False
                lab_,nl=ndi.label(ndi.binary_dilation(reg,iterations=dil)); areas=ndi.sum(reg,lab_,range(1,nl+1)); objs_=ndi.find_objects(lab_)
                mi=int(np.argmax(areas)); ms=objs_[mi]; mtop,mbot,mleft,mright=ms[0].start,ms[0].stop,ms[1].start,ms[1].stop
            for li,sl in enumerate(objs_):
                ar=areas[li]
                if li==mi: ok=True
                elif ov.get('pick') or 'maxw' in ov: ok=False
                else:
                    disjoint=sl[1].stop<mleft or sl[1].start>mright
                    topfrag=sl[0].stop<=mtop+2
                    ok=not(disjoint or (topfrag and ar<0.2*areas[mi]))
                if ok: keep|=(lab_==li+1)&reg
            rows_k=np.where(keep.sum(axis=1)>0)[0]; cols_k=np.where(keep.sum(axis=0)>0)[0]
            b=a+rows_k.max(); a=a+rows_k.min()
            px0,px1=max(xa,0)+cols_k.min(),max(xa,0)+cols_k.max()
            # whiten dropped ink inside the final bbox
            kept_mask=np.zeros(ink.shape,bool)
            kept_mask[ a0:a0+keep.shape[0], max(xa,0):max(xa,0)+keep.shape[1]] = keep
            # text block: from b+? to below dot until gap>70
            ty0=max(ttop-4,0)
            rr=ink[cy:cy+500,x0:x1].sum(axis=1)>0
            y=0; last=0; 
            while y<len(rr):
                if rr[y]: last=y
                elif y-last>40: break
                y+=1
            ty1=cy+last+6
            nb=[bd for bd in badges if x0<=bd[0]<=x1 and a-80<=bd[1]<=b]
            pid=f'p{pno:02d}_r{ri}_c{ci}'
            pad=10
            wk=work.copy()
            sub=(ink[a:b+1,max(px0-pad,0):px1+pad+1]&~kept_mask[a:b+1,max(px0-pad,0):px1+pad+1])
            wk[a:b+1,max(px0-pad,0):px1+pad+1][ndi.binary_dilation(sub,iterations=2)]=255
            ph=Image.fromarray(wk[max(a-3,0):b+4,max(px0-pad,0):px1+pad].astype('uint8'))
            ph.save(f'{outdir}/{pid}_photo.png')
            tx=Image.fromarray(im[ty0:ty1,x0:x1].astype('uint8')); tx.save(f'{outdir}/{pid}_text.png')
            res.append(dict(id=pid,page=pno,row=ri,col=ci,cx=int(cx),cy=int(cy),photo=[int(px0),int(a),int(px1),int(b)],new=bool(nb)))
    # headings: blue text components
    return res, rows

if __name__=='__main__':
    pno=int(sys.argv[1]); S=os.path.dirname(__file__)
    od=f'{S}/crops'; os.makedirs(od,exist_ok=True)
    res,_=process(f'{S}/pages/p{pno:02d}.png',od,pno)
    print(len(res),[r for r in res if 'err' in r])
    json.dump(res,open(f'{od}/p{pno:02d}.json','w'))
