---
id: install-and-upgrade
title: "Install and upgrade"
sidebar_position: 5
---

Flest Bifröst-forrit leysa af hólmi útgefið Origo Cloud Events forrit. Arftakinn er **nýtt
forrit** með nýtt auðkenni og nýtt númerabil hluta, sett upp samhliða því forriti sem það
leysir af. Við fyrstu uppsetningu tekur það yfir gögn þess forrits; gamla forritið er lagt
af á eftir.

Þessi síða lýsir því yfirtökumynstri, og öðrum verkum sem uppsetningareining sinnir.

## Auðkenni arftakans

Arftaki er nýtt forrit, ekki ný útgáfa af því gamla. `app.json` hans fær:

- **nýtt auðkenni forrits** — og prófunarforritið fær líka nýtt auðkenni;
- **útgáfu endurstillta á `28.0.0.0`**, því útgáfusagan tilheyrir forritinu sem er lagt af;
- **nýtt númerabil hluta** úr sameiginlegu vinnubókinni, skráð áður en nokkur hlutur notar það;
- **sama Application Insights tengistreng og sama Key Vault** og forritið sem það leysir af,
  svo fjarmælingar og leyfismál haldist á einum stað;
- `"publisher": "Origo"`, óbreytt.

Ekkert annað erfist. Heiti forritsins breytist, nafnrýmið breytist, API-slóðin breytist, og
AppSource lítur á útkomuna sem nýtt framboð sem er sett upp samhliða því gamla frekar en að
uppfæra það.

## Yfirtökumynstrið

Yfirtakan keyrir úr `OnInstallAppPerCompany`, á undan öllu öðru sem forritið setur upp, og
hún er drifin af lista af pörum `(gamalt töflunúmer, nýtt töflunúmer)`. Fyrir hvert par:

1. **Gakktu úr skugga um að gamla taflan sé enn til** — `TableMetadata.Get(<gamalt töflunúmer>)`.
   Útgefna forritið er ekki endilega uppsett í þessu fyrirtæki.
2. **Slepptu þegar nýja taflan hefur þegar raðir** — `if not Target.IsEmpty() then exit;`.
   Þetta er það sem gerir yfirtökuna sjálfsamkvæma og örugga við enduruppsetningu.
3. **Afritaðu með `DataTransfer` á sömu reitanúmerum.** Arftakinn heldur reitanúmerum
   forverans, svo hvert par er `AddFieldValue(N, N)`.
4. **`DataTransfer.UpdateAuditFields(false)`** svo `SystemModifiedAt` og
   `SystemModifiedBy` lifi afritunina af — raðirnar halda upprunalegri rekjanleikaslóð.
5. **Skráðu niðurstöðuna** í `Install Log ori`, svo kerfisstjóri sjái hvað færðist — sjá
   [Skráning á því sem uppsetningin gerði](#skráning-á-því-sem-uppsetningin-gerði).

Úr `App Takeover ori` í Bifrost Orchestrator:

```al
/// <summary>Copies <c>CE Orchestrator Setup ori</c> (10076036) into <c>Scheduler Setup ori</c> (10035536).</summary>
local procedure TakeOverSchedulerSetup()
var
    Target: Record "Scheduler Setup ori";
    OldRef: RecordRef;
    DataTransfer: DataTransfer;
begin
    if not OldTableExists(10076036) then
        exit;
    if not Target.IsEmpty() then
        exit;
    DataTransfer.SetTables(10076036, Database::"Scheduler Setup ori");
    OldRef.Open(10076036);
    if OldRef.FieldExist(10) then
        DataTransfer.AddFieldValue(10, 10);
    if OldRef.FieldExist(20) then
        DataTransfer.AddFieldValue(20, 20);
    if OldRef.FieldExist(30) then
        DataTransfer.AddFieldValue(30, 30);
    OldRef.Close();
    DataTransfer.UpdateAuditFields(false);
    DataTransfer.CopyRows();
    LogTakeOver('Scheduler Setup ori', Target.Count());
end;

local procedure OldTableExists(OldTableId: Integer): Boolean
var
    TableMetadata: Record "Table Metadata";
begin
    exit(TableMetadata.Get(OldTableId));
end;
```

`FieldExist`-vörnin utan um hvert `AddFieldValue` er ekki til skrauts. Skema útgefna
forritsins er ekki tryggilega hið sama niður í smæstu atriði milli umhverfa — tveir gámar
sem keyra sömu uppgefnu útgáfu hafa mælst með ólík pakkaauðkenni — og `DataTransfer` bregst
harkalega við reit sem er ekki til staðar. Að athuga hvern reit fyrst breytir misheppnaðri
uppsetningu í afritun að hluta.

Yfirtakan í Bifrost Orchestrator er búin til af forriti út frá nafnavörpun flutningsins, ekki slegin inn í
höndunum, og einingin segir frá því í samantekt sinni. Það er rétta aðferðin um leið og
forrit hefur fleiri en örfáar töflur: reitalistarnir eru langir og vélrænir.

### Hvaða töflur eru afritaðar — og hverjar ekki

**Afritað**: allt sem viðskiptavinurinn stillti eða samdi. Stakar uppsetningarfærslur, tengi-
og auðkennisfærslur, áætlaðar færslur, endurtekin sniðmát, leikbækur ásamt þrepum þeirra og
skilyrðum, vistaðar forstillingar skýrslna, stillingar hvers notanda.

**Ekki afritað — hverfular töflur:**

- `Message ori` — skilaboðabiðröðin.
- `Message Argument ori` — viðfangafærslan fyrir hvert kall.
- `Request Log ori` — skráning útleiðandi beiðna.
- Biðminnis- og vinnutöflur.
- Keyrsluannálar. Bifrost Orchestrator skilur `Playbook Instance ori` og
  `Playbook Step Log ori` vísvitandi eftir; Bifrost Attachments skilur eftir upphleðslulotur og búta þeirra.

Þetta eru raðir í vinnslu eða söguleg gögn sem hafa ekkert stillingargildi. Að afrita þær
flytti suð yfir, og í tilviki beiðnaannálsins færði það þegar hulin gagnaboð yfir í nýja
töflu án nokkurs ávinnings.

**Ekki afritað — leyndarmál.** IsolatedStorage er afmörkuð við hverja viðbót, og arftakinn
hefur nýtt auðkenni forrits, svo ekkert sem forritið sem var lagt af geymdi er læsilegt úr
því nýja. Kerfisstjóri slær auðkennin inn að nýju eftir skiptin. Skráðu öll leyndarmál við
uppsetningu svo heildarlistinn sjáist strax á **Leyndarmál forrita Bifröst**, og taktu fram í
útgáfulýsingunni að endurinnsláttur þeirra sé þrep í yfirfærslunni — sjá
[Uppsetning og leyndarmál](/extensibility/setup-and-secrets/).

### Flækjurnar þrjár

**BLOB-reitir.** `DataTransfer` styður þá ekki. Afritaðu þá á eftir með `RecordRef`-yfirferð:
farðu í gegnum nýju töfluna, finndu samsvarandi röð í gömlu töflunni eftir aðallykli og
færðu hvern BLOB gegnum `Temp Blob`.

```al
BlobFieldNos.Add(30);
CopyBlobFields(10076039, Database::"Playbook ori", BlobFieldNos);
```

**Gildi sem báru hlutanúmer eða raðnúmer enum-gildis.** Röð sem geymdi
`Object ID to Run` eða raðnúmer `Message Type` úr bili forverans heldur tölu sem merkir
ekkert í nýja bilinu. Hliðraðu henni um mismun bilanna eftir afritunina:

```al
ShiftIntegerField(Database::"Scheduled Entry ori", Target.FieldNo("Object ID to Run"), 10076035, 10076134, -40500);
```

Aðeins gildi innan gamla bilsins eru hliðruð; öðru er ekki hróflað.

**Úthlutanir heimildasetta.** Notandi sem hafði heimildasett gamla forritsins fær ekki
sjálfkrafa það nýja — úthlutunin er lykluð eftir auðkenni forrits. Farðu í gegnum
`Access Control` fyrir hvert gamalt hlutverkanúmer undir gamla auðkenni forritsins og settu
inn samsvarandi röð fyrir nýja hlutverkanúmerið undir núverandi auðkenni forrits:

```al
local procedure TakeOverAccessControl()
var
    Migrated: Integer;
begin
    Migrated += MigrateRole('CE Orchestrator ori', 'BIFROST Orchestr ori');
    Migrated += MigrateRole('CE Orch. Setup ori', 'BIFROST NrnSetup ori');
    if Migrated > 0 then
        LogTakeOver('Access Control', Migrated);
end;
```

### Þegar „slepptu þegar markmiðið er ekki tómt“ dugir ekki

`if not Target.IsEmpty() then exit;` er rétta vörnin fyrir töflu sem arftakinn skrifar aldrei
í áður en yfirtakan keyrir. Fyrir tvenns konar töflur er hún röng, og það hljóðlaust —
hún sleppir að eilífu og stillingar viðskiptavinarins berast aldrei.

**Tafla sem forritið sáir sjálfgefnum gildum í.** `Install ori` í grunninum kallar á
`InsertDefaultExceptions()`, sem setur fjórar raðir í `ChangeLog Guard Exception ori`. Á
gámnum þar sem þetta var mælt hélt forverinn **22** raðir — sjálfgefnu fjórar auk átján sem
viðskiptavinurinn bætti við. `IsEmpty`-vörn sér sáðu fjórar og sleppir öllum 22.

Lausnin er **sameining**: settu inn þær raðir úr upprunanum sem eiga engan aðallykil í
markmiðinu og láttu allar raðir sem fyrir eru í markmiðinu í friði. `Take-Over ori` í
grunninum gerir þetta röð fyrir röð gegnum `RecordRef` og parar eftir aðallykli markmiðsins:

```al
LookupRef.Open(TargetTableId);
InsertRef.Open(TargetTableId);
repeat
    if not FindMatchingRow(SourceRef, LookupRef) then begin
        InsertRef.Init();
        foreach FieldNo in ScalarFields do
            InsertRef.Field(FieldNo).Value := SourceRef.Field(FieldNo).Value();
        InsertRef.Insert(false);
        RowsCopied += 1;
    end;
until SourceRef.Next() = 0;
```

Sameining er sjálfsamkvæm í eðli sínu — lykillinn er annaðhvort til eða ekki — svo hún er
líka hátturinn sem gerir kleift að keyra yfirtöku örugglega í annað sinn. Kostnaðurinn er að
`Insert(false)` stimplar eftirlitsreitina með tíma afritunarinnar frekar en þeim upprunalega;
`DataTransfer.UpdateAuditFields(false)` kemur ekki að gagni hér því `DataTransfer` afritar
heilar töflur, ekki valdar raðir.

**Stök uppsetningarfærsla.** Uppsetningarkveikjan býr hana til hvort sem eitthvað var tekið
yfir eða ekki, svo þegar yfirtakan lítur er röðin alltaf komin. Vörn á `IsEmpty` sleppir
henni; að skrifa yfir án skilyrða eyðileggur stillingar kerfisstjóra sem þegar var búinn að
setja hana upp.

Reglan í grunninum: **skrifaðu aðeins yfir meðan röðin er enn jöfn sjálfgefnu gildunum úr `Init()`.**

```al
local procedure IsSetupAtInstallDefaults(var BifrostSetup: Record "Setup ori"): Boolean
var
    DefaultSetup: Record "Setup ori";
begin
    DefaultSetup.Init();
    exit(
        (BifrostSetup."Default Language Code" = DefaultSetup."Default Language Code") and
        (BifrostSetup."ChangeLog Write Guard" = DefaultSetup."ChangeLog Write Guard") and
        // ... one line per field
        (BifrostSetup."Request Debug Mode" = DefaultSetup."Request Debug Mode"));
end;
```

Skrifaðu samanburðinn út reit fyrir reit í stað þess að fara í gegnum `RecordRef` í lykkju.
Almenn lykkja verður að bera enum-reiti saman gegnum `Format`, sem kóðunarstaðallinn bannar,
og yfirlesari sér ekki af lykkju hvaða reitir teljast „stilltir“. Kostnaðurinn er ein lína
til viðhalds í hvert sinn sem reit er bætt á uppsetningartöfluna — taktu það fram í samantekt
fallsins.

Þetta skiptir meira máli en það virðist. Staka uppsetningarfærslan í grunninum mældist á
lifandi gámi með **`Default Language Code = ISL`** í forveranum og **`ENU`** — sjálfgefna
gildi uppsetningarinnar — í arftakanum. Öll gildi á þeirri töflu sem viku frá sjálfgefnu
töpuðust við uppsetningu, hljóðlaust, í hverju einasta umhverfi.

### Opinber aðgangspunktur, svo laga megi yfirtöku sem fórst fyrir

Yfirtaka sem keyrir aðeins úr `OnInstallAppPerCompany` er **einskiptisþrep**. Ef forritið var
sett upp áður en yfirtökueining þess varð til, eða uppsetningin keyrði í fyrirtæki þar sem
forverinn var ekki enn uppsettur, sitja gögnin föst: engin enduruppsetning, uppfærsla eða
endurútgáfa reynir aftur, því uppsetningarkveikjan fer ekki aftur í gang.

Gefðu yfirtökunni opinberan aðgangspunkt og láttu uppsetningarkveikjuna aðeins kalla á hann:

```al
trigger OnInstallAppPerCompany()
var
    TakeOver: Codeunit "Take-Over ori";
begin
    TakeOver.RunTakeOver();
    // ... the rest of the install
end;
```

```al
/// <summary>
/// Runs the whole take-over. Safe to call again at any time: each pair carries its own
/// guard, so a second run is a no-op unless something was genuinely left behind.
/// </summary>
/// <returns>The total number of rows written across every step.</returns>
procedure RunTakeOver() RowsCopied: Integer
```

Paraðu hana við **skilaboðategund sem er eingöngu til prófunar** í prófunarforriti forritsins
— grunnurinn skilar `Test.TakeOver.Run` — svo hægt sé að keyra yfirtökuna aftur og staðfesta
hana yfir API á lifandi gámi án enduruppsetningar. Skilaboðategundin skilar þeim
`Install Log ori` röðum sem sú keyrsla bjó til, sem er allt svarið við „keyrði þetta einhvern
tíma, og hvað færðist?“.

Haltu vörnunum sjálfum óbreyttum fyrir uppsetningarleiðina. Endurkeyranleikinn kemur frá því
að varnirnar séu á raðastigi og heiðarlegar, ekki frá þvingunarrofa.

### Röðun

Yfirtakan verður að keyra **á undan** því að forritið býr til sínar eigin stöku færslur.
Uppsetningareiningin í Bifrost Orchestrator er skýr um það:

```al
trigger OnInstallAppPerCompany()
var
    SchedulerSetup: Record "Scheduler Setup ori";
    JobQueueManagement: Codeunit "Scheduler Mgt ori";
    AppTakeover: Codeunit "App Takeover ori";
begin
    // The take-over must run before the setup singleton is created, otherwise the target table
    // is no longer empty and the published app's setup would not be copied.
    AppTakeover.TakeOverAll();
    SchedulerSetup.OnOpenEmptyRec();
    JobQueueManagement.RegisterJobQueues();
    RegisterRetentionPolicies();
end;
```

Settu uppsetningarfærsluna þína inn fyrst og þá kveikir prófið „slepptu þegar markmiðið er
ekki tómt“ á röð sem þú bjóst til sjálf/ur, og stillingar viðskiptavinarins verða hljóðlaust
eftir.

Bifrost Attachments setur yfirtökuna í eigin einingu með `Subtype = Install` í stað þess að kalla á
hana úr annarri. Hvor tveggja skipanin virkar; það sem máli skiptir er að ekkert annað
uppsetningarverk snerti markmiðstöflurnar á undan.

## Skráning á því sem uppsetningin gerði

Hvert Bifröst-forrit skrifar það sem uppsetning þess gerði í eina sameiginlega töflu,
**`Install Log ori`**, sem grunnurinn á og er `Access = Public`.

Ástæðan fyrir tilvist hennar: yfirtökur skráðu áður eingöngu í Application Insights. Það
dugar útgefandanum og gagnast engum öðrum — umhverfi viðskiptavinar birtir sjaldnast App
Insights, svo á lifandi gámi var engin leið til að svara „keyrði yfirtakan, og hvað færði
hún?“ nema með því að telja raðir í báðum forritum og álykta. `Install Log ori` er vísvitandi
**ekki** á takmörkunarlista `Data.Records.Get` í grunninum, svo hana má lesa aftur yfir API,
af síðu eða úr prófun.

### API-viðmótið

| Hlutur | Númer | Athugasemdir |
| --- | --- | --- |
| tafla `Install Log ori` | 10078310 | `Access = Public`, læsileg gegnum `Data.Records.Get` |
| eining `Install Log ori` | 10078313 | `Access = Public` — skrifviðmótið |
| síða `Install Log ori` | 10078315 | Listi, `UsageCategory = None`, opnuð úr Uppsetningu Bifröst |

Fjögur föll, og ekkert í þeim kastar villu: skráning sem bregst má aldrei brjóta uppsetningu.

| Fall | Tilgangur |
| --- | --- |
| `StartStep()` | Markar upphaf þrepsins sem næsta skráningarkall lýsir. Valkvætt — án þess er `Started At` jafnt `Finished At`. |
| `LogTableCopy(AppId; Step; SourceTableId; TargetTableId; RowsCopied; SkippedReason; Message): Integer` | Skráir afritun einnar töflu yfir í aðra. |
| `LogStep(AppId; Step; Success; Message): Integer` | Skráir þrep sem er ekki töfluafritun — úthlutanir heimildasetta, varðveislureglu, samantekt heillar yfirtöku. |
| `GetLastEntryNo(): Integer` | Hæsta færslunúmerið í skránni. Náðu í það fyrir keyrslu til að bera kennsl á raðirnar sem sú keyrsla bjó til. |

Bæði `Log*`-föllin skila færslunúmerinu sem þau skrifuðu, sem kallandi má hunsa.

`Skipped Reason` er enum-ið `Install Skip Reason ori`, og það er það sem gerir skrána þess
virði að lesa:

| Gildi | Merking |
| --- | --- |
| `None` | Þrepið keyrði til enda. `Rows Copied` getur samt verið núll ef uppruninn var tómur. |
| `Source Missing` | Upprunataflan er ekki í þessum gagnagrunni — forverinn er ekki uppsettur. |
| `Target Not Empty` | Markmiðið hélt þegar raðir, svo afrituninni var sleppt í stað þess að skrifa yfir þær. |
| `Field Mismatch` | Að minnsta kosti einn reitur komst ekki með: tegund hans eða lengd er önnur, eða hann geymir tvíundargögn. |
| `Error` | Þrepið kastaði villu. `Message` ber villutextann og engu sem það skrifaði var haldið. |

Aðgreiningin á milli `Source Missing` og `None` með núll raðir er sú sem borgar sig upp:
„forverinn var aldrei hér“ og „forverinn var hér og hafði ekkert“ líta eins út í raðatalningu
og eru gjörólík í þjónustubeiðni.

### Notkunin

```al
var
    InstallLog: Codeunit "Install Log ori";
begin
    InstallLog.StartStep();
    // ... copy the table ...
    InstallLog.LogTableCopy(
        AppId(), 'STORAGE ATTACHMENT LINK ORI', 10075985, Database::"Storage Attachment Link ori",
        Target.Count(), Enum::"Install Skip Reason ori"::None, '');
end;
```

`AppId()` er þín eigin eining, sama hjálparfallið og leyndarmálageymslan notar:

```al
local procedure AppId(): Guid
var
    AppInfo: ModuleInfo;
begin
    NavApp.GetCurrentModuleInfo(AppInfo);
    exit(AppInfo.Id());
end;
```

Skráin flettir upp heiti forritsins út frá auðkenninu sjálfu, svo síðan og API-svarið nefna
forritið þitt án þess að þú sendir það með.

### Hvað á að skrá

**Ein röð fyrir hvert töflupar, alltaf** — líka fyrir þau pör sem afrituðu ekkert. Par sem
skilur enga röð eftir er ekki hægt að greina frá pari sem var aldrei í vörpuninni, sem er
einmitt bilunin sem þessi tafla er til að grípa. Yfirtakan í grunninum skrifar eina röð fyrir
hvert þrettán para sinna, auk einnar fyrir heimildasettaþrepið og einnar samantektarraðar.

**Veittu heimildasettunum þínum sýn á hana.** Bættu `tabledata "Install Log ori" = R` og
`page "Install Log ori" = X` við lesheimildasettið þitt, og `RIMD` við fullaðgangssettið, svo
kerfisstjóri geti opnað hana úr Uppsetningu Bifröst.

## Hvað uppsetningareining gerir að auki

Fyrir utan yfirtökuna er `OnInstallAppPerCompany` staðurinn þar sem forrit skráir sig hjá
kerfinu og hjá grunninum.

**Varðveislureglur** fyrir hverja annálstöflu sem forritið skrifar í:

```al
local procedure RegisterRetentionPolicies()
var
    RetenPolAllowedTables: Codeunit "Reten. Pol. Allowed Tables";
begin
    // field 30 = "Started At" on Playbook Instance ori; min 28 days
    RetenPolAllowedTables.AddAllowedTable(Database::"Playbook Instance ori", 30, 28);
    RetenPolAllowedTables.AddAllowedTable(Database::"Playbook Step Log ori");
end;
```

**Undantekningar frá ChangeLog-vörninni.** ChangeLog Write Guard í grunninum stöðvar skrif í
reiti með breytingaskráningu gegnum Data API. Tafla sem þitt eigið forrit heldur utan um þarf
undantekningu, skráða gegnum opinbera fallið á uppsetningarfærslunni:

```al
local procedure RegisterChangeLogGuardExceptions()
var
    BifrostSetup: Record "Setup ori";
begin
    if not BifrostSetup.Get() then
        exit;
    BifrostSetup.AddChangeLogGuardException(Database::"Storage Attachment Link ori", 0);
end;
```

Reitanúmerið `0` nær yfir alla töfluna. `AddChangeLogGuardException` setur aðeins inn þegar
undantekningin er ekki þegar til staðar, svo óhætt er að kalla á hana við hverja uppsetningu.

**Aðstoðuð uppsetning**, þegar forritið hefur leiðsagnarglugga, gegnum
`Guided Experience.InsertAssistedSetup` undir `"Assisted Setup Group"::Extensions`.

**Skráning leyndarmála** — sjá [Uppsetning og leyndarmál](/extensibility/setup-and-secrets/).

**Uppfærslumerki.** Bifrost Attachments setur merki fyrir fyrstu útgáfu við uppsetningu og skráir það á
`OnGetPerCompanyUpgradeTags`, svo síðari gagnauppfærsla geti greint nýja uppsetningu frá
uppfærðri:

```al
internal procedure GetInitialReleaseTag(): Code[250]
begin
    exit('Origo.Bifrost.Attachments-Initial-20260905');
end;
```

## Að lifa við hlið forritsins sem þú leysir af

Arftakinn og forritið sem er lagt af eru uppsett **á sama tíma** eins lengi og yfirtakan
keyrir — og þannig er prófunargámurinn líka settur upp. Tvö forrit sem eru komin af sama
uppruna skrifa sig fyrir sömu atburðum grunnforritsins, og þau munu rekast á.

Áreksturinn sem auðvelt er að missa af er atburður í grunnforritinu sem bæði forritin
meðhöndla. Flutningur grunnsins lenti nákvæmlega í þessu: forritið sem var lagt af og arftaki
þess skrifa sig bæði fyrir bókunaratburðum samþykktastýringarinnar, og eldri meðhöndlarinn
eyðir `Notification Entry` röðum fyrir samþykktir í bið fyrir *allar* aðferðir áður en
Bifröst-meðhöndlarinn keyrir — svo tvær annars réttar prófanir féllu.

Hvernig á að bregðast við:

- **Færðu þig framar, eða þrengdu umfangið.** Skrifaðu þig fyrir atburði sem kviknar á undan
  meðhöndlaranum sem rekst á, eða þrengdu þinn eigin meðhöndlara við þína eigin aðferð eða
  færslutegund svo þeir tveir keppi ekki um sömu raðirnar.
- **Slökktu aldrei á prófuninni sem fellur.** Prófun sem fellur aðeins þegar forverinn er
  uppsettur er að greina frá raunverulegu ástandi í yfirfærsluglugganum, sem er einmitt þegar
  viðskiptavinir keyra bæði forritin.
- **Keyrðu prófanasafnið á gámi sem hefur forverann enn uppsettan.** Græn keyrsla á hreinum
  gámi sannar ekkert um þær aðstæður sem hver einasti núverandi viðskiptavinur verður í.

Bústu við þessu í hverjum flutningi: sömu grunnatburðir, sömu töflur, tveir áskrifendur.

## Uppfærslueiningin

Eining með `Subtype = Upgrade` sér um útgáfur eftir þá fyrstu. Tvær kveikjur vinna verkið:

- `OnCheckPreconditionsPerCompany` — staðfesting og endurskráning sem verður að gerast áður
  en uppfærslan keyrir.
- `OnUpgradePerCompany` — gagnauppfærslan sjálf.

Allt sem er skráð við uppsetningu er skráð aftur við uppfærslu, því fyrirtæki sem uppfærir
keyrir aldrei uppsetningarkveikjuna. Uppfærslueiningin í Bifrost Orchestrator endurtekur stofnun stöku
uppsetningarfærslunnar, skráningu varðveislureglna og virkjun HTTP-biðlarans einmitt af
þeirri ástæðu.

```al
codeunit 10035538 "App Upgrade ori"
{
    Access = Internal;
    Subtype = Upgrade;

    trigger OnUpgradePerCompany()
    begin
        CreateJobqueueOrchestratorSetup();
        SetDefaultTypeToCodeunit();
        EnableHttpClientRequests();
        RegisterRetentionPolicies();
    end;
}
```

Haltu uppfærsluþrepum sjálfsamkvæmum og vörðum — `if IsEmpty() then exit;` á undan
`ModifyAll`, `if not HasUpgradeTag(...)` á undan einskiptisflutningi. Uppfærslukveikja getur
keyrt oftar en þig grunar.

## Næst

- [Prófanir](/extensibility/testing/) — að ná í innri uppsetningu úr prófunarkeyrslu.
- [Hlutir og nafnavenjur](/extensibility/conventions/) — hvers vegna arftakinn fær nýtt
  númerabil frekar en að endurnýta bil forritsins sem er lagt af.
