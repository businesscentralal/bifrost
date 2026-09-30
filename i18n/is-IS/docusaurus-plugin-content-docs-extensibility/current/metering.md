---
id: metering
title: "Mæling skilaboðategundar"
sidebar_label: "Mæling skilaboðategundar"
sidebar_position: 3
description: "Msg Metering ori viðmótið sem Bifröst kallar á eftir hvert árangursríkt kall, og hvað það getur og getur ekki gert."
---

# Mæling skilaboðategundar

Bifröst kallar á einn krók eftir hver árangursrík skilaboð: `Msg Metering ori`. Hann er til
þess að gjaldtöku- eða mælingalausn hafi stað til að hengja sig á — verðlagningu á hvert
kall, teljara fyrir leigjanda, ytri mæli — án þess að breyta grunninum og án þess að skrá
sig á atburð sem kviknar við allt mögulegt.

Krókurinn er viljandi einfaldur. Hann ræður ekki hvað kall kostar, hann getur ekki gert kall
ókeypis og hann getur ekki breytt því sem kallandinn fær til baka. Honum er sagt að kall hafi
átt sér stað, og það er allt og sumt.

## Samningurinn

`Argument` ber allt kallið sem lauk: skilaboðategundina, efnið, beiðnigögnin og svarið sem
kallandinn fær. Lestu eins mikið af því og þú þarft — en ekki breyta svarinu: þegar krókurinn
keyrir hefur kallandinn það þegar.

## Hvenær hann keyrir

Grunnurinn kallar á krókinn einu sinni eftir hvert **árangursríkt** skilaboðakall. Kall er
árangursríkt þegar svarið hefur ekkert `status`, eða `status = "Success"`. Ekkert keyrir
krókinn eftir misheppnað kall.

Grunnurinn mælir ekki eigin uppgötvunar- og hjálpartegundir; tegundir forritsins þíns eru
mældar, þar með talin þín eigin Help-tegund.

Kallið kemur **eftir** að svarið hefur verið skrifað, og krókurinn fær sína eigin
færsluheild. Tvennt leiðir af því, og hvort tveggja er þér í hag: þú mátt skrifa í
gagnagrunninn, og ef þú klikkar eru aðeins þínar eigin skriftir bakfærðar — kallandinn heldur
svarinu sem hann hefur þegar fengið.

## Ekkert að gera fyrir núverandi forrit

Hvert gildi `Message Type ori` hefur nú þegar sjálfgefna útfærslu sem gerir ekkert, svo þú
þarft ekki að lýsa yfir neinu. Ef þú ert ekki að smíða gjaldtökulausn máttu hætta að lesa hér.

## Gjaldtakan er óbreytt

Krókurinn hefur engin áhrif á gjaldtöku. Bifröst telur notkun á sama hátt hvort sem þú útfærir
krókinn eða ekki. Ef lausnin þín þarf vægi, mæli eða verð á hverja tegund heldur hún utan um
það í eigin töflum — og það er einmitt það sem krókurinn er til.

Sjá [Licensing](/foundation/reference/licensing/).

## Að taka krókinn upp

Skrifaðu einingu sem útfærir viðmótið og bentu svo þeim skilaboðategundum sem þú verðleggur
á hana á enum-gildinu, við hliðina á útfærslunni sem þú ert þegar með. Hvert gildi sem nefnir
ekki `"Msg Metering ori"` heldur sjálfgefnu útfærslunni, svo þú getur mælt þrjár tegundir af
þrjátíu og látið hinar í friði.

Mynstrið er í leiðarvísinum fyrir samstarfsaðila:
[START-HERE §5.7, `Msg Metering ori`](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#interface-msg-metering-ori-advanced-optional).

### Reglur um meginmálið

- **Skrifaðu óhikað.** Settu inn mælingafærsluna þína, hækkaðu teljarann, settu útleið kall í
  biðröð.
- **Hafðu hann ódýran.** Krókurinn keyrir við hvert árangursríkt kall þeirra tegunda sem þú
  tekur að þér. Innsetning í þitt eigið bókhald er í lagi. Samstillt útleið HTTP-beiðni á hvert
  kall er það ekki — settu þá vinnu frekar í biðröð.
- **Aldrei breyta svarinu.** `Argument` er sent með tilvísun svo þú getir lesið beiðnina og
  svarið, ekki svo þú getir endurskrifað þau.
- **Ekki reiða þig á færsluheild kallandans.** Þú deilir henni ekki. Villa sem þú kastar
  bakfærir þínar eigin skriftir og ekkert annað — kallandinn fær eftir sem áður sama svar og
  hann hefði fengið án nokkurs króks. Bókhaldið þitt er því eftir bestu getu, og það verður
  að skrifa þannig að týnd færsla sé gat í bókhaldinu frekar en skemmd í því.
