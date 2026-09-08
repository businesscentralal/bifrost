---
id: testing
title: "Próf"
sidebar_label: "Próf"
sidebar_position: 6
description: "Mynstrið fyrir Test.* skilaboðagerðir sem eru eingöngu fyrir próf, prófunargerðir grunnsins og venjur um prófgögn í sameiginlegu fyrirtæki."
---

# Próf

Bifröst-forrit er alltaf gefið út sem tvö forrit: sjálft vöruforritið og prófunarforrit sem
byggir á því. Prófunarforritið hýsir einingaprófin, hverja þá gervi-útfærslu (mock) sem
varan þarf til að hægt sé að keyra hana án tengingar við raunverulega ytri þjónustu, og —
þetta er það sem er sértækt fyrir Bifröst — **skilaboðagerðir sem eru eingöngu fyrir próf**.

## Af hverju skilaboðagerðir eingöngu fyrir próf eru til

Eigin uppsetning grunnsins er ekki aðgengileg í gegnum opinbera API vörunnar. `Setup ori` og
`ChangeLog Guard Exception ori` eru skráð með `Access = Internal`, sem þýðir:

- `Data.Records.Get` og `Data.Records.Set` geta hvorki lesið þær né skrifað í þær;
- sjálfvirk prófkeyrsla sem stýrir API-inu utan frá BC getur hvorki breytt ChangeLog Write
  Guard, kveikt á Request Debug Mode, né skráð undanþágu frá skrifvörninni;
- sama keyrsla getur ekki skrifað í svæði sem skrifvörnin ver, í neinni töflu.

Sá valkostur að láta manneskju smella sér í gegnum notendaviðmót Business Central í miðri
prófkeyrslu er enginn valkostur. Þess vegna skráir **prófunarforrit** grunnsins fáeinar
`Test.*` skilaboðagerðir sem ná til þessara taflna. Þær eru aðeins til í prófunarforritinu,
þannig að þær eru aldrei uppsettar í umhverfi viðskiptavinar, og hver og ein neitar að keyra
í rekstrarumhverfi (production), sama hvað:

```al
internal procedure AssertNotProduction(var Argument: Record "Message Argument ori"): Boolean
var
    EnvironmentInformation: Codeunit "Environment Information";
begin
    if EnvironmentInformation.IsProduction() then begin
        Argument.RespondWithError(ProductionErr);
        exit(false);
    end;
    exit(true);
end;
```

Sérhver `Test.*` útfærsla byrjar á `if not Helper.AssertNotProduction(Argument) then exit;`.

## Prófunargerðir grunnsins

Skráðar af prófunarforriti grunnsins á `Message Type ori` enum-inu:

```al
enumextension 98981 "Test Tools MsgType" extends "Message Type ori"
{
    value(98860; "Test.Setup.Get")
    {
        Caption = 'Test Setup Get', Locked = true;
        Implementation = "Msg Interface ori" = "Test Setup Get Impl";
    }
    value(98861; "Test.Setup.Set")
    {
        Caption = 'Test Setup Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Setup Set Impl";
    }
    value(98862; "Test.Records.Set")
    {
        Caption = 'Test Records Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Records Set Impl";
    }
    value(98863; "Test.Records.Delete")
    {
        Caption = 'Test Records Delete', Locked = true;
        Implementation = "Msg Interface ori" = "Test Records Delete Impl";
    }
    value(98870; "Test.Secret.Set")
    {
        Caption = 'Test Secret Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret Set Impl";
    }
    value(98871; "Test.Secret.Clear")
    {
        Caption = 'Test Secret Clear', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret Clear Impl";
    }
    value(98872; "Test.Secret.List")
    {
        Caption = 'Test Secret List', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret List Impl";
    }
}
```

(`Test.Records.Get`, `Test.Blocking.Set` og `Test.Metering.Fail` eru líka til, á ordinölum
98864–98866, til að lesa færslur á almennan hátt, þvinga fram lokaða skrift og þvinga fram
mælingarbilun í prófum — sama form, sleppt hér til að stytta mál.)

### `Test.Setup.Get`

Skilar öllum svæðum innri `Setup ori` færslunnar sem JSON, þar á meðal `ChangeLog Write
Guard` og `Request Debug Mode`. Engar beiðnibreytur.

```json
{ "status": "Success", "setup": { "ChangeLog Write Guard": "Open", "Request Debug Mode": "false" } }
```

### `Test.Setup.Set`

Skrifar svæði `Setup ori` úr `fields`-hlut og skilar uppfærðu færslunni. Svæðislyklar eru
nöfn svæða — annað hvort nákvæm, eða án tillits til há-/lágstafa og greinarmerkja; enum-svæði
taka bæði við nafni gildis eða ordinal-tölu.

```json
{ "fields": { "ChangeLog Write Guard": "Blocked", "Request Debug Mode": true } }
```

`ChangeLog Write Guard` tekur við `Open`, `Blocked` eða `Via force`.

### `Test.Records.Set`

Setur inn eða breytir færslum í **hvaða töflu sem er**, þar með talið innri Bifröst-töflum og
svæðum sem ChangeLog Write Guard myndi annars loka á. Hver færsla er staðsett út frá
frumlyklasvæðunum sem eru til staðar í `fields`: finnist hún er `Modify(true)` keyrt, finnist
hún ekki er `Insert(true)` keyrt. BLOB- og Media-svæði eru ekki studd.

```json
{ "tableName": "ChangeLog Guard Exception ori", "records": [ { "fields": { "Table No.": 18, "Field No.": 2 } } ] }
```

`tableId` má nota í stað `tableName`, og nöfn má gefa upp með eða án ` ori`-viðskeytisins.
Svarið greinir frá `inserted`, `modified` og færslunum sem urðu til.

### `Test.Records.Delete`

Eyðir færslum úr töflu sem passa við `tableView`-síu, ein `Delete(true)`-aðgerð fyrir hverja
færslu. **Sía er skylda** — að eyða allri töflu er hafnað.

```json
{ "tableName": "Customer", "tableView": "WHERE(No.=FILTER(BIFT-*))" }
```

### `Test.Secret.Set`

Skráir (án tvítekningar) og skrifar gildi í sameiginlegu `Secret Store ori` geymsluna fyrir
tiltekið App Id og Secret Code — nákvæmlega það sem forrit gerir sjálft með `Register` +
`Set`, en án uppsetningarsíðu eða hulds glugga. Gildið er aldrei skilað til baka í svarinu;
lestrar- og skriftarleiðin keyrir í einni `[NonDebuggable]` einingu svo það birtist heldur
aldrei í kembiforritslotu. Notaðu einungis gervigildi — sömu reglu og gildir um hvert annað
leyndarmál sem skrifað er í gegnum þessa geymslu.

```json
{ "appId": "11111111-1111-1111-1111-111111111111", "code": "API-KEY", "value": "dummy-value", "scope": "Company", "description": "Test secret" }
```

`scope` er `Company` (sjálfgefið) eða `Company And User`; `description` er valfrjálst.

```json
{ "status": "Success", "appId": "...", "code": "API-KEY", "scope": "Company", "isSet": true }
```

### `Test.Secret.Clear`

Hreinsar geymt gildi `Secret Store ori`-færslu (`codeunit "Secret Store ori".Clear`) —
skráningarfærslan sjálf lifir áfram, `isSet` fer aftur í `false`. Secret Code sem aldrei var
skráður er meinlaus núll-aðgerð, í samræmi við hegðun `Clear` sjálfrar.

```json
{ "appId": "11111111-1111-1111-1111-111111111111", "code": "API-KEY" }
```

### `Test.Secret.List`

Skráir skráningarfærslur `App Secret ori` fyrir tiltekið App Id — `code`, `description`,
`scope`, `isSet`, `setOn` — svo próf geti staðfest heila hringrás `Test.Secret.Set` /
`Test.Secret.Clear`. Sjálft gildið er hvorki lesið né skilað til baka.

```json
{ "appId": "11111111-1111-1111-1111-111111111111" }
```

```json
{ "status": "Success", "appId": "...", "secrets": [ { "code": "API-KEY", "description": "Test secret", "scope": "Company", "isSet": true, "setOn": "2026-09-06T12:00:00Z" } ] }
```

## Bættu við þínum eigin `Test.*` gerðum

Reglan alhæfist: **þegar uppsetning þíns forrits þarf að breytast í prófkeyrslu og opinbera
API-ið nær ekki til hennar, bættu við skilaboðagerð eingöngu fyrir próf í þínu
prófunarforriti.** Sama form og hjá grunninum:

- `enumextension` á `Message Type ori` í prófunarforritinu, með ordinal-tölum úr skráðu
  númerabili **þíns prófunarforrits**;
- ein útfærslueining á hverja gerð, `Access = Internal`;
- `AssertNotProduction` sem fyrsta yrðing í `ExecuteBifrostTask`;
- `GetMessageHelpAsMarkdownDocument` sem hefst á **„Test app only."** og segir að gerðinni sé
  hafnað í rekstrarumhverfi;
- `GetDescription` með forskeytinu `TEST ONLY:`, svo gerðin er ótvírætt merkt í
  `Help.MessageTypes.Get`.

Gervi-útfærslur (mocks) fylgja sömu hugmynd fyrir viðmót fremur en skilaboðagerðir.
Prófunarforrit Bifröst Attachments útvíkkar geymslugerðar-enum vörunnar með innri-minni bakenda
(in-memory), svo hægt sé að keyra alla tengiliðina án tengingar við raunverulegan
geymslureikning:

```al
namespace Origo.Bifrost.Attachments.Test;

using Origo.Bifrost.Attachments;

enumextension 96200 "Storage Type Test" extends "Storage Type ori"
{
    value(96200; Mock)
    {
        Caption = 'Mock', Locked = true;
        Implementation = "Storage Connector ori" = "Storage Mock Impl";
    }
}
```

Útvíkkanlegt enum í þínu eigin vöruforriti er það sem gerir þetta mögulegt — hannaðu þín
eigin viðmót á sama hátt.

## Að keyra skilaboðagerð úr prófi

Prófunarforrit hjálparforrits notar **eingöngu opinbera API grunnsins** — `Dispatcher ori` —
sömu leið og vöruforritið sem verið er að prófa. Enginn innri flýtileið er til staðar, og
engin þeirra er nauðsynleg: engin `internalsVisibleTo`-færsla þarf að biðja um í `app.json`
grunnsins, engin þörf á að endurbyggja og endurútgefa grunninn áður en próf nýs
prófunarforrits geta keyrt.

`Execute` er létta leiðin. Hún sendir beint í gegnum viðmótið, með `OmitCommit = true` og
án þess að nokkur biðraðarfærsla sé varðveitt:

```al
var
    Dispatcher: Codeunit "Dispatcher ori";
    RequestContent: BigText;
    ResponseContent: BigText;
    ResponseContentType: Text[50];
begin
    RequestContent.AddText(RequestJson);
    Dispatcher.Execute(
        "Message Type ori"::"Storage.File.Get", "Message Version ori"::"1.0",
        Subject, 'MyApp Tests', 'application/json',
        RequestContent, ResponseContent, ResponseContentType);
end;
```

Þar sem `Execute` fer í gegnum sömu `Message Task ori` vinnslu og rekstrarköllun gerir,
berst beiðnin til útfærslunnar þegar merkt með gildu leyfi — það þarf hvorki að kalla á
`SetLicensed` né elta uppi bilun í `Argument.AssertIsLicensed()`. Notaðu `Execute` þegar
prófið snýst um rökfræði útfærslunnar sjálfrar; notaðu `EnqueueAndProcess` í staðinn þegar
prófið þarf fulla keyrslu í gegnum stjórnandann — tungumálaskipti, svartíma, varðveislu eða
lokaviðburðinn — því þá snýst prófið um hegðun sem kallandi myndi sjá. Sjá
[Skilaboðagerðir](/extensibility/message-types) fyrir bæði undirskriftaform.

Að smíða `Message Argument ori` í höndunum og kalla beint á útfærslueininguna, og merkja
kallið gilt með innra `SetLicensed` grunnsins, er tækni prófunarforrits **grunnsins sjálfs**
— hann kemst þangað því hann er gefinn út í sama pakka. Prófunarforrit hjálparforrits er
aldrei í þeim pakka, og eftir 2026-09-07 hefur það enga ástæðu til að biðja um þann aðgang
heldur: `Dispatcher ori.Execute` er bein staðgengd, á sama kostnaði.

## Sjálfvirk prófun

Umboðsmaður (agent) sem keyrir próf eingöngu í gegnum biðraðar-API-ið (`POST tasks`, ekkert
notendaviðmót BC) þarf leið til að kveikja á þeim greiningum sem hann þarf, sá niður
auðkennum sem forritið undir prófun kallar eftir, keyra sviðsmyndirnar sínar og hreinsa upp
á eftir — allt í gegnum skilaboðagerðir. Mynstrið:

1. **Kveiktu á debug-ham.** `Request Debug Mode` er svæði á `Setup ori`, svo
   `Test.Setup.Get` og `Test.Setup.Set` ná þegar utan um það — engin sérstök
   `Test.Debug.*` gerð er til. Lestu núverandi gildi fyrst svo hægt sé að endurheimta það:

   ```json
   // Test.Setup.Get -> {"status":"Success","setup":{"Request Debug Mode":"false", ...}}
   // Test.Setup.Set
   { "fields": { "Request Debug Mode": true } }
   ```

   Debug-hamur breytir aðeins því sem `Request Logger ori` grímur (maskers) skilja eftir
   ómaskað fyrir **útgangandi tengiliðaköll** sem þitt forrit gerir (sjá
   [Leyndarmál](/foundation/reference/secrets) og gríma-viðmótið í eigin kóða þessa forrits).
   Hann hefur ekki áhrif á sjálfa Bifröst skilaboðabiðröðina: `Request Data` / `Response
   Data` á `Message ori` geyma óbreytt móttökugögn fyrir hverja einustu skilaboðagerð,
   hvort sem kveikt er á honum eða ekki — það er þannig ramminn beinir og endurspilar
   skilaboð, ekki maskunargat. **`Test.Secret.Set` er eina undantekningin** (löguð
   2026-09-07): hún kallar á `Record "Message Argument ori".RedactRequestData()`
   strax eftir að hafa geymt gildið, sem yfirskrifar `Request Data` á varðveittu
   `Message ori`-færslunni með `{"redacted":true}`-staðgengli — svo gildið sem hún
   móttók situr ekki eftir í biðraðartöflunni heldur, aðeins í varinni geymslu `Secret
   Store ori`. Sérhver önnur skilaboðagerð geymir enn allt móttökuálagið óbreytt, svo
   notaðu gervigildi í prófunarálagi óháð debug-ham, sömu reglu og gildir alls staðar
   annars staðar á þessari síðu. Hjálparforrit sem bætir við eigin skilaboðagerð til að sá
   niður auðkennum (eins og `Test.Treasury.Secret.Set` í Bifröst Iceland Treasury gerir)
   ætti að kalla á sömu einingu strax eftir að hafa notað gildið.

2. **Sáðu niður auðkennum úr eigin umhverfi umboðsmannsins, aldrei úr skrá.** Umboðsmaðurinn
   les gildi úr eigin umhverfisbreytum (eða leyndarmálastjóra) og sendir það sem `value`
   eiginleika `Test.Secret.Set` — gildið er aldrei til nema í minni ferlis umboðsmannsins og
   í varinni geymslu `Secret Store ori`, aldrei í skriftu eða stillingarskrá:

   ```json
   { "appId": "<app under test id>", "code": "<secret code>", "value": "<from an environment variable>", "scope": "Company" }
   ```

   Staðfestu að það hafi skilað sér með `Test.Secret.List` (`isSet: true` — listinn
   endurómar aldrei gildið), keyrðu sviðsmyndirnar og kallaðu svo á `Test.Secret.Clear`
   þegar keyrslunni er lokið.

3. **Settu upp forritið sem verið er að prófa** með `Test.Records.Set` fyrir allt sem
   opinbera API-ið getur ekki skrifað beint í (innri töflur, svæði sem skrifvörnin ver) —
   sjá gerðina hér fyrir ofan.

4. **Keyrðu sviðsmyndirnar**: eina leið sem staðfestir góða útkomu (happy path) fyrir hverja
   skilaboðagerð með því að lesa gögnin aftur, og að minnsta kosti eitt tilvik sem á að
   skila `status = Error` með gagnlegum skilaboðum — aldrei óhöndlaðri undantekningu, aldrei
   HTTP 5xx. Sjá [Skilaboðagerðir](/extensibility/message-types) fyrir báðar leiðirnar til
   að kalla á gerð úr prófi.

5. **Slökktu aftur á debug-ham** (`Test.Setup.Set` með `"Request Debug Mode": false`) og
   hreinsaðu hvert það leyndarmál sem keyrslan sáði og væri annars ekki til staðar.
   Keyrslan sjálf ber ábyrgð á að endurheimta stöðuna sem hún breytti — sjá „Venjur um
   prófgögn" hér fyrir neðan.

## Venjur um prófgögn

Bifröst-forrit eru prófuð í sameiginlegum fyrirtækjagagnagrunnum — CRONUS IS á íslenska
gámnum, CRONUS International á W1-gámnum — sem eru einnig notaðir til handvirkrar
staðfestingar og sýnikennslu. Tvær reglur fylgja af því.

**Settu forskeyti á allt sem þú býrð til, eitt á hverja prófsstraum.** Venjan yfir alla
fjölskylduna er `BIFT-<bókstafur>`: `BIFT-A0001`, `BIFT-B0001`. Forskeytið gerir eigin
færslur prófs auðþekkjanlegar, kemur í veg fyrir árekstra tveggja strauma og gerir
hreinsun að einni síu:

```json
{ "tableName": "Customer", "tableView": "WHERE(No.=FILTER(BIFT-*))" }
```

**Eyddu aldrei fyrirliggjandi grunngögnum.** Viðskiptamenn, birgjar, vörur, bókhaldslyklar,
vídd og bókunaruppsetningar í sameiginlegu prófunarfyrirtæki eru sameiginlegar
grunneiningar. Próf sem eyðir þeim brýtur hvert annað próf og hverja sýnikennslu í því
fyrirtæki. Búðu til þínar eigin færslur, síaðu út frá þínu eigin forskeyti, og eyddu
einungis því sem þú bjóst til sjálf/ur.

Sama agi gildir um uppsetningu grunnsins sjálfs: keyrsla sem opnar ChangeLog Write Guard
með `Test.Setup.Set` setur hana aftur í `Blocked` þegar henni er lokið. Prófkeyrslan sjálf
ber ábyrgð á að endurheimta stöðuna sem hún breytti — ekki næsta manneskja sem opnar
fyrirtækið.

## Hvað prófunarsvíta hjálparforrits nær yfir

- Sérhver skilaboðagerð: leið sem staðfestir góða útkomu með því að lesa gögnin aftur, og
  að minnsta kosti eitt tilvik sem á að skila `status = Error` með gagnlegum skilaboðum —
  aldrei óhöndlaðri undantekningu, aldrei HTTP 5xx.
- Yfirtaka við uppsetningu, þar sem forritið leysir af hólmi útgefinn forvera:
  [Uppsetning og uppfærsla](/extensibility/install-and-upgrade).
- Sérhvert viðmót sem þitt forrit skilgreinir, í gegnum gervi-útfærslu (mock) skráða á
  enum-inu.

Prófunarforrit grunnsins sjálfs er viðmiðunin fyrir allt þetta, og þar búa `Test.*`
gerðirnar sem eru skjalfestar hér fyrir ofan.
