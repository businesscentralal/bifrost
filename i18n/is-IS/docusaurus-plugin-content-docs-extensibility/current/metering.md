---
id: metering
title: "Mæling skilaboðategundar"
sidebar_label: "Mæling skilaboðategundar"
sidebar_position: 3
description: "Msg Metering ori krókurinn sem Bifröst kallar á eftir hver árangursrík skilaboð, og hvernig gjaldtöku- eða mælingalausn hengir eigið bókhald á hann."
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

Ein aðferð:

```al
interface "Msg Metering ori"
{
    procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
}
```

`Argument` ber allt kallið sem lauk: skilaboðategundina, efnið, beiðnigögnin og svarið sem
kallandinn fær. Lestu eins mikið af því og þú þarft — en ekki breyta svarinu: þegar krókurinn
keyrir hefur kallandinn það þegar.

Samningurinn aðferð fyrir aðferð, fjarmælingaratburðurinn og reglurnar um kallið eru í
[tilvísun mælingaviðmótsins](/foundation/reference/metering-interface/).

## Hvenær hann keyrir

`Message Task ori` kallar á krókinn einu sinni eftir hvert **árangursríkt** skilaboðakall:

- í **öllum umhverfum** — í rekstri, í sandkassa og í eigin umhverfi;
- hvort sem leyfisskylda á skilaboðakvóta gildir í umhverfinu eða ekki;
- fyrir allar skilaboðategundir allra forrita, jafnt grunnsins sem háðra forrita.

Eina undantekningin er nafnforskeytisreglan sem hefur alltaf ráðið gjaldtöku: skilaboðategundir
sem byrja á `Help.` eða `Webhook.` ná aldrei króknum. Uppgötvun og svarkall eru ekki
gjaldskyld vinna og eru því ekki mæld heldur. Það er engin önnur leið til að vera undanþeginn —
skilaboðategund getur ekki afskráð sig sjálf.

Ekkert keyrir krókinn eftir misheppnað kall. Svar þar sem `status` er annað en `Success` er
hvorki gjaldfært né mælt.

Kallið kemur **eftir** að svarið hefur verið skrifað í `Message ori` og staðfest, rétt á undan
svarkallstilkynningunni. Grunnurinn keyrir það með `Codeunit.Run` á sérstakri einingu,
`Metering Hook ori`, svo það fær sína eigin færsluheild. Tvennt leiðir af því, og hvort tveggja
er þér í hag: þú mátt skrifa í gagnagrunninn, og ef þú klikkar eru aðeins þínar eigin skriftir
bakfærðar — kallandinn heldur svarinu sem hann hefur þegar fengið.

## Ekkert að gera fyrir núverandi forrit

`Message Type ori` lýsir yfir viðmótinu og sjálfgefinni útfærslu:

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

`Default Metering ori` (10078308) er með tómt meginmál. Af því að enumið nefnir hana sem
sjálfgefna útfærslu ber hvert einasta gildi — þar með talin enum-viðbótargildin í forritinu
þínu — krókinn nú þegar án þess að lýsa yfir nokkru, og að gera ekkert kostar eitt tómt
viðmótskall fyrir hver árangursrík skilaboð. Ef þú ert ekki að smíða gjaldtökulausn máttu
hætta að lesa hér.

## Gjaldtakan er óbreytt

Krókurinn hefur engin áhrif á gjaldtöku. Gjaldtakan virkar nákvæmlega eins og hún gerði áður
en krókurinn varð til:

- nákvæmlega **ein skilaboð** fyrir hvert árangursríkt kall sem er ekki undanþegið;
- gjaldfærð á pott kallandans, **Notandi** eða **Forritsskráning**, sem er ákveðinn miðlægt;
- skráð í `Message ori."Charge Type"`.

Það er ekkert vægi, enginn mælir og ekkert verð á hverja tegund neins staðar í kerfinu. Ef
lausnin þín þarf slíkt heldur hún utan um það í eigin töflum — og það er einmitt það sem
krókurinn er til.

Sjá [Licensing](/foundation/reference/licensing/) fyrir pottana, framfylgdina og daglegu
notkunarsamstillinguna.

## Að taka krókinn upp

Skrifaðu einingu sem útfærir viðmótið og bentu svo þeim skilaboðategundum sem þú verðleggur
á hana á enum-gildinu, við hliðina á útfærslunni sem þú ert þegar með:

```al
codeunit 50100 "Contoso Metering" implements "Msg Metering ori"
{
    Access = Internal;

    internal procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
    var
        MeterEntry: Record "Contoso Meter Entry";
    begin
        MeterEntry.Init();
        MeterEntry."Message Type" := ...;      // Argument."Type"
        MeterEntry.Subject := Argument.Subject;
        MeterEntry."Metered At" := CurrentDateTime();
        MeterEntry.Insert(true);
    end;
}

enumextension 50100 "Contoso Msg Types" extends "Message Type ori"
{
    value(50100; "Contoso.Invoice.Rate")
    {
        Caption = 'Contoso.Invoice.Rate', Locked = true;
        Implementation = "Msg Interface ori" = "Contoso Invoice Rate Impl", "Msg Metering ori" = "Contoso Metering";
    }
}
```

Hvert gildi sem nefnir ekki `"Msg Metering ori"` heldur `Default Metering ori`, svo þú getur
mælt þrjár tegundir af þrjátíu og látið hinar í friði.

### Að ná í heiti tegundarinnar

Ef mælingafærslan þín geymir skilaboðategundina sem texta frekar en sem enum skaltu ekki
grípa til `Format()` — Origo-staðlarnir banna það á enum-gildum, því það skilar
skjátextanum en ekki heiti gildisins. Farðu í gegnum `Names()` og `Ordinals()`:

```al
TypeName := Enum::"Message Type ori".Names().Get(
    Enum::"Message Type ori".Ordinals().IndexOf(Argument."Type".AsInteger()));
```

Það skilar heitinu eins og það er á vírnum — `Contoso.Invoice.Rate` — á öllum tungumálum.

### Fjórar reglur um meginmálið

- **Skrifaðu óhikað.** Af því að grunnurinn kallar á krókinn með `Codeunit.Run` en ekki
  `TryFunction` leyfir AL-keyrslan skriftir í gagnagrunninn: settu inn mælingafærsluna þína,
  hækkaðu teljarann, settu útleið kall í biðröð. Það er einmitt tilgangur einangrunarinnar —
  `TryFunction` hreiðrað í skilaboðaverkinu myndi hafna þessum skriftum.
- **Hafðu hann ódýran.** Krókurinn keyrir eftir sem áður í þræði kallandans, við hvert
  árangursríkt kall þeirra tegunda sem þú tekur að þér. Innsetning í þitt eigið bókhald er í
  lagi. Samstillt útleið HTTP-beiðni á hvert kall er það ekki — settu þá vinnu frekar í
  biðröð.
- **Aldrei breyta svarinu.** `Argument` er sent með tilvísun svo þú getir lesið beiðnina og
  svarið, ekki svo þú getir endurskrifað þau. Svarið var staðfest áður en kallað var á
  krókinn, svo breyting væri jafn gagnslaus og hún er röng.
- **Ekki reiða þig á færsluheild kallandans.** Þú deilir henni ekki. Villa sem þú kastar er
  gripin með því að `Codeunit.Run` skilar `false`, skráð í fjarmælingar (`ORI-BIF-0170`) og
  bakfærir þínar eigin skriftir og ekkert annað — kallandinn fær eftir sem áður sama svar og
  hann hefði fengið án nokkurs króks. Bókhaldið þitt er því eftir bestu getu, og það verður
  að skrifa þannig að týnd færsla sé gat í bókhaldinu frekar en skemmd í því.

## Næst

- Reglurnar um kallið, fjarmælingaratburðurinn og það sem er skráð á skilaboðin:
  [Metering interface](/foundation/reference/metering-interface/).
- Pottarnir, kvótaathuganirnar og daglega notkunarsamstillingin:
  [Licensing](/foundation/reference/licensing/).
- Hitt viðmótið á sama enum-gildinu:
  [Message types](/extensibility/message-types).
