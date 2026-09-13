---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir fyrir vottun Bifröst Iceland DocEx á AppSource."
---

Prófaðu í Business Central 28.0 eða nýrra með Bifröst Foundation og prófunaraðgangi að þeim skjalaskiptaþjónustum sem á að nota.

## Sviðsmynd 1: Setja upp viðbót

Settu upp Foundation og DocEx, opnaðu Bifröst Setup → Document Exchange og staðfestu að þjónustuaðilar og skilríkjastöður birtist án villu.

## Sviðsmynd 2: BIS 3.0 landskóðar

Keyrðu `DocumentExchange.BIS30.CountryCodes`. Svarið skal innihalda Peppol-landskóða.

## Sviðsmynd 3: BIS 3.0 skjalategundarkóðar

Keyrðu `DocumentExchange.BIS30.DocumentTypeCodes` og staðfestu að staðlaðir skjalakóðar komi til baka.

## Sviðsmynd 4: Advania — ólesin skjöl

Keyrðu `DocumentExchange.Advania.GetUnread`. Staðfestu lista yfir ólesin skjöl og að beiðni og svar séu skráð með huldu leyndarmáli.

## Sviðsmynd 5: Advania — heilt skjal

Notaðu `DocumentExchange.Advania.GetDocument` og `DocumentExchange.Advania.GetDocumentPdf` til að sækja gögn og PDF.

## Sviðsmynd 6: Advania — senda reikning

Keyrðu `DocumentExchange.Advania.CreateInvoice` með gildu Business Central-skjali og staðfestu stöðu sendingar.

## Sviðsmynd 7: Advania — samstilling stöðu

Keyrðu `DocumentExchange.Advania.StatusSync` og staðfestu að stöður skjala samstillist.

## Sviðsmynd 8: Unimaze — ólesin skjöl

Keyrðu `DocumentExchange.Unimaze.GetUnread` og staðfestu móttekin skjöl.

## Sviðsmynd 9: Unimaze — senda færslu

Keyrðu `DocumentExchange.Unimaze.SubmitTransaction` með prófunargögnum og staðfestu staðfestingu eða sundurliðaðar villur.

## Sviðsmynd 10: InExchange — innkomandi skjöl

Keyrðu `DocumentExchange.InExchange.GetIncoming` og staðfestu að innkomandi skjöl og lýsigögn skili sér.

## Sviðsmynd 11: InExchange — senda skjal

Keyrðu `DocumentExchange.InExchange.SendDocument` og staðfestu afhendingarstöðu.

## Sviðsmynd 12: UBL — reikningur

Keyrðu `DocumentExchange.UBL.RenderBilling` og staðfestu gilt UBL 2.1 XML.

## Sviðsmynd 13: UBL — pöntun

Keyrðu `DocumentExchange.UBL.RenderOrder` og staðfestu UBL 2.1 XML fyrir pöntun.

## Sviðsmynd 14: Uppfletting viðskiptafélaga

Keyrðu `DocumentExchange.Advania.GetTradingPartners` og staðfestu að kaupendur og seljendur finnist.

## Sviðsmynd 15: Sækja PDF skjals

Sæktu skjal með `DocumentExchange.Advania.GetDocumentPdf` og staðfestu að svarið innihaldi PDF-gögn.

## Sviðsmynd 16: Ógild skilríki

Keyrðu þjónustuaðgerð með röngum skilríkjum. Skipulögð villa skal skila sér og aðgangsupplýsingar mega ekki birtast í Request Log.

## Sviðsmynd 17: Heimildir

Staðfestu að lesheimildir leyfi uppflettingar en að sendi- og uppfærsluaðgerðir krefjist viðeigandi heimildasetts.

## Sviðsmynd 18: Fjarlægja viðbót

Fjarlægðu DocEx og staðfestu að uppsetningar- og fjarlægingarferli ljúki án villu.