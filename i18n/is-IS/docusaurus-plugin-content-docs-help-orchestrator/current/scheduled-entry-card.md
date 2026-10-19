---
id: scheduled-entry-card
title: "Spjald vinnsluraðarafærslu"
sidebar_label: "Spjald vinnsluraðarafærslu"
sidebar_position: 15
---

**Spjald vinnsluraðarafærslu** skilgreinir eitt verk sem Bifröst stjórnandi hefur eftirlit með: hvað á að
keyra, hvenær, hvað gera skal ef það bregst og hverjum á að tilkynna. Bifröst stjórnandi stofnar
vinnsluraðafærsluna út frá þessari skilgreiningu og endurskapar hana ef hún bregst eða hverfur.

Opnaðu spjaldið úr hlutanum **Vinnsluraðarfærslur** á
[Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/), með
**Vinnsluraðarstjórafærsla** á tímasettri keðju, eða með því að velja **Bæta við Bifröst stjórnandann** á
[vinnsluraðafærslu](/help/orchestrator/job-queue-entries/).

Ný færsla byrjar lokuð, með **Fyrsti tími til keyrslu** stilltan á núna, svo þú getir lokið
skilgreiningunni áður en verkið keyrir.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Gerð hluts til keyrslu** | Hvort verkið keyrir _Skýrsla_ eða _Kóðaeining_. |
| **Auðkenni hluts til keyrslu** | Auðkenni hlutarins sem á að keyra. Skyldureitur: ekki er hægt að loka spjaldinu án hans. |
| **Heiti hluts til keyrslu** | Heiti hlutarins. |
| **Lýsing** | Lýsing færslunnar. Þegar færslan var stofnuð fyrir aðra færslu velur þú gildið til að opna hana. |
| **Gerð skýrsluúttaks** | Úttakssnið skýrslunnar. Aðeins sýnt þegar **Gerð hluts til keyrslu** er _Skýrsla_. |
| **Flokkunarkóði vinnsluraða** | Vinnsluraðaflokkur færslunnar. |
| **Notendaauðkenni** | Notandinn sem á vinnsluraðafærsluna og keyrir hana með sínum heimildum. Hann verður að hafa heimild til að keyra vinnsluraðafærslur. Sé reiturinn auður er núverandi notandi notaður. Aðeins sýnt í staðbundinni uppsetningu. |
| **Lokað** | Kemur í veg fyrir að Bifröst stjórnandi tímasetji færsluna. Hreinsaðu reitinn þegar skilgreiningin er tilbúin. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu færslunnar. |
| **Kóði biðlaraauðkenningar** | [Auðkenni biðlara](/help/orchestrator/credentials-list/) sem eru notuð þegar verkið kallar á ytri þjónustu. |
| **Fyrsti tími til keyrslu** | Fyrsta dagsetning og tími sem verkið má keyra. |
| **Kóði endurtekningarsniðmáts** | [Endurtekningarsniðmát](/help/orchestrator/recurring-template/) sem gefur áætlunina. Þegar það er valið fylgja reitirnir í **Endurtekning** sniðmátinu og ekki er hægt að breyta þeim. |
| **Tímasett** | Sýnir hvort vinnsluraðafærsla sé tímasett fyrir færsluna. |

## Endurprófunarreglur {#retry-policy}

| Reitur | Lýsing |
| --- | --- |
| **Endurprófunarreglur** | Hvað gerist þegar verkið bregst. _Alltaf_: færslan er alltaf endurræst. _Þrisvar sinnum_: færslan er aðeins endurræst meðan hún hefur brugðist færri en þrisvar í röð. _Aldrei_: færslan er ekki endurræst sjálfkrafa. |
| **Villur frá síðustu velgengni** | Fjöldi villna í röð frá síðustu heppnuðu keyrslu. Teljarinn núllstillist þegar verkið keyrir án villu. |

## Endurtekning {#recurrence}

Aðeins er hægt að breyta reitunum í **Endurtekning** þegar **Kóði endurtekningarsniðmáts** er auður.
Áætlunin er yfirfarin þegar þú lokar spjaldinu.

| Reitur | Lýsing |
| --- | --- |
| **Keyra á mánudögum** … **Keyra á sunnudögum** | Vikudagarnir sem verkið keyrir á. Endurtekið verk þarf að minnsta kosti einn. |
| **Tímabelti** | Tímabeltið sem áætlunin miðast við. Notaðu aðstoðarhnappinn til að velja það. |
| **Formúla næsta keyrsludags** | Dagsetningarformúla fyrir næsta keyrsludag, til dæmis `1M` fyrir mánaðarlega keyrslu. |
| **Upphafstími** | Fyrsti tími dagsins sem verkið má keyra. |
| **Lokatími** | Síðasti tími dagsins sem verkið má keyra. |
| **Fjöldi mínúta milli keyrslu** | Lágmarksfjöldi mínútna milli tveggja keyrslna. |

## Tilkynning {#notification}

| Reitur | Lýsing |
| --- | --- |
| **Gerð tilkynningar** | Hvernig þér er sagt frá því þegar verkið bregst eða er endurræst: _Engin_, _Tölvupóstur_ eða _Telegram_. Þegar þú velur _Telegram_ og **Viðtakandi tilkynningar** er auður er þitt eigið Telegram-spjallauðkenni úr Bifröst-notandauppsetningu þinni fyllt út. |
| **Viðtakandi tilkynningar** | Netfangið eða Telegram-spjallauðkennið sem tilkynningin fer á. Skyldureitur þegar tilkynningagerðin þarf viðtakanda. Notaðu aðstoðarhnappinn til að senda prófunartilkynningu. |

Gervigreindarfulltrúi getur ekki breytt **Notendaauðkenni** eða **Viðtakandi tilkynningar** í gegnum
almennar gagnaaðgerðir Bifröst, svo hver keyrir verkið og hvert tilkynningar þess fara er stillt á þessu
spjaldi. Aðstoðarmaður getur aðeins sett viðtakanda þegar hann tímasetur keðju fyrir þig.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Keyra einu sinni (forgrunni)** | Keyrir afrit af verkinu einu sinni, strax, í forgrunni. Notaðu hana til að prófa skilgreiningu áður en hún keyrir eftir áætlun. |
| **Endurtímasetja** | Fjarlægir núverandi vinnsluraðafærslu; Bifröst stjórnandi stofnar nýja í næstu yfirferð. Færslan má ekki vera lokuð. |
| **Áætla núna** | Endurskapar vinnsluraðafærsluna svo verkið sé tímasett til keyrslu strax. Færslan má ekki vera lokuð. |
| **Aðgerðaskrá** | Sýnir hvað Bifröst stjórnandi hefur gert við þessa færslu, svo sem endurræsingar og villur, þegar **Skrá virkni vinnsluraða** er valið á uppsetningarsíðunni. |
| **Vinnsluraðarafærsla** | Opnar [Spjald vinnsluraðafærslu](/help/orchestrator/job-queue-entry-card/) fyrir vinnsluraðafærslu færslunnar. Aðeins í boði meðan sú vinnsluraðafærsla er til. |
