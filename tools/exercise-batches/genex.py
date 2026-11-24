# python3 genex.py ex.py defs.js tr-NN.js vNNN — adds a batch of exercises (texts in 7 languages + animations block) to the repo
import json,re,sys,os
exf,defsf,trname,ver=sys.argv[1:5]; S=os.path.dirname(os.path.abspath(__file__)); R='/home/user/fitness-app/'
exec(open(exf).read())
GD=json.load(open(S+'/guides.json')) if os.path.exists(S+'/guides.json') else {'G':{},'M':{}}
for e in EX:
  b=e.get('base')
  if not b: continue
  g=GD['G'][b]
  for k in ['feel','setup','breathe','easier','harder']: e.setdefault(k,g[k])
  e.setdefault('steps',list(g['steps'])); e.setdefault('mistakes',list(g['mistakes'])); e.setdefault('tags',g.get('tags',[])); e.setdefault('mus',GD['M'].get(b,['Core']))
  if e.get('steps_add'): e['steps']=[e['steps_add']]+e['steps'][:3]

D=json.load(open(S+'/dict.json')); K=D['keys']; Kset=set(K); L=['uk','es','de','fr','pt','pl']
def tr(s,l): x=T.get(s); return (x and x[L.index(l)]) or D[l].get(s)
strs=[]
for e in EX:
  for k in ['name','cue','feel','setup','breathe','easier','harder']: strs.append(e[k])
  strs+=e['steps']+e['mistakes']
assert not [(l,s) for s in strs for l in L if not tr(s,l)], 'missing translations'
new=[s for s in dict.fromkeys(strs) if s not in Kset]; idx={s:len(K)+i for i,s in enumerate(new)}; J=lambda x: json.dumps(x,ensure_ascii=False)
k=open(R+'i18n/keys.js').read(); lines=k.split('\n'); i=[n for n,l in enumerate(lines) if l.startswith('const I18N_KEYS = [')][0]
assert lines[i].endswith('];'); lines[i]=lines[i][:-2]+', '+', '.join(J(s) for s in new)+'];'; open(R+'i18n/keys.js','w').write('\n'.join(lines))
out='// %s: new exercises — names, cues and directions\n'%ver
for l in L[1:]: out+='I18N_FILL("%s", {\n'%l+',\n'.join('%d:%s'%(idx[s],J(tr(s,l))) for s in new)+'\n});\n'
open(R+'i18n/'+trname,'w').write(out)
def ap(f,pairs):
  t_=open(R+'i18n/'+f).read(); i=t_.rstrip().rfind('}'); head=t_[:i].rstrip()
  if not head.endswith(','): head+=','
  open(R+'i18n/'+f,'w').write(head+'\n'+',\n'.join('  %s: %s'%(J(a),J(b)) for a,b in pairs)+'\n'+t_[i:])
ap('uk-names.js',[(e['name'],tr(e['name'],'uk')) for e in EX]); ap('uk-cues.js',[(e['cue'],tr(e['cue'],'uk')) for e in EX])
g=open(R+'i18n/uk-guides3.js').read(); i=g.rstrip().rfind('});'); head=g[:i].rstrip()
if not head.endswith(','): head+=','
u=lambda s: tr(s,'uk')
ent=['%s: [%s, %s,\n [%s],\n %s, [%s], %s, %s]'%(e['gid'],J(u(e['feel'])),J(u(e['setup'])),', '.join(J(u(s)) for s in e['steps']),J(u(e['breathe'])),', '.join(J(u(s)) for s in e['mistakes']),J(u(e['easier'])),J(u(e['harder']))) for e in EX]
open(R+'i18n/uk-guides3.js','w').write(head+'\n'+',\n'.join(ent)+'\n'+g[i:])
defs=open(defsf).read(); pre,body=defs.split('module.exports = {',1); body=body.rsplit('};',1)[0]
blk='\n// %s: new exercises with their own animations (built from checked poses), directions and muscles; they show "New" until checked\n{\n'%ver+pre+'  Object.assign(ANIMS, {'+body+'  });\n}\n'
blk+='Object.assign(TECH, {\n'+',\n'.join('  %s: { ...TECH.%s }'%(e['id'],e['tech']) for e in EX if e.get('tech'))+'\n});\n'
blk+='Object.assign(GUIDES, {\n'+',\n'.join('  %s: G(%s, %s,\n    [%s],\n    %s, [%s], %s, %s, %s)'%(e['gid'],J(e['feel']),J(e['setup']),', '.join(J(s) for s in e['steps']),J(e['breathe']),', '.join(J(s) for s in e['mistakes']),J(e['easier']),J(e['harder']),J(e['tags'])) for e in EX)+'\n});\n'
blk+='Object.assign(GUIDE_MUSCLES, { '+', '.join('%s: %s'%(e['gid'],J(e['mus'])) for e in EX)+' });\n'
blk+='EX_MAP.unshift('+', '.join('[/%s/, "%s", "%s"]'%(e['rx'],e['gid'],e['id']) for e in EX)+');\n'
blk+='LIB_NEW.push(\n'+',\n'.join('  [%s, "%s", %s]'%(J(e['name']),e['type'],J(e['cue'])) for e in EX)+');\n'
h=open(R+'liftbook.html').read(); a=h.index('LIB_NEW.push(\n'); e2=h.index(');\n',h.rindex('LIB_NEW.push(\n'))+3
h=h[:e2]+blk+h[e2:]; open(R+'liftbook.html','w').write(h)
print('new keys',len(new),'from',len(K))
