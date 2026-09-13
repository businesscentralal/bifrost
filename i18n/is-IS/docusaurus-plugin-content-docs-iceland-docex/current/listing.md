---
id: listing
title: "Skráning í Partner Center"
sidebar_label: "Skráning"
sidebar_position: 9
description: "Texti fyrir skráningu viðbótarinnar á markaðstorginu: heiti, samantekt, flokkar og heildarlýsing."
---

## Samantekt í leitarniðurstöðu (hámark 50 stafir)
Viðbót fyrir rafræna reikninga í Business Central með Peppol, Advania og Unimaze.

## Samantekt tilboðs
Rafrænir reikningar og skjalaskipti í gegnum Peppol, Advania, Unimaze og InExchange.

## Lýsing
Heildarlýsingin er [hér að neðan](#heildarlýsing).

## Leitarorð
- rafrænir reikningar
- Peppol
- skjalaskipti
- rafrænn reikningur
- UBL
- Advania
- Unimaze
- InExchange

## Flokkar
- **Aðalflokkur:** Operations > Supply Chain
- **Aukaflokkur:** Finance > Tax/Audit

## Atvinnugreinar
- Fagþjónusta
- Smásala
- Dreifing
- Framleiðsla

## Studd lönd
- IS (Ísland)
- SE (Svíþjóð)
- NO (Noregur)
- DK (Danmörk)
- FI (Finnland)

## Studd tungumál
- en-US (enska)
- is-IS (íslenska)

## Útgáfa viðbótar
28.0.0.0

## Stuðningur
- **Vefslóð:** https://www.origo.is/
- **Netfang:** bc-support@origo.is
- **Hjálparslóð:** https://bifrost.origo.is/en-us/iceland-docex/

## Persónuverndarstefna
https://www.origo.is/

## Endanotendaleyfissamningur
Staðlaður Microsoft AppSource EULA gildir.

## Skjámyndir
1. Bifröst uppsetning með skjalaskiptaþjónustum stilltum.
2. Biðraðarviðmót sem sýnir sendingu skjalaskiptaskilaboða.
3. UBL-reiknings-XML úr RenderBilling-aðgerðinni.

---

## Heildarlýsing

### Tengdu Business Central við leiðandi skjalaskiptanet

**Bifröst Iceland DocEx** bætir rafrænum skjalaskiptum við Business Central í gegnum Bifröst — skilaboðadrifið samþættingarlag fyrir skipulagðan aðgang að gögnum og ferlum Business Central í gegnum OData. Sendu og móttaktu rafræna reikninga, pantanir og önnur viðskiptaskjöl frá mörgum þjónustuaðilum án sérsmíðaðra tenginga eða handvirkrar skráameðhöndlunar.

Byggt á **Bifröst Foundation** bætir forritið skjalaskiptum við sem skilaboðategundum sem MCP-biðlari, REST-sendi eða BC-ferli getur kallað í gegnum sama biðröð → verk → gögn-mynstur og aðrir hlutar Bifrastar.

### Fyrir hvern er þetta?

**Fjármála- og upplýsingatækniteymi** sem senda eða taka á móti rafrænum reikningum og þurfa að tengja Business Central við skjalaskiptanet. Viðbótin minnkar handvirka skráavinnslu, rekur allan líftíma skjala og styður Peppol BIS 3.0.

### Studdir þjónustuaðilar

**Advania** — senda, taka á móti og fylgjast með rafrænum reikningum og skjölum, þar á meðal innhólf, stöðusamstilling, viðskiptafélagar, PDF-skjöl, OCR og XML-umbreyting.

**Unimaze** — senda og taka á móti skjölum með fullri líftímastjórnun, sendingu færslna, greiðsluskráningu, höfnun og sannprófun.

**InExchange** — sækja innkomandi skjöl, senda reikninga út, fylgjast með afhendingu og fletta upp viðskiptafélögum.

**BIS 3.0 viðmiðunargögn** — innbyggð Peppol BIS 3.0 gögn fyrir lönd, gjaldmiðla, skjalategundir, rafræn auðkenniskerfi, einingar og VSK-kóða án ytri skilríkja.

**UBL-myndun** — mynda staðlað UBL 2.1 XML beint úr Business Central-skjölum fyrir reikninga, kreditreikninga, pantanir, afhendingartilkynningar og yfirlit.

### Lykilgetu

- **Margir þjónustuaðilar** — notaðu einn eða fleiri eftir þörfum viðskiptafélaga.
- **Sameinað viðmót** — allir þjónustuaðilar nota sama Bifröst-skilaboðamynstur.
- **Peppol-samræmi** — UBL-myndun og BIS 3.0 viðmiðunargögn styðja staðlaða útgáfu skjala.
- **Allur líftími skjala** — taka á móti, senda, fylgjast með stöðu, sækja PDF og stjórna viðskiptafélögum.
- **Stækkanlegt** — bæta má sérsniðnum þjónustuaðilum og skilaboðategundum við með AL-viðbótum.

### Hvernig það virkar

Ytri kerfi eða BC-ferli senda skilaboð í Bifröst-biðraðarviðmótið með þjónustuaðila og aðgerð, til dæmis `DocumentExchange.Advania.GetUnread`. Kerfið sendir skilaboðin til rétta meðhöndlara, keyrir aðgerðina og skilar niðurstöðu í gegnum gagnaviðmótið.

### Kröfur og forsendur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra (Essentials eða Premium)
- Bifröst Foundation (fáanlegt sér á AppSource)
- Aðgangsupplýsingar frá að minnsta kosti einum studdum þjónustuaðila
- BIS 3.0 gögn og UBL-myndun þurfa engar ytri aðgangsupplýsingar