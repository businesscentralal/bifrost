---
id: scheduled-entry-card
title: "Spjald vinnsluraðarafærslu"
sidebar_label: "Spjald vinnsluraðarafærslu"
sidebar_position: 15
---

**Spjald vinnsluraðarafærslu** skilgreinir eitt verk undir eftirliti: hvað á að keyra, hvenær, hvernig á að bregðast við villum og hverjum á að tilkynna. Vinnsluraðarinn býr til og viðheldur undirliggjandi vinnsluraðafærslu út frá þessari skilgreiningu og endurskapar hana ef hún bregst eða hverfur.

Nýjar færslur eru búnar til lokaðar og með fyrsta keyrslutíma á núverandi dagsetningu, svo hægt sé að ljúka skilgreiningunni áður en verkið fer í gang.

## Almennt

| Reitur | Lýsing |
| --- | --- |
| **Gerð hluts til keyrslu** | Gerð hlutarins sem verkið keyrir – oftast kóðaeining eða skýrsla. |
| **Auðkenni hluts til keyrslu** | Auðkenni hlutarins sem á að keyra. Skyldureitur; síðan lokast ekki án hans. |
| **Heiti hluts til keyrslu** | Heiti hlutarins, fyllt út frá auðkenni hlutarins. |
| **Lýsing** | Lýsing færslunnar. Boraðu niður til að opna tengda færslu þegar færslan var búin til út frá einni. |
| **Gerð úttaks skýrslu** | Snið úttaks fyrir keyrsluna. Birtist aðeins þegar gerð hlutarins er _Skýrsla_. |
| **Flokkunarkóði vinnsluraða** | Flokkur vinnsluraða sem færslan tilheyrir. |
| **Notendauðkenni vinnsluraðar** | Notandinn sem á vinnsluraðafærsluna. Hann verður að hafa heimild til að keyra vinnsluraðafærslur; sé reiturinn auður er núverandi notandi notaður. Aðeins í staðbundinni uppsetningu. |
| **Lokað** | Kemur í veg fyrir að vinnsluraðarinn tímasetji færsluna. Nýjar færslur byrja lokaðar – hreinsaðu reitinn þegar skilgreiningin er tilbúin. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu þessarar færslu. |
| **Kóði auðkenna biðlara** | [Auðkenni biðlara](/help/orchestrator/credentials-list/) sem notað eru þegar þessi færsla kallar í ytri þjónustu. |
| **Fyrsti tími til keyrslu** | Fyrsta dagsetning og tími sem verkið má keyra. |
| **Endurtekningarsniðmát** | [Endurtekningarsniðmát](/help/orchestrator/recurring-template/) sem gefur áætlunina. Þegar sniðmát er valið verða reitirnir í endurtekningarhlutanum óbreytanlegir og fylgja sniðmátinu. |
| **Tímasett** | Sýnir hvort færslan hafi vinnsluraðafærslu á áætlun. |

## Endurprófanarstefna

| Reitur | Lýsing |
| --- | --- |
| **Endurprófanarstefna** | Hvernig vinnsluraðarinn bregst við villu. **Alltaf** – færslan er alltaf endurræst. **Þriggja sinnum** – færslan er aðeins endurræst meðan hún hefur mistekist færri en þrisvar. **Aldrei** – færslan er aldrei endurræst sjálfkrafa. |
| **Villur frá síðustu gangi** | Fjöldi villna í röð frá síðustu vel heppnuðu keyrslu. Teljarinn núllstillist þegar færslan keyrir með góðum árangri. |

## Endurtekning

Endurtekningarhlutinn er aðeins breytanlegur þegar **Endurtekningarsniðmát** er autt. Áætlunin er sannreynd þegar síðunni er lokað.

| Reitur | Lýsing |
| --- | --- |
| **Keyra á mánudegi … Keyra á sunnudegi** | Vikudagarnir sem verkið keyrir á. Að minnsta kosti einn dagur verður að vera valinn fyrir endurtekin verk. |
| **Tímabelti** | Tímabeltið sem áætlunin miðast við. Notaðu aðstoðarhnappinn til að velja tímabelti. |
| **Dagsetningarformúla næstu keyrslu** | Formúla sem reiknar næsta keyrsludag, til dæmis `1M` fyrir mánaðarlega keyrslu. |
| **Upphafstími** | Fyrsti tími dagsins sem endurtekna verkið má keyra. |
| **Lokatími** | Síðasti tími dagsins sem endurtekna verkið má keyra. |
| **Fjöldi mínútna milli keyrslu** | Lágmarksfjöldi mínútna milli tveggja keyrslna. |

## Tilkynning

| Reitur | Lýsing |
| --- | --- |
| **Gerð tilkynningar** | Hvernig tilkynnt er um keyrsluna: _Engin_, _Tölvupóstur_ eða _Telegram_. Þegar Telegram er valið er viðtakandinn fylltur út úr Telegram-spjallauðkenni þínu í notandauppsetningu ef það er skráð. |
| **Viðtakandi tilkynningar** | Heimilisfangið sem tilkynningin er send á – netfang eða Telegram-spjallauðkenni. Reiturinn er merktur skyldureitur þegar valin tilkynningagerð krefst viðtakanda. Notaðu aðstoðarhnappinn til að senda prófunartilkynningu. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Keyra einu sinni (forgrunni)** | Keyrir afrit af verkinu einu sinni, strax, í forgrunni. Gagnlegt til að prófa skilgreiningu áður en hún fer á áætlun. |
| **Enduráætla** | Eyðir núverandi vinnsluraðafærslu. Vinnsluraðarinn býr til nýja í næstu yfirferð. Færslan má ekki vera lokuð. |
| **Áætla núna** | Endurskapar vinnsluraðafærsluna svo verkið sé tímasett til keyrslu strax. Færslan má ekki vera lokuð. |
| **Aðgerðaskrá** | Opnar aðgerðaskrá færslunnar svo hægt sé að fara yfir fyrri keyrslur og villur. |
| **Vinnsluraðafærsla** | Opnar [Spjald vinnsluraðafærslu](/help/orchestrator/job-queue-entry-card/) fyrir undirliggjandi vinnsluraðafærslu. Aðeins virkt meðan slík færsla er til. |
