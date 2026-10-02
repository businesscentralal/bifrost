---
id: index
title: "Bifröst Ísland"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Tengir Business Central við íslenskar opinberar þjónustur og SMS-gáttir: Þjóðskrá gegnum Umsjá, Skattinn, Seðlabanka, Skilagrein, island.is og Já Gagnatorg."
---

# Bifröst Ísland

**Business Central talar við íslensku þjónusturnar sem þú notar nú þegar.** Skilaðu virðisaukaskatti
og staðgreiðslu, flettu upp einstaklingum og fyrirtækjum og sæktu gengi án þess að slá neitt inn tvisvar.

Bifröst Ísland tengir Business Central við Þjóðskrá gegnum Umsjá, Skattinn, Seðlabanka Íslands,
Skilagrein, island.is, Já Gagnatorg og SMS-gáttir Símans og Nova. Notandi, tímasett ferli eða
aðstoðarmaður nota þær á sama hátt og aðra hluta Bifrastar.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/), fyrir fyrirtæki á Íslandi. Nýr notandi
Bifrastar? Byrjaðu á [Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Flett upp einstaklingi eða fyrirtæki.** Leitað í þjóðskrá (Þjóðskrá gegnum Umsjá) eftir
  kennitölu, nafni eða heimilisfangi, séð tengsl, hlutverk og hagsmunaaðila, eða leitað í Símaskrá
  Já. Einnig má halda staðbundið afrit af skránni, uppfært mánaðarlega.
- **Skilað skýrslum til Skattsins.** Sótt, villuprófað, sent inn og leiðrétt virðisaukaskatt,
  staðgreiðslu og fjármagnstekjuskatt, og fengið kvittun sem PDF. Prófaðu fyrst gegn
  prófunarþjónustu Skattsins.
- **Undirbúið og gert upp virðisaukaskatt í Business Central.** Forskoðað VSK-skýrsluna eftir
  reitum, tilbúna fyrir Skattinn, og reiknað og bókað uppgjör virðisaukaskatts.
- **Sótt gögn frá Seðlabankanum.** Gengi beint í gengistöflu Business Central, auk vaxta,
  dráttarvaxta, vísitölu neysluverðs og annarra hagvísa.
- **Sent iðgjöld til lífeyrissjóða og stéttarfélaga.** Haldið grunngögnum Skilagreinar réttum,
  sent skilagreinar til innheimtuaðila og staðfest aukagreiðslur.
- **Kannað upplýsingar og sent skilaboð.** Staðfest kennitölu, flett upp ökutæki eða tollflokki á
  island.is, kannað frídaga og póstnúmer, og sent SMS gegnum Símann eða Nova.

Allt þetta má keyra eftir tímaáætlun, til dæmis daglega uppfærslu gengis, sem verkferil í
[Bifröst Orchestrator](/orchestrator/). Tengingar við banka eru í
[Bifröst Iceland Treasury](/iceland-treasury/).

## Fáðu það

Settu **Bifrost Iceland** upp við hlið Bifröst Foundation, af AppSource eða gegnum
samstarfsaðila. Það krefst Business Central 28.0 eða nýrra, Essentials eða Premium, með íslenskri
staðfærslu Microsoft (IS Core).

## Settu það upp

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Keyrðu **uppsetningarleiðsögn Bifrastar** í Bifröst Foundation: leyfðu útsendar HTTP-beiðnir fyrir forritið og skráðu aðgangsupplýsingar þeirra þjónusta sem þú notar. Ekkert nær ytri þjónustu fyrr en HTTP er leyft. | Kerfisstjóri Business Central |
| 2 | Keyrðu **Setja upp Bifröst Ísland** úr Aðstoðaðri uppsetningu, eða opnaðu **Uppsetning Bifröst Ísland**, og veldu raunþjónustu eða prófunarþjónustu fyrir hverja tengingu. | Kerfisstjóri Business Central |
| 3 | Skráðu kennitölu fyrirtækisins í **Upplýsingar fyrirtækis → Kennitala**. Skatturinn les hana þaðan. | Kerfisstjóri Business Central |
| 4 | Fyrir Skilagrein: skráðu lykilorð hvers innheimtuaðila á síðunni **Innheimtuaðilar skilagreinar**. | Kerfisstjóri Business Central |
| 5 | Úthlutaðu heimildum: `BIFROST Full ori` fyrir fullan aðgang, eða settinu fyrir eina þjónustu (sjá töfluna hér að neðan). | Kerfisstjóri Business Central |

Leiðbeiningar skref fyrir skref eru í hjálpinni í forritinu:
[Uppsetning Bifröst Ísland](/help/iceland/iceland-setup/),
[Einingar þjóðskrár](/help/iceland/iceland-umsja-registry/) og
[Grunngögn skilagreinar](/help/iceland/iceland-skilagrein/).

## Gott að vita

- **Það vinnur sem þú.** Hvert kall keyrir með þínum eigin heimildum í Business Central og er skráð
  á síðunni **Bifrost Messages**.
- **Hver þjónusta hefur sitt heimildasett**, svo notandi getur fengið að skila virðisaukaskatti án
  þess að geta sent SMS eða samstillt þjóðskrá.
- **Aðgangsupplýsingar** þarf fyrir Umsjá, Skattinn, Skilagrein, SMS og Já Gagnatorg. Þær eru geymdar
  í leyndarmálageymslu Bifröst Foundation, aldrei sýndar aftur og huldar í beiðnaskránni.
  Seðlabankinn, island.is, frídagar og póstnúmer þurfa engar.
- **Aðgangsupplýsingar flytjast ekki** frá Origo Cloud Events Iceland. Skráðu þær einu sinni eftir
  uppsetningu.
- **Afrit þjóðskrár eru persónuupplýsingar.** Hafðu heimildasettin þröng og hreinsaðu afritið þegar
  fyrirtækið hefur ekki lengur lögmæta ástæðu til að geyma það.

## Finndu aðgerðirnar

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-tólunum `list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

- [Notendasviðsmyndir fyrir AppSource](./user-scenarios) · [Texti AppSource-skráningar](./listing)

## Heimildasett

`BIFROST ISFull ori` er heimildasettsviðbót: hún bætir öllum hlutum Íslandsforritsins við
`BIFROST Full ori` í Bifröst Foundation, svo það er settið sem á að úthluta fyrir fullan aðgang. Hin
settin verja eina þjónustu hvert og eru úthlutuð sérstaklega þegar notandi á aðeins að ná í hluta
forritsins.

| Heimildasett | Úthlutanlegt | Nær yfir |
| --- | --- | --- |
| `BIFROST ISFull ori` | Viðbót við `BIFROST Full ori` | Alla hluti Íslandsforritsins |
| `BIFROST Umsja ori` | Nei, fylgir `BIFROST ISFull ori` | Uppflettingar í Umsjá og afrit þjóðskrár |
| `BIFROST NatReg ori` | Já | Samstillingu þjóðskrár |
| `BIFROST VAT ori` | Já | Skil virðisaukaskatts |
| `BIFROST Payroll ori` | Já | Skil staðgreiðslu |
| `BIFROST CapTax ori` | Já | Skil fjármagnstekjuskatts |
| `BIFROST Collect ori` | Já | Skilagreinar til innheimtuaðila |
| `BIFROST SMS ori` | Já | SMS á íslensk númer |
| `BIFROST SMS Fgn ori` | Já | SMS á erlend númer |
| `BIFROST Ja ori` | Já | Leit og uppflettingar í Já Gagnatorgi |
