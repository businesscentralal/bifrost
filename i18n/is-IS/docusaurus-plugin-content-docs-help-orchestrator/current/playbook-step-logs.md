---
id: playbook-step-logs
title: "Atburðaskrá keðjuskrefa"
sidebar_label: "Atburðaskrá keðjuskrefa"
sidebar_position: 28
---

Hlutinn **Atburðaskrá skrefa** á síðunni [Upplýsingar um keðjukeyrslu](/help/orchestrator/playbook-instance-card/) sýnir hvert skref sem keyrði í einni keyrslu keðju. Skref sem ítrar yfir fylki fær eina línu á hvern hlut. Notaðu hann til að finna hvar keyrsla fór úrskeiðis og hvað aðgerðin fékk og skilaði. Listinn er óbreytanlegur.

Veldu línu til að sjá beiðni hennar og svar í upplýsingareitnum [Valið skref](/help/orchestrator/playbook-step-log-detail-fact-box/).

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Skrefnúmer** | Skrefið sem keyrði. |
| **Ítrunarnúmer** | Númer hlutarins þegar skrefið ítrar yfir fylki; `0` fyrir eitt kall. |
| **Skilaboðagerð** | Aðgerðin sem skrefið keyrði. |
| **Staða** | Niðurstaða skrefsins: _Lokið_ (grænt), _Mistókst_ (rautt) eða _Hætt við_ þegar hlut var sleppt af því að fyrra skref mistókst fyrir hann eða hámarki ítrana var náð. |
| **Tímalengd** | Hversu lengi skrefið tók. |
| **Villuboð** | Villuboðin, þegar skrefið mistókst. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Sækja beiðni** | Sækir beiðnina sem skrefið sendi, sem JSON-skrá. |
| **Sækja svar** | Sækir svarið sem aðgerðin skilaði, sem JSON-skrá. |
| **Sækja vinnusvæði** | Sækir gildin sem keðjan hafði safnað þegar skrefið mistókst. Aðeins í boði á línum sem mistókust. |

## Algeng verk {#common-tasks}

- **Finna orsök villu:** leitaðu að fyrstu rauðu línunni, lestu **Villuboð** og berðu síðan beiðnina í upplýsingareitnum **Valið skref** saman við það sem aðgerðin býst við.
