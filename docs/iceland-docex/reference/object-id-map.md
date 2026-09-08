---
id: object-id-map
title: "Object ID map — Cloud Events DocEx to Bifröst"
sidebar_label: "Object ID map"
sidebar_position: 1
description: "How every object, field and enum value of the retired Origo Cloud Events DocEx app maps to Bifröst Iceland DocEx."
---

| | |
|---|---|
| **Source app** | `Origo Cloud Events DocEx` — id `0e09f56c-bf97-486f-86de-238b669d971b`, range `10077485–10077884`, namespace `Origo.APP.CloudEvents.DocumentExchange` |
| **Target app** | `Bifrost Iceland DocEx` — id `54d53040-b92f-4745-8980-89573b6b0463`, range `10036385–10036784`, namespace `Origo.Bifrost.IcelandDocEx` |
| **ID offset** | `-41100` on every object, field and enum value. Relative order is preserved, so `newId = oldId − 41100`. |
| **Test app** | `Bifrost Iceland DocEx - Tests` — id `7e297fbd-23c2-4fee-b43e-4b61085a35ca`, range `99400–99599` (old `97700–97799`). |
| **Generated from** | `tools/migration/configs/out/namemap.tsv` plus a scan of `app/src/**/*.al`. |

## Rename rules

1. The `CE ` object-name prefix is dropped, and the words "Cloud Events" / "Cloud Event" are removed everywhere.
2. Every app object ends with the mandatory AppSource affix ` ori` — `CE DocEx Adv Client` → `DocEx Adv Client ori`.
3. One name had to be abbreviated to stay inside the 20-character permission-set limit: `CE DocEx GL Jnl Edit` → `DocEx GLJnl Edit ori`.
4. Test objects drop the `CE ` prefix and carry no affix — `CE DocEx Adv Mock` → `DocEx Adv Mock`.
5. Message-type keys (`DocumentExchange.*`, `Help.DocumentExchange.Get`) are the API contract and are unchanged.
6. The interface method `ExecuteCloudEventTask` is now `ExecuteBifrostTask`.

## Renamed Bifrost Foundation objects referenced by this app

The dependency moved from `Origo Cloud Events Core` to `Bifrost Foundation`
(`7505e808-6e52-4b96-a328-82573391297a`, 28.0.0.0). These Foundation objects were renamed with it:

| Old name | New name |
|---|---|
| `Cloud Event Message Type ori` | `Message Type ori` |
| `Cloud Event Msg Interface ori` | `Msg Interface ori` |
| `CE Message Argument ori` | `Message Argument ori` |
| `Cloud Events Setup ori` | `Setup ori` |
| `CE User Setup ori` | `User Setup ori` |
| `CE Request Log ori` | `Request Log ori` |
| `CE Request Log Type ori` | `Request Log Type ori` |
| `Cloud Event Msg Direction ori` | `Msg Direction ori` |
| `CE Full Access ori` | `BIFROST Full ori` |

---

## Tables (15)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036399 | `DocEx Setup ori` | — | *(new — replaces the table extension on `Setup ori`)* |
| 10036385 | `DocEx Att Buffer ori` | 10077485 | `CE DocEx Att Buffer` |
| 10036386 | `DocEx Chrg Buffer ori` | 10077486 | `CE DocEx Chrg Buffer` |
| 10036387 | `DocEx Endpt Buffer ori` | 10077487 | `CE DocEx Endpt Buffer` |
| 10036388 | `DocEx Hdr Buffer ori` | 10077488 | `CE DocEx Hdr Buffer` |
| 10036389 | `DocEx Inbox Buffer ori` | 10077489 | `CE DocEx Inbox Buffer` |
| 10036390 | `DocEx Line Buffer ori` | 10077490 | `CE DocEx Line Buffer` |
| 10036391 | `DocEx Party Buffer ori` | 10077491 | `CE DocEx Party Buffer` |
| 10036392 | `DocEx Pmt Buffer ori` | 10077492 | `CE DocEx Pmt Buffer` |
| 10036393 | `DocEx Ref Buffer ori` | 10077493 | `CE DocEx Ref Buffer` |
| 10036394 | `DocEx Status Buffer ori` | 10077494 | `CE DocEx Status Buffer` |
| 10036395 | `DocEx Tax Buffer ori` | 10077495 | `CE DocEx Tax Buffer` |
| 10036396 | `DocEx BIS30 Code Map ori` | 10077496 | `CE DocEx BIS30 Code Map` |
| 10036397 | `DocEx Vend VAT G/L Map ori` | 10077497 | `CE DocEx Vend VAT G/L Map` |
| 10036398 | `DocEx Inc.Doc. Post Instr ori` | 10077498 | `CE DocEx Inc.Doc. Post Instr` |

## Table extensions (2)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| ~~10036385~~ | ~~`DocEx Setup Ext ori`~~ | 10077485 | `CE DocEx Setup Ext ori` — **deleted**, replaced by table `DocEx Setup ori` (10036399) |
| 10036704 | `DocEx Inc Doc Ext ori` | 10077804 | `CE DocEx Inc Doc Ext ori` |
| 10036705 | `DocEx Vendor Ext ori` | 10077805 | `CE DocEx Vendor Ext` |

## Pages (3)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036398 | `DocEx Setup ori` | — | *(new — the app setup page, opened from the Apps group on Bifröst Setup)* |
| 10036396 | `DocEx BIS30 Code Map ori` | 10077496 | `CE DocEx BIS30 Code Map` |
| 10036397 | `DocEx Vend VAT G/L Map ori` | 10077497 | `CE DocEx Vend VAT G/L Map` |

## Page extensions (5)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036385 | `DocEx Setup Ext ori` | 10077485 | `CE DocEx Setup Ext ori` |
| 10036386 | `DocEx Vendor Card Ext ori` | 10077486 | `CE DocEx Vendor Card Ext` |
| 10036387 | `DocEx Vendor List Ext ori` | 10077487 | `CE DocEx Vendor List Ext` |
| 10036388 | `DocEx Inc Doc Ext ori` | 10077488 | `CE DocEx Inc Doc Ext` |
| 10036389 | `DocEx Inc Docs Ext ori` | 10077489 | `CE DocEx Inc Docs Ext` |

## Codeunits (126)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036385 | `DocEx BIS30 Client ori` | 10077485 | `CE DocEx BIS30 Client` |
| 10036386 | `DocEx BIS30 CountryCodes ori` | 10077486 | `CE DocEx BIS30 CountryCodes` |
| 10036387 | `DocEx BIS30 Currencies ori` | 10077487 | `CE DocEx BIS30 Currencies` |
| 10036388 | `DocEx BIS30 DocTypeCodes ori` | 10077488 | `CE DocEx BIS30 DocTypeCodes` |
| 10036389 | `DocEx BIS30 DocTypes ori` | 10077489 | `CE DocEx BIS30 DocTypes` |
| 10036390 | `DocEx BIS30 ElecAddr ori` | 10077490 | `CE DocEx BIS30 ElecAddr` |
| 10036391 | `DocEx BIS30 InvObjId ori` | 10077491 | `CE DocEx BIS30 InvObjId` |
| 10036392 | `DocEx BIS30 Live ori` | 10077492 | `CE DocEx BIS30 Live` |
| 10036393 | `DocEx BIS30 MimeCodes ori` | 10077493 | `CE DocEx BIS30 MimeCodes` |
| 10036394 | `DocEx BIS30 PartSchemes ori` | 10077494 | `CE DocEx BIS30 PartSchemes` |
| 10036395 | `DocEx BIS30 UnitCodes ori` | 10077495 | `CE DocEx BIS30 UnitCodes` |
| 10036396 | `DocEx BIS30 VatCodes ori` | 10077496 | `CE DocEx BIS30 VatCodes` |
| 10036397 | `DocEx Adv ChkUnivSvc ori` | 10077497 | `CE DocEx Adv ChkUnivSvc` |
| 10036398 | `DocEx Adv Client ori` | 10077498 | `CE DocEx Adv Client` |
| 10036399 | `DocEx Adv CompressPdf ori` | 10077499 | `CE DocEx Adv CompressPdf` |
| 10036400 | `DocEx Adv ConvertXml ori` | 10077500 | `CE DocEx Adv ConvertXml` |
| 10036401 | `DocEx Adv CreateInvoice ori` | 10077501 | `CE DocEx Adv CreateInvoice` |
| 10036402 | `DocEx Adv GetAttach ori` | 10077502 | `CE DocEx Adv GetAttach` |
| 10036403 | `DocEx Adv GetAuthPart ori` | 10077503 | `CE DocEx Adv GetAuthPart` |
| 10036404 | `DocEx Adv GetDocHist ori` | 10077504 | `CE DocEx Adv GetDocHist` |
| 10036405 | `DocEx Adv GetDocInfo ori` | 10077505 | `CE DocEx Adv GetDocInfo` |
| 10036406 | `DocEx Adv GetDocLight ori` | 10077506 | `CE DocEx Adv GetDocLight` |
| 10036407 | `DocEx Adv GetDocLines ori` | 10077507 | `CE DocEx Adv GetDocLines` |
| 10036408 | `DocEx Adv GetDocPdf ori` | 10077508 | `CE DocEx Adv GetDocPdf` |
| 10036409 | `DocEx Adv GetDocSupport ori` | 10077509 | `CE DocEx Adv GetDocSupport` |
| 10036410 | `DocEx Adv GetDocTypes ori` | 10077510 | `CE DocEx Adv GetDocTypes` |
| 10036411 | `DocEx Adv GetDocument ori` | 10077511 | `CE DocEx Adv GetDocument` |
| 10036412 | `DocEx Adv GetInbox ori` | 10077512 | `CE DocEx Adv GetInbox` |
| 10036413 | `DocEx Adv GetPresentUrl ori` | 10077513 | `CE DocEx Adv GetPresentUrl` |
| 10036414 | `DocEx Adv GetSent ori` | 10077514 | `CE DocEx Adv GetSent` |
| 10036415 | `DocEx Adv GetSessUrl ori` | 10077515 | `CE DocEx Adv GetSessUrl` |
| 10036416 | `DocEx Adv GetStatuses ori` | 10077516 | `CE DocEx Adv GetStatuses` |
| 10036417 | `DocEx Adv GetTradePart ori` | 10077517 | `CE DocEx Adv GetTradePart` |
| 10036418 | `DocEx Adv GetUnread ori` | 10077518 | `CE DocEx Adv GetUnread` |
| 10036419 | `DocEx Adv GetUnreadRA ori` | 10077519 | `CE DocEx Adv GetUnreadRA` |
| 10036420 | `DocEx Adv GetUserAccess ori` | 10077520 | `CE DocEx Adv GetUserAccess` |
| 10036421 | `DocEx Adv GetWebUIUrl ori` | 10077521 | `CE DocEx Adv GetWebUIUrl` |
| 10036422 | `DocEx Adv InboxSince ori` | 10077522 | `CE DocEx Adv InboxSince` |
| 10036423 | `DocEx Adv Live ori` | 10077523 | `CE DocEx Adv Live` |
| 10036424 | `DocEx Adv LookupDoc ori` | 10077524 | `CE DocEx Adv LookupDoc` |
| 10036425 | `DocEx Adv OcrPdf ori` | 10077525 | `CE DocEx Adv OcrPdf` |
| 10036426 | `DocEx Adv StatusSync ori` | 10077526 | `CE DocEx Adv StatusSync` |
| 10036427 | `DocEx Adv SubmitDoc ori` | 10077527 | `CE DocEx Adv SubmitDoc` |
| 10036428 | `DocEx Adv Test ori` | 10077528 | `CE DocEx Adv Test` |
| 10036429 | `DocEx Adv UpdateStatus ori` | 10077529 | `CE DocEx Adv UpdateStatus` |
| 10036430 | `DocEx Document ori` | 10077530 | `CE DocEx Document` |
| 10036431 | `DocEx Exchange ori` | 10077531 | `CE DocEx Exchange` |
| ~~10036432~~ | ~~`DocEx Credentials ori`~~ | 10077532 | `CE DocEx Credentials` — **deleted**, replaced by `Secret Store ori` in Bifröst Foundation |
| 10036433 | `DocEx Gate ori` | 10077533 | `CE DocEx Gate` |
| 10036434 | `DocEx Help ori` | 10077534 | `CE DocEx Help` |
| 10036435 | `DocEx Attachments ori` | 10077535 | `CE DocEx Attachments` |
| 10036436 | `DocEx Incoming Doc ori` | 10077536 | `CE DocEx Incoming Doc` |
| 10036437 | `DocEx Sales Doc ori` | 10077537 | `CE DocEx Sales Doc` |
| 10036438 | `DocEx BII Def ori` | 10077538 | `CE DocEx BII Def` |
| 10036439 | `DocEx BII Install ori` | 10077539 | `CE DocEx BII Install` |
| 10036440 | `DocEx BII Pre-Map ori` | 10077540 | `CE DocEx BII Pre-Map` |
| 10036441 | `DocEx Help Get Help ori` | 10077541 | `CE DocEx Help Get Help` |
| 10036442 | `DocEx Help Get Impl ori` | 10077542 | `CE DocEx Help Get Impl` |
| 10036443 | `DocEx Overview Subscriber ori` | 10077543 | `CE DocEx Overview Subscriber` |
| 10036444 | `DocEx BIS30 Mapper ori` | 10077544 | `CE DocEx BIS30 Mapper` |
| 10036445 | `DocEx Umz AddAttach ori` | 10077545 | `CE DocEx Umz AddAttach` |
| 10036446 | `DocEx Umz Client ori` | 10077546 | `CE DocEx Umz Client` |
| 10036447 | `DocEx Umz CreateInvoice ori` | 10077547 | `CE DocEx Umz CreateInvoice` |
| 10036448 | `DocEx Umz CreateMsg ori` | 10077548 | `CE DocEx Umz CreateMsg` |
| 10036449 | `DocEx Umz GetDocHist ori` | 10077549 | `CE DocEx Umz GetDocHist` |
| 10036450 | `DocEx Umz GetDocInfo ori` | 10077550 | `CE DocEx Umz GetDocInfo` |
| 10036451 | `DocEx Umz GetDocOrig ori` | 10077551 | `CE DocEx Umz GetDocOrig` |
| 10036452 | `DocEx Umz GetDocSupport ori` | 10077552 | `CE DocEx Umz GetDocSupport` |
| 10036453 | `DocEx Umz GetDocTrans ori` | 10077553 | `CE DocEx Umz GetDocTrans` |
| 10036454 | `DocEx Umz GetDocument ori` | 10077554 | `CE DocEx Umz GetDocument` |
| 10036455 | `DocEx Umz GetInbox ori` | 10077555 | `CE DocEx Umz GetInbox` |
| 10036456 | `DocEx Umz GetPartyInfo ori` | 10077556 | `CE DocEx Umz GetPartyInfo` |
| 10036457 | `DocEx Umz GetPending ori` | 10077557 | `CE DocEx Umz GetPending` |
| 10036458 | `DocEx Umz GetPresentUrl ori` | 10077558 | `CE DocEx Umz GetPresentUrl` |
| 10036459 | `DocEx Umz GetUnread ori` | 10077559 | `CE DocEx Umz GetUnread` |
| 10036460 | `DocEx Umz GetValid ori` | 10077560 | `CE DocEx Umz GetValid` |
| 10036461 | `DocEx Umz Live ori` | 10077561 | `CE DocEx Umz Live` |
| 10036462 | `DocEx Umz LookupDoc ori` | 10077562 | `CE DocEx Umz LookupDoc` |
| 10036463 | `DocEx Umz RegPayment ori` | 10077563 | `CE DocEx Umz RegPayment` |
| 10036464 | `DocEx Umz RegReject ori` | 10077564 | `CE DocEx Umz RegReject` |
| 10036465 | `DocEx Umz RetryMsg ori` | 10077565 | `CE DocEx Umz RetryMsg` |
| 10036466 | `DocEx Umz StatusSync ori` | 10077566 | `CE DocEx Umz StatusSync` |
| 10036467 | `DocEx Umz SubmitTrx ori` | 10077567 | `CE DocEx Umz SubmitTrx` |
| 10036468 | `DocEx Umz Test ori` | 10077568 | `CE DocEx Umz Test` |
| 10036469 | `DocEx Umz UpdateStatus ori` | 10077569 | `CE DocEx Umz UpdateStatus` |
| 10036470 | `DocEx Advania Masker ori` | 10077570 | `CE DocEx Advania Masker` |
| 10036471 | `DocEx BIS30 Masker ori` | 10077571 | `CE DocEx BIS30 Masker` |
| 10036472 | `DocEx Unimaze Masker ori` | 10077572 | `CE DocEx Unimaze Masker` |
| 10036473 | `DocEx XDoc Masker ori` | 10077573 | `CE DocEx XDoc Masker` |
| 10036474 | `DocEx Http Notif. Action ori` | 10077574 | `CE DocEx Http Notif. Action` |
| 10036475 | `DocEx UBL Builder ori` | 10077575 | `CE DocEx UBL Builder` |
| 10036476 | `DocEx UBL Desp Writer ori` | 10077576 | `CE DocEx UBL Desp Writer` |
| 10036477 | `DocEx UBL Help ori` | 10077577 | `CE DocEx UBL Help` |
| 10036478 | `DocEx UBL Inv Writer ori` | 10077578 | `CE DocEx UBL Inv Writer` |
| 10036479 | `DocEx UBL Ns Resolver ori` | 10077579 | `CE DocEx UBL Ns Resolver` |
| 10036480 | `DocEx UBL Ord Writer ori` | 10077580 | `CE DocEx UBL Ord Writer` |
| 10036481 | `DocEx UBL Party Writer ori` | 10077581 | `CE DocEx UBL Party Writer` |
| 10036482 | `DocEx UBL RenderDesp ori` | 10077582 | `CE DocEx UBL RenderDesp` |
| 10036483 | `DocEx UBL RenderInv ori` | 10077583 | `CE DocEx UBL RenderInv` |
| 10036484 | `DocEx UBL RenderOrder ori` | 10077584 | `CE DocEx UBL RenderOrder` |
| 10036485 | `DocEx UBL RenderStmt ori` | 10077585 | `CE DocEx UBL RenderStmt` |
| 10036486 | `DocEx UBL Stmt Writer ori` | 10077586 | `CE DocEx UBL Stmt Writer` |
| 10036487 | `DocEx UBL Store ori` | 10077587 | `CE DocEx UBL Store` |
| 10036488 | `DocEx UBL Tax Writer ori` | 10077588 | `CE DocEx UBL Tax Writer` |
| 10036489 | `DocEx Umz SubmitXml ori` | 10077589 | `CE DocEx Umz SubmitXml` |
| 10036490 | `DocEx Install ori` | 10077590 | `CE DocEx Install` |
| 10036491 | `DocEx UBL Validator ori` | 10077591 | `CE DocEx UBL Validator` |
| 10036492 | `DocEx Inv Rounding ori` | 10077592 | `CE DocEx Inv Rounding` |
| 10036493 | `DocEx Inc.Doc.Events ori` | 10077593 | `CE DocEx Inc.Doc.Events` |
| 10036494 | `DocEx BII Post-Map ori` | 10077594 | `CE DocEx BII Post-Map` |
| 10036495 | `DocEx InEx Live ori` | 10077595 | `CE DocEx InEx Live` |
| 10036496 | `DocEx InEx Test ori` | 10077596 | `CE DocEx InEx Test` |
| 10036497 | `DocEx InEx Client ori` | 10077597 | `CE DocEx InEx Client` |
| 10036498 | `DocEx InEx GetIncoming ori` | 10077598 | `CE DocEx InEx GetIncoming` |
| 10036499 | `DocEx InEx GetDocument ori` | 10077599 | `CE DocEx InEx GetDocument` |
| 10036500 | `DocEx InEx GetDocInfo ori` | 10077600 | `CE DocEx InEx GetDocInfo` |
| 10036501 | `DocEx InEx MarkHandled ori` | 10077601 | `CE DocEx InEx MarkHandled` |
| 10036502 | `DocEx InEx SendDoc ori` | 10077602 | `CE DocEx InEx SendDoc` |
| 10036503 | `DocEx InEx GetStatus ori` | 10077603 | `CE DocEx InEx GetStatus` |
| 10036504 | `DocEx InEx BuyerLookup ori` | 10077604 | `CE DocEx InEx BuyerLookup` |
| 10036505 | `DocEx InEx SellerLookup ori` | 10077605 | `CE DocEx InEx SellerLookup` |
| 10036506 | `DocEx InEx Masker ori` | 10077606 | `CE DocEx InEx Masker` |
| 10036507 | `DocEx VAT GL Resolver ori` | 10077607 | `CE DocEx VAT GL Resolver` |
| 10036508 | `DocEx Purch Doc Creator ori` | 10077608 | `CE DocEx Purch Doc Creator` |
| 10036509 | `DocEx Jnl Creator ori` | 10077609 | `CE DocEx Jnl Creator` |
| 10036510 | `DocEx Take-Over ori` | — | *(new — data take-over from the published app)* |
| 10036511 | `DocEx Secrets ori` | — | *(new — builds the secret codes and wraps `Secret Store ori`)* |
| 10036512 | `DocEx Setup Init ori` | — | *(new — shared install/upgrade initializer)* |
| 10036513 | `DocEx Upgrade ori` | — | *(new — upgrade codeunit, upgrade-tag guarded)* |

## Interfaces (5)

Interfaces carry no object id; only the name changed.

| New name | Old name |
|---|---|
| `DocEx Advania ori` | `CE DocEx Advania ori` |
| `DocEx BIS30 ori` | `CE DocEx BIS30 ori` |
| `DocEx InExchange ori` | `CE DocEx InExchange ori` |
| `DocEx Unimaze ori` | `CE DocEx Unimaze ori` |
| `DocEx Vend Post Mode ori` | `CE DocEx Vend Post Mode ori` |

## Enums (12)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036385 | `DocEx BIS30 Env ori` | 10077485 | `CE DocEx BIS30 Env ori` |
| 10036386 | `DocEx Advania Env ori` | 10077486 | `CE DocEx Advania Env ori` |
| 10036387 | `DocEx Delivery Stat ori` | 10077487 | `CE DocEx Delivery Stat` |
| 10036388 | `DocEx Doc Type ori` | 10077488 | `CE DocEx Doc Type` |
| 10036389 | `DocEx Party Type ori` | 10077489 | `CE DocEx Party Type` |
| 10036390 | `DocEx Ref Type ori` | 10077490 | `CE DocEx Ref Type` |
| 10036391 | `DocEx BIS30 Map Type ori` | 10077491 | `CE DocEx BIS30 Map Type` |
| 10036392 | `DocEx Unimaze Env ori` | 10077492 | `CE DocEx Unimaze Env ori` |
| 10036393 | `DocEx UBL Standard ori` | 10077493 | `CE DocEx UBL Standard` |
| 10036394 | `DocEx UBL Store Target ori` | 10077494 | `CE DocEx UBL Store Target` |
| 10036395 | `DocEx InExchange Env ori` | 10077495 | `CE DocEx InExchange Env ori` |
| 10036396 | `DocEx Vend Post Mode ori` | 10077496 | `CE DocEx Vend Post Mode ori` |

## Enum extensions (7)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036385 | `DocEx BIS30 Msg Type ori` | 10077485 | `CE DocEx BIS30 Msg Type ori` |
| 10036386 | `DocEx Adv Msg Type ori` | 10077486 | `CE DocEx Adv Msg Type ori` |
| 10036387 | `DocEx Help Msg Type ori` | 10077487 | `CE DocEx Help Msg Type ori` |
| 10036388 | `DocEx Umz Msg Type ori` | 10077488 | `CE DocEx Umz Msg Type ori` |
| 10036389 | `DocEx Request Log Type ori` | 10077489 | `CE DocEx Request Log Type` |
| 10036390 | `DocEx UBL Msg Type ori` | 10077490 | `CE DocEx UBL Msg Type ori` |
| 10036394 | `DocEx InEx Msg Type ori` | 10077494 | `CE DocEx InEx Msg Type ori` |

## Permission set extensions (5)

| New ID | New name | Old ID | Old name |
|---|---|---|---|
| 10036385 | `DocEx Full ori` | 10077485 | `CE DocEx Full ori` |
| 10036386 | `DocEx D365 Read ori` | 10077486 | `CE DocEx D365 Read` |
| 10036387 | `DocEx D365 Edit ori` | 10077487 | `CE DocEx D365 Edit` |
| 10036388 | `DocEx D365 Full ori` | 10077488 | `CE DocEx D365 Full` |
| 10036389 | `DocEx GLJnl Edit ori` | 10077489 | `CE DocEx GL Jnl Edit` |

---

## Enum extension value IDs

Values extend `Message Type ori` in Bifrost Foundation, except the Request Log types, which extend
`Request Log Type ori`. The value **names** are the message-type keys and did not change.

| Enum extension | Value IDs | Count |
|---|---|---|
| `DocEx BIS30 Msg Type ori` | 10036500–10036509 | 10 |
| `DocEx Adv Msg Type ori` | 10036510–10036539 | 30 |
| `DocEx Umz Msg Type ori` | 10036540–10036561, 10036567 | 23 |
| `DocEx Help Msg Type ori` | 10036562 | 1 |
| `DocEx UBL Msg Type ori` | 10036563–10036566 | 4 |
| `DocEx InEx Msg Type ori` | 10036600–10036607 | 8 |
| `DocEx Request Log Type ori` | 10036600–10036604 | 5 |

Total message types: **76** (10 BIS30 + 30 Advania + 23 Unimaze + 8 InExchange + 4 UBL + 1 Help).

## Table extension field IDs

| Field ID | Field | Extends | Old field ID |
|---|---|---|---|
| 10036700 | `DocEx Advania Env` | `Setup ori` | 10077800 |
| 10036701 | `DocEx Unimaze Env` | `Setup ori` | 10077801 |
| 10036702 | `DocEx BIS30 Env` | `Setup ori` | 10077802 |
| 10036703 | `DocEx InExchange Env` | `Setup ori` | 10077803 |
| 10036704 | `Document Id ori` | `Incoming Document` | 10077804 |
| 10036705 | `DocEx Posting Mode ori` | `Vendor` | 10077805 |

## Isolated storage keys

Credential keys were renamed with the brand. Because BC scopes isolated storage per extension, the
stored values do **not** move with the data take-over — an administrator must re-enter them on the
Bifröst Setup page after installing Bifrost Iceland DocEx.

| Old key prefix | New key prefix |
|---|---|
| `CE-DOCEX-ADV-LIVE` | `Bifrost_DocEx_Adv_Live` |
| `CE-DOCEX-ADV-TEST` | `Bifrost_DocEx_Adv_Test` |
| `CE-DOCEX-UMZ-LIVE` | `Bifrost_DocEx_Umz_Live` |
| `CE-DOCEX-UMZ-TEST` | `Bifrost_DocEx_Umz_Test` |
| `CE-DOCEX-INEX-LIVE` | `Bifrost_DocEx_InEx_Live` |
| `CE-DOCEX-INEX-TEST` | `Bifrost_DocEx_InEx_Test` |

Each prefix is suffixed with `-USER` and `-PWD` by `DocEx Credentials ori`.
Key Vault secret names still start with `CE-` — that is an external contract and was deliberately left alone.


## Test app objects (Bifrost Iceland DocEx - Tests)

Range 99400-99599 (old 97700-97799). Test objects drop the `CE ` prefix and carry no affix.

| Type | New ID | New name | Old ID | Old name |
|---|---|---|---|---|
| codeunit | 99453 | `DocEx Adv Mock` | 97753 | `CE DocEx Adv Mock` |
| codeunit | 99455 | `DocEx BIS30 Mock` | 97755 | `CE DocEx BIS30 Mock` |
| codeunit | 99457 | `DocEx InEx Mock` | 97757 | `CE DocEx InEx Mock` |
| codeunit | 99454 | `DocEx Umz Mock` | 97754 | `CE DocEx Umz Mock` |
| codeunit | 99456 | `DocEx Connector Tests` | 97756 | `DocEx Connector Tests` |
| codeunit | 99400 | `DocEx Incoming Doc Tests` | 97700 | `DocEx Incoming Doc Tests` |
| codeunit | 99401 | `DocEx Setup Secret Tests` | — | *(new — the setup table, the setup page and the secret store)* |
| codeunit | 99460 | `DocEx Pre-Map VAT Tests` | 97760 | `DocEx Pre-Map VAT Tests` |
| codeunit | 99458 | `DocEx Test Config` | 97758 | `DocEx Test Config` |
| codeunit | 99459 | `DocEx UBL Render Tests` | 97759 | `DocEx UBL Render Tests` |
| codeunit | 99461 | `DocEx Vend VAT GL Map Tests` | 97761 | `DocEx Vend VAT GL Map Tests` |
| enumextension | 99450 | `DocEx Adv Mock Env` | 97750 | `CE DocEx Adv Mock Env` |
| enumextension | 99452 | `DocEx BIS30 Mock Env` | 97752 | `CE DocEx BIS30 Mock Env` |
| enumextension | 99457 | `DocEx InEx Mock Env` | 97757 | `CE DocEx InEx Mock Env` |
| enumextension | 99451 | `DocEx Umz Mock Env` | 97751 | `CE DocEx Umz Mock Env` |
| enumextension | 99458 | `DocEx Test Msg Types` | 97758 | `DocEx Test Msg Types` |

## Obsolete objects

The source app contained no objects in `ObsoleteState = Pending` or `Removed`, so nothing was dropped
for obsolescence. Every object in the source app has a counterpart above.

## Changes after the migration

The migration reproduced the Cloud Events app object for object. Adopting the shared Bifröst
platform setup pattern then changed five things, all listed in the tables above:

| Change | Why |
|---|---|
| `tableextension 10036385 "DocEx Setup Ext ori"` deleted | A dependent app must not extend Foundation's `Setup ori` table. Its four environment fields moved to the new singleton `table 10036399 "DocEx Setup ori"`, and the install and upgrade codeunits copy the values over. |
| `pageextension 10036385 "DocEx Setup Ext ori"` reduced | It now contributes one action to the `Apps` group on Bifröst Setup, opening `page 10036398 "DocEx Setup ori"`. The Document Exchange field group and the Navigation action group moved onto that page. |
| `codeunit 10036432 "DocEx Credentials ori"` deleted | Provider credentials moved into Foundation's `Secret Store ori`, keyed `<PROVIDER>-<ENVIRONMENT>-<PART>`. |
| Three interfaces trimmed | `GetUsername`, `SetCredentials` and `ClearCredentials` were removed; only `HasCredentials` remains. The setup page talks to the secret store directly, and a `SecretText` value cannot be unwrapped in a Cloud app. |
| Three codeunits added | `DocEx Secrets ori`, `DocEx Setup Init ori` and `DocEx Upgrade ori` (10036511-10036513). |

The value of every credential must be entered once after installing: Business Central keeps stored
secrets separate per extension, so nothing carries over from the published Cloud Events app.
