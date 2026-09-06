---
id: clockify-set-secret-dialog
title: "Slá inn Clockify API lykil"
sidebar_label: "Slá inn API lykil"
sidebar_position: 6
---

**Slá inn Clockify API lykil** er glugginn sem aðgerðin **Skrá API lykil fyrirtækis** á [Uppsetningu Clockify](/help/clockify/clockify-setup/) opnar. Þetta er eini staðurinn þar sem Clockify API lykillinn er sleginn inn í Business Central.

Reiturinn er falinn meðan slegið er inn og gildið er ekki birt aftur á eftir. Þegar staðfest er fer lykillinn beint í IsolatedStorage á sviði fyrirtækisins — hann er hvorki skrifaður í reit í töflu, birtur í beiðnaskrá né sýndur aftur.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| API lykill | Clockify API lykillinn sem á að geyma. Gildið er falið meðan þú slærð það inn. |

## Hvar lykillinn fæst

Opnaðu **Profile Settings** í Clockify og farðu í hlutann **API**. Búðu til lykil þar og límdu hann hingað.

Lykillinn ber heimildir þess Clockify-notanda sem bjó hann til. Allt sem tengingin gerir í Clockify — les vinnusvæði, skrifar verkefni, skráir vefkróka — gerist í nafni þess notanda, svo notaðu aðgang sem hefur þær heimildir sem samþættingin þarf í raun.

## Að skipta um lykil eða fjarlægja hann

Keyrðu aðgerðina aftur til að skrifa yfir geymda lykilinn; ekki þarf að eyða honum fyrst. Til að fjarlægja hann alveg skaltu nota **Eyða API lykli fyrirtækis** á [Uppsetningu Clockify](/help/clockify/clockify-setup/). Sé enginn lykill geymdur svarar hver skilaboðategund sem kallar á Clockify með meðhöndlaðri villu um að lykilinn vanti, í stað þess að bregðast.
