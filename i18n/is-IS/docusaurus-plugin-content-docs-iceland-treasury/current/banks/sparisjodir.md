---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "Hvað Bifröst fjárstýring gerir með sparisjóðunum: yfirlit, kröfur og kröfubunkar, greiðslur, reikningar, greiðsluseðlar, kreditkort, gengi og innflutningur yfirlita."
---

Þessi síða er fyrir fjármálasvið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við einn af íslensku sparisjóðunum. Hún útskýrir hvað Sparisjóðatengingin í
[Bifröst fjárstýringu](/iceland-treasury/) gerir, hvað þú setur upp og hvað þú sérð í Business
Central á eftir.

Sparisjóðirnir bjóða sömu þjónustur, hver frá sínu vistfangi. Fyrirtæki í Business Central vinnur með
einum sparisjóði, sem er valinn með innflutningssniði yfirlita (sjá hér að neðan).

## Hvað hún gerir fyrir þig

- **Yfirlit inn í afstemmingu.** Flyttu yfirlit beint inn í **afstemmingu bankareiknings**, eða lestu
  yfirlit fyrir hvaða reikning og tímabil sem er.
- **Kröfur (*innheimtukröfur*).** Finndu kröfur, sjáðu greiðslur sem borist hafa inn á þær og fylgdu
  kröfu gegnum ferilinn.
- **Kröfubunkar.** Stofnaðu, breyttu, felldu niður og endurstofnaðu kröfur í bunkum, og sendu bunka í
  milliinnheimtu. Bankinn staðfestir bunkann fyrst og skilar niðurstöðunni á eftir. Staðfestur bunki
  þýðir ekki að greiðandinn hafi greitt: skoðaðu greiðslur krafnanna til þess.
- **Greiðslur.** Sendu greiðslubunka og sæktu niðurstöðu hans.
- **Reikningar.** Reikningarnir sem bankanotandinn þinn nær til, reikningar í eigu kennitölu,
  upplýsingar um einn reikning, og staðfesting á að eigandi og reikningur eigi saman.
- **Greiðsluseðlar og kreditkort.** Ógreiddir seðlar og nánari upplýsingar um þá; kreditkortin þín og
  færslur þeirra.
- **Gengi.** Birt gengi sparisjóðsins.

Þú, tímasett ferli eða gervigreindaraðstoðarmaður getið beðið um hvað sem er af þessu. Uppsettar
skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Hvað þú setur upp

1. **Samning við sparisjóðinn þinn** um þær þjónustur sem þú notar, með B2B-notandanafni, lykilorði og
   undirritunarskilríki (`.pfx`-skrá með eigin lykilorði).
2. **Línu Sparisjóða á Uppsetning Bifröst Ísland Fjárstýringar**: hafðu hana virka, skráðu
   notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og **Skrá skírteini**. Sjá
   [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/) og
   [Draupnir-undirritara](../reference/draupnir-signers.md).
3. **Eigin aðgang notenda, ef þeir hafa sinn eigin aðgang hjá bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð í **notandastillingum Bifrastar**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Innflutning yfirlita, sem einnig velur sparisjóðinn.** Á bankareikningi í Business Central
   skaltu velja snið sparisjóðsins þíns sem **Innflutningssnið bankayfirlits**: `SPAR-IN-SPARAUST`,
   `SPAR-IN-SPTHIN`, `SPAR-IN-SPSTR` eða `SPAR-IN-SPSH`. Enginn sérstakur bankareitur er á
   uppsetningarsíðunni. Breytingar sem þú gerir á þessum sniðum haldast við enduruppsetningu og
   uppfærslu.
5. **Kröfur.** Á hvern greiðslumáta sem notaður er til innheimtu skráirðu **kröfuauðkenni Spar** sem
   bankinn úthlutaði þeim innheimtusamningi. **Síðasta kröfunúmer Spar** heldur númeraröðinni
   gangandi. Kennitala kröfuhafa er lesin úr upplýsingum fyrirtækis. Sjá
   [Greiðslumátar](/help/iceland-treasury/payment-methods/).
6. **Heimildir.** Úthlutaðu heimildasettunum hér að neðan.

| Aðgangsupplýsingar | Geymdar fyrir | Athugasemdir |
| --- | --- | --- |
| Lykilorð fyrirtækis | Fyrirtækið | Sjálfgefið B2B-lykilorð fyrirtækisins. |
| Lykilorð notanda | Hvern notanda | Notað með eigin notandanafni hans. |
| Undirritunarskilríki og lykilorð þess | Fyrirtækið | Undirritar hverja beiðni. Lokadagsetning þess sést á uppsetningarsíðunni. |

Öll gildi eru slegin inn í huldum gluggum og aldrei sýnd aftur; sjá
[Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).

## Hvað þú sérð í Business Central

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið til sparisjóðsins. Sé ekkert
  eldra bókað yfirlit til að halda áfram frá biður það um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  reikninginn, gjaldmiðil, IBAN, innfluttar línur og upphafs- og lokastöðu, og varar við ef þær stemma
  ekki við bankann.
- **Greiðslumátar** sýna kröfuauðkenni Spar og síðasta kröfunúmer.
- **Upplýsingagluggi viðskiptamannafærslna** sýnir kröfureikning og kröfudagsetningu hjá sparisjóðnum,
  fyrir notendur sem mega lesa kröfur. Sjá
  [Viðskiptamannafærslur — kröfuupplýsingar](/help/iceland-treasury/customer-ledger-factbox/).
- Hvert kall til bankans er skráð í **beiðnaskrá Bifrastar**, með aðgangsupplýsingarnar huldar.

## Heimildasett

Hvert svið hefur sitt heimildasett, svo notandi getur lesið yfirlit án þess að geta greitt.

| Heimildasett | Veitir |
| --- | --- |
| `BIFROST SPStmt ori` | Yfirlit |
| `BIFROST SPAcct ori` | Uppflettingar og staðfestingu reikninga |
| `BIFROST SPBill ori` | Greiðsluseðla |
| `BIFROST SPCard ori` | Kreditkort og kortafærslur |
| `BIFROST SPClmPmt ori` | Leit að kröfum, greiðslur krafna og feril krafna |
| `BIFROST SPClmCrt ori` | Kröfubunka og niðurstöður þeirra |
| `BIFROST SPPaymt ori` | Greiðslubunka og niðurstöður þeirra |

`BIFROST SPFull ori` víkkar `BIFROST Full ori` í Foundation, svo allir með fullan Bifrastaraðgang ná
til alls sem Sparisjóðatengingin gerir. `BIFROST SPRdClm ori` víkkar `BIFROST Read ori` með
lesaðgangi að kröfum.

## Að færa sig frá Cloud Events Sparisjóðir

Settu Bifröst fjárstýringu upp við hlið gamla forritsins. Við fyrstu uppsetningu tekur hún yfir gögn
sparisjóðanna (kröfur, kröfu- og greiðslubunka, kröfureitina á greiðslumátum, stillingar notenda,
notandanafn fyrirtækisins og úthlutanir heimildasetta) og síðan má fjarlægja gamla forritið. Gögnum
sem þegar eru í nýja forritinu er aldrei skrifað yfir.

**Lykilorð, skilríki og lykilorð skilríkisins flytjast ekki.** Skráðu þau einu sinni eftir skiptin.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Draupnir-undirritarar](../reference/draupnir-signers.md): undirritunarskilríkið
- [Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/)
