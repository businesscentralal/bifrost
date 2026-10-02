---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 2
description: "Hvað Bifröst fjárstýring gerir með Arion banka: yfirlit, reikningar, greiðsluseðlar, kreditkort, kröfur, innlendar og erlendar greiðslur, gjaldeyrisreikningar, rafræn skjöl og gengi."
---

Þessi síða er fyrir fjármálasvið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Arion banka. Hún útskýrir hvað Arion-tengingin í [Bifröst fjárstýringu](/iceland-treasury/)
gerir, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað hún gerir fyrir þig

- **Yfirlit inn í afstemmingu.** Flyttu reikningsyfirlit frá Arion beint inn í **afstemmingu
  bankareiknings**, eða lestu yfirlit fyrir hvaða reikning og tímabil sem er. Kreditkortafærslur má
  flytja inn á sama hátt.
- **Reikningar.** Listaðu reikningana sem bankanotandinn þinn sér, flettu einum upp, listaðu reikninga
  í eigu kennitölu og staðfestu að kennitala eigi tiltekinn reikning áður en þú greiðir inn á hann.
- **Greiðsluseðlar og kreditkort.** Sjáðu ógreidda seðla og nánari upplýsingar um þá, kreditkortin
  þín og kortafærslur eftir tímabili eða gjalddagamánuði.
- **Kröfur (*innheimtukröfur*).** Finndu kröfur og greiðslur sem borist hafa inn á þær, og fylgdu
  kröfu gegnum ferilinn. Stofnaðu, breyttu og felldu niður kröfur í bunkum: bankinn staðfestir
  bunkann fyrst og skilar niðurstöðunni á eftir.
- **Greiðslur.** Sendu bunka innlendra greiðslna í krónum og sæktu niðurstöðu hverrar línu. Sendu
  erlendar greiðslur, sjáðu virka bunka og sæktu kvittanir.
- **Gjaldeyrisreikningar.** Sjáðu gjaldeyrisreikningana þína með færslum og yfirlitum.
- **Rafræn skjöl.** Hladdu upp PDF- eða XML-skjali til birtingar í netbanka viðtakandans og
  staðfestu að það hafi verið afgreitt.
- **Gengi.** Kaup- og sölugengi Arion fyrir hvaða dag sem er. Gengi krefst ekki heimildasetts.

Þú, tímasett ferli eða gervigreindaraðstoðarmaður getið beðið um hvað sem er af þessu. Uppsettar
skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Hvað þú setur upp

1. **Samning við Arion banka** um þær þjónustur sem þú notar, með B2B-notandanafni, lykilorði og
   undirritunarskilríki (`.pfx`-skrá með eigin lykilorði).
2. **Línu Arion á Uppsetning Bifröst Ísland Fjárstýringar**: hafðu hana virka, skráðu notandanafn
   fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og **Skrá skírteini**. Sjá
   [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/) og
   [Draupnir-undirritara](../reference/draupnir-signers.md).
3. **Eigin aðgang notenda, ef þeir hafa sinn eigin aðgang hjá bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð í **notandastillingum Bifrastar**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Innflutning yfirlita.** Á bankareikningi í Business Central skaltu velja yfirlitssnið Arion sem
   **Innflutningssnið bankayfirlits**. Fyrir kreditkort stofnarðu bankareikning með kortanúmerið sem
   reikningsnúmer og velur kortasnið Arion.
5. **Kröfur.** Á hvern greiðslumáta sem notaður er til innheimtu skráirðu **kröfuauðkenni Arion** úr
   innheimtusamningnum. **Síðasta kröfunúmer Arion** heldur númeraröðinni gangandi. Sjá
   [Greiðslumátar](/help/iceland-treasury/payment-methods/).
6. **Heimildir.** Úthlutaðu heimildasettunum hér að neðan.

| Aðgangsupplýsingar | Geymdar fyrir | Athugasemdir |
| --- | --- | --- |
| Lykilorð fyrirtækis | Fyrirtækið | Notað þegar notandinn hefur ekkert eigið lykilorð. |
| Lykilorð notanda | Hvern notanda | Skráð af notandanum sjálfum. Notað með eigin notandanafni hans. |
| Undirritunarskilríki og lykilorð þess | Fyrirtækið | Undirritar hverja beiðni. Lokadagsetning þess sést á uppsetningarsíðunni. |

Arion þarf hvorki API-lykil né skírteini bankans. Öll gildi eru slegin inn í huldum gluggum og aldrei
sýnd aftur; sjá [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).

## Hvað þú sérð í Business Central

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið til Arion. Í fyrsta sinn
  biður það um [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/); eftir það heldur það
  áfram frá síðasta bókaða yfirliti. [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/)
  sýnir síðan innfluttar línur og upphafs- og lokastöðu, og varar við ef þær stemma ekki við bankann.
- **Greiðslumátar** sýna kröfuauðkenni Arion og síðasta kröfunúmer.
- **Upplýsingagluggi viðskiptamannafærslna** sýnir kröfureikning og kröfudagsetningu sem skráð eru hjá
  Arion, fyrir notendur sem mega lesa kröfur. Sjá
  [Viðskiptamannafærslur — kröfuupplýsingar](/help/iceland-treasury/customer-ledger-factbox/).
- Hvert kall til bankans er skráð í **beiðnaskrá Bifrastar**, með aðgangsupplýsingarnar huldar.

## Heimildasett

Hvert svið sem les eða hreyfir fé hefur sitt heimildasett, svo notandi getur lesið yfirlit án þess að
geta greitt.

| Heimildasett | Veitir |
| --- | --- |
| `BIFROST ABStmt ori` | Yfirlit |
| `BIFROST ABAcct ori` | Uppflettingar og staðfestingu reikninga |
| `BIFROST ABBill ori` | Greiðsluseðla |
| `BIFROST ABCard ori` | Kreditkort og kortafærslur |
| `BIFROST ABClmPmt ori` | Uppflettingar krafna, greiðslur krafna og feril krafna |
| `BIFROST ABClmCrt ori` | Stofnun, breytingu og niðurfellingu krafna |
| `BIFROST ABPaymt ori` | Innlendar greiðslur og niðurstöður þeirra |
| `BIFROST ABFrgPay ori` | Erlendar greiðslur og kvittanir |
| `BIFROST ABFStmt ori` | Gjaldeyrisreikninga, færslur og yfirlit |
| `BIFROST ABDoc ori` | Rafræn skjöl |

`BIFROST ABFull ori` víkkar `BIFROST Full ori` í Foundation og `BIFROST ABRdClm ori` víkkar
`BIFROST Read ori` með lesaðgangi að kröfum. Notandi sem hefur fullt sett eða lessett Foundation fær
þau sjálfkrafa.

## Að færa sig frá Origo Cloud Events Arionbanki

Settu Bifröst fjárstýringu upp við hlið gamla forritsins. Við fyrstu uppsetningu tekur hún yfir gögn
Arion (kröfur, bunka, kröfureitina á greiðslumátum, stillingar Arion og úthlutanir heimildasetta til
notenda) og síðan má fjarlægja gamla forritið. Gögnum sem þegar eru í nýja forritinu er aldrei skrifað
yfir.

**Lykilorð og skilríki flytjast ekki.** Skráðu þau einu sinni eftir skiptin. Skráðu líka aðgang
Landsbankans aftur: gömlu forritin gátu ruglað saman geymdum gildum bankanna tveggja, svo hvorugt er
flutt.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Draupnir-undirritarar](../reference/draupnir-signers.md): undirritunarskilríkið
- [Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/)
