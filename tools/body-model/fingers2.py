import numpy as np, json
P=np.fromfile('upos.f32',dtype=np.float32).reshape(-1,3); C=np.fromfile('ucomp.i32',dtype=np.int32)
V=P[C==17767]; W,d,w,n=np.load('hand_frame.npy')
h=V[(np.linalg.norm(V-W,axis=1)<30)&(V[:,0]>47)&(V[:,1]<115)]
q=np.stack([(h-W)@d,(h-W)@w,(h-W)@n],1); q=q[q[:,1]>-7.5]
cent={0:[-3.08,7.35],1:[0.57,6.42],2:[5.28,4.39],3:[7.86,-1.42]}
names=['Index','Middle','Ring','Pinky']; mcp_d=[15.0,15.3,14.6,13.4]
axes={i:{18.0:np.array(c)} for i,c in cent.items()}
def kmeans(X,c):
  c=np.array(c,float)
  for _ in range(25):
    lab=np.argmin(((X[:,None,:]-c[None])**2).sum(2),1)
    c=np.array([X[lab==k].mean(0) if (lab==k).sum() else c[k] for k in range(len(c))])
  return c,np.bincount(lab,minlength=len(c))
def sweep(ds):
  act=list(range(4)); cur={i:np.array(cent[i]) for i in range(4)}; out={i:{} for i in range(4)}
  for dd in ds:
    s=q[(q[:,0]>=dd-.5)&(q[:,0]<dd+.5)][:,1:]
    if len(s)<4 or not act: break
    c,cnt=kmeans(s,[cur[i] for i in act])
    keep=[]
    for k,i in enumerate(act):
      if cnt[k]>=5 and np.linalg.norm(c[k]-cur[i])<2.5: cur[i]=c[k]; out[i][dd]=c[k]; keep.append(i)
    act=keep
  return out
UP=sweep(np.arange(18.5,31,0.5)); DOWN=sweep(np.arange(17.5,13,-0.5))
def track(i,ds): return UP[i] if ds[0]>18 else {k:v for k,v in DOWN[i].items() if k>=mcp_d[i]}
res={}
for i,nm in enumerate(names):
  up=track(i,np.arange(18.5,30,0.5)); down=track(i,np.arange(17.5,mcp_d[i]-0.01,-0.5))
  allp=sorted({**down,18.0:np.array(cent[i]),**up}.items())
  ds=np.array([a for a,_ in allp]); cs=np.array([c for _,c in allp])
  tip_d=ds.max()+0.8; mcp=np.array([mcp_d[i],*cs[0]])
  poly=np.column_stack([ds,cs]); poly=np.vstack([mcp,poly,[tip_d,*cs[-1]]])
  seg=np.linalg.norm(np.diff(poly,axis=0),axis=1); cum=np.concatenate([[0],np.cumsum(seg)]); L=cum[-1]
  at=lambda f: np.array([np.interp(f*L,cum,poly[:,k]) for k in range(3)])
  res[nm]=[at(0),at(.47),at(.76),at(1.0)]
  print(nm,'len',round(L,1),[p.round(1).tolist() for p in res[nm]])
res['Thumb']=[np.array(x,float) for x in [[1,-5.5,2.5],[8,-9,0.6],[13.5,-10.6,-0.8],[18.6,-11.3,-1.1]]]
toW=lambda p: (W+d*p[0]+w*p[1]+n*p[2]).tolist()
json.dump({'frame':{'W':W.tolist(),'d':d.tolist(),'w':w.tolist(),'n':n.tolist()},
 'joints':{f'LeftHand{k}{j+1}':toW(p) for k,v in res.items() for j,p in enumerate(v)},'grip':toW([12.5,0.5,-0.5])},open('fingers.json','w'),indent=1)
