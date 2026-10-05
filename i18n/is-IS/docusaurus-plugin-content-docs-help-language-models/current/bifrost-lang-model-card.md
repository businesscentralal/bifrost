---
id: bifrost-lang-model-card
title: "Bifröst mállíkan"
---

Spjaldið **Bifröst mállíkan** setur upp eitt mállíkan: veituna sem spjallið talar við, líkanið og mörk
þess, API-lykilinn og hæfnina, leiðbeiningarnar sem eru sendar með hverju spjalli. Fólk spjallar við
líkanið sem er valið í notandauppsetningu Bifröst hjá því.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einkvæmur kóði mállíkansins, til dæmis `SALES` eða `FINANCE`. Það er hann sem þú velur í **Kóði mállíkans** í notandauppsetningu Bifröst. |
| **Lýsing** | Til hvers mállíkanið er. |
| **Sjálfgefið** | Líkanið sem sjálfvirkt ferli notar þegar það biður um svar án þess að nefna líkan og sá sem keyrir það hefur ekkert líkan í notandauppsetningu sinni. Aðeins eitt mállíkan getur verið sjálfgefið. Spjallið notar það ekki. |
| **Spjallveitandi** | Hver svarar: **Copilot**, **OpenAI**, **Azure OpenAI**, **Sérsniðið LLM** (líkan sem þú hýsir, með viðmóti sem er samhæft OpenAI), **Anthropic**, **xAI (Grok)** eða **Google (Gemini)**. Með **Enginn** getur líkanið ekki svarað. Þegar þú velur veitu eru auðu reitirnir hér fyrir neðan fylltir með sjálfgildum hennar. |

## Stillingar veitanda {#provider-configuration}

Copilot keyrir á auðlindum sem Microsoft rekur, svo þessir reitir eru ekki notaðir fyrir það.

| Reitur | Lýsing |
| --- | --- |
| **Grunnslóð** | Slóð API-veitunnar. Fyllt út fyrir veitur með fasta slóð; fyrir Azure OpenAI og sérsniðið LLM skráirðu þína eigin. |
| **Tímamörk (sekúndur)** | Hve lengi er beðið eftir svari, í sekúndum. `0` notar sjálfgildi veitunnar. |
| **Hámarksfjöldi tókena** | Lengsta svar sem líkanið má gefa, í tókum. `0` notar sjálfgildi veitunnar. |
| **Samhengistákn** | Hversu mikið samtal líkanið getur tekið við í einu, samhengisgluggi þess, í tókum. Bifröst notar það til að ákveða hversu mikið af fyrra samtali er sent með hverri spurningu; núverandi spurning er alltaf send. Autt (`0`) notar sjálfgildi veitunnar: 32.000 tók fyrir sérsniðið LLM, 128.000 fyrir OpenAI, Azure OpenAI, xAI og Google Gemini, og 200.000 fyrir Anthropic. Stilltu það á samhengisglugga líkansins þegar þú notar líkan með minni eða stærri glugga en það, til dæmis líkan sem þú keyrir sjálf(ur). |
| **Spjallslóð** | Slóð spjallendapunktsins, fyrir veitur sem þurfa hana (Azure OpenAI og sérsniðið LLM). Skildu hana eftir auða fyrir `/v1/chat/completions`. |
| **Líkanaslóð** | Slóðin sem telur upp líkön veitunnar, fyrir veitur sem þurfa hana. Skildu hana eftir auða fyrir `/v1/models`. |
| **Líkan** | Líkan veitunnar sem á að nota. Skildu það eftir autt fyrir sjálfgefið líkan veitunnar. Fyrir veitur sem geta talið upp líkön sín sýnir uppflettingin þau. |

Grunnslóð, spjallslóð og líkanaslóð ráða því hvert beiðnir, og API-lykillinn, eru sendar. Þeim er
aðeins hægt að breyta hér á spjaldinu, eða af einhverjum sem vinnur í Business Central.
Gervigreindarfulltrúi sem vinnur í gegnum Bifröst getur ekki breytt þeim.

## Auðkenning {#authentication}

Sýnd fyrir veitur sem þurfa API-lykil, það er allar veitur nema Copilot. Lykillinn er aldrei reitur á
þessari síðu: hann er geymdur í leyndarmálageymslu Bifröst og spjaldið sýnir aðeins hvort gildi hafi
verið skráð.

| Reitur | Lýsing |
| --- | --- |
| **Persónulegur lykill geymdur** | Hvort þú hafir persónulegan lykil fyrir þetta líkan. Persónulegur lykill hefur forgang yfir sameiginlega lykilinn. Hann gildir aðeins fyrir þig, í þessu fyrirtæki. |
| **Sameiginlegur lykill geymdur** | Hvort sameiginlegur lykill sé geymdur fyrir allt fyrirtækið. Allir sem hafa engan persónulegan lykil nota hann. |
| **Athugasemd** | Sýnd aðeins meðan enginn lykill er geymdur. Ekki er hægt að flytja lykla frá annarri viðbót, svo hver lykill er skráður einu sinni. |

Þú getur líka séð og skráð báða lykla hvers mállíkans á [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/).

## Hæfni {#skill}

Hæfnin, skrifuð á Markdown-sniði í ritlinum neðst á spjaldinu, er send líkaninu með hverju spjalli þegar
þetta mállíkan er notað. Notaðu hana til að segja til hvers aðstoðarmaðurinn er og hvernig hann á að
svara. Hún bætist við það sem Bifröst segir líkaninu alltaf, og hver notandi getur bætt við eigin
leiðbeiningum í kerfisleiðbeiningum [notandauppsetningar Bifröst](/help/foundation/bifrost-user-setup-editor/).

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Flytja inn sjálfgildi** | Fyllir hæfnina með sjálfgefinni hæfni veitunnar, og spyr áður en hún skrifar yfir hæfni sem er fyrir. Í boði fyrir veitur sem hafa slíka. |
| **Prófa tengingu** | Kallar á veituna með lyklinum sem gildir fyrir þig og segir hvort líkanið svari. |
| **Prófa** | Opnar spjall við þetta mállíkan, svo þú getir prófað það áður en þú úthlutar því nokkrum. |
| **Sækja API-lykil** | Opnar síðu veitunnar þar sem þú færð API-lykil. |
| **Skrá persónulegan API-lykil** | Skráðu þinn eigin lykil fyrir þetta líkan, í glugga sem felur innsláttinn. |
| **Hreinsa persónulegan API-lykil** | Fjarlægir þinn eigin lykil. Sameiginlegi lykillinn, ef hann er til, gildir þá aftur. |
| **Skrá sameiginlegan API-lykil** | Skráðu lykilinn fyrir allt fyrirtækið. Krefst heimildasamstæðunnar `BIFROST ChatSvc ori`. |
| **Hreinsa sameiginlegan API-lykil** | Fjarlægir lykil fyrirtækisins; allir sem hafa engan persónulegan lykil missa aðgang. Krefst heimildasamstæðunnar `BIFROST ChatSvc ori`. |

Ef mállíkan fær nýtt heiti halda lyklarnir sér. Ef því er eytt eru báðir lyklar þess fjarlægðir.

## Algeng verk {#common-tasks}

- **Setja upp líkan sem þú hýsir sjálf(ur):** veldu **Sérsniðið LLM**, skráðu **Grunnslóð**,
  **Spjallslóð** og **Líkan**, stilltu **Samhengistákn** á samhengisglugga líkansins, skráðu lykilinn og
  veldu síðan **Prófa tengingu**.
- **Gefa teymi eigin aðstoðarmann:** búðu til líkan með hæfni fyrir vinnu teymisins og veldu það síðan í
  **Kóði mállíkans** í notandauppsetningu Bifröst hjá hverjum í teyminu.

## Sjá einnig {#see-also}

- [Bifröst mállíkön](/help/language-models/bifrost-lang-model-list/): öll mállíkön
- [Spjalla með Bifröst](/help/language-models/bifrost-chat/): að nota spjallið
