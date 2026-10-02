---
id: orchestrator-setup
title: "Uppsetning Bifröst Orchestrator"
sidebar_label: "Uppsetning Orchestrator"
sidebar_position: 17
---

**Uppsetning Bifröst Orchestrator** er eina uppsetningarsíða vinnsluraðaraeiningarinnar. Hún geymir stillingar stjórnunarfærslunnar í vinnsluröð sem fylgist með og endurræsir tímasett verk, stöðu Telegram-vélmennislykilsins og listann yfir vinnsluraðarafærslurnar sjálfar. Allt annað sem einingin stillir er aðgengilegt héðan með aðgerð.

Síðan er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar. Ein uppsetningarfærsla er til fyrir hvert fyrirtæki og hún verður til sjálfkrafa þegar síðan er opnuð í fyrsta sinn.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Kóði vinnsluraðarflokks** | Vinnsluraðarflokkurinn sem stjórnunarfærslan tilheyrir. Skylda — hann hópar verk vinnsluraðarans með þeim verkum sem hann hefur eftirlit með. |
| **Skrá virkni vinnsluraðar** | Kveikir á skráningu á virkni vinnsluraðar svo hægt sé að rýna keyrslur eftir á í virkniskránni. |
| **Notandaauðkenni vinnsluraðar** | Notandinn sem á stjórnunarfærsluna. Sá notandi verður að hafa heimild til að keyra vinnsluraðarfærslur. Autt þýðir núverandi notandi. Aðeins sýnt í staðbundnum uppsetningum. |
| **Staða vinnsluraðara** | Staða stjórnunarfærslunnar, ekki breytanleg. Kafið niður til að opna undirliggjandi vinnsluraðarfærslu og uppfæra stöðuna. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu sem vinnsluraðarinn framkvæmir. |
| **Telegram-vélmennislykill** | Staða, ekki breytanleg, sem sýnir hvort vélmennislykill hafi verið geymdur. Gildið sjálft er aldrei birt — það er í leyndarmálageymslu Bifrastar. |

## Vinnsluraðir

Hlutinn **Vinnsluraðir** sýnir vinnsluraðarafærslurnar sem eru skráðar í þessu fyrirtæki. Veljið línu og opnið hana til að komast á [spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/), þar sem tímasetningu, endurtekningarstefnu og tilkynningum þeirrar færslu er viðhaldið.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Bifröst keðjur** | Opnar [Bifröst keðjur](/help/orchestrator/playbooks/) til að skoða og stilla skilaboðakeðjur. |
| **Auðkenni biðlara** | Opnar [Auðkenni biðlara](/help/orchestrator/credentials-list/) til að stjórna auðkenningu gagnvart ytri þjónustum. |
| **Keyrsluskrá keðju** | Opnar [keyrsluskrá keðju](/help/orchestrator/playbook-instances/) fyrir keyrslur keðja. |
| **Leyndarmál forrits** | Opnar lista Bifrastar yfir leyndarmál forrita, síaðan á Bifröst Orchestrator, sem sýnir öll leyndarmál einingarinnar og hvort gildi hafi verið skráð. |
| **Vinnsluraðafærslur** | Opnar staðlaða listann [Vinnsluraðafærslur](/help/orchestrator/job-queue-entries/) svo sjá megi raunverulegu vinnsluraðarfærslurnar sem urðu til úr vinnsluraðarafærslunum. |
| **Endurtekningarsniðmát** | Opnar [endurtekningarsniðmát vinnsluraðar](/help/orchestrator/recurring-templates/) þar sem endurnýtanlegum tímasetningarmynstrum er viðhaldið. |
| **Endurræsa vinnsluröð** | Endurræsir stjórnunarfærsluna. Notið hana þegar staða vinnsluraðarans sýnir að röðin hafi stöðvast. |
| **Skrá Telegram-vélmennislykil** | Opnar sameiginlega hulda innsláttargluggann og geymir vélmennislykilinn í leyndarmálageymslu Bifrastar. |
| **Hreinsa Telegram-vélmennislykil** | Fjarlægir geymda vélmennislykilinn. Leyndarmálið er áfram skráð svo síðan sýnir áfram að gildis sé vænst. |

## Leyndarmál

Bifröst Orchestrator geymir öll auðkenni í leyndarmálageymslu Bifröst Foundation í stað eigin taflna: Telegram-vélmennislykilinn sem er notaður til að senda tilkynningar, og OAuth 2.0 biðlaraauðkenni og leyniorð hverrar færslu í [auðkennum biðlara](/help/orchestrator/credentials-card/). Gildin eru geymd á öruggan hátt í Business Central fyrir þetta fyrirtæki, eru aldrei sýnd aftur og rata hvorki í töflu, skrá né fjarmælingar.

Business Central heldur geymdum leyndarmálum aðskildum eftir viðbótum, svo gildi sem voru skráð í eldri útgáfu forritsins — eða í eldri vinnsluraðara Origo Cloud Events — flytjast ekki með. Skráið hvert gildi einu sinni eftir uppsetningu.

## HTTP á útleið

Telegram-tilkynningar og köll í ytri þjónustur fara um HTTP, svo viðbótin þarf að mega senda HTTP-biðlarabeiðnir. Uppsetningarleiðsögn Bifrastar kveikir á þeim fyrir öll uppsett Bifröst-forrit í einu. Þangað til birtir síðan **Uppsetning Bifrastar** tilkynningu með aðgerðinni **Hefja uppsetningarleiðsögn**, og allt sem þarf HTTP mistekst með villu um að HTTP-biðlarabeiðnir séu ekki virkar fyrir viðbótina.

Eigin [leiðsagnaruppsetning](/help/orchestrator/scheduler-setup-wizard/) Orchestrator athugar líka HTTP á útleið og ræsir stjórnunarvinnsluröðina.

## Fyrstu skref

1.  Opnið **Uppsetningu Bifrastar**. Ef hún sýnir HTTP-tilkynninguna, veljið þá fyrst **Hefja uppsetningarleiðsögn** og ljúkið leiðsögninni.
2.  Keyrið leiðsagnaruppsetninguna [Uppsetning Bifröst Orchestrator](/help/orchestrator/scheduler-setup-wizard/) til að ræsa stjórnunarvinnsluröðina.
3.  Opnið þessa síðu úr flokknum **Forrit** á **Uppsetningu Bifrastar** og athugið að **Staða vinnsluraðara** sýni að röðin sé í gangi.
4.  Sláið inn Telegram-vélmennislykilinn og þau auðkenni biðlara sem færslur og keðjur nota.

## Ábendingar

-   Ef stöðureiturinn sýnir að röðin sé ekki í gangi, notið annaðhvort **Endurræsa vinnsluröð** hér eða keyrið [leiðsagnaruppsetninguna](/help/orchestrator/scheduler-setup-wizard/).
-   Telegram-vélmennislykilinn þarf aðeins þegar vinnsluraðarafærsla eða tímasett keðja notar tilkynningategundina _Telegram_.
