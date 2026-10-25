---
id: treasury-setup
title: "Bifröst Ísland Fjárstýring - uppsetning"
---

Í **Bifröst Ísland Fjárstýring - uppsetning** tengir kerfisstjóri Business Central við íslensku bankana.
Síðan sýnir eina línu fyrir hvern banka, svo þú sérð í einu vetfangi hvaða bankar eru virkir, hverjir hafa
notandanafn og hjá hverjum leyndarmál vantar enn. Úr henni eru rakningarsíðurnar líka opnaðar.

Opnaðu hana með **Ísland Fjárstýring** í flokknum **Forrit** á síðunni [Uppsetning Bifröst](/help/foundation/bifrost-setup/).
Aðeins handhafi `BIFROST TAdmin ori` getur breytt henni; fyrir aðra opnast hún aðeins til lestrar og
aðgerðirnar sem vista eða hreinsa leyndarmál eru ekki í boði.

HTTP-beiðnir út eru ekki leyfðar hér. [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/)
leyfir þær fyrir öll uppsett Bifröst-forrit, þetta þar með talið. Ekkert berst til banka fyrr en þær eru
leyfðar.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn sem línan stillir. |
| **Virkt** | Hvort kalla megi á bankann. Slökktu á reitnum til að stöðva allar aðgerðir bankans án þess að eyða stillingum hans. |
| **Notandanafn** | Notandanafn fyrirtækisins í bankanum. Notandi sem hefur eigin innskráningu skráir hana á síðunni **Uppsetning notanda Bifröst**. |
| **Leyndarmál** | **Fullskráð** þegar öll leyndarmál sem bankinn þarf eru vistuð, annars **Vantar**. Gildin eru aldrei sýnd. |
| **SOAP-undirritari** | Aðeins fyrir Íslandsbanka og Kviku banka: hvernig beiðnir eru undirritaðar. Hafðu reitinn auðan nema bankinn biðji um annað snið. |

## Skírteini {#certificate}

Upplýsingareiturinn **Skírteini** sýnir biðlaraskírteinið sem er vistað fyrir valinn banka: **Handhafi**,
**Útgefandi**, **Fingrafar**, **Gildir frá** og **Rennur út**. Endurnýjaðu skírteinið hjá bankanum áður en
það rennur út og vistaðu það nýja með **Skrá skírteini**: bankinn hafnar beiðnum sem eru undirritaðar með
útrunnu skírteini. Ef ekkert skírteini er vistað, eða ekki tekst að opna það vistaða með lykilorði þess,
segir upplýsingareiturinn það.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá lykilorð fyrirtækis** | Opnar hulinn glugga og vistar lykilorð fyrirtækisins í völdum banka. |
| **Skrá skírteini** | Hleður upp biðlaraskírteininu (`.pfx`-skjali) og biður um lykilorð þess. Skírteinið er opnað með lykilorðinu áður en nokkuð er vistað, svo rangt lykilorð kemur strax í ljós. |
| **Skrá skírteini banka** | Aðeins Íslandsbanki. Hleður upp opinberu skírteini bankans. |
| **Skrá API-lykil** | Aðeins Landsbankinn. Vistar API-lykil fyrirtækisins. |
| **Hreinsa leyndarmál fyrirtækis** | Fjarlægir öll vistuð leyndarmál fyrirtækisins fyrir valinn banka, eftir að þú staðfestir. |
| **Endurbyggja uppsetningargögn** | Stofnar innflutningssnið bankayfirlits bankans og inn- og útflutningsuppsetningu hans aftur ef þau vantar. Óhætt að keyra hvenær sem er. |
| **Endurnýja stillingar bankayfirlits** | Eyðir og stofnar aftur innflutningssnið bankayfirlits bankans og inn- og útflutningsuppsetningu hans. |
| **Greiðslubunkar í banka** | Opnar [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/). |
| **Kröfur í banka** | Opnar [Kröfur í banka](/help/iceland-treasury/bank-claims/). |
| **Kröfubunkar í banka** | Opnar [Kröfubunkar í banka](/help/iceland-treasury/bank-claim-batches/). |
| **Greiðslur krafna í banka** | Opnar [Greiðslur krafna í banka](/help/iceland-treasury/bank-claim-payments/). |
| **Ferilskrá bankaaðgerða** | Opnar [Ferilskrá bankaaðgerða](/help/iceland-treasury/bank-tracking-log/). |
| **Uppsetningarleiðsögn** | Opnar Uppsetningarleiðsögn Bifröst, sem leyfir HTTP-beiðnir út og fer í gegnum innskráningarupplýsingar hvers Bifröst-forrits. |
| **Leyndarmál forrita Bifröst** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/). |
| **Uppsetning Bifrastar** | Opnar [Uppsetning Bifröst](/help/foundation/bifrost-setup/). |

## Hvað hver banki þarf {#what-each-bank-needs}

| Banki | Lykilorð | Biðlaraskírteini | API-lykill |
| --- | --- | --- | --- |
| Arion banki | Já | Já | Nei |
| Íslandsbanki | Já | Já | Nei |
| Kvika banki | Já | Já | Nei |
| Landsbankinn | Já | Já | Já |

Aðgerðir sem eiga ekki við valinn banka eru ekki í boði. Sjá [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/)
um hvar gildin eru geymd.

## Algeng verk {#common-tasks}

**Tengja banka.** Veldu línu hans, skráðu **Notandanafn** og veldu svo **Skrá lykilorð fyrirtækis**,
**Skrá skírteini** og, fyrir Landsbankann, **Skrá API-lykil**. **Leyndarmál** verður **Fullskráð**.

**Hætta að nota banka.** Slökktu á **Virkt**. Aðgerðir hans stöðvast en stillingarnar haldast, svo þú
getur kveikt á honum aftur síðar.

**Endurnýja skírteini.** Veldu **Skrá skírteini** og hladdu upp nýja `.pfx`-skjalinu með lykilorði þess.
Upplýsingareiturinn sýnir nýjan lokadag.

**Lagfæra innflutning yfirlita.** Þegar **Flytja inn bankayfirlit** finnur ekki innflutningssnið bankans
skaltu velja **Endurbyggja uppsetningargögn** á línu bankans.

## Gott að vita {#good-to-know}

- Leiðsögnin [Bifröst Ísland Fjárstýring - Bankauppsetning](/help/iceland-treasury/treasury-setup-wizard/)
  fer í gegnum sömu stillingar, einn banka í einu.
- Lykilorð, skírteini og lyklar eru í varinni geymslu og birtast aldrei aftur; sjá
  [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).
- Hvað hver banki nær yfir: [Arion banki](/iceland-treasury/banks/arion/),
  [Íslandsbanki](/iceland-treasury/banks/islandsbanki/), [Kvika banki](/iceland-treasury/banks/kvika/) og
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/).
