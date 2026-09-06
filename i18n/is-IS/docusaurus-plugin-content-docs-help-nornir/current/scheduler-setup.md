---
id: scheduler-setup
title: "Uppsetning vinnsluraðara"
sidebar_label: "Uppsetning vinnsluraðara"
sidebar_position: 17
---

Síðan **Uppsetning vinnsluraðara** er miðlæg uppsetningarsíða fyrir tímasetningu í Bifröst Nornir. Hún geymir stillingar fyrir stjórnunarvinnsluraðafærsluna sem fylgist með og endurræsir tímasett verk, Telegram-vélmennislykilinn sem notaður er fyrir tilkynningar, og lista yfir vinnsluraðarafærslurnar sjálfar.

Ein uppsetningarfærsla er til í hverju fyrirtæki og hún er búin til sjálfkrafa í fyrsta skipti sem síðan er opnuð.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Flokkunarkóði vinnsluraða** | Flokkurinn sem stjórnunarvinnsluraðafærslan tilheyrir. Reiturinn er skyldureitur og tengir verk vinnsluraðarans við þau verk sem hann hefur eftirlit með. |
| **Skrá verkvirkni vinnsluraða** | Kveikir á skráningu vinnsluraðavirkni svo hægt sé að fara yfir keyrslur eftir á í aðgerðaskránni. |
| **Notendauðkenni vinnsluraðar** | Notandinn sem á stjórnunarvinnsluraðafærsluna. Sá notandi verður að hafa heimild til að keyra vinnsluraðafærslur. Sé reiturinn auður er núverandi notandi notaður. Reiturinn birtist aðeins í staðbundinni uppsetningu. |
| **Staða vinnsluraðara** | Óbreytanleg staða stjórnunarvinnsluraðafærslunnar. Boraðu niður til að opna undirliggjandi vinnsluraðafærslu og uppfæra stöðuna. |
| **Senda fjarmælingar** | Þegar kveikt er á þessu eru fjarmælingar sendar fyrir hverja keyrslu sem vinnsluraðarinn framkvæmir. |
| **Telegram-vélmennislykill** | Telegram-lykillinn sem notaður er til að senda tilkynningar. Gildið er hulmið og geymt á öruggan hátt – þegar það hefur verið vistað birtist það sem `***` og hægt er að skipta því út en ekki lesa það. |
| **Vélmennislykill stilltur** | Óbreytanleg vísbending um hvort Telegram-vélmennislykill hafi verið vistaður. |

## Vinnsluraðir

Hlutinn **Vinnsluraðir** neðst á síðunni sýnir vinnsluraðarafærslurnar sem skráðar eru í þessu fyrirtæki. Veldu línu og opnaðu hana til að komast á [Spjald vinnsluraðarafærslu](/help/nornir/scheduled-entry-card/) þar sem áætlun, endurprófanarstefna og tilkynningar eru stillt.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Vinnsluraðafærslur** | Opnar staðlaðan lista [Vinnsluraðafærslur](/help/nornir/job-queue-entries/) svo hægt sé að sjá þær vinnsluraðafærslur sem búnar hafa verið til út frá vinnsluraðarafærslunum. |
| **Endurtekningarsniðmát** | Opnar [Endurtekningarsniðmát vinnsluraða](/help/nornir/recurring-templates/) þar sem endurnýtanleg áætlunarmynstur eru vistuð. |
| **Endurræsa vinnsluröð** | Endurræsir stjórnunarvinnsluraðafærsluna. Notaðu þetta þegar staðan sýnir að röðin hafi stöðvast. |

## Ábendingar

-   Ef stöðureiturinn sýnir að röðin sé ekki í gangi skaltu nota **Endurræsa vinnsluröð** hér eða keyra [uppsetningarleiðsögnina](/help/nornir/scheduler-setup-wizard/).
-   Telegram-vélmennislykilinn þarf aðeins þegar vinnsluraðarafærsla eða tímasett keðja notar tilkynningagerðina _Telegram_.
-   Auðkenni biðlara sem notað eru til að kalla í ytri þjónustur eru vistuð sér á [Auðkenni biðlara](/help/nornir/credentials-list/).
