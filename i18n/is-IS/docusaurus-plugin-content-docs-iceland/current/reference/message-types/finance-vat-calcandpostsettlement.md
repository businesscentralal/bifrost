---
id: finance-vat-calcandpostsettlement
title: "Finance.VAT.CalcAndPostSettlement"
sidebar_label: "Finance.VAT.CalcAndPostSettlement"
sidebar_position: 1
description: "Beiðni- og svarsamningur fyrir Finance.VAT.CalcAndPostSettlement Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Keyrir Report 20 "Calc. and Post VAT Settlement" til að loka opnum VSK-færslum fyrir tímabil.
Eftir bókun eru VSK-færslur merktar lokaðar og síaðar í VSK-skýrslunni.

**Stefna:** Inbound (býr til færslur í aðalbók)

## Hlutverk í verkflæði VSK-skila
```
Post transactions → **CalcAndPostSettlement** → VATStatement.Preview → Map to RSK → Validate → Submit
```
Þessa aðgerð verður að kalla á áður en `VATStatement.Preview` er keyrt með `selection: "Closed"`.
Hún gerir upp allar opnar VSK-færslur á dagsetningabilinu.

## Beiðni
```json
{
  "startingDate": "2026-03-01",
  "endingDate": "2026-04-30",
  "postingDate": "2026-04-30",
  "documentNo": "VSK-P16-SETTL",
  "settlementAccountNo": "5610"
}
```

| Parameter | Required | Lýsing |
|-----------|----------|-------------|
| startingDate | Yes | Upphaf tímabils (notaðu `startDate` úr `GetInfo`) |
| endingDate | Yes | Lok tímabils (notaðu `endDate` úr `GetInfo`) |
| postingDate | Yes | Bókunardagur uppgjörsfærslu í aðalbók |
| documentNo | Yes | Skjalanúmer uppgjörsins |
| settlementAccountNo | Yes | Aðalbókarreikningur fyrir hreina VSK-stöðu, t.d. "5610" |

## Svar
```json
{
  "status": "Success",
  "posted": true,
  "glRegisterNo": 1099,
  "fromVATEntryNo": 574,
  "toVATEntryNo": 580
}
```

## Leiðbeiningar fyrir umboð
1. Bókaðu fyrst allar sölu- og innkaupafærslur tímabilsins.
2. Kallaðu á þessa skilaboðagerð til að loka VSK-færslunum. Notaðu dagsetningar tímabilsins úr `GetInfo`.
3. Kallaðu síðan á `Finance.VATStatement.Preview` með `selection: "Closed"` til að sækja upphæðir.
4. Í leiðréttingarferli: bókaðu viðbótarfærslur og kallaðu síðan aftur á þessa skilaboðagerð fyrir sama tímabil.
   Aðeins nýjar, enn opnar færslur verða gerðar upp.
