---
id: playbook-card
title: "Bifröst keðja"
sidebar_label: "Bifröst keðja"
sidebar_position: 6
---

Á spjaldinu **Bifröst keðja** skilgreinir þú keðju: fast ferli í skrefum, þar sem hvert skref er
Bifröst-aðgerð í Business Central og svar eins skrefs getur nært það næsta. Á spjaldinu setur þú skrefin,
skilyrðin sem stýra þeim og greina leiðir, og beiðnina sem fyrsta skrefið fær, keyrir keðjuna og
tímasetur hana. Spjaldið sýnir líka hvernig hverju skrefi gekk í síðustu keyrslu.

Opnaðu spjaldið af listanum [Bifröst keðjur](/help/orchestrator/playbooks/).

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði keðjunnar. |
| **Lýsing** | Hvað keðjan gerir. |

## Skref {#steps}

Hlutinn **Skref** sýnir skrefin í þeirri röð sem þau keyra. Fyrir hvert skref velur þú aðgerðina sem það
kallar á (dálkurinn **Skilaboðagerð**), hvort það endurtaki sig fyrir hvert stak í fylki úr fyrra skrefi,
hvort það sé athugun eða aðgerð, og hvaða skref tekur við eftir árangur og eftir misbrest. Skref sem
endurtaka sig yfir fylki eru inndregin og óvirk skref eru dempuð. Dálkurinn **Síðasta keyrsla** sýnir
hvernig hverju skrefi gekk í síðustu keyrslu: ✓ lokið, ✗ mistókst, – sleppt, · ekki keyrt.

Sjá [Keðjuskref](/help/orchestrator/playbook-steps/) um alla dálka.

## Skilyrði skrefa {#step-conditions}

Hlutinn **Skilyrði skrefa** sýnir skilyrði þess skrefs sem er valið í **Skref**. Skilyrði af gerðinni
**Upphaf** ræður hvort skrefið keyrir, **Árangur** velur næsta skref og **Villa** merkir keyrsluna sem
misheppnaða án þess að breyta leiðinni. Öll skilyrði í hópi verða að vera sönn; nóg er að einn hópur sé
sannur.

Sjá [Skilyrði skrefa](/help/orchestrator/playbook-conditions/) um alla dálka.

## Tímaáætlun {#schedule}

| Reitur | Lýsing |
| --- | --- |
| **Tímasett** | Sýnir hvort keðjan hafi vinnsluraðarfærslu sem keyrir hana eftir tímaáætlun. |

## Upphafsbeiðni {#initial-request}

| Reitur | Lýsing |
| --- | --- |
| **Upphafsbeiðni JSON** | JSON-gögnin sem fyrsta skrefið fær þegar keyrsla hefst án eigin beiðni, til dæmis með **Keyra núna** eða eftir tímaáætlun. Breyttu þeim beint í reitnum. |

## Sniðmát beiðna {#request-templates}

Hvert skref sendir beiðni sem er byggð á sniðmáti beiðni þess, sem er sýnt í upplýsingareitnum
**Sniðmát beiðni**. Sniðmát getur notað gildi sem keyrslan hefur safnað með **@-slóð**:

- `@10.customerNo` er gildi sem var geymt úr svari skrefs 10.
- `@_sys.today`, `@_sys.workDate`, `@_sys.thisMonthStart`, `@_sys.companyName` og `@_sys.userId` eru
  gildi sem hver keyrsla leggur til: dagsetningar, fyrirtækið og notandinn sem keyrir.
- Þegar JSON-gildi er aðeins @-slóð heldur gildið tegund sinni (tala, hlutur eða listi). Þegar @-slóðin
  er inni í öðrum texta er gildið skrifað inn í textann.

Breyttu sniðmáti í [Ritill keðjusniðmáts](/help/orchestrator/playbook-template-editor/), sem **Breyta** í
upplýsingareitnum opnar. Sjá [Sniðmát beiðni](/help/orchestrator/playbook-step-template-fact-box/) um
upplýsingareitinn.

## Upplýsingareitir {#factboxes}

| Upplýsingareitur | Lýsing |
| --- | --- |
| **Sniðmát beiðni** | Sniðmát beiðni þess skrefs sem er valið í **Skref**, með aðgerðum til að breyta því, sækja það og hlaða því upp. |
| **Síðasta keyrsla** | Samantekt síðustu keyrslu: staða, upphaf, tímalengd, teljarar og villa ef einhver var. Sjá [Síðasta keyrsla](/help/orchestrator/playbook-last-run-fact-box/). |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Keyra núna** | Keyrir keðjuna strax, í forgrunni, með **Upphafsbeiðni JSON**. Þegar keyrslu lýkur sýna skilaboð stöðu hennar og **Síðasta keyrsla** uppfærist. |
| **Tímasetja** | Opnar [Tímasetja keðju](/help/orchestrator/schedule-playbook/), sem stofnar vinnsluraðarfærslu sem keyrir keðjuna eftir endurtekinni tímaáætlun. Aðeins í boði meðan keðjan er ekki tímasett. |
| **Vinnsluraðarstjórafærsla** | Opnar [vinnsluraðarfærslu](/help/orchestrator/scheduled-entry-card/) keðjunnar, þar sem þú breytir áætluninni, lokar henni eða keyrir einu sinni. Aðeins í boði þegar keðjan er tímasett. |
| **Keyrsluskrá** | Opnar [Keyrsluskrá keðju](/help/orchestrator/playbook-instances/) síaða á þessa keðju. |

## Ábendingar {#tips}

- Keðja keyrir með heimildum notandans sem keyrir hana; tímasett keðja með heimildum notandans sem
  vinnsluraðafærsla hennar keyrir sem.
- Prófaðu keðju með **Keyra núna** áður en þú tímasetur hana: með tilviki þar sem eitthvað er að gera,
  tilviki þar sem ekkert er að gera og tilviki með röngu inntaki.
- Aðgerðirnar sem skref getur kallað á, og hvað hver þeirra þarf, eru sýndar í
  [Tiltækar skilaboðategundir](/help/foundation/bifrost-message-type-list/) á Uppsetning Bifröst.
