---
id: index
title: "Bifröst Timesheets"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Tímaskráning í Clockify tengd við Business Central, með samstillingu tímafærslna í verkbækur og tímablöð."
---

# Bifröst Timesheets

**Tímar skráðir í Clockify, bókaðir í Business Central.** Kláraðar tímafærslur verða að línum í
verkbók eða að tímablaðsfærslum, án þess að slá þurfi þær inn aftur.

Bifröst Timesheets tengir Business Central við [Clockify](https://clockify.me), tímaskráningarþjónustuna.
Það getur líka haldið viðskiptavinum, verkefnum, verkþáttum og merkjum í Clockify í
takt við Business Central.

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Fært tíma úr Clockify í verkbókina.** Eina færslu, tímabil, eða alla tengda notendur í einu.
  Færsla sem er samstillt tvisvar tvöfaldast ekki, og breytt færsla er bókuð sem leiðrétting.
- **Eða fyllt út tímablöð í staðinn.** Skrifaðu sömu kláruðu færslurnar í opið tímablað
  forðans.
- **Rekið tímablaðsvikuna.** Búðu til vikublöð komandi viku, sendu þau inn og samþykktu, hafnaðu
  línum eða opnaðu þær aftur, bókaðu samþykkta tíma í gegnum verkbók og settu bókuð blöð í
  geymslu.
- **Haldið Clockify í takt við verkefnin þín.** Skráð, búið til, breytt og eytt viðskiptavinum,
  verkefnum, verkþáttum, merkjum og tímafærslum í Clockify-vinnusvæðinu þínu.
- **Samstillt jafnóðum.** Þegar vefkrókar Clockify eru skráðir berast nýjar, breyttar og eyddar
  færslur til Business Central án þess að bíða eftir tímaáætlun.

## Sæktu appið

Settu **Bifrost Timesheets** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra, Essentials eða Premium, og
Clockify-reikning með API-lykli.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Í Clockify skaltu búa til API-lykil undir **Profile Settings → API**, með reikningi sem hefur þann aðgang sem samþættingin þarf. | Eigandi Clockify-reikningsins |
| 2 | Á **Uppsetningu Bifrost** skaltu opna **Uppsetningu Bifrost Timesheets** úr flokknum **Forrit**. Veldu **Set Company API Key** og veldu síðan **sjálfgefið vinnusvæði**. | Kerfisstjóri Business Central |
| 3 | Til að samstilla í verkbók skaltu fylla út sniðmát verkbókar, keyrslu og sjálfgefna vinnutegund. Til að samstilla í tímablöð skaltu setja forðana upp fyrir tímablöð. | Kerfisstjóri Business Central |
| 4 | Tengdu færslur í Business Central við hluti í Clockify, til dæmis viðskiptamenn við viðskiptavini og vinnutegundir við merki. Tengingarnar eru skráðar á **Integration Links**. | Sá sem smíðar samþættinguna |
| 5 | Fyrir samstillingu jafnóðum skaltu slá inn **Webhook Receiver URL**, velja **Register Webhooks** og setja undirritunarteiknin sem þar birtast upp á móttakaranum. | Kerfisstjóri Business Central, ásamt þeim sem rekur móttakarann |
| 6 | Gefðu fólki og þjónustum sem nota appið heimildasafnið **`BIFROST Timeshts ori`**. | Kerfisstjóri Business Central |

Leiðbeiningar skref fyrir skref eru í hjálpinni í appinu:
[Uppsetning Timesheets](/help/timesheets/timesheets-setup/),
[Slá inn API-lykil Clockify](/help/timesheets/timesheets-set-secret-dialog/),
[Vinnusvæði Clockify](/help/timesheets/timesheets-workspace-lookup/),
[Samþættingartengingar](/help/timesheets/timesheets-integration-list/) og
[Vefkrókar](/help/timesheets/timesheets-webhooks/).

## Gott að vita

- **Það vinnur sem þú.** Hvert kall keyrir með þínum eigin heimildum í Business Central og er skráð
  á **Bifrost Messages**.
- **Það vinnur í Clockify sem eigandi lykilsins.** Allt sem gert er í Clockify gerist með heimildum
  Clockify-notandans sem bjó til API-lykilinn.
- **API-lykillinn er hvorki í töflum né skrám.** Hann er geymdur á öruggan hátt í Business Central,
  einn lykill fyrir hvert fyrirtæki, og er aldrei sýndur aftur eftir að hann hefur verið sleginn inn.
- **Aðeins kláraðar færslur eru samstilltar.** Færsla sem enn er í gangi hefur enga lengd, svo
  samstillingin hafnar henni viljandi.
- **Tengingum er haldið, þeim er ekki eytt.** Rofin tenging milli færslu og hlutar í Clockify er
  merkt bakfærð og fjarlægð með varðveislustefnu um mánuði síðar.
- **Samstilling jafnóðum þarf móttakara.** Vefkrókar þurfa endapunkt sem er aðgengilegur af netinu
  og áframsendir atburði Clockify til Business Central. Undirritunarteiknin eru ekki geymd í
  Business Central.

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_message_types` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**.

- [Byggðu á Bifröst](/extensibility/)
- Heimildasafn: `BIFROST Timeshts ori`.
