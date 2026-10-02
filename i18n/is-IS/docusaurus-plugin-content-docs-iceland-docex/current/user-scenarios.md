---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir fyrir vottun Bifröst Iceland DocEx á AppSource."
---

Prófaðu í Business Central 28.0 eða nýrra með Bifröst Foundation og prófunaraðgangi að þeim skjalaskiptaþjónustum sem á að nota.

Prófandinn vinnur gegnum gervigreindaraðstoðarmann sem er tengdur Business Central með MCP-þjóni
Bifrastar (sjá [Tengdu gervigreindaraðstoðarmanninn](/setup/connect-your-ai/)), eða kallar á Bifröst úr
öðrum biðlara. Uppsettar aðgerðir og samningar þeirra eru alltaf listaðir með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Sviðsmynd 1: Setja upp viðbót

Settu upp Foundation og DocEx, opnaðu Uppsetning Bifröst → Uppsetning skjalaskipta og staðfestu að þjónustuaðilar og skilríkjastöður birtist án villu, og að skjalaskiptaaðgerðirnar séu á síðunni Bifrost Message Types.

## Sviðsmynd 2: BIS 3.0 landskóðar

Biddu aðstoðarmanninn um landskóða Peppol BIS 3.0. Svarið skal innihalda landskóða með heitum.

## Sviðsmynd 3: BIS 3.0 skjalategundarkóðar

Biddu um skjalategundarkóða Peppol BIS 3.0 og staðfestu að staðlaðir kóðar komi til baka (t.d. 380 reikningur, 381 kreditreikningur).

## Sviðsmynd 4: Advania — ólesin skjöl

Spyrðu hvaða skjöl séu ólesin hjá Advania. Staðfestu lista yfir ólesin skjöl og að kallið sé skráð í beiðnaskrá með aðgangsupplýsingarnar huldar.

## Sviðsmynd 5: Advania — heilt skjal

Biddu um eitt skjal frá Advania eftir skjalanúmeri og staðfestu haus, línur og upphæðir.

## Sviðsmynd 6: Advania — senda reikning

Biddu aðstoðarmanninn að senda bókaðan sölureikning gegnum Advania og staðfestu að sendingin fái rakningarnúmer.

## Sviðsmynd 7: Advania — samstilling stöðu

Biddu um að staða sendra skjala hjá Advania sé uppfærð og staðfestu að stöðurnar endurspegli kerfi Advania.

## Sviðsmynd 8: Unimaze — ólesin skjöl

Spyrðu hvaða skjöl séu ólesin hjá Unimaze og staðfestu móttekin skjöl.

## Sviðsmynd 9: Unimaze — senda færslu

Biddu um sendingu skjals gegnum Unimaze með prófunargögnum og staðfestu færslunúmer eða sundurliðaðar villur.

## Sviðsmynd 10: InExchange — innkomandi skjöl

Spyrðu hvaða innkomandi skjöl bíði hjá InExchange og staðfestu að skjöl og lýsigögn skili sér.

## Sviðsmynd 11: InExchange — senda skjal

Biddu um sendingu skjals gegnum InExchange og staðfestu rakningarnúmer sendingar.

## Sviðsmynd 12: UBL — reikningur

Biddu um að bókaður sölureikningur sé myndaður sem Peppol BIS 3.0 UBL og staðfestu gilt UBL 2.1 XML.

## Sviðsmynd 13: UBL — pöntun

Biddu um að sölupöntun sé mynduð sem UBL og staðfestu UBL 2.1 XML fyrir pöntun.

## Sviðsmynd 14: Uppfletting viðskiptafélaga

Biddu um leit að viðskiptafélögum á Advania-netinu eftir nafni eða rafrænu auðkenni og staðfestu að kaupendur og seljendur finnist.

## Sviðsmynd 15: Sækja PDF skjals

Biddu um PDF af skjali hjá Advania og staðfestu að PDF-skjalið opnist og passi við upprunaskjalið.

## Sviðsmynd 16: Ógild skilríki

Skráðu röng skilríki á Uppsetning skjalaskipta og endurtaktu sviðsmynd 4. Skipulögð villa skal skila sér og aðgangsupplýsingar mega ekki birtast í beiðnaskránni.

## Sviðsmynd 17: Heimildir

Staðfestu að notandi með heimildasettið geti opnað uppsetninguna og notað skjalaskiptaaðgerðirnar, og að sami notandi fái heimildavillu þegar settið er tekið af honum.

## Sviðsmynd 18: Fjarlægja viðbót

Fjarlægðu DocEx og staðfestu að fjarlægingin ljúki án villu og að önnur Bifröst-forrit virki áfram.
