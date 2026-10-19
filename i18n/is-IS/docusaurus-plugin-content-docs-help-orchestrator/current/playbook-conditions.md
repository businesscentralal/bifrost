---
id: playbook-conditions
title: "Skilyrði skrefa"
sidebar_label: "Skilyrði skrefa"
sidebar_position: 24
---

Hlutinn **Skilyrði skrefa** á spjaldinu [Bifröst keðja](/help/orchestrator/playbook-card/) ræður því hvort skref keyrir, hvaða leið keðjan fer á eftir því og hvort keyrslan skuli merkt sem mistekin. Hann sýnir skilyrði þess skrefs sem valið er í hlutanum [Skref](/help/orchestrator/playbook-steps/); nýjar línur tilheyra því skrefi.

Skref án skilyrða keyrir alltaf og það tekst þegar aðgerð þess lýkur án villu.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Skrefnúmer** | Skrefið sem skilyrðið tilheyrir. |
| **Tegund skilyrðis** | **Upphaf** ræður því hvort skrefið keyrir yfirhöfuð; sé það ósatt er skrefinu sleppt og keðjan heldur áfram eftir árangursleið skrefsins. **Árangur** ræður því hvort skrefið tókst og þar með leiðinni. **Villa** merkir keyrsluna sem mistekna án þess að breyta leið. |
| **Hópnúmer** | Öll skilyrði í hópi verða að vera sönn. Nægilegt er að einn hópur sé sannur. |
| **Slóð** | Hvaðan gildið er lesið: slóð í vinnusvæði keðjunnar fyrir Upphaf og Villu, slóð í svari skrefsins fyrir Árangur. |
| **Virki** | Hvernig gildið á slóðinni er borið saman: _Jafnt_, _Ekki jafnt_, _Stærra en_, _Minna en_, _Stærra eða jafnt_, _Minna eða jafnt_, _Inniheldur_ eða _Er til_. |
| **Gildi** | Gildið sem borið er saman við. Þarf ekki fyrir _Er til_. |
| **Lýsing** | Valfrjáls skýring á tilgangi skilyrðisins. |

## Algeng verk {#common-tasks}

- **Keyra skref aðeins stundum:** bættu við upphafsskilyrði á gildi sem fyrra skref vistaði.
- **Greina eftir svari:** bættu við árangursskilyrði á svarið og settu síðan bæði næstu skref skrefsins í hlutanum Skref.
- **Merkja niðurstöðu án þess að stöðva:** bættu við villuskilyrði. Keðjan heldur áfram og keyrslan er skráð sem mistekin.
