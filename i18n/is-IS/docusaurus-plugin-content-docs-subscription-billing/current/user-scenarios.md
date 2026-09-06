---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndirnar sem staðfestingarteymi Microsoft keyrir til að votta viðbótina fyrir AppSource."
---

**Útgefandi:** Origo
**Viðbót:** Bifrost Subscription Billing (`dd7b8bd8-f93e-4ac4-a251-1a132a14ef3d`)
**Útgáfa:** 29.0.0.0
**Innsendingardagur:** 2026-09-06
**Prófunarumhverfi:** Sandkassi í Business Central með **Subscription Billing** appi Microsoft og **Bifrost Foundation** uppsettum. Sjá „Prófunaraðgangur" og „Forsendur" hér að neðan.

---

## Prófunaraðgangur

| Reitur | Gildi |
| --- | --- |
| Umhverfi | Sandkassi með Subscription Billing virkjað |
| Félag | CRONUS, eða hvaða félag sem er með Subscription Billing uppsett |
| Notandi | Notandi með SUPER, eða með `BIFROST SubBil ori` auk heimildasetts fyrir Bifröst Foundation |

Þessi viðbót geymir engin leyniorð og kallar á enga ytri þjónustu. Allt sem hún gerir keyrir innan Business Central, á móti Subscription Billing appi Microsoft.

---

## Forsendur

1. Settu upp **Bifrost Foundation** og virkjaðu hana — sjá uppsetningarleiðbeiningar Foundation.
2. Settu upp **Subscription Billing** (Microsoft) og keyrðu leiðsagnaruppsetningu þess, svo uppsetning áskriftarsamninga, númeraraðir og reikningssniðmát séu til.
3. Settu upp **Bifrost Subscription Billing**.
4. Úthlutaðu heimildasettinu **Bifröst - áskriftir** (`BIFROST SubBil ori`) á prófunarnotandann, til viðbótar við Bifröst Foundation heimildir hans.

### Uppsetning félagsins sem síðari sviðsmyndir byggja á

Sviðsmyndir 1 til 5 þurfa ekkert umfram skrefin fjögur hér að ofan. Reiknings-, frestunar- og notkunarsviðsmyndirnar bókfæra í fjárhagsbókhaldið, svo félagið verður líka að vera sett upp fyrir það. Þetta eru forsendur Microsoft fyrir Subscription Billing frekar en þessarar viðbótar, en auðvelt er að yfirsjást þær í nýjum sandkassa — hver einasta þeirra kom upp við prófun þessarar útgáfu á móti Business Central 28.4.

| Uppsetning | Hvers vegna hún þarf að vera til | Einkenni ef hana vantar |
| --- | --- | --- |
| **Almenn bókunaruppsetning** fyrir bókunarflokkasamsetningu áskriftarvörunnar: *Cust. Sub. Contract Account*, *Cust. Sub. Contr. Def Account*, *Vend. Sub. Contract Account*, *Vend. Sub. Contr. Def. Account* | Frestanir samninga bókast gegnum þessa reikninga | Bókun reikningsskjals brestur með *„Cust. Sub. Contract Deferral Account must have a value in General Posting Setup..."* |
| **Almenn bókunaruppsetning**: sölu- og innkaupalínu- og reikningsafsláttarreikningar, kreditreikningar | Losunarbók frestana þarf á þeim að halda | `Subscription.Deferral.Release` brestur með *„Sales Line Disc. Account must have a value..."* |
| **VSK-bókunaruppsetning** fullgerð fyrir VSK-vöruflokk áskriftarvörunnar | Öll bókun | Bókun brestur með *„...VAT Posting Setup is blocked"* |
| **Source Code Setup → Sub. Contr. Deferrals Release** | Stimplar losunarfærslur frestana | `Subscription.Deferral.Release` brestur með *„Subscription Contract Deferral must have a value in Source Code Setup"* |
| **Uppsetning áskriftarsamninga → Def. Rel. Jnl. Template Name / Def. Rel. Jnl. Batch Name** | Bókin sem losunin bókast gegnum | `Subscription.Deferral.Release` getur ekki bókfært |
| **Uppsetning áskriftarsamninga → Vend. Sub. Contract Nos.** | Númering birgjasamninga | Stofnun birgjaáskriftarsamnings brestur |
| **Mælieining vöru** fyrir áskriftarvöruna, og sami kóði á áskriftarhausnum | Vara sem reikningsfærð er verður að deila mælieiningu áskriftarinnar | `Subscription.Contract.CreateInvoice` brestur með *„The subscription's unit of measure contains a value that is not found in the item unit of measure..."* |
| **Gengisskráningar** sem ná yfir þær bókunardagsetningar sem notaðar eru — þar með talið fyrir **viðbótarskýrslumynt**, hafi félagið slíka | Bókun umreiknar fjárhæðir í viðbótarskýrslumyntina á bókunardegi | Bókun brestur með *„There is no Currency Exchange Rate within the filter"*. Myntkóðinn sem tilgreindur er getur verið **heimamyntin** þótt öll skjöl séu í heimamynt og gengið sem vantar tilheyri skýrslumyntinni, svo athugaðu báðar |

### Viðbótaruppsetning fyrir sviðsmyndir um reikningsgerð eftir notkun

`Subscription.Usage.ImportData` þáttar skrána gegnum almenna notkunargagnatengil Microsoft, sem þarf, til viðbótar við ofangreint:

- **Usage Data Supplier** af gerðinni Generic;
- **Generic Import Settings** fyrir þann birgi, sem vísa á **Data Exchange Definition** sem varpar dálkum skrárinnar á töflu 8018 *Usage Data Generic Import*;
- færslur í **Usage Data Supplier Reference**, **Usage Data Supp. Customer** og **Usage Data Supp. Subscription** sem tengja auðkenni viðskiptavinar og áskriftar í skránni við viðskiptavininn í Business Central og mældu áskriftarlínuna.

Án Data Exchange Definition heppnast innflutningskallið samt sem kall og skilar `processingStatus` af gerðinni `Error` með skýringu Business Central sjálfs — það kastar ekki villu.

---

## Sviðsmynd 1: Uppsetning og virkjun

**Svið:** Uppsetning og virkjun

### Skref
1. Opnaðu **Extension Management**.
2. Staðfestu að **Bifrost Subscription Billing** sé á listanum og uppsett.
3. Staðfestu að forsendan **Bifrost Foundation** sé uppsett og birtist fyrir ofan hana.
4. Opnaðu **Users**, veldu prófunarnotandann, og staðfestu að hægt sé að úthluta heimildasettinu **Bifröst - áskriftir**.

### Væntanleg niðurstaða
- Viðbótin setur sig upp án villu.
- Hægt er að úthluta heimildasetti hennar á notanda.

---

## Sviðsmynd 2: Uppgötvun skilaboðategunda

**Svið:** Kjarnavirkni

### Skref
1. Kallaðu á Bifröst-skilaboðategundina `Help.MessageTypes.Get` (Foundation).
2. Skoðaðu listann sem skilað er.

### Væntanleg niðurstaða
- Svarið inniheldur 22 skilaboðategundir sem heita á `Subscription.`
- Hver þeirra hefur `description` sem er ekki tómt, `messageDirection` af gerðinni `Inbound`, og `isEnabled` sem `true`.

---

## Sviðsmynd 3: Lestur hjálparskjals skilaboðategundar

**Svið:** Kjarnavirkni

### Skref
1. Kallaðu á `Help.Implementation.Get` með viðfangsefnið `Subscription.Billing.CreateProposal`.
2. Lestu Markdown-textann sem skilað er.
3. Endurtaktu fyrir hvaða aðra `Subscription.*` tegund sem er.

### Væntanleg niðurstaða
- Markdown-skjal með fyrirsögninni `Subscription.Billing.CreateProposal` sem inniheldur kaflana Overview, Request Parameters, Request Example, Response Shape, Errors, Safety og Related Message Types.
- Allar aðrar `Subscription.*` tegundir skila sömu uppbyggingu.

---

## Sviðsmynd 4: Kjarnavirkni — búa til reikningstillögu

**Svið:** Kjarnavirkni

### Undirbúningur
1. Opnaðu **Billing Templates** í biðlaranum og skráðu kóða fyrirliggjandi sniðmáts, eða búðu til eitt fyrir viðskiptavinaaðila.

### Skref
1. Kallaðu á `Subscription.Billing.CreateProposal` með meginmáli á borð við:

   ```json
   { "billingTemplateCode": "MONTHLY", "billingDate": "2026-08-31" }
   ```

2. Opnaðu **Recurring Billing** í biðlaranum og síaðu á sama sniðmát.

### Væntanleg niðurstaða
- Svarið hefur `"status": "Success"` og tilgreinir `proposalLinesCreated`.
- Sami fjöldi reikningstillögulína sést í Recurring Billing.
- Hafi ekkert verið gjaldfallið heppnast kallið samt með `proposalLinesCreated` af 0 — það er ekki villa.

---

## Sviðsmynd 5: Kjarnavirkni — reikningsfæra samning á óbókfærðan reikning

**Svið:** Kjarnavirkni

### Undirbúningur
1. Veldu áskriftarsamning viðskiptavinar með áskriftarlínum sem eru gjaldfallnar til reikningsgerðar.

### Skref
1. Kallaðu á `Subscription.Contract.CreateInvoice` með samningsnúmerið sem viðfangsefni skilaboðanna, eða:

   ```json
   { "contractNo": "CC000010", "billingDate": "2026-08-31" }
   ```

2. Opnaðu **Sales Invoices** í biðlaranum.

### Væntanleg niðurstaða
- Svarið telur upp skjalið sem varð til undir `documents`.
- **Óbókfærður** sölureikningur með því númeri er til fyrir viðskiptavin samningsins. Ekkert er bókfært.
- Hafi ekkert verið gjaldfallið á samningnum heppnast svarið með tómu `documents` fylki og skýrandi `message`.

---

## Sviðsmynd 6: Forskoðun skrifar ekkert

**Svið:** Kjarnavirkni

### Undirbúningur
1. Skráðu fjölda óbókfærðra sölureikninga fyrir viðskiptavin, og fjölda reikningslína á einum samningi þess viðskiptavinar.

### Skref
1. Kallaðu á `Subscription.Contract.PreviewInvoice` fyrir þann samning.
2. Athugaðu aftur sölureikningalistann og reikningslínur samningsins.

### Væntanleg niðurstaða
- Svarið hefur `"status": "Success"`, `"preview": true` og `"rollback": true`, og lýsir því sem yrði til.
- **Enginn nýr reikningur og engin ný reikningslína er til** — báðar talningar eru óbreyttar.

---

## Sviðsmynd 7: Villumeðhöndlun — ógild inntök

**Svið:** Villumeðhöndlun

### Skref
1. Kallaðu á `Subscription.Billing.CreateProposal` með sniðmátskóða sem er ekki til:

   ```json
   { "billingTemplateCode": "DOES-NOT-EXIST" }
   ```

2. Kallaðu á `Subscription.Contract.CreateInvoice` án `contractNo` og án viðfangsefnis.

### Væntanleg niðurstaða
- Bæði skila `"status": "Error"` með læsilegum `error` texta — það fyrra nefnir reikningssniðmátið sem vantar, það síðara nefnir nauðsynlega viðfangið sem vantar.
- Ekkert er skrifað í hvorugu tilfelli.
- Svarið inniheldur `hint` sem vísar á `Help.Implementation.Get`.
- Engin ómeðhöndluð undantekning og enginn hrár villugluggi Business Central berst kallandanum.

---

## Sviðsmynd 8: Skjalfestar takmarkanir skila skýrri villu

**Svið:** Villumeðhöndlun

### Skref
1. Kallaðu á `Subscription.PriceUpdate.CreateProposal`.

### Væntanleg niðurstaða
- Svarið er `"status": "Error"`.
- Textinn segir að Microsoft hafi ekki gert opinbert forritsskil aðgengilegt fyrir þessa aðgerð í þessari útgáfu, nefnir viðkomandi ferli Microsoft, og vísar notandanum á síðuna **Contract Price Update** í biðlaranum.
- Þetta er skjalfest og ætluð hegðun — sjá [leiðarvísi um skilaboðategundir](/subscription-billing/message-types) og breytingaskrá viðbótarinnar.

---

## Sviðsmynd 9: Gagnaheilleiki — engum gögnum er eytt

**Svið:** Kjarnavirkni

### Skref
1. Farðu yfir listann yfir skilaboðategundir úr sviðsmynd 2.

### Væntanleg niðurstaða
- Ekkert heiti skilaboðategundar endar á `.Delete`.
- Viðbótin eyðir aldrei áskriftar-, samnings- eða reikningsfærslum.

---

## Sviðsmynd 10: Staðfesting heimilda

**Svið:** Staðfesting heimilda

### Undirbúningur
1. Stofnaðu notanda **án** heimildasettsins `BIFROST SubBil ori`, með Bifröst Foundation aðgang eingöngu.

### Skref
1. Skráðu þig inn sem sá notandi og reyndu að kalla á `Subscription.Billing.CreateProposal`.
2. Úthlutaðu `BIFROST SubBil ori` og reyndu aftur.

### Væntanleg niðurstaða
- Án heimildasettsins brestur kallið með skýrri heimildavillu og ekkert er skrifað.
- Með því heppnast kallið — að því gefnu að notandinn hafi sínar eigin heimildir á töflum Subscription Billing, sem þessi viðbót víkkar ekki.

---

## Sviðsmynd 11: Fjarlæging viðbótar

**Svið:** Fjarlæging

### Skref
1. Opnaðu **Extension Management**.
2. Fjarlægðu **Bifrost Subscription Billing**.
3. Kallaðu aftur á `Help.MessageTypes.Get`.

### Væntanleg niðurstaða
- Viðbótin fjarlægist án villu.
- `Subscription.*` skilaboðategundirnar birtast ekki lengur.
- Bifröst Foundation og Subscription Billing frá Microsoft halda áfram að virka eðlilega, og engin Subscription Billing gögn fjarlægjast við afsetninguna.

---

## Frágangur

Þegar öllum sviðsmyndum er lokið:

1. Eyddu eða bókfærðu óbókfærða sölureikninginn sem varð til í sviðsmynd 5.
2. Hreinsaðu þær reikningstillögulínur sem standa eftir undir sniðmátinu úr sviðsmynd 4.
3. Fjarlægðu prófunarnotandann sem stofnaður var í sviðsmynd 10.
4. Fjarlægðu viðbótina, hafi það ekki þegar verið gert í sviðsmynd 11.
