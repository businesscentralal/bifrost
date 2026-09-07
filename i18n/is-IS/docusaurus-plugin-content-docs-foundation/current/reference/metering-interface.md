---
id: metering-interface
title: "Mælingarviðmót"
sidebar_position: 8
---

`Msg Metering ori` er mælingakrókur Bifröst-skilaboðategundar. Grunnurinn kallar á hann einu
sinni eftir hvert árangursríkt skilaboðakall svo gjaldtöku- eða mælingalausn geti skráð það
sem gerðist. Þetta er annað viðmótið á `Message Type ori`: `Msg Interface ori` segir hvað
tegund **gerir**, `Msg Metering ori` er sagt þegar það **hefur verið gert**.

Nafnrými `Origo.Bifrost`. Valenum `Message Type ori` (10077894).

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

Af því að enumið nefnir `DefaultImplementation` ber **hvert einasta** gildi krókinn — jafnt
gildi grunnsins sem enum-viðbótargildi háðra forrita — án þess að lýsa yfir nokkru.

## Aðferðin

```al
procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
```

| | |
|---|---|
| Viðfang | `Argument` — `Message Argument ori` kallsins sem lauk. Ber skilaboðategundina (`Type`), efnið (`Subject`), beiðnigögnin og svarið sem kallandinn fær. |
| Skilar | Engu. |
| Kallað | Einu sinni, eftir **árangursríkt** kall, eftir að svarið hefur verið skrifað í `Message ori` og staðfest. |
| Má | Skrifa í gagnagrunninn. Krókurinn keyrir í eigin færsluheild, svo innsetningar, breytingar og vinna sett í biðröð eru allt leyfilegt. |
| Má ekki | Breyta svarinu — kallandinn hefur það þegar — né gera ráð fyrir að keyra innan færsluheildar kallandans. |

## Hvenær grunnurinn kallar á hann

`Message Task ori` keyrir krókinn þegar allt eftirfarandi á við:

- lykill skilaboðategundarinnar byrjar **ekki** á `Help.` eða `Webhook.`;
- útfærslan keyrði og svarið er árangursríkt — JSON-hlutur þar sem `status` er `Success`,
  eða svar sem er ekki JSON, t.d. PDF eða CSV.

Ekkert annað stýrir því. Krókurinn keyrir sérstaklega:

| Aðstæður | Krókurinn keyrir |
|---|---|
| Í rekstri, í eigin umhverfi og í sandkassa í skýinu | Já, í öllum þremur |
| Leyfisskylda á skilaboðakvóta gildir | Já |
| Leyfisskylda á skilaboðakvóta gildir **ekki** (sandkassi í skýinu) | Já |
| Pottur kallandans tómur, kalli hafnað | Nei — kallið keyrði aldrei |
| `status` svarsins er `Error` | Nei |
| `Help.*` eða `Webhook.*` skilaboðategund | Nei |

Nafnforskeytisreglan um `Help.` og `Webhook.` er sama gamalgróna reglan og undanþiggur þær
tegundir gjaldtöku. Hún er eina undantekningin: skilaboðategund getur ekki afskráð sig sjálf
úr króknum.

## Kallað í einangrun

Mælingarútfærsla má aldrei kosta kallandann svarið sitt, svo grunnurinn kallar ekki á hana
beint. `Message Task ori` keyrir hana með `Codeunit.Run`:

```al
MeteringHook: Codeunit "Metering Hook ori";
// …
if MeteringHook.Run(Argument) then
    exit;
// annars: skrá ORI-BIF-0170
```

`Metering Hook ori` (10078309) er innri eining með `TableNo = "Message Argument ori"`.
`OnRun` hennar sækir útfærsluna úr `Rec."Type"` og kallar á `OnMessageCompleted`.

Valið á `Codeunit.Run` fram yfir `TryFunction` er meðvitað. Mælingarútfærsla á að **skrifa** —
mælingafærslu, teljara, kall í biðröð til gjaldtökuþjónustu — og AL-keyrslan hafnar skriftum í
gagnagrunninn inni í `TryFunction` sem er hreiðrað í skilaboðaverkinu. `Codeunit.Run` leyfir
þær skriftir og einangrar bilun eftir sem áður:

- villa sem útfærslan kastar er gripin með því að `Run` skilar `false`;
- aðeins skriftirnar sem gerðar voru inni í króknum eru bakfærðar;
- bilunin er skrifuð í fjarmælingar;
- kallandinn fær nákvæmlega það svar sem hann hefði fengið án nokkurs króks.

Kallað er á krókinn **eftir** að svarið hefur verið skrifað í `Message ori` og staðfest —
rétt á undan svarkallstilkynningunni. Þá hefur kallandinn þegar fengið svarið sitt, og þess
vegna nær ekkert sem krókurinn gerir, þar með talið að klikka alveg, til hans.

| Fjarmælingaratburður | Auðkenni | Alvarleiki | Sérvíddir |
|---|---|---|---|
| Message metering hook failed | `ORI-BIF-0170` | Error | `messageType`, `error` |

`error` ber fyrstu 250 stafina úr síðasta villutexta.

## Mælingaeiningar í grunninum

| Eining | Hlutverk | Hegðun |
|---|---|---|
| `Default Metering ori` (10078308) | `DefaultImplementation` viðmótsins, notuð af hverju gildi sem nefnir ekki útfærslu | Tómt meginmál. Kostar eitt viðmótskall fyrir hver árangursrík skilaboð og gerir ekkert annað. |
| `Metering Hook ori` (10078309) | Einangrunarumgjörðin, `Access = Internal`, `TableNo = "Message Argument ori"` | Sækir útfærsluna úr `Rec."Type"` og kallar á `OnMessageCompleted`. `Message Task ori` keyrir hana með `Codeunit.Run`. |

Grunnurinn sendir enga aðra útfærslu viðmótsins. Hann telur skilaboð fyrir leyfin á eigin
spýtur og þarf enga hjálp frá króknum.

## Hvað krókurinn gerir ekki

Krókurinn hefur engin áhrif á gjaldtöku, og gjaldtakan er óbreytt frá því áður en hann varð
til:

- árangursríkt kall sem er ekki undanþegið kostar nákvæmlega **ein skilaboð** úr potti
  kallandans;
- potturinn — **Notandi** eða **Forritsskráning** — er ákveðinn miðlægt út frá auðkenni
  kallandans og er skráður í `Message ori."Charge Type"`;
- það er ekkert gjaldvægi, enginn mælir og ekkert verð á hverja tegund í kerfinu.

Lausn sem þarf verðlagningu á hvert kall heldur utan um það líkan í eigin töflum og fyllir
það úr króknum.

## Tengt efni

- [Metering a message type](/extensibility/metering) — hvernig háð forrit tekur krókinn upp,
  með einingunni og enum-viðbótinni til að afrita.
- [Licensing](/foundation/reference/licensing/) — pottarnir, framfylgdin og notkunarsamstillingin.
- [Foundation public surface](/extensibility/public-surface) — allir opinberu útvíkkunarpunktarnir.
