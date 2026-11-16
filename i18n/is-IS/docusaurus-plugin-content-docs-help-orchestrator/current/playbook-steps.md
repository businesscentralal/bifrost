---
id: playbook-steps
title: "Keðjuskref"
sidebar_label: "Keðjuskref"
sidebar_position: 23
---

Hlutinn **Skref** á spjaldinu [Bifröst keðja](/help/orchestrator/playbook-card/) er þar sem keðja er byggð upp: ein lína fyrir hvert skref, hvert skref keyrir eina Bifröst aðgerð, í þeirri röð sem skrefin keyra. Skrefnúmer eru gefin um leið og línum er bætt við og hvert skref segir til um hvaða skref kemur næst, svo keðja getur greinst eftir niðurstöðu.

Skref sem ítra yfir fylki eru inndregin og óvirk skref eru daufari. Veldu skref til að sjá skilyrði þess í hlutanum [Skilyrði skrefa](/help/orchestrator/playbook-conditions/) og beiðni þess í upplýsingareitnum [Sniðmát beiðni](/help/orchestrator/playbook-step-template-fact-box/).

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Skrefnúmer** | Raðnúmer skrefsins. |
| **Síðasta keyrsla** | Niðurstaða skrefsins í síðustu keyrslu: ✓ lokið, ✗ mistókst, – sleppt, · ekki keyrt. Autt þegar keðjan hefur ekki keyrt. |
| **Lýsing** | Hvað skrefið gerir. |
| **Skilaboðagerð** | Aðgerðin sem skrefið keyrir. Aðgerðirnar sem eru uppsettar í Business Central eru taldar upp á síðunni **Bifrost Message Types**. |
| **Slóð fylkis til ítrunar** | JSON-slóð að fylki í svari fyrra skrefs. Skrefið keyrir þá einu sinni fyrir hvern hlut. Skildu eftir autt fyrir eitt kall. |
| **Upprunaskref ítrunar** | Fyrra skrefið sem inniheldur fylkið í svari sínu. |
| **Tegund skrefs** | **Aðgerð**: ósatt árangursskilyrði telst villa. **Athugun**: skilyrðið er einfaldlega svarið og fellir ekki keyrsluna. |
| **Slóðir samantektar** | Slóðir í svari sem afritast í keyrsluskýrslu þessa skrefs. Hafðu listann stuttan; hann fer í skýrsluna, ekki í síðari skref. |
| **Undanskilja frá stöðu keyrslu** | Heldur skrefinu utan við stöðu keyrslu og skýrslu. Notist fyrir skýrsluskrefin sjálf. |
| **Næsta skref (árangur)** | Skrefið sem haldið er áfram í þegar skrefið tekst. `0` lýkur keðjunni. Óvirkt eða sleppt skref heldur líka áfram hingað. |
| **Næsta skref (misbrestur)** | Skrefið sem haldið er áfram í þegar skrefið mistekst. `0` lýkur keðjunni. |
| **Stöðva við villu hlutar** | Stöðvar keðjuna þegar einn hlutur í ítrun mistekst, í stað þess að halda áfram með hina hlutina. |
| **Óvirkt** | Keðjan sleppir skrefinu án þess að keyra það. |

## Algeng verk {#common-tasks}

- **Bæta við skrefi:** skráðu nýja línu, veldu aðgerðina í **Skilaboðagerð** og skrifaðu beiðni hennar í upplýsingareitinn **Sniðmát beiðni**.
- **Greina eftir niðurstöðu:** settu ólík skref í **Næsta skref (árangur)** og **Næsta skref (misbrestur)**, og bættu við árangursskilyrðum ef svar aðgerðarinnar, ekki aðeins það að henni ljúki, á að ráða leiðinni.
- **Vinna úr lista:** láttu **Upprunaskref ítrunar** og **Slóð fylkis til ítrunar** vísa á fylkið sem fyrra skref skilaði.
- **Prófa breytingu:** veldu **Keyra núna** á spjaldinu og skoðaðu dálkinn **Síðasta keyrsla**.

## Biðja mállíkan um úrskurð {#ask-a-language-model-for-a-verdict}

Þegar ekki er hægt að skrifa reglu sem síu („er þessi viðskiptamaður rétt uppsettur?“) getur **Athugun** beðið mállíkan um úrskurð (stenst, stenst ekki eða óvíst) og látið líkanið fletta upp gögnum. Líkanið les eingöngu og getur ekki breytt gögnum. Hvað uppflettingin getur og getur ekki er lýst undir [Bifröst mállíkön](/language-models/).

- **Gerð skrefsins:** **Athugun** sem endurtekur sig fyrir hverja færslu fyrra skrefs, þar sem **Upprunaskref ítrunar** og **Slóð fylkis til ítrunar** vísa á færslur þess skrefs. Árangursskilyrðin eru að svarið barst, að svarið passaði við umbeðið form og að úrskurðurinn sé „stenst“.
- **Hvað hver niðurstaða þýðir:** „stenst“ þýðir að hluturinn tókst. „Stenst ekki“ eða „óvíst“ þýðir að hluturinn er athugaður og þarfnast athygli: athugunin svaraði nei og keyrslan mistekst ekki. Ef líkanið gat ekki keyrt er hluturinn villa og telst misbrestur keyrslunnar.
- **Geymdu niðurstöðurnar:** notaðu **Niðurstöðuskráningarslóðir** til að geyma úrskurðinn og athugasemdirnar, og ástæðu þess að keyrsla stöðvaðist, fyrir hvern hlut.
- **Skýrðu frá fjölda:** taktu fjölda hluta eftir niðurstöðu úr talningu skrefsins í skýrslu keyrslunnar. **Slóðir samantektar** á endurteknu skrefi geyma aðeins síðasta hlutinn.
- **Hugaðu að kostnaði:** hver hlutur er ein keyrsla líkans og hver uppflettun sem hún gerir er talin skilaboð (sjá [Notkun og reikningsfærsla](/licensing/usage-and-billing/)). Kostnaðurinn vex með fjölda færslna sem fyrra skrefið les, svo takmarkaðu það sem það les.
- **Keyrðu án tímamarka:** keyrsla sem er ræst með **Keyra núna**, samkvæmt tímaáætlun eða með því að setja hana í biðröð hefur engin tímamörk biðlara. Aðstoðarmaður eða kerfi sem ræsir keðju og bíður eftir svari getur farið yfir tímamörk fyrst; fyrir langar keyrslur ætti það að setja keðjuna í biðröð í stað þess að bíða.
- **Öruggt að tímasetja:** úrskurðarkeðja skrifar ekkert og er því óhætt að tímasetja hana þegar þú hefur prófað hana. Keðja sem bregst við úrskurðinum bætir við eigin skrifskrefi, sem þú stýrir sérstaklega.
- **Fyrir aðstoðarmann:** aðstoðarmaður sem er tengdur Bifröst les uppsettar aðgerðir og dæmi þeirra í beinni með `list_domains`, `describe_domains` og `describe_message_type`.
