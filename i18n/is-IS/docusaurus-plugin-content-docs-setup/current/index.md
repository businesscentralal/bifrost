---
id: index
title: "Settu það upp"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Bifröst sett upp í tveimur hlutum: uppsetning fyrirtækisins einu sinni, og hver notandi tengir sinn eigin aðstoðarmann."
---

# Settu það upp

Þegar þessu er lokið notar hver og einn Business Central úr sínum eigin gervigreindaraðstoðarmanni, innan eigin
heimilda. Uppsetningin er í tveimur hlutum. **Fyrirtækið** setur það upp einu sinni í Business Central. Síðan tengir
**hver notandi** gervigreindaraðstoðarmanninn sem hann notar, og skráir sig inn sem hann sjálfur.

| | Fyrir fyrirtækið | Fyrir hvern notanda |
|---|---|---|
| **Hver** | Kerfisstjóri Business Central, ásamt Entra-kerfisstjóra í einu skrefi | Hver sá sem notar Bifröst, til dæmis í fjármálum eða sölu |
| **Hvenær** | Einu sinni fyrir hvert umhverfi og fyrirtæki | Einu sinni fyrir hvern og einn, eftir uppsetningu fyrirtækisins |
| **Skref** | [1 Náðu í forritið](/setup/get-the-app/) · [2 Settu upp Business Central](/setup/business-central/) · [3 Samþykktu einu sinni](/setup/consent/) · [4 Settu upp gögnin](/setup/data-setup/) · [5 Prófaðu og bjóddu notendunum](/setup/first-call/) | [1 Veldu aðstoðarmanninn](/setup/pick-your-assistant/) · [2 Tengdu aðstoðarmanninn](/setup/connect-your-ai/) · [3 Spurðu fyrstu spurningarinnar](/setup/first-question/) |

Viltu prófa fyrst? [Prófaðu](/try-it-out/) er fljótlega leiðin í sandkassa.

## Fyrir fyrirtækið {#for-your-company}

import SetupFlow from '@site/src/components/SetupFlow';

<SetupFlow />

### Áður en þú byrjar {#before-you-start}

- **Studd útgáfa af Business Central**: sjá [Kröfur](/foundation/#get-it-and-set-it-up).
- **Sandkassi er góður fyrsti staður.** Prófaðu allt þar fyrst; sjá [Prófaðu](/try-it-out/).
- **Leyfi fyrir framleiðsluumhverfi.** Sjá [Verð](/price/).

### Hver gerir hvað {#who-does-what}

| Verk | Hver |
|---|---|
| Setja forritið upp úr AppSource (skref 1) | Kerfisstjóri Business Central, eða samstarfsaðilinn þinn |
| Samþykkja notkunarskilmálana og keyra uppsetningarleiðsögnina (skref 2) | Sá sem má samþykkja skilmála fyrir hönd fyrirtækisins |
| Gefa fólki og forritum heimildasamstæður (skref 2) | Kerfisstjóri Business Central |
| Veita samþykkið í Microsoft Entra ID, einu sinni (skref 3) | Altækur kerfisstjóri (Global Administrator) eða forritsstjóri (Application Administrator) |
| Ákveða hvaða reiti fulltrúar mega ekki fá (skref 4) | Fyrirtækið sjálft: þið þekkið gögnin. Samstarfsaðilinn getur sett það upp |
| Tengja aðstoðarmanninn | Hver notandi, innskráður sem hann sjálfur ([Fyrir hvern notanda](/setup/pick-your-assistant/)) |

### Þarf ég samstarfsaðila? {#do-i-need-a-partner}

Nei. Kerfisstjórarnir þínir geta tekið hvert skref. Ef þú vinnur með Business Central samstarfsaðila getur hann tekið
Business Central skrefin fyrir þig. Samþykkið í skrefi 3 gefur kerfisstjóri Microsoft Entra ID fyrirtækisins.

### Sandkassi, framleiðsluumhverfi og fyrirtæki {#sandbox-production-and-companies}

- **Hvert umhverfi** (sandkassi, framleiðsluumhverfi) fær forritin uppsett sérstaklega.
- **Hvert fyrirtæki** keyrir uppsetningarleiðsögnina einu sinni; þangað til hafnar Bifröst köllum fyrir það fyrirtæki.
- **Samþykkið í skrefi 3** er gefið einu sinni fyrir allt fyrirtækið.

## Fyrir hvern notanda {#for-each-user}

Þegar uppsetningu fyrirtækisins er lokið [velur hver notandi aðstoðarmanninn](/setup/pick-your-assistant/),
[tengir hann](/setup/connect-your-ai/) og [spyr fyrstu spurningarinnar](/setup/first-question/). Það tekur um tíu
mínútur; kerfisstjórinn sendir þér slóðina sem þú þarft.

## Eftir uppsetningu {#after-setup}

Daglegur rekstur Bifröst er í [Fyrir kerfisstjóra](/documentation/end-customers/administrators/); notkunin er í
[Fyrir notendur](/documentation/end-customers/users/).
