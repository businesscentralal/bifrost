---
id: docex-setup
title: "Uppsetning Bifröst DocEx"
sidebar_label: "Uppsetning DocEx"
sidebar_position: 2
---

**Uppsetning Bifröst DocEx** er eina uppsetningarsíða skjalaskiptaeiningarinnar. Hún er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar og geymir einn hluta fyrir hvern þjónustuaðila: umhverfið sem talað er við, stöðu innskráningarupplýsinga og aðgerðirnar sem skrá, hreinsa og prófa þær.

Ein uppsetningarfærsla er til fyrir hvert fyrirtæki og hún verður til sjálfkrafa þegar síðan er opnuð í fyrsta sinn.

## Þjónustuaðilar

Hver hópur hefur reitinn **Umhverfi** sem velur hvaða þjónustu einingin kallar á — venjulega Live eða Test — og stöðuna **Innskráningarupplýsingar**, sem er ekki breytanleg og sýnir hvort þau gildi sem sá aðili þarf hafi verið skráð.

| Hópur | Reitir |
| --- | --- |
| **Advania** | Umhverfi, notandanafn vefviðmóts, staða innskráningarupplýsinga. |
| **Unimaze** | Umhverfi, staða innskráningarupplýsinga. |
| **InExchange** | Umhverfi, staða innskráningarupplýsinga. |
| **BIS30 uppflettigögn** | Umhverfi. Peppol-uppflettilistarnir þurfa engin auðkenni. |

Þegar umhverfi er breytt breytist hvaða leyndarmál einingin les: innskráningarupplýsingar eru geymdar bæði eftir þjónustuaðila **og** umhverfi, svo prófunarlykill berst aldrei inn í raunkall.

## Innskráningarupplýsingar

Innskráningarupplýsingar eru aldrei reitir á þessari síðu. Þær eru í leyndarmálageymslu Bifrastar og aldrei sýndar aftur — síðan segir aðeins hvort gildi sé til.

Hver þjónustuaðili þarf sín eigin gildi, geymd fyrir hvert umhverfi:

| Þjónustuaðili | Gildi |
| --- | --- |
| Advania | Notandanafn og lykilorð fyrir vefþjónustu Advania. |
| Unimaze | Notandanafn og lykilorð (lykilorðsreiturinn tekur einnig við API-lykli). |
| InExchange | API-lykill og biðlaratókinn sem auðkennir fyrirtækið. |

Innskráningarupplýsingar sem voru skráðar í Origo Cloud Events DocEx flytjast ekki með. Skráið hvert gildi einu sinni eftir uppsetningu.

## Aðgerðir

| Hópur | Aðgerð | Lýsing |
| --- | --- | --- |
| **Advania** | Skrá notandanafn / Skrá lykilorð | Opnar sameiginlega hulda innsláttargluggann og geymir gildið fyrir valið umhverfi. |
| | Hreinsa innskráningarupplýsingar | Fjarlægir bæði geymdu gildin fyrir valið umhverfi. |
| | Prófa Advania tengingu | Kallar á þjónustuaðilann með geymdum upplýsingum og segir frá niðurstöðunni. |
| | Opna Advania vefviðmót | Opnar auðkennda lotu í vefviðmóti Advania. |
| **Unimaze** | Skrá notandanafn / Skrá lykilorð eða API lykil | Geymir gildið fyrir valið umhverfi. |
| | Hreinsa innskráningarupplýsingar | Fjarlægir bæði geymdu gildin. |
| | Prófa Unimaze tengingu | Staðfestir geymdu upplýsingarnar. |
| **InExchange** | Skrá API lykil / Skrá biðlaratóka | Geymir gildið fyrir valið umhverfi. |
| | Hreinsa innskráningarupplýsingar | Fjarlægir bæði geymdu gildin. |
| | Prófa InExchange tengingu | Staðfestir geymdu upplýsingarnar. |
| **Almennt** | Leyndarmál forrits | Opnar lista Bifrastar yfir leyndarmál forrita, síaðan á Bifröst Iceland DocEx: öll leyndarmál einingarinnar og hvort gildi hafi verið skráð. |
| | Uppfæra BII gagnaskiptaskilgreiningar | Endurgerir gagnaskiptaskilgreiningarnar `BIIINVOICE` og `BIICREDITMEMO`. Keyrið hana ef þið flytjið inn skjöl á innleið. |
| | BIS30 kóðavörpun | Opnar [BIS30 kóðavörpun](/help/iceland-docex/bis30-code-map/). |
| | VSK fjárhagsreikningsvörpun | Opnar [VSK fjárhagsreikningsvörpun lánardrottins](/help/iceland-docex/vend-vat-gl-map/). |

## HTTP-beiðnir út á við

Allir þjónustuaðilar eru sóttir um HTTP. Uppsetningarleiðsögnin kveikir á HTTP-beiðnum út á við fyrir Bifröst-forritin: þar til það hefur verið gert birtir **Uppsetning Bifrastar** tilkynningu með aðgerðinni **Hefja uppsetningarleiðsögn**, og ekkert skjalaskiptakall tekst.

## Fyrstu skref

1.  Opnið **Uppsetningu Bifrastar**. Ef hún sýnir HTTP-tilkynninguna skuluð þið fyrst velja **Hefja uppsetningarleiðsögn**. Veljið síðan **Uppsetning Bifröst Iceland DocEx** í flokknum **Forrit**.
2.  Stillið **Umhverfi** fyrir hvern þjónustuaðila sem þið notið.
3.  Skráið innskráningarupplýsingar þeirra aðila með **Skrá …** aðgerðunum.
4.  Veljið **Prófa … tengingu** fyrir hvern aðila og staðfestið að hún takist.
5.  Veljið **Uppfæra BII gagnaskiptaskilgreiningar** ef þið flytjið inn skjöl á innleið.
6.  Sendið og takið á móti skjölum gegnum Bifröst, til dæmis með því að biðja gervigreindaraðstoðarmanninn.
