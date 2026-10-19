---
id: orchestrator-setup
title: "Uppsetning Bifröst stjórnanda"
sidebar_label: "Uppsetning Bifröst stjórnanda"
sidebar_position: 17
---

**Uppsetning Bifröst stjórnanda** er uppsetningarsíða Bifröst stjórnanda, fyrir kerfisstjórann sem setur
forritið upp. Þar eru stillingar stjórnunarvinnsluraðafærslunnar sem fylgist með og endurræsir verkin
sem eru undir eftirliti, staða Telegram-vélmennislykilsins og listi yfir vinnsluraðarfærslurnar.
Keðjur, auðkenni biðlara, keyrsluskrá keðja og leyndarmál forritsins eru opnuð héðan.

Opnaðu síðuna með **Uppsetning Bifröst stjórnanda** í flokknum **Forrit** á
[Uppsetning Bifröst](/help/foundation/bifrost-setup/). Ein uppsetningarfærsla er fyrir hvert fyrirtæki;
hún er stofnuð þegar síðan er opnuð í fyrsta sinn. Síðan sýnir engar tilkynningar sjálf: það sem enn á
eftir að setja upp er sýnt á Uppsetning Bifröst.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Flokkunarkóði vinnsluraða** | Vinnsluraðaflokkur stjórnunarvinnsluraðafærslunnar. Skyldureitur. |
| **Skrá virkni vinnsluraða** | Skráir í aðgerðaskrá hvað Bifröst stjórnandinn gerir við hverja færslu undir eftirliti; **Aðgerðaskrá** á færsluspjaldinu sýnir hana. |
| **Notendaauðkenni** | Notandinn sem á stjórnunarvinnsluraðafærsluna. Hann verður að hafa heimild til að keyra vinnsluraðafærslur. Sé reiturinn auður er núverandi notandi notaður. Aðeins sýnt í staðbundinni uppsetningu. Gervigreindarfulltrúi getur ekki breytt þessum reit í gegnum Bifröst; breyttu honum hér. |
| **Staða vinnsluraðara** | Hvort stjórnunarvinnsluraðafærslan sé í gangi. Veldu gildið til að opna þá vinnsluraðafærslu; sé hún ekki til býðst þér að tímasetja hana. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu. |

## Telegram {#telegram}

| Reitur | Lýsing |
| --- | --- |
| **Telegram-vélmennislykill** | **Skráð** þegar vélmennislykillinn sem sendir Telegram-tilkynningar hefur verið skráður, annars **Ekki skráð**. Gildið er geymt í leyndarmálageymslu Bifröst og er aldrei sýnt. |

## Vinnsluraðarfærslur {#orchestrator-entries}

Hlutinn **Vinnsluraðarfærslur** sýnir vinnsluraðarfærslur fyrirtækisins: hvert verk sem Bifröst
stjórnandi hefur eftirlit með, ásamt hlut, áætlun, tilkynningu og stöðu. Opnaðu línu til að vinna á
[Spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/). Sjá
[Vinnsluraðarfærslur](/help/orchestrator/scheduled-entry-subform/) um dálka og aðgerðir hlutans.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Endurræsa vinnsluröð** | Endurræsir stjórnunarvinnsluraðafærsluna. Notaðu hana þegar **Staða vinnsluraðara** sýnir að hún sé ekki í gangi. |
| **Skrá Telegram-vélmennislykil** | Opnar gluggann [Skrá leyndarmál](/help/foundation/set-secret-dialog/) þar sem þú slærð inn vélmennislykilinn. |
| **Hreinsa Telegram-vélmennislykil** | Fjarlægir geymda vélmennislykilinn þegar þú hefur staðfest. |
| **Uppsetningarleiðsögn** | Opnar [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/), sem leyfir HTTP-beiðnir fyrir öll Bifröst-forrit og fer yfir auðkenni hvers forrits. |
| **Bifröst keðjur** | Opnar [Bifröst keðjur](/help/orchestrator/playbooks/). |
| **Auðkenni biðlara** | Opnar [Auðkenni biðlara](/help/orchestrator/credentials-list/), auðkennispörin sem notuð eru fyrir ytri þjónustur. |
| **Keyrsluskrá keðju** | Opnar [Keyrsluskrá keðju](/help/orchestrator/playbook-instances/). |
| **Leyndarmál forrits** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/) síað á Bifröst stjórnanda: öll leyndarmál sem forritið þarf og hvort gildi hafi verið skráð. |
| **Vinnsluraðafærslur** | Opnar staðlaða listann [Vinnsluraðafærslur](/help/orchestrator/job-queue-entries/). |
| **Endurtekningarsniðmát** | Opnar [Endurtekningarsniðmát vinnsluraða](/help/orchestrator/recurring-templates/), endurnýtanlegar áætlanir. |

## Leyndarmál {#secrets}

Bifröst stjórnandi geymir leyndarmál sín í leyndarmálageymslu Bifröst, aldrei á síðu eða í töflu:
Telegram-vélmennislykilinn, og biðlaraauðkenni og leyniorð hvers
[auðkennispars biðlara](/help/orchestrator/credentials-card/). Þau eru geymd fyrir þetta fyrirtæki og
aldrei sýnd aftur. Skráðu þau hér, á spjaldi auðkenna biðlara eða í Uppsetningarleiðsögn Bifröst.

## Fyrstu skref {#getting-started}

1. Á **Uppsetning Bifröst** skaltu keyra uppsetningarleiðsögnina ef tilkynning biður þig um það. Hún
   leyfir Bifröst-forritunum að senda HTTP-beiðnir, sem Telegram-tilkynningar og köll í ytri þjónustur
   þurfa.
2. Keyrðu aðstoðuðu uppsetninguna [Uppsetning Bifröst stjórnanda](/help/orchestrator/scheduler-setup-wizard/)
   til að ræsa stjórnunarvinnsluröðina.
3. Opnaðu þessa síðu og athugaðu að **Staða vinnsluraðara** sýni vinnsluröðina í gangi.
4. Ef þú vilt Telegram-tilkynningar skaltu velja **Skrá Telegram-vélmennislykil**. Hver sem fær þær þarf
   **Telegram-spjallauðkenni** í [Ritli notandauppsetningar](/help/foundation/bifrost-user-setup-editor/).
5. Bættu við þeim auðkennum biðlara sem færslurnar þurfa, og settu vinnsluraðafærslurnar sem á að fylgjast
   með undir Bifröst stjórnanda með **Bæta við Bifröst stjórnandann** á
   [Vinnsluraðafærslur](/help/orchestrator/job-queue-entries/).

## Ábendingar {#tips}

- Ef staðan sýnir að vinnsluröðin sé ekki í gangi skaltu velja **Endurræsa vinnsluröð** eða keyra
  [aðstoðuðu uppsetninguna](/help/orchestrator/scheduler-setup-wizard/) aftur.
- Telegram-vélmennislykilinn þarf aðeins þegar vinnsluraðarfærsla eða tímasett keðja notar
  tilkynningagerðina _Telegram_, eða þegar aðstoðarmaður sendir Telegram-skilaboð.
