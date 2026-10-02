---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir fyrir vottun Bifröst Iceland Treasury á AppSource."
---

Þar sem sviðsmynd kallar á banka vinnur prófandinn gegnum gervigreindaraðstoðarmann sem er tengdur
Business Central með MCP-þjóni Bifrastar (sjá [Tengdu gervigreindaraðstoðarmanninn](/setup/connect-your-ai/)),
eða kallar á Bifröst úr öðrum biðlara. Uppsettar aðgerðir og samningar þeirra eru alltaf listaðir með
MCP-tólunum `list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Prófunarskilríki

Notaðu prófunarreikning hjá að minnsta kosti einum studdum íslenskum banka. Skilríki skulu vera í prófunarumhverfi bankans.

## Sviðsmynd 1: Uppsetning og virkjun

Settu upp Foundation og Iceland Treasury. Opnaðu Uppsetning Bifröst og staðfestu að allir bankar og leyndarmálastaða séu sýnileg, og að aðgerðir bankanna séu á síðunni Bifrost Message Types.

## Sviðsmynd 2: Stýrð uppsetning

Keyrðu leiðsagnaruppsetninguna fyrir Treasury og leyfðu útsendar HTTP-beiðnir. Staðfestu að bankastillingar vistist.

## Sviðsmynd 3: Banki stilltur á uppsetningarlista

Stilltu einn banka á Treasury Setup List, virkjaðu hann og staðfestu stöðudálkinn. Ófullgerð skilríki skulu vera merkt.

## Sviðsmynd 4: Skilríki eftir notanda

Skráðu notandanafn og lykilorð á Bifröst User Setup. Staðfestu að þau séu notuð saman og að lykilorð annarrar auðkenningar sé aldrei sent.

## Sviðsmynd 5: Fyrirspurn til banka gegnum Bifröst

Biddu aðstoðarmanninn um gengi dagsins hjá banka sem hefur verið stilltur, og síðan um reikninga eða
yfirlit hjá sama banka. Biddu hann loks að lýsa aðgerðinni sem hann notaði (samningurinn er lesinn með
`Help.Implementation.Get`). Svörin skulu innihalda rétt gögn og engin leyndarmál.

## Sviðsmynd 6: Innflutningur bankayfirlits í afstemmingu

Stilltu Bank Statement Import Format og keyrðu innflutning í Bank Acc. Reconciliation. Staðfestu upphafs- og lokastöðu, fjölda lína og viðvörun ef stöður passa ekki.

## Sviðsmynd 7: Heimildir — lestur án greiðslu

Úthlutaðu yfirlitsheimildum en ekki greiðsluheimildum. Staðfestu að lestur virki og greiðsluframkvæmd sé hafnað.

## Sviðsmynd 8: Villa vegna vantaðs leyndarmáls

Hreinsaðu eitt nauðsynlegt leyndarmál og keyrðu bankaaðgerð. Bifröst skal skila skipulagðri villu áður en ytri beiðni er send.

## Hreinsun

Hreinsaðu prófunarfærslur og fjarlægðu prófunarskilríki.

## Tengd skjöl

- [Skráning](./listing)
- Hjálp í kerfinu