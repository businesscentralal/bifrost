---
id: metering
title: "Mæling skilaboðategundar"
sidebar_label: "Mæling skilaboðategundar"
sidebar_position: 3
description: "Að taka upp Msg Metering ori viðmótið fyrir skilaboðategund til að stýra hvað eitt árangursríkt kall kostar, hvort það er ókeypis og undir hvaða mæli það er tilkynnt."
---

# Mæling skilaboðategundar

Bifröst gjaldfærir leyfispott kallandans einu sinni fyrir hver árangursrík skilaboð sem
eru ekki undanþegin. Hvaða pottur kallið lendir í — **Notandi** eða **Forritsskráning** —
er ákveðið miðlægt og skilaboðategund hefur engin áhrif á það. Það sem skilaboðategund
*getur* haft áhrif á er verðið: hversu margar leyfiseiningar eitt árangursríkt kall nýtir,
hvort það er ókeypis, og undir hvaða mæli notkunin er tilkynnt.

Það er hlutverk `Msg Metering ori`. Það er annað, valfrjálst viðmót á sama enum-gildinu og
nefnir nú þegar útfærsluna þína.

## Tvö viðmót á einu enumi

`Message Type ori` (10077894) í Foundation lýsir nú yfir báðum:

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

`Msg Interface ori` segir hvað tegundin **gerir**. `Msg Metering ori` segir hvað hún
**kostar**. Þau eru aðskilin svo verðlagning geti breyst án þess að snerta viðskiptarökin,
og svo fjölskylda tegunda geti deilt einni mælingaeiningu.

## Ekkert að gera fyrir núverandi forrit

Af því að enumið lýsir yfir `DefaultImplementation` fellur hvert gildi sem nefnir ekki
`Msg Metering ori` útfærslu — þar með talin enum-viðbótargildin í forritinu þínu — aftur á
`Default Metering ori`, sem endurskapar nákvæmlega það sem Bifröst gerði áður en viðmótið
var til:

- gjaldvægi **1** fyrir hvert árangursríkt kall;
- `Help.*` og `Webhook.*` tegundir **undanþegnar**, eftir nafnforskeyti;
- **enginn** mælir.

Bifrost Nornir og Bifrost Bragi voru þýdd óbreytt gegn nýju Foundation til að staðfesta
það. Ef þú ert sátt/ur við eina einingu á hvert kall þarftu ekki að bæta neinu við.

## Samningurinn

```al
interface "Msg Metering ori"
{
    procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer
    procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean
    procedure GetMeterName(): Text[50]
}
```

| Aðferð | Skilar |
| --- | --- |
| `GetChargeWeight` | Leyfiseiningunum sem eitt **árangursríkt** kall nýtir. `0` gerir kallið ókeypis; neikvætt gildi er meðhöndlað sem `0`. |
| `IsExempt` | `true` þegar tegundin er aldrei gjaldfærð **og** aldrei stöðvuð af kvótaathugun. |
| `GetMeterName` | Valfrjálsa mælinum sem notkunin er tilkynnt undir, við hliðina á heildartölu pottsins. Autt þýðir eingöngu heildartala pottsins. |

Bæði `GetChargeWeight` og `IsExempt` fá `Message Argument ori` kallsins og eru metin
**áður en** verkið keyrir, svo beiðnigögnin eru tiltæk: vægi má ráðast af því hversu mikla
vinnu kallandinn bað um. `GetMeterName` tekur ekkert viðfang — mælir nefnir fjölskyldu
tegunda, ekki stakt kall.

Fullar undirskriftir, merking viðfanga og hegðunartaflan eru í
[mælingaviðmótinu](/foundation/reference/metering-interface/).

## Að taka mælingu upp

Nefndu mælingarútfærsluna á enum-gildinu, við hliðina á þeirri sem þú ert þegar með:

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

enumextension 10035535 "Orchestrator Msg Type ori" extends "Message Type ori"
{
    value(10035560; "Orchestrator.Playbook.Run")
    {
        Caption = 'Orchestrator.Playbook.Run', Locked = true;
        Implementation = "Msg Interface ori" = "Playbook Run Msg ori", "Msg Metering ori" = "Playbook Run Metering ori";
    }
}
```

Skrifaðu svo mælingaeininguna. Hún er lýsigögn, ekki viðskiptarök: hafðu hana litla,
án aukaverkana, og láttu hana aldrei bregðast — hún keyrir á leyfisleiðinni áður en
útfærslan þín gerir það.

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

/// <summary>
/// Metering for Orchestrator.Playbook.Run. A playbook run costs one unit per step the
/// caller asked for, so a caller that batches ten steps into one call is charged the same
/// as one that sends ten calls.
/// </summary>
codeunit 10035561 "Playbook Run Metering ori" implements "Msg Metering ori"
{
    Access = Internal;

    var
        PlaybookMeterTok: Label 'PLAYBOOK', Locked = true;

    /// <summary>
    /// Returns one unit per requested step, and one unit for a request without steps.
    /// </summary>
    /// <param name="Argument">The message argument of the call being metered.</param>
    /// <returns>The units to charge for this call.</returns>
    internal procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer
    var
        RequestJson: JsonObject;
        LinesToken: JsonToken;
        LineCount: Integer;
    begin
        RequestJson := Argument.GetRequestJson();
        if not RequestJson.Get('lines', LinesToken) then
            exit(1);
        if not LinesToken.IsArray() then
            exit(1);
        LineCount := LinesToken.AsArray().Count();
        if LineCount < 1 then
            exit(1);
        exit(LineCount);
    end;

    /// <summary>
    /// Returns false: running a playbook is licensed work.
    /// </summary>
    /// <param name="Argument">The message argument of the call being metered.</param>
    /// <returns>Always false.</returns>
    internal procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean
    begin
        exit(false);
    end;

    /// <summary>
    /// Returns the meter every playbook message type reports under.
    /// </summary>
    /// <returns>The playbook meter name.</returns>
    internal procedure GetMeterName(): Text[50]
    begin
        exit(PlaybookMeterTok);
    end;
}
```

Bifröst hástafar mælisheitið áður en það er geymt á skilaboðunum, þannig að `Playbook`,
`playbook` og `PLAYBOOK` eru sami mælirinn. Hafðu það stutt, stöðugt og læst — rétt eins og
enum-gildisheitið er mælir orðinn samningur um leið og hann hefur verið tilkynntur.

## Að velja vægi

- **Hafðu vægin lítil og fyrirsjáanleg.** Kallandi á að geta reiknað út hvað kall kostar
  af hjálparskjalinu án þess að keyra það.
- **Vægi yfir 1 verður að réttlæta með raunverulegum kostnaði** — vinnu sem leigjandinn
  hefði annars greitt fyrir sem mörg köll, eða útleið þjónustu sem Origo greiðir fyrir á
  hverja einingu. Það er ekki verðstýringartæki.
- **Notaðu mæli til að tilkynna fjölskyldu tegunda saman**, ekki til að skipta einni tegund
  í undirflokka. `PLAYBOOK`, `LLM`, `STORAGE` er formið; einn mælir á hverja
  skilaboðategund er það ekki.
- **Undanþága þýðir „ekki leyfisskyld vinna".** Uppgötvun, hjálp og webhook-svör eru
  undanþegin svo leigjandi með tæmdan pott geti áfram komist að því hvað Bifröst gerir og
  keypt meira. Undanþága er ekki leið til að gefa leyfisskylda vinnu.

Undanþága gengur framar vægi: undanþegin tegund er hvorki talin né stöðvuð, hvað sem
`GetChargeWeight` skilar.

## Hvað kallandinn sér

Mæling er sýnileg í gegnum uppgötvunartegundirnar, svo kallandi getur verðlagt kall áður en
hann gerir það:

- `Help.MessageTypes.Get` skilar `exempt`, `chargeWeight` og `meter` fyrir hverja tegund.
- `Help.License.Get` skilar valfrjálsum `pendingMeters` hlut með einingum á hvern mæli sem
  hafa verið gjaldfærðar staðbundið en ekki enn tilkynntar.

`Help.MessageTypes.Get` er sjálft dæmið í Foundation: það lýsir yfir undanþágu sinni í
gegnum `Msg Metering ori` í stað þess að reiða sig á `Help.*` nafnforskeytið, þannig að
efnisskrá vefþjónustunnar helst ókeypis jafnvel þótt tegundin verði einhvern tímann færð út
úr `Help.*` hópnum.

## Næst

- Hvað reitirnir á skilaboðunum og daglega notkunarsamstillingin gera við vægi og mæli:
  [Licensing](/foundation/reference/licensing/).
- Samningurinn aðferð fyrir aðferð og hegðunartaflan:
  [Metering interface](/foundation/reference/metering-interface/).
- Hitt viðmótið á sama enum-gildinu:
  [Message types](/extensibility/message-types).
