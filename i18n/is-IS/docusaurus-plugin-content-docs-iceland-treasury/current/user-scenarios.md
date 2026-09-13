---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir fyrir vottun Bifröst Iceland Treasury á AppSource."
---

## Prófunarskilríki

Notaðu prófunarreikning hjá að minnsta kosti einum studdum íslenskum banka. Skilríki skulu vera í prófunarumhverfi bankans.

## Sviðsmynd 1: Uppsetning og virkjun

Settu upp Foundation og Iceland Treasury. Opnaðu Bifröst Setup og staðfestu að allir bankar og leyndarmálastaða séu sýnileg.

## Sviðsmynd 2: Stýrð uppsetning

Keyrðu leiðsagnaruppsetninguna fyrir Treasury og leyfðu útsendar HTTP-beiðnir. Staðfestu að bankastillingar vistist.

## Sviðsmynd 3: Banki stilltur á uppsetningarlista

Stilltu einn banka á Treasury Setup List, virkjaðu hann og staðfestu stöðudálkinn. Ófullgerð skilríki skulu vera merkt.

## Sviðsmynd 4: Skilríki eftir notanda

Skráðu notandanafn og lykilorð á Bifröst User Setup. Staðfestu að þau séu notuð saman og að lykilorð annarrar auðkenningar sé aldrei sent.

## Sviðsmynd 5: Fyrirspurn í gegnum Queue API

Keyrðu `Help.MessageTypes.Get`, `Help.Implementation.Get`, `Arionbanki.CurrencyRates.Get`, `Landsbankinn.Account.List` eða `Sparisjodir.Statement.Get` með gildum prófunargögnum. Svarið skal innihalda rétt gögn og enga leyndu færslu.

## Sviðsmynd 6: Innflutningur bankayfirlits í afstemmingu

Stilltu Bank Statement Import Format og keyrðu innflutning í Bank Acc. Reconciliation. Staðfestu upphafs- og lokastöðu, fjölda lína og viðvörun ef stöður passa ekki.

## Sviðsmynd 7: Heimildir — lestur án greiðslu

Úthlutaðu yfirlitsheimildum en ekki greiðsluheimildum. Staðfestu að lestur virki og greiðsluframkvæmd sé hafnað.

## Sviðsmynd 8: Villa vegna vantaðs leyndarmáls

Hreinsaðu eitt nauðsynlegt leyndarmál og keyrðu bankaaðgerð. Bifröst skal skila skipulagðri villu áður en ytri beiðni er send.

## Hreinsun

Hreinsaðu prófunarfærslur og fjarlægðu prófunarskilríki.

## Tengd skjöl

- [Skráning](../listing)
- [Hjálp í kerfinu](/help/iceland-treasury/)