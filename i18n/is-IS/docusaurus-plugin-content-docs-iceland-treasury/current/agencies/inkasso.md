---
id: inkasso
title: "InKasso"
sidebar_label: "InKasso"
sidebar_position: 2
description: "Hvað Bifröst Ísland Fjárstýring gerir með innheimtufyrirtækinu InKasso: kröfur stofnaðar, breyttar og felldar niður í bunkum, og greiðslur sem berast inn á þær."
---

# InKasso

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem innheimtir kröfur
sínar í gegnum InKasso. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með
InKasso, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

InKasso er innheimtufyrirtæki, ekki banki: Bifröst sér þar um kröfur og ekkert annað.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Kröfur.** Stofnaðu, breyttu og felldu niður kröfur í bunkum: InKasso tekur fyrst við bunkanum og
  tilkynnir svo niðurstöðu hverrar kröfu. Flettu kröfu upp, listaðu kröfur fyrir tímabil og sjáðu
  greiðslur sem hafa borist inn á þær.

Bifröst skráir ekki greiðslur, les ekki yfirlit og sækir ekki gengi hjá InKasso.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við InKasso** um vefþjónustu þess, með notandanafni og lykilorði. Ekkert skírteini þarf.
2. **Línuna InKasso í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis**.
   **Leyndarmál** sýnir **Fullskráð** þegar lykilorðið er vistað. **Skrá skírteini** er ekki í boði fyrir
   InKasso.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin hjá InKasso.** Hver notandi skráir eigið
   notandanafn og lykilorð í hópnum **InKasso** á síðunni **Uppsetning notanda Bifröst**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Kröfur.** Krafa hjá InKasso er stofnuð undir kóða kröfusniðmáts frá InKasso. Skráðu þann kóða sem
   kröfuauðkenni, og síðasta kröfunúmer, á greiðslumáta
   ([Greiðsluhættir](/help/iceland-treasury/payment-methods/)) fyrir hvern innheimtusamning.
   Kröfureikningurinn er 12 tölustafir og byrjar á bankanúmerinu `09`: bankanúmer (4 tölustafir),
   höfuðbók (2) og kröfunúmer (6). Kröfu með reikning sem byrjar á öðru bankanúmeri er hafnað áður en
   nokkuð er sent.
5. **Heimildir.** Úthlutaðu sömu [heimildasamstæðum](/iceland-treasury/#permissions) og fyrir kröfur í
   banka: `BIFROST TClmEdit ori` til að stofna, breyta og fella niður kröfur og lesa niðurstöðu bunka, og
   `BIFROST TClmPmt ori` til að lesa kröfur og greiðslur þeirra.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- Kröfur, kröfubunkar og greiðslur krafna birtast á rakningarsíðunum sem opnaðar eru úr
  **Bifröst Ísland Fjárstýring - uppsetning**, með **InKasso** sem banka, alveg eins og kröfur í banka;
  sjá [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
- Upplýsingareiturinn **Upplýsingar um viðskiptamannafærslu** sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til InKasso er skráð á síðunni **Annáll beiðna Bifröst**, með lykilorðið falið.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Gjaldskil](/iceland-treasury/agencies/gjaldskil/), hitt innheimtufyrirtækið
