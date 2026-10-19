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
