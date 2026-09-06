---
id: nornir-setup
title: "Uppsetning Bifröst Nornir"
sidebar_label: "Uppsetning Nornir"
sidebar_position: 17
---

**Uppsetning Bifröst Nornir** er eina uppsetningarsíða vinnsluraðaraeiningarinnar. Hún geymir stillingar stjórnunarfærslunnar í vinnsluröð sem fylgist með og endurræsir tímasett verk, stöðu Telegram-vélmennislykilsins og listann yfir vinnsluraðarafærslurnar sjálfar. Allt annað sem einingin stillir er aðgengilegt héðan með aðgerð.

Síðan er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar. Ein uppsetningarfærsla er til fyrir hvert fyrirtæki og hún verður til sjálfkrafa þegar síðan er opnuð í fyrsta sinn.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Kóði vinnsluraðarflokks** | Vinnsluraðarflokkurinn sem stjórnunarfærslan tilheyrir. Skylda — hann hópar verk vinnsluraðarans með þeim verkum sem hann hefur eftirlit með. |
| **Skrá virkni vinnsluraðar** | Kveikir á skráningu á virkni vinnsluraðar svo hægt sé að rýna keyrslur eftir á í virkniskránni. |
| **Notandaauðkenni vinnsluraðar** | Notandinn sem á stjórnunarfærsluna. Sá notandi verður að hafa heimild til að keyra vinnsluraðarfærslur. Autt þýðir núverandi notandi. Aðeins sýnt í staðbundnum uppsetningum. |
| **Staða vinnsluraðara** | Staða stjórnunarfærslunnar, ekki breytanleg. Kafið niður til að opna undirliggjandi vinnsluraðarfærslu og uppfæra stöðuna. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu sem vinnsluraðarinn framkvæmir. |
| **Telegram-vélmennislykill** | Staða, ekki breytanleg, sem sýnir hvort vélmennislykill hafi verið geymdur. Gildið sjálft er aldrei birt — það er í leyndarmálageymslu Bifrastar undir kóðanum `TELEGRAM-BOT-TOKEN`. |

## Vinnsluraðir

Hlutinn **Vinnsluraðir** sýnir vinnsluraðarafærslurnar sem eru skráðar í þessu fyrirtæki. Veljið línu og opnið hana til að komast á [spjald vinnsluraðarafærslu](/help/nornir/scheduled-entry-card/), þar sem tímasetningu, endurtekningarstefnu og tilkynningum þeirrar færslu er viðhaldið.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Bifröst keðjur** | Opnar [Bifröst keðjur](/help/nornir/playbooks/) til að skoða og stilla skilaboðakeðjur. |
| **Auðkenni biðlara** | Opnar [Auðkenni biðlara](/help/nornir/credentials-list/) til að stjórna auðkenningu gagnvart ytri þjónustum. |
| **Keyrsluskrá keðju** | Opnar [keyrsluskrá keðju](/help/nornir/playbook-instances/) fyrir keyrslur keðja. |
| **Leyndarmál forrits** | Opnar lista Bifrastar yfir leyndarmál forrita, síaðan á Bifröst Nornir, sem sýnir öll leyndarmál einingarinnar og hvort gildi hafi verið skráð. |
| **Vinnsluraðafærslur** | Opnar staðlaða listann [Vinnsluraðafærslur](/help/nornir/job-queue-entries/) svo sjá megi raunverulegu vinnsluraðarfærslurnar sem urðu til úr vinnsluraðarafærslunum. |
| **Endurtekningarsniðmát** | Opnar [endurtekningarsniðmát vinnsluraðar](/help/nornir/recurring-templates/) þar sem endurnýtanlegum tímasetningarmynstrum er viðhaldið. |
| **Endurræsa vinnsluröð** | Endurræsir stjórnunarfærsluna. Notið hana þegar staða vinnsluraðarans sýnir að röðin hafi stöðvast. |
| **Skrá Telegram-vélmennislykil** | Opnar sameiginlega hulda innsláttargluggann og geymir vélmennislykilinn í leyndarmálageymslu Bifrastar. |
| **Hreinsa Telegram-vélmennislykil** | Fjarlægir geymda vélmennislykilinn. Leyndarmálið er áfram skráð svo síðan sýnir áfram að gildis sé vænst. |

## Leyndarmál

Bifröst Nornir geymir öll auðkenni í leyndarmálageymslu Bifröst-grunnsins í stað eigin taflna. Gildin eru skrifuð í einangraða geymslu, eru aldrei sýnd aftur og rata hvorki í töflu, skrá né fjarmælingar.

| Kóði leyndarmáls | Umfang | Notað fyrir |
| --- | --- | --- |
| `TELEGRAM-BOT-TOKEN` | Fyrirtæki | Telegram Bot API-lykillinn sem er notaður til að senda tilkynningar. |
| `CREDENTIAL-<Kóði>-CLIENT-ID` | Fyrirtæki | OAuth 2.0 biðlaraauðkenni einnar færslu í [auðkennum biðlara](/help/nornir/credentials-card/). |
| `CREDENTIAL-<Kóði>-CLIENT-SECRET` | Fyrirtæki | OAuth 2.0 leyniorð biðlara fyrir sömu færslu. |

Business Central heldur geymdum leyndarmálum aðskildum eftir viðbótum, svo gildi sem voru skráð í eldri útgáfu forritsins — eða í eldri vinnsluraðara Origo Cloud Events — flytjast ekki með. Skráið hvert gildi einu sinni eftir uppsetningu.

## Tilkynning við uppsetningu

Þegar síðan er opnuð athugar viðbótin tvennt og birtir tilkynningu ef annað hvort vantar:

| Staða | Skilaboð |
| --- | --- |
| **HTTP lokað og röðin ekki í gangi** | HTTP-biðlarabeiðnir eru lokaðar og vinnsluröð vinnsluraðarans er ekki í gangi. |
| **Aðeins HTTP lokað** | HTTP-biðlarabeiðnir eru ekki virkar fyrir þessa viðbót. |
| **Aðeins röðin ekki í gangi** | Vinnsluröð vinnsluraðarans er ekki í gangi. |

Hver tilkynning ber aðgerðina **Keyra leiðsagnarforrit** sem opnar [leiðsagnaruppsetninguna](/help/nornir/scheduler-setup-wizard/) á því skrefi sem lagar vandann.

Önnur tilkynning telur þau leyndarmál sem hafa ekkert gildi enn, með aðgerð sem opnar listann yfir leyndarmál forritsins. Hún hverfur þegar öll skráð leyndarmál hafa verið slegin inn.

## Ábendingar

-   Ef stöðureiturinn sýnir að röðin sé ekki í gangi, notið annaðhvort **Endurræsa vinnsluröð** hér eða keyrið [leiðsagnaruppsetninguna](/help/nornir/scheduler-setup-wizard/).
-   Telegram-vélmennislykilinn þarf aðeins þegar vinnsluraðarafærsla eða tímasett keðja notar tilkynningategundina _Telegram_.
