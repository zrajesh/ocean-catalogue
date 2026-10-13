import numpy as np, sys
from PIL import Image
from scipy import ndimage as ndi
def dots_of(im):
    R,G,B=im[...,0],im[...,1],im[...,2]
    m=(R>225)&(G>100)&(G<170)&(B<90)
    lab,n=ndi.label(m); out=[]
    for i,s in enumerate(ndi.find_objects(lab)):
        h=s[0].stop-s[0].start;w=s[1].stop-s[1].start;a=(lab[s]==i+1).sum()
        if 8<=h<=30 and 8<=w<=30 and abs(h-w)<=4 and a>0.6*h*w: out.append(((s[1].start+s[1].stop)//2,(s[0].start+s[0].stop)//2))
    return out
if __name__=='__main__':
    p=sys.argv[1]
    im=np.array(Image.open(p).convert('RGB')).astype(int)
    dots=sorted(dots_of(im),key=lambda d:(d[1]//150,d[0]))
    ink=(im.min(axis=2)<235)
    for cx,cy in dots[:9]:
        x0,x1=cx-120,cx+120
        rows=ink[:cy-5,x0:x1].sum(axis=1)>0
        segs=[];y=cy-6
        while y>0:
            if rows[y]:
                e=y
                while y>0 and rows[y]: y-=1
                segs.append((y+1,e))
            else: y-=1
            if len(segs)>=6: break
        print((cx,cy),[(a,b,b-a) for a,b in segs])
