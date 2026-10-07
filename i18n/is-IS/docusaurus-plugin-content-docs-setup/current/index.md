---
id: index
title: "Settu það upp"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Hvernig Bifröst er komið í gang, skref fyrir skref, og hvern þarf í hvert skref."
---

# Settu það upp

Þessi skref leiða þig frá engu að fyrsta svari frá Business Central í gervigreindaraðstoðarmanninum þínum. Taktu þau í
réttri röð. Hvert skref segir hvern þarf, svo þú getur haft rétta fólkið tilbúið áður en þú byrjar.

**Í stuttu máli:** settu forritið upp, keyrðu uppsetningarleiðsögnina, samþykktu einu sinni, tengdu aðstoðarmanninn og
spurðu. Áður en raunverulegir notendur og raunveruleg gögn koma til skaltu bæta við heimildunum og ákvörðunum um gögnin í
skrefum 2 og 4. Viltu prófa fyrst? [Prófaðu](/try-it-out/) er fljótlega leiðin í sandkassa.

## Áður en þú byrjar {#before-you-start}

- **Studd útgáfa af Business Central**: sjá [Kröfur](/foundation/#get-it-and-set-it-up).
- **Sandkassi er góður staður til að byrja.** Prófaðu allt þar fyrst; sjá [Prófaðu](/try-it-out/).
- **Leyfi fyrir framleiðsluumhverfi.** Sjá [Verð](/price/).

## Skrefin {#the-steps}

import SetupFlow from '@site/src/components/SetupFlow';

<SetupFlow />

## Þarf ég samstarfsaðila? {#do-i-need-a-partner}

Nei. Kerfisstjórarnir þínir geta tekið hvert skref. Ef þú vinnur með Business Central samstarfsaðila getur hann tekið
Business Central skrefin fyrir þig. Samþykkið í skrefi 3 gefur kerfisstjóri Microsoft Entra ID fyrirtækisins.

## Hver gerir hvað {#who-does-what}

| Verk | Hver |
|---|---|
| Setja forritið upp úr AppSource | Kerfisstjóri Business Central, eða samstarfsaðilinn þinn |
| Samþykkja notkunarskilmálana og keyra uppsetningarleiðsögnina (skref 2) | Sá sem má samþykkja skilmála fyrir hönd fyrirtækisins |
| Veita samþykkið í Microsoft Entra ID, einu sinni (skref 3) | Altækur kerfisstjóri (Global Administrator) eða forritsstjóri (Application Administrator) |
| Gefa fólki og forritum heimildasamstæður (skref 2) | Kerfisstjóri Business Central |
| Ákveða hvaða reiti fulltrúar mega ekki fá (skref 4) | Fyrirtækið sjálft: þið þekkið gögnin. Samstarfsaðilinn getur sett það upp |
| Tengja aðstoðarmanninn | Hver notandi, innskráður sem hann sjálfur |

## Sandkassi, framleiðsluumhverfi og fyrirtæki {#sandbox-production-and-companies}

- **Hvert umhverfi** (sandkassi, framleiðsluumhverfi) fær forritin uppsett sérstaklega.
- **Hvert fyrirtæki** keyrir uppsetningarleiðsögnina einu sinni; þangað til hafnar Bifröst köllum fyrir það fyrirtæki.
- **Samþykkið í skrefi 3** er gefið einu sinni fyrir allt fyrirtækið.

## Eftir uppsetningu {#after-setup}

Daglegur rekstur Bifröst, og ákvarðanirnar á bak við hverja stillingu, eru í
[Leiðbeiningum fyrir kerfisstjóra](/documentation/end-customers/administrators/).
