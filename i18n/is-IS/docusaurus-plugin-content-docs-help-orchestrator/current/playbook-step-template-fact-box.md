---
id: playbook-step-template-fact-box
title: "Sniðmát beiðni"
sidebar_label: "Sniðmát beiðni"
sidebar_position: 25
---

Upplýsingareiturinn **Sniðmát beiðni** á spjaldinu [Bifröst keðja](/help/orchestrator/playbook-card/) geymir JSON-beiðnina sem skrefið, sem valið er í hlutanum [Skref](/help/orchestrator/playbook-steps/), sendir á aðgerð sína. Þú getur breytt henni beint í upplýsingareitnum eða opnað hana í stærri ritli.

Gildi sem er skrifað sem `@` og slóð á eftir er fyllt út þegar skrefið keyrir, úr því sem keðjan hefur safnað fram að því: til dæmis upphafsbeiðninni, gildum sem fyrri skref vistuðu eða núverandi hlut þegar skrefið ítrar yfir fylki. Stakt skref með autt sniðmát sendir upphafsbeiðni keðjunnar.

Til að sjá hvaða færibreytur aðgerð tekur við skaltu biðja um lýsingu hennar með `Help.Implementation.Get` eða fletta henni upp á síðunni **Bifrost Message Types**.

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Breyta** | Opnar sniðmátið í [Ritli keðjusniðmáts](/help/orchestrator/playbook-template-editor/), heilsíðuritli. |
| **Sækja** | Sækir sniðmátið sem JSON-skrá. |
| **Hlaða upp** | Skiptir sniðmátinu út fyrir innihald JSON-skrár sem þú velur. |

## Algeng verk {#common-tasks}

- **Afrita beiðni milli keðja:** veldu **Sækja** á öðru skrefinu og **Hlaða upp** á hinu.
- **Sjá hvað var raunverulega sent:** opnaðu keyrsluna í [keyrsluskrá keðju](/help/orchestrator/playbook-instances/). Upplýsingareiturinn [Valið skref](/help/orchestrator/playbook-step-log-detail-fact-box/) sýnir beiðnina með öllum gildum útfylltum.
