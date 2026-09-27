---
id: ip-boundary
title: "Hugverkamörk opinbera vefsins"
sidebar_label: "Hugverkamörk opinbera vefsins"
sidebar_position: 10
description: "Hvað má birtast á opinbera Bifröst-skjölunarvefnum og hvað verður að halda utan hans."
---

# Hugverkamörk opinbera vefsins

Opinberi vefurinn í [`businesscentralal/bifrost`](https://github.com/businesscentralal/bifrost)
birtir **aðeins opinberar upplýsingar**. Bifröst er smíðuð til að byggja ofan á hana, svo samningurinn
sem samstarfsaðilar byggja á er opinber og á heima hér í heild. Það sem helst utan vefsins er hvernig
Origo rekur og útfærir vöruna.

## Opinbert: skjalaðu það til fulls

- **Skilaboðategundir.** Heiti, lýsingar, hjálparskjöl, lögun beiðna og svara og villusvör, þar á
  meðal leyfisstöðureitir `Help.Bifrost.Get` á borð við `blockOnMissingQuota`.
- **Viðbótaryfirborðið.** Allt sem samstarfsaðili notar til að smíða háð forrit: enum og viðmót
  skilaboðategunda, skilaboðafærsluna, dreifarann, skráningu forrita, API leyndarmálageymslunnar,
  opinberu atburðina og mynstrin sem sýnd eru í tilvísunarsafninu (aðskilin útfærslu-, einangrunar-
  og hjálparhlutir; einangruð skrif með `Codeunit.Run`; útgáfu- og leyfisvarnir; skráning).
- **Hegðun gagnvart viðskiptavinum.** Kvótapottar, hvað telst með, birta prufuleyfið (1.000
  notendaskilaboð + 1.000 forritsskráningarskilaboð), vikmörkin (100 skilaboð), þrep álagsþaks og
  dagleg takmörk þeirra, ferli leyfisbeiðna og að köll keyri á meðan eftirstöðvar kvótans eru enn
  óþekktar.
- **Skráðar API-villur,** þar á meðal villusvör vegna uppurins kvóta, án þess að nefna
  undirliggjandi gagnageymslur í sýnidæmum.

Leyfishegðun sem kallendur og stjórnendur reiða sig á er opinber samningur. Skjalaðu hana á yfirliti
[Leyfisveitinga](/foundation/reference/licensing/) og á lifandi skilaboðategundasíðum á borð við
`Help.Bifrost.Get`, ekki sem leiðsögn um innviði leyfisveitinga.

## Aldrei birta á þessum vef

| Bannað | Ástæða |
|--------|--------|
| Nöfn leyndarmála og forskeyti þeirra í raunhæfum dæmum | Kennir hvernig finna eða falsa má aðgangsupplýsingar |
| Vöruheiti leyndarmálageymslna í skýi eða vélarheiti þeirra | Innviðaupplýsingar, ekki samningur við viðskiptavin |
| Vöruheiti gagnageymslna sem standa að baki leyfisveitingum | Útfærsluatriði, ekki opinbert API |
| Lögun aðgangslykla, hlutar tengistrengja og auðkenni reikninga / gagnagrunna / gáma | Efni sem varðar aðgangsupplýsingar |
| Vélarheiti, slóðir og auðkenni leigjenda og fyrirtækja í eigin umhverfum Origo | Vísar á lifandi kerfi |
| Innri hlutaheiti Origo (til dæmis `… Impl ori`, `… Handler ori`) og innri codeunit-einingar sem útfæra geymslu eða samstillingu leyfa | Útfærsla, ekki hluti af opinbera samningnum. Samstarfsaðilar læra mynstrið af tilvísunarsafninu, með eigin heitum |
| Innra verklag Origo: sameiginleg vinnuskjöl, sameiginlegir gámar, fjarmælingaauðlindir, innri gagnasöfn, ákvarðanir verkefnisins | Ekki ætlað viðskiptavinum |
| `TODO`-merkingar og ókláraðar innri hönnunarglósur | Ekki ætlað viðskiptavinum |

Síðurnar **Tengingastaða** og **Leyndarmál í eigin umhverfi** eru áfram utan vefsins: þær nefna
leyndarmálageymsluna og bakgeymsluna.

Slóðir umhverfa og aðgangsupplýsingar fara heldur aldrei í `tools/` eða `.github/`. Skriftur lesa þær
úr umhverfisbreytum og leyndarmálum gagnasafnsins.

## Að yfirfara breytingu

Keyrðu `npm run check:ip-boundary` áður en þú opnar skjölunar-PR. Athugunin
(`tools/check-docs.mjs` í `ipBoundary`-ham) leitar í `docs/` og `help/` (og samsvarandi
`i18n/`-speglum) að föstum lista bannaðra hugtaka. Þessi reglusíða er undanskilin leitinni svo hún
geti lýst reglunni án þess að falla sjálf. Athugunin leitar ekki í `tools/` eða `.github/`, svo farðu
yfir þær möppur handvirkt.

## Hvernig skrifa á leyfissamningsskjöl

1. Notaðu frekar yfirlit [Leyfisveitinga](/foundation/reference/licensing/) og lifandi tegundir á borð
   við `Help.Bifrost.Get`. Ekki endurgera úreltar `Help.License.*` skilaboðategundasíður.
2. Lýstu því sem kallandinn sendir og því sem kallandinn fær til baka.
3. Segðu „leyfisþjónusta“ þegar nafnorð þarf um ytri þjónustuna, aldrei vöruheiti gagnageymslu.
4. Um leyndarmál í eigin uppsetningu: taktu fram að Origo afhendi gildin með leyfi fyrir eigin
   uppsetningu; ekki líma inn raunhæf heiti reikninga, lykla eða auðkenni gagnagrunna.
5. Haltu `blockOnMissingQuota` og öðrum reitum sem birtast í opinbera JSON-svarinu; ekki útskýra
   hvernig eða hvar flöggin eru geymd.

## Tengt efni

- [Hjálpar-codeunit](/extensibility/help-codeunits) — Markdown-samningur sem fylgir hverri tegund
- [Leyfisveitingar](/foundation/reference/licensing/) — opinbert leyfislíkan
- [Opinbert yfirborð grunnsins](/extensibility/public-surface) — það sem háð forrit mega reiða sig á
