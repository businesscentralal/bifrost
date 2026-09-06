---
id: metering-interface
title: "Metering interface"
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
| Kallað | Einu sinni, eftir **árangursríkt** kall, áður en svarið er skrifað aftur á biðraðarfærsluna. |
| Má ekki | Breyta svarinu, né gera ráð fyrir að keyra innan færsluheildar kallandans. |

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

## Kallað með varúð

Mælingarútfærsla má aldrei kosta kallandann svarið sitt, svo grunnurinn vefur kallið í
`TryFunction`:

- villa sem útfærslan kastar er gripin;
- skriftir útfærslunnar í gagnagrunninn eru bakfærðar;
- bilunin er skrifuð í fjarmælingar;
- kallandinn fær nákvæmlega það svar sem hann hefði fengið án nokkurs króks.

| Fjarmælingaratburður | Auðkenni | Alvarleiki | Sérvíddir |
|---|---|---|---|
| Message metering hook failed | `ORI-BIF-0170` | Error | `messageType`, `error` |

`error` ber fyrstu 250 stafina úr síðasta villutexta.

## Útfærslur í grunninum

| Eining | Notuð af | Hegðun |
|---|---|---|
| `Default Metering ori` (10078308) | Hverju gildi sem nefnir ekki útfærslu | Tómt meginmál. Kostar eitt viðmótskall fyrir hver árangursrík skilaboð og gerir ekkert annað. |

Grunnurinn sendir enga aðra útfærslu. Hann telur skilaboð fyrir leyfin á eigin spýtur og
þarf enga hjálp frá króknum.

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
