---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 3
description: "Hvað Bifröst fjárstýring gerir með Íslandsbanka: yfirlit, gengi, staðfesting reikninga, innlendar og erlendar greiðslur, kröfur, milliinnheimta, innsending skráa og verðbréf."
---

Þessi síða er fyrir fjármálasvið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Íslandsbanka. Hún útskýrir hvað Íslandsbankatengingin í [Bifröst fjárstýringu](/iceland-treasury/)
gerir, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

Íslandsbanki er eini bankinn í forritinu sem þarf ekkert undirritunarskilríki: hann auðkennir með
notandanafni og lykilorði yfir dulkóðaða tengingu.

## Hvað hún gerir fyrir þig

- **Yfirlit og gengi.** Lestu reikningsyfirlit fyrir hvaða reikning og tímabil sem er, og gengi
  bankans fyrir tiltekinn dag og gengistegund.
- **Staðfesting reikninga.** Staðfestu að reikningur sé til, eftir atvikum ásamt kennitölu eiganda,
  og listaðu ógreiddar kröfur, gíróseðla, skuldabréf og reikninga sem kennitala skuldar.
- **Innlendar greiðslur.** Skráðu bunka millifærslna, láttu bankann villuprófa hann, framkvæmdu hann
  og sæktu niðurstöðuna. Millifærðu upphæð inn á debetkort.
- **Kröfur.** Stofnaðu og felldu niður innheimtukröfur, flettu einni upp, listaðu kröfur kröfuhafa
  eftir gjalddaga og stöðu, og sjáðu greiðslur sem borist hafa inn á kröfu.
- ***Milliinnheimta*.** Listaðu kröfur og greiðslur í milliinnheimtu fyrir tímabil, og skilaðu kröfu
  úr milliinnheimtu.
- **Erlendar greiðslur.** Skráðu bunka, skoðaðu tilboð og þóknun bankans, staðfestu hann og sæktu
  niðurstöðuna.
- **Innsending skráa.** Sendu skrá inn í birtingarkerfi bankans.
- **Verðbréf.** Lestu viðskiptasögu verðbréfa fyrir tímabil.

Greiðslur eru í tveimur skrefum: það sem þú skráir er ekki framkvæmt fyrr en það er sett í gang
(innlendar) eða staðfest (erlendar), og bankinn auðkennir verkið með bunkanúmeri sem þú getur notað
til að sækja niðurstöðuna.

Þú, tímasett ferli eða gervigreindaraðstoðarmaður getið beðið um hvað sem er af þessu. Uppsettar
skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Hvað þú setur upp

1. **Samning við Íslandsbanka** um þær þjónustur sem þú notar, með B2B-notandanafni og lykilorði,
   og opinberu skírteini bankans.
2. **Línu Íslandsbanka á Uppsetning Bifröst Ísland Fjárstýringar**: hafðu hana virka, skráðu
   notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og **Skrá skírteini banka**.
   Aðgerðin fyrir undirritunarskilríki er óvirk fyrir þennan banka. Sjá
   [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/).
3. **Eigin aðgang notenda, ef þeir hafa sinn eigin aðgang hjá bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð í **notandastillingum Bifrastar**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/). Eigið notandanafn án eigin
   lykilorðs er stöðvað með skýrri villu og aldrei sent með lykilorði fyrirtækisins.
4. **Heimildir.** Úthlutaðu heimildasettunum hér að neðan.

| Aðgangsupplýsingar | Geymdar fyrir | Athugasemdir |
| --- | --- | --- |
| Lykilorð fyrirtækis | Fyrirtækið | Notað þegar notandinn hefur engan eigin aðgang. |
| Lykilorð notanda | Hvern notanda | Notað með eigin notandanafni hans. |
| Skírteini banka | Fyrirtækið | Opinbert skírteini bankans. |

Öll gildi eru slegin inn í huldum gluggum og aldrei sýnd aftur; sjá
[Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).

## Hvað þú sérð í Business Central

- Lína Íslandsbanka á **Uppsetning Bifröst Ísland Fjárstýringar** sýnir hvort öll leyndarmál séu
  skráð. Skírteinisglugginn segir að bankinn noti ekkert undirritunarskilríki.
- Hvert kall til bankans er skráð í **beiðnaskrá Bifrastar**, með lykilorðið hulið.

## Heimildasett

Skráning og framkvæmd greiðslna, og stofnun eða niðurfelling krafna, þurfa eigin heimildasett. Lestur
yfirlita, gengis, krafna og niðurstaðna greiðslna þarf ekkert umfram almennan Bifrastaraðgang, svo
ferli sem aðeins sækir niðurstöður þarf engar greiðsluheimildir.

| Heimildasett | Veitir |
| --- | --- |
| `BIFROST IBPaymt ori` | Skráningu og framkvæmd innlendra greiðslubunka, og millifærslur á debetkort |
| `BIFROST IBClaim ori` | Stofnun og niðurfellingu krafna, og skil kröfu úr milliinnheimtu |
| `BIFROST IBFrgPay ori` | Skráningu og staðfestingu erlendra greiðslna |

`BIFROST IBFull ori` víkkar `BIFROST Full ori` í Foundation: það er settið á bak við fullan aðgang að
Íslandsbankatengingunni.

## Að færa sig frá Cloud Events Íslandsbanki

Settu Bifröst fjárstýringu upp við hlið gamla forritsins. Við fyrstu uppsetningu tekur hún yfir
notandanafn fyrirtækisins, stillingar Íslandsbanka og úthlutanir heimildasetta til notenda, og síðan
má fjarlægja gamla forritið. Gögnum sem þegar eru í nýja forritinu er aldrei skrifað yfir.

**Lykilorð og skírteini bankans flytjast ekki.** Skráðu þau einu sinni eftir skiptin.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/)
