---
id: bifrost-lang-model-card
title: "Bifröst mállíkan - Spjald"
sidebar_label: "Bifröst mállíkan - Spjald"
sidebar_position: 3
---

**Bifröst mállíkan - Spjald** sýnir og gerir þér kleift að breyta einu mállíkani. Hér skilgreinirðu kerfisleiðbeiningu, stillir líkansvalkosti og tengir hæfni við mállíkanið.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einkvæmt auðkenni mállíkansins. |
| **Lýsing** | Stutt lýsing á tilgangi mállíkansins. |
| **Líkan** | Heiti gervigreindarlíkansins (t.d. claude-sonnet-4-20250514). |
| **Hámarkstókar** | Hámarksfjöldi tóka í hverju svari. |
| **Hiti** | Stýrir sköpunarkrafti svarsins (0 = nákvæmt, 1 = skapandi). |
| **Kerfisleiðbeining** | Grunnleiðbeiningin sem gervigreindin fylgir í öllum samtölum með þessu mállíkani. |

## Hæfnilínur

Neðst á spjaldinu getur þú bætt við hæfni (skills) sem mállíkanið hefur aðgang að.

## Auðkenning

Allir veitendur nema Copilot þurfa API-lykil. Lykillinn er aldrei reitur á þessari síðu — hann er í leyndarmálageymslu Bifrastar og spjaldið sýnir aðeins hvort gildi hafi verið skráð.

| Reitur | Lýsing |
| --- | --- |
| **Persónulegur lykill geymdur** | Hvort *þú* hafir geymt persónulegan lykil fyrir þetta líkan. Persónulegur lykill gengur framar sameiginlega lyklinum. |
| **Sameiginlegur lykill geymdur** | Hvort lykill fyrir allt fyrirtækið hafi verið geymdur fyrir þetta líkan. Allir sem hafa engan persónulegan lykil nota hann. |
| **Athugasemd** | Birtist aðeins meðan enginn nothæfur lykill er til og útskýrir að skrá þurfi gildið einu sinni. |

| Kóði leyndarmáls | Umfang |
| --- | --- |
| `LANGMODEL-<Kóði>-API-KEY` | Fyrirtæki — sameiginlegi lykillinn |
| `LANGMODEL-<Kóði>-USER-API-KEY` | Fyrirtæki og notandi — persónulegi lykillinn |

Business Central heldur geymdum leyndarmálum aðskildum eftir viðbótum, svo lykill sem var skráður í eldri útgáfu forritsins flyst ekki með. Skráið hvern lykil einu sinni.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Flytja inn sjálfgildi** | Sækir sjálfgefna hæfniskilgreiningu af staðlaðri slóð og fyllir mállíkanið með fyrirfram skilgreindum leiðbeiningum. |
| **Prófa tengingu** | Kallar á veitandann með þeim lykli sem á við um þig og segir hvort líkanið svari. |
| **Skrá persónulegan API-lykil** | Opnar sameiginlega hulda innsláttargluggann og geymir þinn eigin lykil fyrir þetta líkan. |
| **Hreinsa persónulegan API-lykil** | Fjarlægir þinn eigin geymda lykil. Sameiginlegi lykillinn, ef hann er til, gildir þá aftur. |
| **Skrá sameiginlegan API-lykil** | Geymir lykil fyrir allt fyrirtækið. Krefst heimildasettsins `BIFROST ChatSvc ori`. |
| **Hreinsa sameiginlegan API-lykil** | Fjarlægir lykil fyrirtækisins. Krefst heimildasettsins `BIFROST ChatSvc ori`. |
| **Prófa** | Opnar spjall gagnvart þessu mállíkani svo hægt sé að sannreyna stillingarnar áður en það er tekið í notkun. |

Þegar mállíkani er eytt eru báðir lyklar þess hreinsaðir úr leyndarmálageymslunni.

## Sjá einnig

-   [Bifröst mállíkan](/help/bragi/bifrost-lang-model-list/) – Listi yfir öll mállíkön
-   [Spjalla við Bifröst og notandauppsetning](/help/bragi/bifrost-chat/) – Tengja mállíkan við notanda
