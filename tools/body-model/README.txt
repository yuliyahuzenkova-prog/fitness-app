Realistic:  RSM=6 CLR=8 CLE=.75 SR=20 SITER=70 node build.mjs 17767 5199,6273            -> body.bin.gz.b64 (BODY_DATA)
Chrome:     RSM=8 CLR=8 CLE=.75 MANQ=1 OUT=manq.bin.gz.b64 SR=20 SITER=70 node build.mjs 17767 5199,6273   (MANQ_DATA)
Needs upos.f32/uidx.u32/ucomp.i32 (dump.mjs + comp.mjs from the Cena GLB), joints.json, fingers.json, xbot.bin.gz.b64.
Builds now use PIT=.85 (armpit weights)
Chrome (muscular): add MUSC=1 to the Chrome build
Chrome woman: FEM=1 MANQ=1 PIT=.85 RSM=4 CLR=8 CLE=.75 SR=20 SITER=70 OUT=fem.bin.gz.b64 node build.mjs 17767 5199,6273   (FEM_DATA)
  The same mesh and skeleton reshaped: narrower waist and upper chest, fuller hips, breasts, smoothed face and crotch.
Underwear is not in the data: the app marks it on the subdivided mesh at load time (proWear in liftbook.html).
(WEAR=1 still exists in build.mjs as an older, coarser way to bake the mask; not used.)
