---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 4
description: "Hvað Bifröst fjárstýring gerir með Kviku banka: kröfur og kröfubunkar, greiðslubunkar, reikningsyfirlit og gengi."
---

Þessi síða er fyrir fjármálasvið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Kviku banka. Hún útskýrir hvað Kvikutengingin í [Bifröst fjárstýringu](/iceland-treasury/) gerir,
hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað hún gerir fyrir þig

- **Leit að kröfum.** Leitaðu að kröfum eftir kröfuhafa, tímabili, greiðanda og stöðu, eða flettu
  einni kröfu upp. Tímabilið getur miðast við gjalddaga, eindaga, niðurfellingardag eða stofndag.
- **Stofnun, breyting og niðurfelling krafna í bunkum.** Kvika tekur aðeins við kröfubreytingum í
  bunkum. Bankinn staðfestir bunkann strax og skilar niðurstöðunni á eftir, svo ekkert bíður eftir
  bankanum.
- **Greiðslur krafna.** Sjáðu greiðslur sem borist hafa inn á kröfurnar þínar.
- **Greiðslur.** Sendu bunka millifærslna og kröfugreiðslna, með framvirkum greiðsludegi ef þú vilt,
  og veldu hvort allur bunkinn sé bakfærður ef ein lína mistekst. Sæktu niðurstöðuna á eftir: stöðuna,
  aðeins villurnar, aðeins línurnar sem tókust, eða allt.
- **Yfirlit.** Lestu reikningsyfirlit fyrir hvaða reikning og tímabil sem er.
- **Gengi.** Birt gengi Kviku.

Þú, tímasett ferli eða gervigreindaraðstoðarmaður getið beðið um hvað sem er af þessu. Uppsettar
skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Hvað þú setur upp

1. **Samning við Kviku banka** um þær þjónustur sem þú notar, með B2B-notandanafni, lykilorði og
   undirritunarskilríki (`.pfx`-skrá, með lykilorði ef hún hefur það).
2. **Línu Kviku á Uppsetning Bifröst Ísland Fjárstýringar**: hafðu hana virka, skráðu notandanafn
   fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og **Skrá skírteini**. Sjá
   [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/) og
   [Draupnir-undirritara](../reference/draupnir-signers.md).
3. **Eigin aðgang notenda, ef þeir hafa sinn eigin aðgang hjá bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð í **notandastillingum Bifrastar**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/). Eigið notandanafn án eigin
   lykilorðs er stöðvað með skýrri villu og aldrei sent með lykilorði fyrirtækisins.
4. **Heimildir.** Úthlutaðu heimildasettunum hér að neðan.

| Aðgangsupplýsingar | Geymdar fyrir | Athugasemdir |
| --- | --- | --- |
| Lykilorð fyrirtækis | Fyrirtækið | Notað þegar notandinn hefur engan eigin aðgang. |
| Lykilorð notanda | Hvern notanda | Notað með eigin notandanafni hans. |
| Undirritunarskilríki og lykilorð þess | Fyrirtækið | Undirritar hverja beiðni. Skildu lykilorðið eftir autt ef skilríkið hefur ekkert. |

Öll gildi eru slegin inn í huldum gluggum og aldrei sýnd aftur; sjá
[Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).

## Hvað þú sérð í Business Central

- Lína Kviku á **Uppsetning Bifröst Ísland Fjárstýringar** sýnir hvort öll leyndarmál séu skráð, og
  skírteinisglugginn sýnir hvenær skilríkið rennur út.
- Hvert kall til bankans er skráð í **beiðnaskrá Bifrastar**, með lykilorðið hulið.

## Heimildasett

Hver aðgerð Kviku krefst eins af þremur heimildasettum, svo veita má lestur yfirlita án
greiðsluheimilda.

| Heimildasett | Veitir |
| --- | --- |
| `BIFROST KVClmPmt ori` | Leit að kröfum, kröfubunka og niðurstöður þeirra, og greiðslur krafna |
| `BIFROST KVPaymt ori` | Greiðslubunka og niðurstöður þeirra |
| `BIFROST KVStmt ori` | Yfirlit og gengi |

`BIFROST KVFull ori` víkkar `BIFROST Full ori` í Foundation: það er settið á bak við fullan aðgang að
Kvikutengingunni.

## Að færa sig frá Cloud Events Kvika banki

Settu Bifröst fjárstýringu upp við hlið gamla forritsins. Við fyrstu uppsetningu tekur hún yfir
stillingar Kviku (hvort tengingin er virk og notandanafn fyrirtækisins), Kvikureitina á stöðluðum
færslum Business Central og úthlutanir heimildasetta til notenda, og síðan má fjarlægja gamla
forritið. Gögnum sem þegar eru í nýja forritinu er aldrei skrifað yfir.

**Lykilorð og undirritunarskilríki flytjast ekki.** Skráðu þau einu sinni eftir skiptin.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Draupnir-undirritarar](../reference/draupnir-signers.md): undirritunarskilríkið
- [Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/)
