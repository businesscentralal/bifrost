---
id: index
title: "Forrit byggð á Bifröst"
sidebar_label: "Forrit byggð á Bifröst"
sidebar_position: 1
slug: /
description: "Skrá yfir Business Central viðbætur sem byggja á Bifröst Foundation — leitaðu, síaðu eftir sviði og finndu tengla á AppSource, skjölun og hugbúnaðarsafn fyrir hverja þeirra."
---

import AppRegistry from '@site/src/components/AppRegistry';

# Forrit byggð á Bifröst

Hvert forrit hér að neðan er Business Central viðbót sem byggir á
[Bifröst Foundation](/foundation/) og bætir við eigin skilaboðatögum,
hjálparsíðum og uppsetningu. Listinn er búinn til úr einni JSON skrá,
[`data/apps.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.json),
sem er einnig birt óbreytt á [`/apps.json`](https://businesscentralal.github.io/bifrost/apps.json) svo verkfæri og
innbyggðir listar geti lesið hana beint.

Leitaðu eftir nafni eða lýsingu, eða síaðu eftir sviði, til að finna forritið
sem þú þarft.

## Forrit og hjálp: hver er munurinn

Hvert forrit hefur tvenns konar síður á þessum vef:

| | Kafli forritsins (til dæmis [Foundation](/foundation/)) | Hjálp forritsins (til dæmis [hjálp Foundation](/help/foundation/)) |
|---|---|---|
| **Hvað þar stendur** | Hvað forritið bætir við og skilaboðagerðirnar sem því fylgja | Til hvers ein síða í Business Central er, reitir hennar og aðgerðir |
| **Hver les** | Þau sem velja forrit, kerfisstjórar, forritarar og gervigreindarþjónar sem fletta upp skilaboðagerð | Notandi á síðunni, sem opnar hjálpina úr Business Central með hjálparhnappnum |
| **Hvar það finnst** | Valmyndin **Forrit** | Valmyndin **Hjálp**, eða úr Business Central |

Gervigreindarþjónn þarf hvorugt: hann spyr Bifröst hvaða skilaboðagerðir eru til og les hjálp þeirra
beint.

<AppRegistry />

## Ertu að byggja þitt eigið forrit?

Ef þú ert að byggja Business Central viðbót sem byggir á Bifröst Foundation,
getur þú líka skráð hana hér — hvort sem hún er þegar gefin út á AppSource
eða enn í þróun. Sjá
[Skráðu forritið þitt](/apps/register-your-app/) fyrir kröfur og hvernig
á að opna PR (pull request).
