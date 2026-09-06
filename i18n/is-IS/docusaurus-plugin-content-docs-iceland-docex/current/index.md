---
id: index
title: "Bifröst Iceland DocEx"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Rafræn skjalaskipti fyrir Business Central gegnum Advania, Unimaze og InExchange, með Peppol BIS 3.0 gögnum og UBL-myndun."
---

Bifröst Iceland DocEx sendir og móttekur rafræn viðskiptaskjöl gegnum fjórar þjónustur — Advania, Unimaze, InExchange og opinberu viðmiðunargagnaþjónustuna fyrir Peppol BIS Billing 3.0 — og birtir hverja aðgerð sem skilaboðategund. Hún byggir á Bifröst Foundation: sendandi póstar einum skilaboðum á borð við `DocumentExchange.Advania.GetUnread`, viðbótin framkvæmir HTTP-kallið, skráir samskiptin í Bifrastar-beiðnaskrána með leyniorðin hulin, og skilar JSON-svari.

## Hvað hún gerir

- **Advania** — taka á móti og senda skjöl, lesa lýsigögn, línur, viðhengi og sögu, samstilla stöður, fletta upp í innhólfi og sendum skjölum, fletta upp viðskiptafélögum, sækja PDF-skjöl og keyra OCR og XML-umbreytingu.
- **Unimaze** — taka á móti og senda skjöl, senda færslur og hrátt XML, bæta við viðhengjum, lesa niðurstöður sannprófunar, endurreyna skilaboð sem brugðust, skrá greiðslur og höfnun, og lista aðgerðir sem bíða ákvörðunar.
- **InExchange** — sækja innkomandi skjöl, senda skjöl út, fylgjast með afhendingarstöðu, merkja skjöl afgreidd og fletta upp kaupendum og seljendum.
- **Peppol BIS 3.0 viðmiðunargögn** — landskóðar, gjaldmiðlar, skjalategundarkóðar, rafræn auðkenniskerfi, auðkenniskerfi þátttakenda, MIME-kóðar, einingarkóðar og VSK-kóðar, án ytri aðgangsupplýsinga.
- **UBL-myndun** — mynda UBL 2.1 XML fyrir reikninga, kreditreikninga, pantanir, afhendingartilkynningar og yfirlit beint úr skjölum Business Central, án vörpunarverkefnis.
- **Skjöl á innleið** — innkomandi greiðsla getur orðið að innkomandi skjali í Business Central, án tvítekningar þar sem skjalaauðkenni þjónustuaðilans er skráð, og þaðan annaðhvort að innkaupapappír eða fjárhagskladdalínum eftir bókunarhætti lánardrottins.
- **Bókunarreglur á hvern lánardrottin** — hægt er að stilla lánardrottin þannig að innkomandi línur bókist á fasta fjárhagsreikninga eftir VSK-prósentu.
- **Rekjanleg samskipti** — hvert kall til þjónustuaðila er skráð í Bifrastar-beiðnaskrána gegnum hulunarkóða þjónustuaðilans, svo endurgera megi misheppnuð samskipti án þess að leyniorð birtist.
- **Eitt viðmót fyrir fjögur net** — sendandinn skiptir um skilaboðategund, ekki um samþættingarkóða.

## Hvernig hún virkar

1. Stjórnandi opnar **Bifröst uppsetning → Skjalaskipti**, velur umhverfi (Live eða Test) fyrir hvern þjónustuaðila og slær inn aðgangsupplýsingar. Þær fara í Isolated Storage; síðan sýnir aðeins gátreitinn **Innskráningarupplýsingar geymdar**.
2. Sendandi — ytra kerfi, MCP-biðlari eða ferli í Business Central — póstar skilaboðum með `DocumentExchange.*`-tegund og JSON-greiðslu á biðraðarviðmót Bifrastar.
3. Bifröst Foundation leysir skilaboðategundina upp í meðhöndlunarkóðaeiningu hennar.
4. Meðhöndlarinn les umhverfi þjónustuaðilans úr uppsetningunni, finnur réttan biðlara og framkvæmir HTTP-kallið. Beiðni og svar eru skráð í Bifrastar-beiðnaskrána með aðgangsupplýsingarnar huldar.
5. Meðhöndlarinn skrifar JSON-svar aftur á skilaboðin og sendandinn sækir það úr gagnaviðmóti Bifrastar.
6. Fyrir skjöl á innleið sem beðið er um með `createIncomingDocument: true` býr viðbótin einnig til innkomandi skjal í Business Central og, eftir bókunarhætti lánardrottins, innkaupapappír eða fjárhagskladdalínur.

## Skilaboðategundir

Viðbótin bætir 76 skilaboðategundum ofan á Bifröst Foundation. Hver þeirra lýsir sér sjálf: sendu `Help.DocumentExchange.Get` með heiti skilaboðategundarinnar sem viðfang til að fá lýsingu á beiðni og svari á Markdown-sniði.

| Flokkur | Tegundir | Hvað hann nær yfir |
| --- | --- | --- |
| BIS 3.0 viðmiðunargögn | 10 | Kóðalistar Peppol BIS 3.0 — lönd, gjaldmiðlar, skjalategundir, auðkenniskerfi heimilisfanga og þátttakenda, MIME-kóðar, einingarkóðar, VSK-kóðar. |
| Advania | 30 | Móttaka, sending, stöðustýring, fyrirspurnir í hólf, uppfletting viðskiptafélaga, sókn skjala, OCR og XML-umbreyting, notenda- og vefviðmótsaðgangur. |
| Unimaze | 23 | Móttaka, sending, stöðustýring, fyrirspurnir, viðhengi og sannprófun, ferli greiðslu og höfnunar. |
| InExchange | 8 | Innkomandi skjöl, sending og staða á útleið, uppfletting kaupenda og seljenda. |
| UBL-myndun | 4 | `DocumentExchange.UBL.RenderBilling`, `RenderOrder`, `RenderDespatchAdvice`, `RenderStatement`. |
| Hjálp | 1 | `Help.DocumentExchange.Get` — lýsing á öllum tegundunum hér að ofan. |

Heildarlistann, eina línu á hverja skilaboðategund, er að finna í [hjálpinni í kerfinu](/help/iceland-docex/).

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri, Essentials eða Premium.
- Bifröst Foundation, fáanleg sér á AppSource.
- Aðgangsupplýsingar frá að minnsta kosti einu studdu skjalaskiptaneti — Advania, Unimaze eða InExchange.
- BIS 3.0 viðmiðunargögn og UBL-myndun þurfa engar ytri aðgangsupplýsingar.

## Hvert skal halda næst

- [Hjálp í kerfinu](/help/iceland-docex/)
- [Uppflettirit skilaboðategunda](./reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Kort yfir hlutaauðkenni](./reference/object-id-map)
- [Notendasviðsmyndir fyrir AppSource](./user-scenarios)
- [Skráning í Partner Center](./listing)
- [Byggja á Bifröst](/extensibility/)
