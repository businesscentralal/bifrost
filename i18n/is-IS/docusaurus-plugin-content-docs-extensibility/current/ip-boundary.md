---
id: ip-boundary
title: "Hugverkamörk opinbera vefsins"
sidebar_label: "Hugverkamörk opinbera vefsins"
sidebar_position: 10
description: "Hvað má birtast á opinbera Bifröst-skjölunarvefnum og hvað verður að halda utan hans."
---

# Hugverkamörk opinbera vefsins

Opinberi vefurinn í [`businesscentralal/bifrost`](https://github.com/businesscentralal/bifrost)
birtir **aðeins opinberar upplýsingar**. Hegðun leyfisveitinga gagnvart viðskiptavinum á heima hér
þegar hún er hluti af samningnum sem kallendur og stjórnendur reiða sig á. Innri útfærsluatriði eiga
það ekki.

Þessi síða er sameiginleg vinnuregla sem verkefnið getur þróað áfram. Staðfestar ákvarðanir
verkefnisins (2026-09-16) eru rétthærri en eldri texti ef þeim ber ekki saman.

## Alltaf heimilt

- Hegðun vörunnar gagnvart viðskiptavinum: kvótapottar, hvað telst með, birt stærð prufukvóta,
  takmarkanir sandkassa / MCP sem þegar eru opinber vörulýsing og ferli leyfisbeiðna.
- Opinberir samningar skilaboðategunda: lögun beiðna og svara sem kallendur sjá, þar á meðal
  leyfisstöðureitir `Help.Bifrost.Get` á borð við `blockOnMissingQuota`.
- Villusvör vegna uppurinns kvóta og aðrar skráðar opinberar API-villur (án þess að nefna
  undirliggjandi gagnageymslur í sýnidæmum).

Leyfishegðun sem kallendur og stjórnendur reiða sig á er **opinber samningur**. Skjalaðu hana
á yfirliti [Leyfisveitinga](/foundation/reference/licensing/) og á lifandi skilaboðategundasíðum
á borð við `Help.Bifrost.Get` — ekki sem leiðsögn um innviði leyfisveitinga. Ekki finna upp
úreltar `Help.License.*` skilaboðategundasíður.

## Aldrei birta á þessum vef

| Bannað | Ástæða |
|--------|--------|
| Nöfn leyndarmála og forskeyti þeirra í raunhæfum dæmum | Kennir hvernig finna eða falsa má aðgangsupplýsingar |
| Vöruheiti leyndarmálageymslna í skýi eða vélarheiti þeirra | Innviðaupplýsingar, ekki samningur við viðskiptavin |
| Vöruheiti gagnageymslna sem standa að baki leyfisveitingum | Útfærsluatriði, ekki opinbert API |
| Lögun aðgangslykla, hlutar tengistrengja og auðkenni reikninga / gagnagrunna / gáma | Efni sem varðar aðgangsupplýsingar |
| `TODO`-merkingar og ókláraðar innri hönnunarglósur | Ekki ætlað viðskiptavinum |
| Innri nöfn codeunit-eininga sem eru aðeins til að útfæra geymslu eða samstillingu leyfa | Ekki hluti af opinbera samningnum |

Keyrðu `npm run check:ip-boundary` áður en þú opnar skjölunar-PR. Athugunin
(`tools/check-docs.mjs` í `ipBoundary`-ham) leitar í `docs/` og `help/` (og samsvarandi
`i18n/`-speglum) að föstum lista bannaðra hugtaka. Þessi reglusiða er undanskilin leitinni svo
hún geti lýst reglunni án þess að falla sjálf.

## Enn óákveðið — ekki finna upp svör

Þar til ákvarðanir verkefnisins loka þessum atriðum má **ekki** fylla í eyðurnar með ágiskunum:

- Full skipting í A/B/C-þrep (Q1)
- Hvort birting Application Insights / slóðar leyndarmálageymslu í `app.json` sé óhjákvæmileg og
  hvernig eigi að skjala hana (Q4)
- Nákvæmar opinberar tryggingar um stærð umlíðunar, áframhald við bilun og sýnileika Tengingarstöðu
  (§4, lína 7)

Notaðu **samningsöruggt** orðalag um umlíðun / áframhald við bilun / Tengingarstöðu. Ef minnast
verður á umlíðun skal aðeins segja að lítil umlíðun geti verið til staðar og að kvótapottum sem
séu uppurnir sé hafnað með skráðu villunni. Ekki birta nákvæma stærð umlíðunar, töflur yfir
geymslulykla eða innri nöfn samstillingareininga fyrr en §4, lína 7 hefur verið staðfest.

## Hvernig skrifa á leyfissamningsskjöl

1. Notaðu frekar yfirlit [Leyfisveitinga](/foundation/reference/licensing/) og lifandi tegundir á borð
   við `Help.Bifrost.Get`. Ekki endurgera úreltar `Help.License.*` skilaboðategundasíður.
2. Lýstu því sem kallandinn sendir og því sem kallandinn fær til baka.
3. Segðu „leyfisþjónusta“ þegar nafnorð þarf um ytri þjónustuna — aldrei vöruheiti gagnageymslu.
4. Um leyndarmál í eigin uppsetningu: taktu fram að Origo afhendi gildin með leyfi fyrir eigin
   uppsetningu; ekki líma inn raunhæf heiti reikninga, lykla eða auðkenni gagnagrunna.
5. Haltu `blockOnMissingQuota` og öðrum reitum sem birtast í opinbera JSON-svarinu; ekki útskýra
   hvernig eða hvar flöggin eru geymd.

## Tengt efni

- [Hjálpar-codeunit](/extensibility/help-codeunits) — Markdown-samningur sem fylgir hverri tegund
- [Leyfisveitingar](/foundation/reference/licensing/) — opinbert leyfislíkan
- [Opinbert yfirborð grunnsins](/extensibility/public-surface) — það sem háð forrit mega reiða sig á
