---
id: register-your-app
title: "Skráðu forritið þitt"
sidebar_label: "Skráðu forritið þitt"
sidebar_position: 2
description: "Hvernig á að skrá Business Central viðbót í skrána Forrit byggð á Bifröst: reglurnar, JSON færslan og pull request ferlið."
---

# Skráðu forritið þitt

[Forritaskráin](/apps/) er ein JSON skrá,
[`data/apps.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.json),
staðfest gegn
[`data/apps.schema.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.schema.json).
Að skrá forritið þitt þýðir að bæta einni færslu við þá skrá, ásamt merki
(logo), í pull request.

## Hver getur skráð sig

Sérhver Business Central viðbót sem **byggir á Bifröst Foundation**. Hún
þarf ekki að vera gefin út á Microsoft AppSource ennþá — `preview` og
`coming-soon` eru gild staða, svo þú getur skráð forrit meðan það er enn í
þróun.

## Reglur

- **Ósjálfstæði (dependency).** `app.json` verður að lýsa yfir ósjálfstæði á
  Bifröst Foundation (id `7505e808-6e52-4b96-a328-82573391297a`, útgefandi
  `Origo`).
- **Málefnaleg lýsing.** `summary` er ein setning, að hámarki 200 stafir, sem
  lýsir því hvað forritið gerir. Ekkert markaðsmál, engar ýkjur.
- **Tenglar aðeins á AppSource, GitHub eða skjölun.** `appSource`,
  `repository` og `docs` verða hver um sig að benda á eina af þessum þremur
  tegundum síðna (eða vera `null`). `support` má einnig vera `mailto:` tengill.
- **Merki (logo).** 250×250 PNG mynd, sett undir
  `static/img/apps/<þitt-slug>.png`. Endurnýttu núverandi
  AppSource/`Logo250x250.png` táknmynd forritsins — ekki hanna nýtt merki
  eingöngu fyrir þessa skráningu.
- **Staða endurspeglar raunveruleikann.** Notaðu `available` aðeins þegar
  forritið er komið í loftið á AppSource undir nafninu í þessari færslu; notaðu
  annars `preview` (uppsetjanlegt, ekki enn skráð á markaðstorgi) eða
  `coming-soon`.
- **Ein færsla á forrit.** `appId` verður að vera GUID-ið úr `id` í
  `app.json`, og verður að vera einstakt í skránni — staðfestingarskriftan
  hafnar tvítekningum.

## Færslan

Bættu einum hlut við `apps` fylkið í `data/apps.json`, samkvæmt
[`data/apps.schema.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.schema.json):

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "name": "Nafn forritsins",
  "publisher": "Fyrirtækið þitt",
  "summary": "Ein málefnaleg setning sem lýsir því hvað forritið gerir, undir 200 stöfum.",
  "domains": ["integration"],
  "foundationMinVersion": "28.0.0.0",
  "status": "preview",
  "links": {
    "appSource": null,
    "docs": "https://your-docs-url/",
    "repository": "https://github.com/your-org/your-repo",
    "support": "https://your-support-url/",
    "logo": "static/img/apps/your-slug.png"
  }
}
```

`domains` er fastur listi — veldu hvert svið sem á við:
`finance`, `sales`, `purchasing`, `inventory`, `projects`, `hr-payroll`,
`banking`, `e-documents`, `integration`, `ai`, `documents`, `scheduling`,
`time-tracking`, `billing`, `iceland`, `other`.

Valfrjálst `summary_is` reit gefur íslenska þýðingu á `summary` fyrir
`is-IS` útgáfu þessarar síðu; sé því sleppt er enska lýsingin notuð í staðinn.

## Pull request ferlið

1. Gerðu fork af [businesscentralal/bifrost](https://github.com/businesscentralal/bifrost).
2. Bættu merkinu þínu undir `static/img/apps/<þitt-slug>.png` og færslunni
   þinni við `data/apps.json`.
3. Keyrðu staðfestingarskriftuna sjálfur: `node tools/validate-apps.mjs`. Hún
   athugar JSON Schema-ið, einkvæmni `appId`, að merkjaskráin sé til og sé
   250×250 PNG, og að hver tengill sé rétt myndaður.
4. Opnaðu pull request. `.github/workflows/validate-apps.yml` keyrir sömu
   staðfestingu auk fullrar vefsíðubyggingar á hverju PR sem snertir
   `data/**` eða `static/img/apps/**`.
5. Umsjónarmaður úr `@businesscentralal/bifrost-maintainers` fer yfir og
   sameinar — `data/apps.json` og `static/img/apps/` eru beint á það teymi
   gegnum `CODEOWNERS`.

Notar þú ekki git? Opnaðu
[skráningarbeiðni fyrir forrit](https://github.com/businesscentralal/bifrost/issues/new?template=register-app.yml)
í staðinn — hún safnar sömu upplýsingum og umsjónarmaður opnar pull request
fyrir þig.

## Uppfæra fyrirliggjandi færslu

Þegar forritið þitt er komið á AppSource skaltu senda inn framhalds pull
request sem fyllir út `links.appSource` og setur `status` í `available`.
Sömu reglur og staðfestingarskrifta gilda um uppfærslur og um nýjar
færslur.
