---
id: draupnir-signers
title: "Draupnir — IOBS SOAP-undirritarar"
sidebar_label: "Draupnir-undirritarar"
sidebar_position: 2
description: "Hvernig Bifröst fjárstýring undirritar beiðnir til bankanna og hvað kerfisstjóri setur upp fyrir það: biðlaraskilríkið og lykilorð þess."
---

Þessi síða er fyrir kerfisstjóra Business Central sem tengir fyrirtækið við bankana. Hún útskýrir
hvað Draupnir gerir og það eina sem þú þarft að leggja til: biðlaraskilríki bankans.

## Hvað undirritari er

Landsbankinn, Arion banki, Kvika banki og Sparisjóðirnir krefjast þess að hver beiðni sé undirrituð
rafrænt með skilríki sem bankinn gaf út til fyrirtækisins. Það er hluti af íslenska
netbankastaðlinum (IOBS, *Sambankaskema*), og hver banki gerir ráð fyrir sínu afbrigði
undirritunarinnar.

**Draupnir** er sá hluti Bifröst fjárstýringar sem sér um undirritunina. Hann veit hvaða afbrigði hver
banki notar, undirritar hverja beiðni áður en hún fer út úr Business Central og, þar sem bankinn
krefst þess, dulkóðar beiðnina og afkóðar svarið. Þú velur aldrei afbrigði sjálfur: tengingin velur
rétt afbrigði fyrir hvern banka og hverja þjónustu.

Íslandsbanki undirritar ekkert. Hann auðkennir með notandanafni og lykilorði yfir dulkóðaða tengingu
og þarf því ekkert biðlaraskilríki.

Ef ekki er hægt að undirrita beiðni (ekkert skilríki, rangt lykilorð skilríkis, útrunnið skilríki) er
ekkert sent til bankans. Kallið er skráð í beiðnaskrá Bifrastar og svarar með villu sem segir hvað er
að.

## Settu skilríkið upp

Biðlaraskilríkið er PKCS#12-skrá (`.pfx`) með lykilorði, gefin út af bankanum.

1. Fáðu skilríkið og lykilorð þess hjá bankanum, sem hluta af samningi um þær þjónustur sem þú notar.
2. Opnaðu **Uppsetning Bifröst Ísland Fjárstýringar** (eða keyrðu leiðsögnina úr Leiðsögn við
   uppsetningu) og veldu línu bankans.
3. Veldu **Skrá skírteini**, hladdu `.pfx`-skránni upp og sláðu inn lykilorðið. Skilríkið er prófað
   gegn lykilorðinu áður en hvort tveggja er geymt, svo innsláttarvilla finnst strax.
4. Gakktu úr skugga um að dálkurinn **Leyndarmál** sýni **Fullskráð** fyrir bankann.

Skilríkið og lykilorð þess eru geymd í dulkóðaðri geymslu forritsins. Þau eru aldrei skrifuð í töflu,
skrá eða villuboð og aldrei sýnd aftur. Sjá [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/)
og [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/).

Eigið skilríki bankans, sem sumar þjónustur nota til dulkóðunar, er sótt sjálfkrafa. Ekkert þarf að
skrá, nema fyrir Íslandsbanka, en skilríki hans er hlaðið upp með **Skrá skírteini banka**.

## Haltu því gildu

Upplýsingaglugginn á uppsetningarsíðunni sýnir skilríki valins banka: viðfang, útgefanda, fingrafar og
gildistíma. Lokadagsetningin verður gul þegar hún nálgast og rauð þegar hún er liðin. Endurnýjaðu
skilríkið hjá bankanum áður en það rennur út og hladdu því nýja upp með **Skrá skírteini**; bankinn
hafnar beiðnum sem eru undirritaðar með útrunnu skilríki.

Skilríki eru geymd fyrir hvert fyrirtæki. Þau flytjast ekki frá eldri Cloud Events bankaforritunum:
hladdu þeim upp einu sinni eftir uppsetningu Bifröst fjárstýringar.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Landsbankinn](../banks/landsbankinn.md) · [Arion banki](../banks/arion.md) ·
  [Kvika banki](../banks/kvika.md) · [Sparisjóðir](../banks/sparisjodir.md)
