---
id: treasury-setup
title: "Bifröst Ísland Fjárstýring - uppsetning"
---

Í **Bifröst Ísland Fjárstýring - uppsetning** tengir kerfisstjóri Business Central við íslensku bankana
og við innheimtufyrirtækin Gjaldskil og InKasso. Síðan sýnir eina línu fyrir hvern banka eða
innheimtufyrirtæki, svo þú sérð í einu vetfangi hverjir eru virkir, hverjir hafa notandanafn og hvort
auðkenning er tiltæk. Úr henni eru rakningarsíðurnar líka opnaðar.

Opnaðu hana með **Ísland Fjárstýring** í flokknum **Forrit** á síðunni [Uppsetning Bifröst](/help/foundation/bifrost-setup/).
Aðeins handhafi `BIFROST TAdmin ori` getur breytt bankauppsetningunni eða vistað, hreinsað og afritað
auðkenni fyrirtækisins. Fyrir aðra eru reitirnir aðeins til lestrar. Þú getur samt skráð eða hreinsað
þína eigin bankaauðkenningu.

HTTP-beiðnir út eru ekki leyfðar hér. [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/)
leyfir þær fyrir öll uppsett Bifröst-forrit, þetta þar með talið. Ekkert berst til banka fyrr en þær eru
leyfðar.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn eða innheimtufyrirtækið sem línan stillir. Sparisjóðirnir fjórir deila einni línu, **Sparisjóðir**. |
| **Virkt** | Hvort kalla megi á bankann. Slökktu á reitnum til að stöðva allar aðgerðir bankans án þess að eyða stillingum hans. |
| **Notandanafn** | Notandanafn fyrirtækisins í bankanum. Notandi sem hefur eigin innskráningu skráir hana með **Skrá mína bankaauðkenningu**, sem vistar nafnið á síðunni **Uppsetning notanda Bifröst** fyrir þann notanda. Autt eigið nafn heldur þessu sjálfgefna nafni fyrirtækisins. |
| **Leyndarmál** | **Fullskráð** þegar þín eigin auðkenning eða auðkenning fyrirtækisins er vistuð fyrir bankann; **Vantar** þegar hvorug er vistuð. Staða skírteinis er sýnd sér. Gildin eru aldrei sýnd. |
| **SOAP-undirritari** | Aðeins hægt að breyta honum fyrir Íslandsbanka, Kviku banka og sparisjóðina; á öðrum línum er hann aðeins til lestrar. Hafðu hann auðan nema bankinn biðji þig um að nota WSE2 eða WSE3. Auður reitur notar venjulegt snið bankans: WSE2 fyrir Íslandsbanka og Kviku banka, WSE3 fyrir sparisjóðina. |

## Upplýsingar {#information}

Upplýsingareiturinn **Upplýsingar** fylgir völdum banka. Hann heldur stöðulínu öruggrar tengingar og sýnir
notandanafnið sem er í notkun, auk auðkenningarstöðunnar hér fyrir neðan. Hann sýnir ekki lykilorð.

| Reitur | Lýsing |
| --- | --- |
| **Notandanafn** | Notandanafnið sem er notað fyrir valinn banka. Þitt eigið nafn er sýnt sem **(eigið)**. Nafn fyrirtækisins er sýnt sem **(sjálfgefið fyrirtækis)**. Þegar ekkert notandanafn fyrirtækis er vistað sýnir reiturinn aðeins **(sjálfgefið fyrirtækis)**. |
| **Mín auðkenning** | **Skráð** þegar þú hefur vistað þína eigin auðkenningu fyrir valinn banka; annars **Ekki skráð**. |
| **Auðkenning** | **Tiltæk** þegar þín eigin auðkenning eða auðkenning fyrirtækisins er vistuð; **Vantar** aðeins þegar hvorug er vistuð. |

**Ekki skráð** getur því birst með **Tiltæk** þegar auðkenning fyrirtækisins er vistuð. **Tiltæk** lýsir
vistaðri auðkenningu; hún staðfestir ekki að bankinn samþykki hana eða að skírteinið sé gilt. Skoðaðu
upplýsingareitinn **Skírteini** fyrir upplýsingar um skírteinið.

## Skírteini {#certificate}

Upplýsingareiturinn **Skírteini** sýnir biðlaraskírteinið sem er vistað fyrir valinn banka: **Handhafi**,
**Útgefandi**, **Fingrafar**, **Gildir frá** og **Rennur út**. Endurnýjaðu skírteinið hjá bankanum áður en
það rennur út og vistaðu það nýja með **Skrá skírteini**: bankinn hafnar beiðnum sem eru undirritaðar með
útrunnu skírteini. Ef ekkert skírteini er vistað, eða ekki tekst að opna það vistaða með lykilorði þess,
segir upplýsingareiturinn það. Gjaldskil og InKasso nota ekkert skírteini.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá lykilorð fyrirtækis** | Opnar hulinn glugga og vistar lykilorð fyrirtækisins í völdum banka. |
| **Skrá mína bankaauðkenningu** | Biður um notandanafnið þitt og þína eigin auðkenningu fyrir valinn banka í einum glugga. Notandanafnið er vistað á síðunni **Uppsetning notanda Bifröst**. Hafðu það autt, eða skildu óbreytta vísbendingu um sjálfgefið fyrirtækis eftir, til að halda sjálfgefna nafninu. Auðkenningin (lykilorðið þitt, eða API-lykillinn þinn hjá Landsbankanum) er hulin, vistuð fyrir þig eingöngu og er ekki sýnd aftur. Auðkenning þín er notuð á undan auðkenningu fyrirtækisins. |
| **Hreinsa mína bankaauðkenningu** | Fjarlægir þína eigin auðkenningu fyrir valinn banka eftir að þú staðfestir. Auðkenning fyrirtækisins breytist ekki. Þegar þú hefur einnig eigið notandanafn fyrir bankann spyr önnur spurning hvort það eigi að fara. Ef þú hafnar fyrri spurningunni breytist ekkert. Ef þú hafnar þeirri seinni helst notandanafnið. |
| **Afrita skírteini í...** | Afritar skírteini fyrirtækisins og lykilorð þess af völdum banka yfir á annan banka. Krefst `BIFROST TAdmin ori` og spyr áður en skírteini á áfangastað er skipt út. |
| **Skrá skírteini** | Hleður upp biðlaraskírteininu (`.pfx`-skjali) og biður um lykilorð þess. Skírteinið er opnað með lykilorðinu áður en nokkuð er vistað, svo rangt lykilorð kemur strax í ljós. Ekki í boði fyrir Gjaldskil og InKasso. |
| **Skrá skírteini banka** | Aðeins Íslandsbanki. Hleður upp opinberu skírteini bankans. |
| **Skrá API-lykil** | Aðeins Landsbankinn. Vistar API-lykil fyrirtækisins. |
| **Hreinsa leyndarmál fyrirtækis** | Fjarlægir öll vistuð leyndarmál fyrirtækisins fyrir valinn banka, eftir að þú staðfestir. |
| **Endurbyggja uppsetningargögn** | Stofnar innflutningssnið bankayfirlits bankans og inn- og útflutningsuppsetningu hans aftur ef þau vantar. Óhætt að keyra hvenær sem er. Ekki í boði fyrir Gjaldskil og InKasso, sem hafa engin yfirlit. |
| **Endurnýja stillingar bankayfirlits** | Eyðir og stofnar aftur innflutningssnið bankayfirlits bankans og inn- og útflutningsuppsetningu hans. Ekki í boði fyrir Gjaldskil og InKasso. |
| **Greiðslubunkar í banka** | Opnar [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/). |
| **Kröfur í banka** | Opnar [Kröfur í banka](/help/iceland-treasury/bank-claims/). |
| **Kröfubunkar í banka** | Opnar [Kröfubunkar í banka](/help/iceland-treasury/bank-claim-batches/). |
| **Greiðslur krafna í banka** | Opnar [Greiðslur krafna í banka](/help/iceland-treasury/bank-claim-payments/). |
| **Ferilskrá bankaaðgerða** | Opnar [Ferilskrá bankaaðgerða](/help/iceland-treasury/bank-tracking-log/). |
| **Uppsetningarleiðsögn** | Opnar Uppsetningarleiðsögn Bifröst, sem leyfir HTTP-beiðnir út og fer í gegnum innskráningarupplýsingar hvers Bifröst-forrits. |
| **Leyndarmál forrita Bifröst** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/). |
| **Uppsetning Bifröst** | Opnar [Uppsetning Bifröst](/help/foundation/bifrost-setup/). |

## Hvað hver banki þarf {#what-each-bank-needs}

| Banki eða innheimtufyrirtæki | Lykilorð | Biðlaraskírteini | API-lykill |
| --- | --- | --- | --- |
| Arion banki | Já | Já | Nei |
| Íslandsbanki | Já | Já | Nei |
| Kvika banki | Já | Já | Nei |
| Landsbankinn | Já | Já | Já |
| Sparisjóðir | Já | Já | Nei |
| Gjaldskil | Já | Nei | Nei |
| InKasso | Já | Nei | Nei |

Aðgerðir sem eiga ekki við valinn banka eru ekki í boði. Sjá [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/)
um hvar gildin eru geymd.

## Algeng verk {#common-tasks}

**Tengja banka.** Veldu línu hans, skráðu **Notandanafn** og veldu svo **Skrá lykilorð fyrirtækis**,
**Skrá skírteini** og, fyrir Landsbankann, **Skrá API-lykil**. **Leyndarmál** verður **Fullskráð**.
Fyrir Gjaldskil og InKasso þarf aðeins lykilorð fyrirtækisins.

**Skrá eigin auðkenningu.** Veldu bankann og svo **Skrá mína bankaauðkenningu**. Þegar þú hefur ekkert
eigið notandanafn sýnir glugginn notandanafn fyrirtækisins sem vísbendingu. Skráðu notandanafnið þitt,
eða hafðu reitinn auðan eða vísbendinguna óbreytta til að halda sjálfgefna nafninu. Þegar þú hefur
þegar eigið notandanafn sýnir glugginn það nafn: skildu það eftir, hreinsaðu það til að fara aftur á
sjálfgefið fyrirtækisins, eða sláðu inn nýtt. Sláðu svo inn þinn eigin API-lykil fyrir Landsbankann,
eða þitt eigið lykilorð í bankanum fyrir hina bankana, í hulda reitinn og staðfestu. Nafnið er vistað á
[Uppsetningu notanda Bifröst](/help/iceland-treasury/bank-user-setup/). **Notandanafn** í **Upplýsingum**
sýnir nafnið þitt með **(eigið)**, eða nafn fyrirtækisins með **(sjálfgefið fyrirtækis)**. **Mín
auðkenning** verður **Skráð** og **Auðkenning** verður **Tiltæk**.

**Hreinsa eigin auðkenningu.** Veldu bankann, veldu **Hreinsa mína bankaauðkenningu** og staðfestu.
Auðkenning þín er fjarlægð og auðkenning fyrirtækisins helst. Ef þú hefur eigið notandanafn fyrir bankann
spyr önnur spurning hvort það eigi einnig að fara. Ef þú hafnar fyrri spurningunni breytist ekkert. Ef
þú hafnar þeirri seinni helst notandanafnið. **Mín auðkenning** verður **Ekki skráð**. **Auðkenning**
helst **Tiltæk** ef auðkenning fyrirtækisins er vistuð; annars verður hún **Vantar**.

**Afrita skírteini fyrirtækis.** Með `BIFROST TAdmin ori` skaltu velja bankann sem hefur skírteinið, velja
**Afrita skírteini í...** og svo annan banka. Aðeins bankar sem nota biðlaraskírteini eru í boði.
Skírteinið og lykilorð þess eru afrituð saman. Ef áfangastaðurinn hefur þegar skírteini skaltu staðfesta
áður en því er skipt út; ef þú hættir við helst það óbreytt. Ekkert er afritað ef upprunabankinn hefur
ekkert vistað skírteini. Veldu línu áfangastaðarins til að skoða upplýsingareitinn **Skírteini**.

**Hætta að nota banka.** Slökktu á **Virkt**. Aðgerðir hans stöðvast en stillingarnar haldast, svo þú
getur kveikt á honum aftur síðar.

**Endurnýja skírteini.** Veldu **Skrá skírteini** og hladdu upp nýja `.pfx`-skjalinu með lykilorði þess.
Upplýsingareiturinn sýnir nýjan lokadag.

**Lagfæra innflutning yfirlita.** Þegar **Flytja inn bankayfirlit** finnur ekki innflutningssnið bankans
skaltu velja **Endurbyggja uppsetningargögn** á línu bankans.

## Gott að vita {#good-to-know}

- Leiðsögnin [Bifröst Ísland Fjárstýring - Bankauppsetning](/help/iceland-treasury/treasury-setup-wizard/)
  fer í gegnum sömu stillingar, einn banka eða innheimtufyrirtæki í einu.
- Lykilorð, skírteini og lyklar eru í varinni geymslu og birtast aldrei aftur; sjá
  [Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).
- Hvað hver banki nær yfir: [Arion banki](/iceland-treasury/banks/arion/),
  [Íslandsbanki](/iceland-treasury/banks/islandsbanki/), [Kvika banki](/iceland-treasury/banks/kvika/),
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/) og [Sparisjóðir](/iceland-treasury/banks/sparisjodir/);
  innheimtufyrirtækin: [Gjaldskil](/iceland-treasury/agencies/gjaldskil/) og
  [InKasso](/iceland-treasury/agencies/inkasso/).
