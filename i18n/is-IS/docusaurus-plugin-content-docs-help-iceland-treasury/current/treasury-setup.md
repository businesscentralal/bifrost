---
id: treasury-setup
title: "Uppsetning Bifröst Ísland Fjárstýringar"
sidebar_label: "Uppsetning fjárstýringar"
sidebar_position: 2
---

Á síðunni **Uppsetning Bifröst Ísland Fjárstýringar** tengir þú Business Central við íslensku bankana. Hún sýnir bankatengingarnar fimm sem fylgja forritinu, eina línu fyrir hvern banka, svo þú sérð í einu vetfangi hvaða bankar eru virkir, hvaða bankar eru með notandanafn og hvar leyndarmál vantar enn.

Síðan er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar, undir **Ísland Fjárstýring**.

Útleið HTTP-biðlarabeiðnir eru ekki virkjaðar hér: **Uppsetningarleiðsögn Bifröst** hjá Bifrastar-grunninum (aðgerðin **Uppsetningarleiðsögn** á þessari síðu, eða tilkynningin á Uppsetningu Bifröst) virkjar þær fyrir öll uppsett Bifröst-forrit, þetta þar með talið.

## Hvers vegna listi en ekki flipi fyrir hvern banka

Bankarnir fimm eru allir stilltir eins: aðalrofi, notandanafn og safn leyndarmála. Listi svarar spurningunni sem þú kemur yfirleitt með — *hvaða bankar eru tilbúnir?* — á einum skjá, og sjötti bankinn bætir við línu í stað nýs flipa, nýrra reita og nýrra aðgerða.

Það sem er ólíkt milli banka, og aðgerðirnar sem geyma leyndarmál, eiga við þá línu sem er valin hverju sinni.

## Reitir

| Reitur | Lýsing |
|---|---|
| **Banki** | Íslenski bankinn sem línan stillir: Landsbankinn, Arion banki, Íslandsbanki, Kvika banki eða Sparisjóðir. |
| **Virkt** | Hvort tengingin megi keyra. Slökktu á henni til að stöðva öll skilaboð þess banka án þess að eyða stillingunum. Nýjar línur byrja virkar. |
| **Notandanafn** | Sjálfgefna B2B-notandanafnið sem bankinn gaf út fyrir fyrirtækið. Notandi getur skráð eigin yfirskrift í **notandastillingum Bifrastar**. |
| **Leyndarmál** | Hvort öll leyndarmál sem bankinn þarf hafi verið skráð. Sýnir **Fullskráð** með grænu, eða **Vantar** upplýst. |
| **Grunnslóð** | Valfrjáls yfirskrift á endapunkti, falin sjálfgefið. Skildu eftir autt til að nota innbyggða framleiðsluendapunkt tengingarinnar. Notaðu hana aðeins fyrir prófunargátt. |

## Skírteinisglugginn

Glugginn til hægri sýnir undirritunarskírteini biðlara fyrir valinn banka: handhafa, útgefanda, fingrafar og gildistímann. Lokadagurinn er litaður — rauður þegar skírteinið er runnið út og gulbrúnn síðustu 30 dagana — svo þú getir endurnýjað það áður en bankinn fer að hafna tengingunni.

Fyrir Íslandsbanka segir glugginn að bankinn noti ekki skírteini biðlara. Það er rétt: Íslandsbanki auðkennir með notandanafni og lykilorði yfir TLS og undirritar ekkert.

## Aðgerðir

| Aðgerð | Hvað hún gerir |
|---|---|
| **Skrá lykilorð fyrirtækis** | Skráir sjálfgefið B2B-lykilorð fyrirtækisins fyrir valinn banka. |
| **Skrá skírteini** | Hleður upp undirritunarskírteini biðlara (`.pfx`-skjali) og biður um lykilorð þess. Skírteinið er athugað gegn lykilorðinu áður en hvorugt er vistað, svo innsláttarvilla kemur strax í ljós. Óvirk fyrir banka sem nota ekki skírteini. |
| **Skrá skírteini banka** | Hleður upp opinberu skírteini bankans sem notað er til að dulrita beiðnir til hans. Aðeins Íslandsbanki notar þetta. |
| **Skrá API-lykil** | Skráir REST API-lykilinn. Aðeins Landsbankinn notar slíkan lykil. |
| **Hreinsa leyndarmál fyrirtækis** | Fjarlægir öll vistuð leyndarmál fyrirtækisins fyrir valinn banka, eftir staðfestingu. |
| **Uppsetningarleiðsögn** | Opnar [uppsetningarleiðsögnina](./treasury-setup-wizard.md) sem fer í gegnum sömu stillingar, einn banka í einu. |
| **Leyndarmál forrita Bifröst** | Opnar leyndarmálaskrá Bifrastar sem sýnir hvað hvert uppsett Bifröst-forrit þarf. |

## Hvaða leyndarmál hver banki notar

Ekki nota allir bankar öll leyndarmál. Aðgerðir sem eiga ekki við eru óvirkar fyrir valda línu.

| Banki | Lykilorð | Skírteini biðlara | API-lykill | Skírteini banka |
|---|---|---|---|---|
| Landsbankinn | Já | Já | Já | — |
| Arion banki | Já | Já | — | — |
| Íslandsbanki | Já | — | — | Já |
| Kvika banki | Já | Já | — | — |
| Sparisjóðir | Já | Já | — | — |

## Hvar leyndarmálin eru geymd

Gildin fara í dulkóðaða geymslu sem tilheyrir viðbótinni. Þau eru aldrei skrifuð í töflu, aldrei send með fjarmælingum og aldrei birt aftur eftir skráningu — síðan segir aðeins hvort gildi sé til staðar.

Þar sem hver viðbót hefur sína eigin geymslu er **ekki hægt** að flytja leyndarmál úr eldri PTE- eða Cloud Events-bankaforritum. Þegar Bifröst Ísland Fjárstýring er sett upp við hlið slíks forrits eru notandanafn bankans og aðrar stillingar afritaðar, en hvert lykilorð, skírteini og API-lykil þarf að skrá einu sinni á þessari síðu.

## Auðkenni einstakra notenda

Notandi sem hefur eigin innskráningu hjá banka getur skráð sitt eigið notandanafn í **notandastillingum Bifrastar** og eigið lykilorð þar. Þegar notandanafn er skráð fyrir notanda notar tengingin lykilorð þess notanda, aldrei lykilorð fyrirtækisins — þetta tvennt er alltaf notað saman, svo lykilorð sem skráð er fyrir eitt auðkenni er aldrei sent undir öðru.

## Tengdar síður

- [Uppsetningarleiðsögn fjárstýringar](./treasury-setup-wizard.md)
- [Leyndarmál banka](./treasury-secrets.md)
