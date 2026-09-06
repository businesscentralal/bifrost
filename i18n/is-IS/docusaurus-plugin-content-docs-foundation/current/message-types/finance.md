---
id: finance
title: "Finance message types"
sidebar_position: 5
---

Þetta skjal lýsir skilaboðategundum tengdum fjármálum í Bifröst Foundation.

## Yfirlit

Skilaboðategundir fyrir fjármál bjóða upp á virkni til að vinna með almenn dagbókabókhald, þar með talið sannvottun og bókun.

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|----------------|--------|-----------|
| [Finance.GeneralJournal.Check](#financegeneraljournalcheck) | Útlæg | Sannvirðir bókhaldsrunu og skilar stöðu á tilbúningu |
| [Finance.GeneralJournal.Post](#financegeneraljournalpost) | Innlæg | Bókar bókhaldsrunu og skilar tölfræði |
| [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) | Innlæg | Líkir eftir bókun á bókhaldsrunu og skilar fyrirhuguðum fjárhagsfærslum án þess að vista breytingar |
| [Finance.GeneralJournal.ReverseRegister](#financegeneraljournalreverseregister) | Innlæg | Bakfærir allar fjárhagsfærslur í tilgreindri fjárhagsskráningu |
| [Finance.GeneralJournal.ReverseTransaction](#financegeneraljournalreversetransaction) | Innlæg | Bakfærir allar fjárhagsfærslur eftir færslunúmeri |
| [Finance.GeneralJournal.SetupNewLine](#financegeneraljournalsetupnewline) | Innlæg | Stofnar nýja dagbókarlínu með sjálfgefnum gildum |
| [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline) | Innlæg | Stofnar nýja fastafjármunadagbókarlínu með sjálfgefnum gildum |
| [Finance.FAJournal.Check](#financefajournalcheck) | Útlæg | Sannvirðir fastafjármunadagbókarrunu |
| [Finance.FAJournal.Post](#financefajournalpost) | Innlæg | Bókar fastafjármunadagbókarrunu |
| [Finance.FAJournal.PreviewPost](#financefajournalpreviewpost) | Innlæg | Hermir bókun á fastafjármunadagbókarrunu og skilar spáðum færslum (afturkallað) |
| [Finance.BankReconciliation.Create](#financebankreconciliationcreate) | Innlæg | Stofnar eða endurnýtir bankaafstemmingu og flytur inn bankalínur |
| [Finance.BankReconciliation.Match](#financebankreconciliationmatch) | Innlæg | Reiknar pörunarham og keyrir sjálfvirka/stranga pörun |
| [Finance.BankReconciliation.Reset](#financebankreconciliationreset) | Innlæg | Fjarlægir allar pöranir úr bankaafstemmingu |
| [Finance.BankReconciliation.Post](#financebankreconciliationpost) | Innlæg | Bókar bankaafstemmingu |
| [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) | Innlæg | Forskoðar eða bókar VSK-uppgjör með skýrslu 20 og skilar fjárhagsskráningu og bili VSK-færslna |
| [Finance.VATStatement.Preview](#financevatstatementpreview) | Innlæg | Endurgerð á síðu 474 "Forskoðun VSK-yfirlits" — skilar reiknuðu Column Amount fyrir hverja línu í VSK-yfirliti |
| [Finance.Currency.AdjustExchangeRates](#financecurrencyadjustexchangerates) | Innlæg | Forskoðar eða bókar gengisleiðréttingu erlendra gjaldmiðla með kódaeiningu 699 og skilar annaðhvort hermdum færslum eða nýrri fjárhagsskráningu, færslubili og sundurliðun eftir gjaldmiðli |

---

## Finance.GeneralJournal.Check

**Stefna**: Útlæg (eingöngu sannvottun, engar breytingar á gögnum)

**Tilgangur**: Sannvirðir bókhaldsrunu án þess að bóka. Skilar ítarlegri stöðu og niðurstöðum sannvottunar.

### Snið beiðni

Bifröst færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "GENERAL|DEFAULT",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Auðkenning bókhaldsrunu

Hægt er að auðkenna bókhaldsrunu á þrjá vegu:

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT"
  }
}
```

JSON-gagnafæribreytur hafa forgang yfir subject-reitinn.

### Snið svars

#### Ready (engar villur, engar viðvaranir)
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "lineCount": 4,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings
```json
{
  "status": "Success",
  "validationResult": "ReadyWithWarnings",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "lineCount": 2,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 2,
  "errors": [],
  "warnings": [
    "Line 10000: Posting Date is in the future (2025-12-31).",
    "Line 20000: Customer C00010 is blocked (Payment)."
  ]
}
```

#### NotReady (sannvottunarvillur)
```json
{
  "status": "Success",
  "validationResult": "NotReady",
  "templateName": "GENERAL",
  "batchName": "INVALID",
  "lineCount": 2,
  "isBalanced": false,
  "requiresBalance": true,
  "totalAmountLCY": 1500.0,
  "errorCount": 3,
  "warningCount": 0,
  "errors": [
    "Journal is not balanced: Total LCY = 1500.00 (should be 0.00).",
    "Line 10000: Document No. is required.",
    "Line 20000: G/L Account 44000 does not allow direct posting."
  ],
  "warnings": []
}
```

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | string | Alltaf "Success" við sannvottun (jafnvel þótt dagbókin sé ekki tilbúin) |
| `validationResult` | string | "Ready", "ReadyWithWarnings" eða "NotReady" |
| `templateName` | string | Heiti dagbókarsniðmáts |
| `batchName` | string | Heiti bókhaldsrunu |
| `batchDescription` | string | Lýsing á bókhaldsrunu |
| `lineCount` | integer | Fjöldi dagbókarlína í runu |
| `isBalanced` | boolean | True ef heildarupphæð í SGM = 0 |
| `requiresBalance` | boolean | True ef sniðmát krefst jafnvægis |
| `totalAmount` | decimal | Summa upphæðar á öllum línum |
| `totalAmountLCY` | decimal | Summa upphæðar (SGM) á öllum línum |
| `errorCount` | integer | Fjöldi hindrunarvillna |
| `warningCount` | integer | Fjöldi viðvaringa sem ekki hindra |
| `errors` | array | Listi yfir villuboð (koma í veg fyrir bókun) |
| `warnings` | array | Listi yfir viðvaranir (bókun leyfð) |

### Sannvottunarreglur

**Sannvottunaraðferð**: Notar BC Error Message Management ramma með kóðaeiningu 11 „Gen. Jnl.-Check Line" til að safna ÖLLUM sannvottunarvillum í einu skani.

**Reglur sem beitt er**:
1. **Jafnvægi** (rununíð): Almenn dagbókarsniðmát krefjast þess að heildarupphæð í SGM sé 0
2. **Línur** (rununíð): Runa þarf að innihalda a.m.k. eina línu
3. **Sannvottun hverrar línu** (í gegnum Gen. Jnl.-Check Line):
   - Nauðsynlegir reitir: Bókunardagsetning, Skjalanúmer, Tegund/Nr. reiknings
   - Bókunartímabil: Dagsetning verður að vera innan leyfðs bókunartímabils
   - Fjárhagslyklar: Verða að vera til, leyfa beinnar bókunar, vera ekki læstir
   - Viðskiptamenn/Lánardrottnar: Verða að vera til og leyfðir til bókunar
   - Mótlyklar: Sannvottaðir ef tilgreindir
   - Víddar: Nauðsynlegar víddar verða að vera til staðar og gildar
   - Gjaldmiðill: Gjaldmiðilskóðar verða að vera til ef tilgreindir
   - VSK: VSK-útreikningar verða að vera gildir
   - Uppgjör: Uppgjörsreglur framfylgdar
4. **Viðvaranir til viðbótar** (hindra ekki):
   - Núll-upphæðir skapar viðvaranir
   - Framtíðar-bókunardagsetningar (eftir vinnudag) skapar viðvaranir

### Villumeðferð

| Villa | Ástæða |
|-------|--------|
| Vantar auðkenningu | Ekkert subject eða gagnafæribreytur gefnar |
| Runa finnst ekki | Sniðmát/runu samsetning er ekki til |
| Engar línur | Runa er til en hefur engar dagbókarlínur |

### Athugasemdir

- **Eyðileggur ekki**: Þessi endapunktur breytir ENGUM gögnum
- **Söfnun villna**: Nýtir BC Error Message ramma til að safna öllum sannvottunarvillum (ekki aðeins fyrstu villunni)
- **Heldur áfram við villur**: Sannvottun heldur áfram jafnvel eftir villur til að gefa fullnægjandi villulýsingu

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Bóka sannvottaða bókhaldsrunu
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) - Sækja dagbókarlínur
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) - Búa til eða uppfæra dagbókarlínur
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget) - Fá lýsigögn um Gen. Journal Line töfluna

---

## Finance.BankReconciliation.Create

**Stefna**: Innlæg

**Tilgangur**: Stofnar nýja bankaafstemmingu fyrir bankareikning eða endurnýtir tóma afstemmingu og flytur inn bankayfirlitslínur.

### Bankaafstemmingarferli

Þessi skilaboðategund er fyrsta skref í bankaafstemmingarhringnum:

1. `Finance.BankReconciliation.Create` -- stofnar eða endurnýtir afstemmingarhaus (`Bank Acc. Reconciliation` með `Statement Type = Bank Reconciliation`) og flytur inn yfirlitslínur í `Bank Acc. Reconciliation Line`.
2. `Finance.BankReconciliation.Match` -- parar yfirlitslínur við `Bank Account Ledger Entry` (BLE) færslur. Pörun stimplar BLE með `Statement No.`, `Statement Line No.` og `Statement Status = Bank Acc. Entry Applied` í gegnum staðlaða BC-aðferð `Bank Acc. Entry Set Recon.-No.`. Margir-á-einn pörun skrifar einnig línur í `Bank Acc. Rec. Match Buffer`.
3. `Finance.BankReconciliation.Reset` (valfrjálst) -- fjarlægir allar pörunarstimplanir til að gera nýja áætlun.
4. `Finance.BankReconciliation.Post` -- keyrir kóðaeiningu `Bank Acc. Reconciliation Post`, lokar pöruðum BLE (`Open=false`, `Statement Status=Closed`) og eyðir afstemmingarhaus.

Þetta ferli skrifar **ekki** `Applied Payment Entry` línur. Sú tafla er aðeins notuð fyrir Statement Type = `Payment Application`, sem þessi viðauki útsetur ekki.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Create",
  "source": "MyIntegrationApp v1.0",
  "subject": "BANK-MAIN",
  "data": {
    "statementDate": "2026-05-30"
  }
}
```

Röðun auðkenningar:
1. `subject` sem GUID -> Bank Account SystemId
2. `subject` sem texti -> Bank Account No.
3. JSON-lyklar: `bankAccountNo`, `bankAccountId`, `id`, `systemId`, `recordSystemId`

### Snið svars

```json
{
  "status": "Success",
  "reused": true,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "statementDate": "2026-05-30",
  "systemId": "<guid>",
  "lineCount": 3,
  "warning": "<optional import warning>"
}
```

### Villumeðferð

Ef ekki tekst að finna bankareikning skilar þjónustan villusvari:

```json
{
  "status": "Error",
  "error": "Bank account identifier must be specified..."
}
```

### Athugasemdir

- Ef `statementDate` vantar og afstemming er endurnýtt er dagsetning endurstillt í `0D` (auð textagildi í JSON).
- Innflutningsvilla kemur sem `warning`; `status` helst `Success`.

---

## Finance.BankReconciliation.Match

**Stefna**: Innlæg

**Tilgangur**: Reiknar pörunarham (`Auto`, `0-N`, `1-1`, `1-N`, `N-1`, `N-N-Strict`, `Custom`) og sannreynir stranga N-N pörun.

### Áhrif pörunar á gögn

Fyrir hverja BLE sem paruð er við yfirlitslínu skrifa stöðluðu BC-aðferðirnar `Match Bank Rec. Lines` og `Bank Acc. Entry Set Recon.-No.`:

- `Bank Account Ledger Entry."Statement No."` = `Statement No.` afstemmingar
- `Bank Account Ledger Entry."Statement Line No."` = línunúmer paraðrar yfirlitslínu
- `Bank Account Ledger Entry."Statement Status"` = `Bank Acc. Entry Applied`
- Fyrir 1-N og N-1 eru línur í `Bank Acc. Rec. Match Buffer` notaðar til að halda utan um margs-til-eins tengsl

Á hverri paraðri `Bank Acc. Reconciliation Line`: `Applied Amount`, `Applied Entries` og `Difference` eru uppfærð.

`Auto`-hamur keyrir `Match Bank Rec. Lines.BankAccReconciliationAutoMatch(BankAccReconciliation, 0)`. Enginn hamur skrifar `Applied Payment Entry` línur.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Match",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {
    "statementLines": [10000, 20000],
    "ledgerEntries": [30000, 40000],
    "strict": true
  }
}
```

### Snið svars

```json
{
  "status": "Success",
  "mode": "N-N-Strict",
  "strict": true,
  "statementLinesCount": 2,
  "ledgerEntriesCount": 2,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Villumeðferð

- Villu kastað ef afstemming finnst ekki.
- Villu kastað ef N-N pörun er beðin án `strict=true`.
- Villu kastað ef ströng N-N fylki eru með mismunandi lengd.

---

## Finance.BankReconciliation.Reset

**Stefna**: Innlæg

**Tilgangur**: Fjarlægir allar pörunarstimplanir af öllum línum bankaafstemmingar með stöðluðu BC-aðferðinni `Match Bank Rec. Lines.RemoveMatchesFromRecLines`.

### Áhrif endurstillingar á gögn

Fyrir hverja BLE sem áður var stimpluð af `Match`:

- `Bank Account Ledger Entry."Statement No."` -> autt
- `Bank Account Ledger Entry."Statement Line No."` -> 0
- `Bank Account Ledger Entry."Statement Status"` -> `Open`
- Allar línur í `Bank Acc. Rec. Match Buffer` fyrir línuna eru fjarlægðar

Á hverri viðkomandi `Bank Acc. Reconciliation Line`:

- `Applied Amount` -> 0
- `Applied Entries` -> 0
- `Difference` -> `Statement Amount`

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Reset",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```

### Snið svars

```json
{
  "status": "Success",
  "mode": "ResetAll",
  "resetLineCount": 0,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Villumeðferð

Villu kastað ef afstemming finnst ekki.

---

## Finance.BankReconciliation.Post

**Stefna**: Innlæg

**Tilgangur**: Bókar bankaafstemmingu með stöðluðu bókunarflæði í Business Central (kóðaeining `Bank Acc. Reconciliation Post`).

### Áhrif bókunar á gögn

- Sannreynir að `Statement Ending Balance` sé jafnt stöðu bankareiknings eftir afstemmingu.
- Fyrir hverja paraða `Bank Account Ledger Entry`: setur `Open = false` og `Statement Status = Closed` (`Statement No.` / `Statement Line No.` stimplar haldast fyrir endurskoðun).
- Bókar fjárhagslínur fyrir afstemmingarlínur með mótreikningum.
- Eyðir `Bank Acc. Reconciliation` hausnum og öllum tilheyrandi `Bank Acc. Reconciliation Line` línum.
- Skrifar sögufærslu í `Posted Bank Acc. Reconciliation` (uppfletting með `Bank Account No.` + `Statement No.`).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```

### Snið svars

```json
{
  "status": "Success",
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Villumeðferð

- Villu kastað ef afstemming finnst ekki.
- Villu kastað ef bókunarskilyrði standast ekki.

---

## Finance.GeneralJournal.Post

**Stefna**: Innlæg (breytir gögnum — bókar dagbók og hreinsar línur)

**Tilgangur**: Bókar sannvirtar bókhaldsrunu til að búa til fjárhagsfærslur.

### Snið beiðni

Bifröst færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "GENERAL|BATCH001",
  "id": "b2c3d4e5-6789-01bc-def2-234567890abc",
  "time": "2024-01-15T14:20:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Auðkenning bókhaldsrunu

Hægt er að auðkenna bókhaldsrunu á þrjá vegu:

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "BATCH001"
  }
}
```

JSON-gagnafæribreytur hafa forgang yfir subject-reitinn.

### Snið svars

#### Svar við velgengni
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "BATCH001",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2024-01-15",
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

#### Svar við villu
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | string | "Success" eða "Error" |
| `templateName` | string | Heiti dagbókarsniðmáts |
| `batchName` | string | Heiti bókhaldsrunu |
| `batchDescription` | string | Lýsing á bókhaldsrunu |
| `linesPosted` | integer | Fjöldi bókaðra dagbókarlína |
| `postingDate` | string | Bókunardagsetning (ISO snið) |
| `totalAmount` | decimal | Heildarupphæð bókuð |
| `totalAmountLCY` | decimal | Heildarupphæð (SGM) bókuð |
| `glRegisterNo` | integer | Fjárhagsskráningarnúmer búið til við bókun |
| `glRegisterId` | string | Fjárhagsskráning SystemId (GUID án sveigja) |
| `fromEntryNo` | integer | Fyrsta fjárhagsfærslunúmer í skráningu |
| `toEntryNo` | integer | Síðasta fjárhagsfærslunúmer í skráningu |
| `fromVATEntryNo` | integer | Fyrsta VSK-færslunúmer í skráningu (0 ef engin) |
| `toVATEntryNo` | integer | Síðasta VSK-færslunúmer í skráningu (0 ef engin) |
| `error` | string | Villuboð (aðeins við Error stöðu) |
| `callstack` | string | Villu-kallstafli (aðeins við Error stöðu) |

### Villumeðferð

**Algengar villur:**
- Bókhaldsruna finnst ekki
- Engar línur til að bóka í rununni
- Bókunarsannvottunarvillur (jafnvægi athugað, nauðsynlegar víddar, o.fl.)
- Vantar auðkenningu bókhaldsrunu
- Ekkert bókað (bókun lauk en engin skráning búin til)

### Athugasemdir

- Notar kóðaeiningu „Gen. Jnl.-Post Batch" (80) til bókunar
- Allar dagbókarlínur eru hreinsaðar úr rununni eftir vel heppnaða bókun
- Runufærslan sjálf helst (eingöngu línurnar eru eyddar)
- Bókun sannvirðir allar línur áður en bókað er (jafnvægi athugað, nauðsynlegir reitir, víddar)
- Fjárhagsskráning geymir fullt endurskoðunarspor bókunar
- Fyrir jafnaðar dagbækur (skuld = kredit), verður `totalAmount` og `totalAmountLCY` 0.00
- Færslusvið í fjárhagsskráningu leyfir beina sótt á allar bókaðar færslur

### Verkfæri

1. Sannvirkja tilvist bókhaldsrunu
2. Sannvirkja að línur séu til í rununni
3. Kalla „Gen. Jnl.-Post Batch" (kóðaeining 80) til að bóka allar línur
4. Sannvirkja að fjárhagsskráning hafi verið búin til
5. Við velgengni: Skila tölfræði fjárhagsskráningar
6. Við villu: Skila villuboðum með kallstafla

**Ráðlögð nálgun:** Sannvirkja með `Finance.GeneralJournal.Check` fyrst, svo bóka með `Finance.GeneralJournal.Post`.

### Öryggissjónarmiðir

- Bókun almennra dagbóka krefst sérstakra heimilda í BC
- Allar bókaðar færslur halda `Journal Batch Name` til rekjanlegar
- Íhugar að bæta við reitartakmörkunum á viðkvæma reiti (t.d. bókunardagsetningar, lykilnúmer)

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.SetupNewLine](#financegeneraljournalsetupnewline) - Stofna nýja dagbókarlínu með sjálfgefnum gildum
- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) - Sannvirkja áður en bókað er
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) - Sækja dagbókarlínur áður en bókað er
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) - Búa til eða uppfæra dagbókarlínur
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget) - Fá lýsigögn um Gen. Journal Line töfluna

---

## Finance.GeneralJournal.PreviewPost

**Stefna**: Innlæg (líkir eftir bókun; engar gagnabreytingar)

**Tilgangur**: Líkir eftir bókun á bókhaldsrunu og skilar fjárhagsfærslunum sem yrðu til (G/L færslur, VSK-færslur, viðskiptamanna-/lánardrottna-/banka-/starfsmanna-skuldfærslur, FA-færslur, verkefnisfærslur og aðrar bókhaldstöflur sem BC-bókunarferlið fyllir út) **án þess að vista breytingar**. Allt `Gen. Jnl.-Post` ferlið keyrir innan transaction sem er rúllað til baka eftir að fyrirhuguðu færslurnar hafa verið lesnar í temp-skrár.

Notaðu þessa skilaboðategund til að:
- Sannvirkja að bókhaldsrunu sé hægt að bóka áður en hún er bókuð í alvöru.
- Sýna AI-fulltrúa (eða notanda) nákvæmlega fjárhagsleg áhrif bókunarinnar.
- Staðfesta að debet/kredit standist og skoða færslurnar sem myndu verða til.

### Inntaksbreytur

Auðkenning bókhaldsrunu (a.m.k. ein aðferð krafist). Fyrsta samsvörun gildir:

| Aðferð | Subject-svæði | Data-svæði |
|--------|---------------|------------|
| Pípu-aðskilin nöfn | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (án sviga) | — |
| Sniðmáts- + runuheiti | — | `templateName` + `batchName` |

### Svarsnið

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting general journal batch GENERAL|DEFAULT (3 lines) would create 6 ledger entries across 2 tables. Transaction is balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 3,
  "postingDate": "2024-01-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["DOC-001", "DOC-002"],
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1500.00,
    "totalCreditLCY": 1500.00
  },
  "preview": [
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "entryCount": 6,
      "entries": [ /* einn JSON-hlutur á hverja útbúna G/L færslu */ ]
    }
  ]
}
```

### Svarsvæði

| Svæði | Gerð | Lýsing |
|-------|------|--------|
| `status` | string | `"Success"` eða `"Error"`. |
| `rollback` | boolean | Alltaf `true` — staðfestir að engin gögn voru vistuð. |
| `summary` | string | Ein-línu lýsing á fyrirhugaðri bókun. |
| `templateName` | string | Heiti sniðmáts. |
| `batchName` | string | Heiti runu. |
| `batchDescription` | string | Lýsing runu. |
| `linesToPost` | integer | Fjöldi lína sem yrðu bókaðar. |
| `postingDate` | string | Bókunardagsetning úr fyrstu línu (ISO snið). |
| `lcyCode` | string | Staðbundinn gjaldmiðill úr fjárhagsuppsetningu. |
| `predictedDocumentNos` | string[] | Einstök fylgiskjalsnúmer úr fyrirhuguðum G/L færslum (aðeins til upplýsingar). |
| `totals.balanced` | boolean | `true` ef `totalDebitLCY = totalCreditLCY`. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Summa debet/kredit upphæða í LCY. |
| `preview` | array | Einn hlutur fyrir hverja töflu sem BC-bókunarferlið fyllir út. |

### Gjaldmiðlameðferð

Bókhaldsrunu getur innihaldið línur í mörgum gjaldmiðlum. Þess vegna sýnir efsta `totals` aðeins LCY-summur. Gjaldmiðilssamhengi á hverja færslu (`CurrencyCode`, `Amount`, `AmountLCY`) er tiltækt inni í `preview`-fylkinu.

### Villumeðhöndlun

Villur eru tilkynntar sem `{ "status": "Error", "error": "..." }`. Algengar villur:
- Auðkenning bókhaldsrunu vantar.
- Bókhaldsrunu fannst ekki.
- Bókhaldsrunu hefur engar línur.
- Sannvirkjun mistókst (ójöfnuð, vantar G/L reikninga, víddir, o.s.frv.).

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) - Sannvirkir runu án bókunar.
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Bókar runu (engin afturkölllun).
- [Sales.Document.PreviewPost](/foundation/message-types/sales/#salesdocumentpreviewpost) / [Purchase.Document.PreviewPost](/foundation/message-types/purchase/#purchasedocumentpreviewpost) - Skjalsbundnar útgáfur.

---

## Finance.GeneralJournal.ReverseRegister

**Stefna**: Innlæg (bakfærir bókaðar færslur)

**Tilgangur**: Bakfærir allar fjárhagsfærslur í tilgreindri fjárhagsskráningu. Býr til nýjar leiðréttingarfærslur sem vega á móti upprunalegu færslunum í skráningunni.

### Snið beiðni

Bifröst færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.ReverseRegister",
  "source": "dynamics365/businesscentral",
  "subject": "42",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Auðkenning fjárhagsskráningar

Subject-reiturinn auðkennir fjárhagsskráninguna sem á að bakfæra:

1. **Skráningarnúmer (heiltala)**: `"subject": "42"` — gildi reitsins "Nr." á fjárhagsskráningunni
2. **SystemId (GUID)**: `"subject": "a1b2c3d4-5678-90ab-cdef-1234567890ab"` — SystemId fjárhagsskráningarfærslunnar

### Snið svars

#### Svar við velgengni
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 100,
  "toEntryNo": 105
}
```

#### Svar við villu
```json
{
  "status": "Error",
  "error": "The register has already been reversed.",
  "callstack": "..."
}
```

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | Text | `Success` eða `Error` |
| `reversedRegisterNo` | Integer | Númer fjárhagsskráningar sem var bakfærð |
| `fromEntryNo` | Integer | Fyrsta færslunúmer í skráningunni |
| `toEntryNo` | Integer | Síðasta færslunúmer í skráningunni |
| `error` | Text | Villuboð (eingöngu við villu) |
| `callstack` | Text | AL-kallstafli (eingöngu við villu) |

### Sannvottun

- Subject verður að vera gild heiltala eða GUID
- Fjárhagsskráning verður að vera til (eftir Nr. eða SystemId)
- Fjárhagsskráning má ekki vera þegar bakfærð

### Verkflæði

1. Auðkenna fjárhagsskráningu (eftir Nr. eða SystemId uppflettingu)
2. Staðfesta að skráning sé til og sé ekki þegar bakfærð
3. Framkvæma bakfærslu með einangruðum skrif-kóðaeiningu (Codeunit.Run mynstur)
4. Við velgengni: skila tölfræði skráningar
5. Við villu: skila villuboðum með kallstafla

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.ReverseTransaction](#financegeneraljournalreversetransaction) - Bakfæra eftir færslunúmeri
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Bóka bókhaldsrunu (stofnar skráningar)

---

## Finance.GeneralJournal.ReverseTransaction

**Stefna**: Innlæg (bakfærir bókaðar færslur)

**Tilgangur**: Bakfærir allar fjárhagsfærslur sem deila tilgreindu færslunúmeri. Býr til nýjar leiðréttingarfærslur sem vega á móti upprunalegu færslunum.

### Snið beiðni

Bifröst færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.ReverseTransaction",
  "source": "dynamics365/businesscentral",
  "subject": "1234",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Auðkenning færslu

Subject-reiturinn auðkennir færsluna sem á að bakfæra:

1. **Færslunúmer (heiltala)**: `"subject": "1234"` — færslunúmerið
2. **SystemId (GUID)**: `"subject": "a1b2c3d4-5678-90ab-cdef-1234567890ab"` — SystemId hvaða fjárhagsfærslu sem er í færslunni; færslunúmerið er dregið út úr færslunni

### Snið svars

#### Svar við velgengni
```json
{
  "status": "Success",
  "reversedTransactionNo": 1234,
  "entriesReversed": 4
}
```

#### Svar við villu
```json
{
  "status": "Error",
  "error": "The transaction has already been reversed.",
  "callstack": "..."
}
```

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | Text | `Success` eða `Error` |
| `reversedTransactionNo` | Integer | Færslunúmerið sem var bakfært |
| `entriesReversed` | Integer | Fjöldi fjárhagsfærslna sem voru bakfærðar |
| `error` | Text | Villuboð (eingöngu við villu) |
| `callstack` | Text | AL-kallstafli (eingöngu við villu) |

### Sannvottun

- Subject verður að vera gild heiltala eða GUID
- Að minnsta kosti ein fjárhagsfærsla verður að vera til fyrir færslunúmerið (eftir Transaction No. eða SystemId uppflettingu)
- Færslan má ekki vera þegar bakfærð

### Verkflæði

1. Auðkenna færslu (eftir Transaction No. eða með uppflettingu á fjárhagsfærslu með SystemId)
2. Staðfesta að færslur séu til og séu ekki þegar bakfærðar
3. Framkvæma bakfærslu með einangruðum skrif-kóðaeiningu (Codeunit.Run mynstur)
4. Við velgengni: skila tölfræði færslu
5. Við villu: skila villuboðum með kallstafla

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.ReverseRegister](#financegeneraljournalreverseregister) - Bakfæra eftir fjárhagsskráningarnúmeri
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Bóka bókhaldsrunu (stofnar færslur)

---

## Finance.GeneralJournal.SetupNewLine

**Stefna**: Innlæg (stofnar nýja dagbókarlínu)

**Tilgangur**: Stofnar og setur inn nýja almenna dagbókarlínu í tilgreindri runu, forútfyllta með sjálfgefnum gildum frá BC `SetUpNewLine` aðferðinni. Þetta er sjálfgefna leiðin til að undirbúa almenna dagbókarlínu áður en viðskiptareitir eru fylltir út með `Data.Records.Set`.

Sjálfgefin gildi sem erfast frá sniðmáti og runu innihalda Tegund mótlykils, Nr. mótlykils, Tegund skjals og Bókunardagsetning. Ef númeraröð er skilgreind á bókhaldsrununni er Skjalanúmer sjálfkrafa fyllt út frá næsta númeri í röðinni.

Línan fær næsta laust Línunr. (síðasta lína + 10000, eða 10000 ef runan er tóm).

### Snið beiðni

Bifröst færibreytur:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "GENERAL|DEFAULT",
  "id": "c3d4e5f6-7890-12cd-ef34-567890abcdef",
  "time": "2026-04-15T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Auðkenning bókhaldsrunu

Hægt er að auðkenna bókhaldsrunu á þrjá vegu:

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT"
  }
}
```

JSON-gagnafæribreytur hafa forgang yfir subject-reitinn.

#### Valfrjálsar færibreytur

| Færibreyta | Tegund | Sjálfgefið | Lýsing |
|------------|--------|------------|--------|
| `fieldNumbers` | int[] | allir reitir | Reitanúmer sem á að skila í svari. Ef sleppt eru allir reitir skilaðir. |

```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT",
    "fieldNumbers": [1, 2, 3, 5, 8]
  }
}
```

### Snið svars

Svarið notar sama snið og `Data.Records.Get`: ein færsla í `result` fylkinu með `id`, `primaryKey` og `fields`.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "GENERAL",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "GJ-00001",
        "DocumentType": " ",
        "AccountType": "G/L Account",
        "BalAccountType": "G/L Account",
        "BalAccountNo_": "29900",
        "..."
      }
    }
  ]
}
```

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | string | "Success" eða "Error" |
| `noOfRecords` | integer | Alltaf 1 við velgengni |
| `result` | array | Eins-staks fylki sem inniheldur nýju dagbókarlínuna |
| `result[].id` | string | SystemId nýju dagbókarlínunnar (GUID) |
| `result[].primaryKey` | object | Aðallykillsreitir: JournalTemplateName, JournalBatchName, LineNo_ |
| `result[].fields` | object | Allir reitir utan aðallykils (eða eingöngu þeir í `fieldNumbers` ef tilgreint) |

### Hegðun

1. Runan er auðkennd með einni af þremur aðferðum hér að ofan.
2. Síðasta línan í rununni er fundin (ef einhver er).
3. Ný lína er ræst með sniðmátsheiti, runuheiti og næsta línunúmeri.
4. BC `SetUpNewLine` er kallað, með síðustu línuna sem tilvísun (eða tóma línu ef runan er tóm). Þetta setur sjálfgefin gildi frá sniðmáti og runu: Tegund mótlykils, Nr. mótlykils, Tegund skjals, Bókunardagsetning, o.fl. Ef númeraröð er skilgreind á rununni er Skjalanúmer fyllt út frá næsta númeri í röðinni.
5. Línan er sett inn með kveikjum.
6. Svarið skilar færslunni á `Data.Records.Get` sniði.

### Dæmigert verkflæði

1. Kalla `Finance.GeneralJournal.SetupNewLine` til að stofna línu með sjálfgefnum gildum.
2. Nota skilaða `id` (SystemId) með `Data.Records.Set` til að fylla út Reikningsnr., Upphæð, o.fl.
3. Endurtaka skref 1-2 fyrir hverja dagbókarlínu.
4. Kalla `Finance.GeneralJournal.Check` til að sannvirkja rununa.
5. Kalla `Finance.GeneralJournal.Post` til að bóka.

### Villumeðferð

| Villa | Ástæða |
|-------|--------|
| Vantar auðkenningu | Ekkert sniðmát/runa, SystemId, eða rör-aðskilið subject gefið |
| Runa finnst ekki | Tilgreind runa er ekki til |

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) — Sannvirkja bókhaldsrunu áður en bókað er
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) — Bóka sannvirta bókhaldsrunu
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) — Uppfæra reiti á nýstofnuðu línunni
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) — Lesa dagbókarlínur (sama svarssnið)

---

## Finance.FAJournal.SetupNewLine

**Stefna**: Innlæg

**Tilgangur**: Stofnar og setur inn nýja fastafjármunadagbókarlínu (FA Journal Line) með sjálfgefnum gildum úr BC `SetUpNewLine` ferli. Sjálfgefin gildi (FA bókunartegund, bókunardagsetning, sviðsgildi) erfast frá sniðmáti og runu. Skjalanúmer er fyllt út úr númeraröð runu ef stillt er.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "FA|DEFAULT",
  "data": {}
}
```

#### Auðkenning fastafjármunadagbókarrunu

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**: `templateName` + `batchName` (forgangur)

#### Valkvæðar færibreytur

| Færibreyta | Tegund | Sjálfgefið | Lýsing |
|-----------|--------|-----------|--------|
| `fieldNumbers` | int[] | öll svið | Svið sem á að taka með í svari |
| `noOfLines` | integer | 1 | Fjöldi lína sem á að stofna (1–100) |
| `clearExistingLines` | boolean | false | Þegar `true`, eyðir öllum línum í runu fyrst |

### Snið svars

Notar sama snið og `Data.Records.Get`. `primaryKey` inniheldur `JournalTemplateName`, `JournalBatchName`, `LineNo_`.

### Tengdar skilaboðategundir

- [Finance.FAJournal.Check](#financefajournalcheck)
- [Finance.FAJournal.Post](#financefajournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Finance.FAJournal.Check

**Stefna**: Útlæg (eingöngu sannvottun)

**Tilgangur**: Sannvirðir fastafjármunadagbókarrunu án þess að bóka.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "FA|DEFAULT",
  "data": {}
}
```

### Snið svars

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "FA",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA Batch",
  "lineCount": 2,
  "totalAmount": 15000.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

### Sviðin í svari

| Svið | Tegund | Lýsing |
|------|--------|--------|
| `validationResult` | string | "Ready", "ReadyWithWarnings" eða "NotReady" |
| `templateName` / `batchName` / `batchDescription` | string | Auðkenni runu |
| `lineCount` | integer | Fjöldi lína |
| `totalAmount` | decimal | Samtala upphæða |
| `errorCount` / `warningCount` | integer | Fjöldi villna/viðvarana |
| `errors` / `warnings` | array | Skilaboðafylki |

### Sannvottunarreglur

- Nauðsynleg svið: bókunardagsetning, FA-númer, FA bókunartegund
- Línur með `Amount = 0` skila **viðvörun** (hindra ekki bókun)
- FA verður að vera til og ekki læst
- Bókunartímabil sannvottað
- Framtíðar bókunardagsetningar gefa viðvörun

### Tengdar skilaboðategundir

- [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline)
- [Finance.FAJournal.Post](#financefajournalpost)

---

## Finance.FAJournal.Post

**Stefna**: Innlæg (breytir gögnum)

**Tilgangur**: Bókar sannvottaða fastafjármunadagbókarrunu og býr til FA-færslur (FA Ledger Entries).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.Post",
  "subject": "FA|BATCH001",
  "data": {}
}
```

### Snið svars

#### Árangur
```json
{
  "status": "Success",
  "templateName": "FA",
  "batchName": "BATCH001",
  "batchDescription": "Default FA Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 0.0,
  "totalAmount": 15000.0,
  "faRegisterNo": 9,
  "faRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 101,
  "toEntryNo": 102
}
```

#### Villa
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Athugasemdir

- Notar BC "FA Jnl.-Post Batch" einingu.
- `totalQuantity` er yfirleitt 0 fyrir FA-bókanir (upphæðamiðað).
- Línur eru hreinsaðar eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu — villur skila byggðu svari með `callstack`.

### Tengdar skilaboðategundir

- [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline)
- [Finance.FAJournal.Check](#financefajournalcheck)

---

## Finance.FAJournal.PreviewPost

**Stefna**: Innlæg (hermir bókun, engin gögn breytast)

**Tilgangur**: Hermir bókun á fastafjármunadagbókarrunu og skilar þeim færslum sem **myndu** verða til — án þess að vista neitt í gagnagrunninn. Beitir BC `Gen. Jnl.-Post Preview.SetContext + Run()` höfuðlausu flæði gegn `FA Jnl.-Post` áskrifanda. Töflur sem oftast eru fangaðar eru `Maintenance Ledger Entry` og (fyrir bókunargerðir sem samtvæma við fjárhag) `FA Ledger Entry`, `G/L Entry`, `VAT Entry` og hreyfingar á mótreikning.

### Innlögð gildi

Auðkenning runu (fyrsta samsvarandi vinnur):

| Aðferð | Subject-svið | Data-svið |
|--------|--------------|-----------|
| Lóðrétt-strik | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (án sviga) | — |
| Sniðmát + runa | — | `templateName` + `batchName` |

### Svarsnið

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting FA journal batch ASSETS|BATCH001 (1 line, type Maintenance) would create 1 ledger entry across 1 table. No G/L impact.",
  "templateName": "ASSETS",
  "batchName": "BATCH001",
  "batchDescription": "Default FA Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedDocumentNos": [],
  "totals": { "balanced": true, "totalDebitLCY": 0.0, "totalCreditLCY": 0.0 },
  "preview": [
    {
      "tableId": 5625,
      "tableName": "Maintenance Ledger Entry",
      "tableCaption": "Maintenance Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "FANo_": "FA000010", "FAPostingType": "Maintenance", "Amount": "-2500", "DocumentNo_": "MNT-0001" }
        }
      ]
    }
  ]
}
```

Fyrir fjárhags-samtvæmdar bókunargerðir (Acquisition Cost, Depreciation, Disposal o.s.frv.) inniheldur `preview[]` einnig `FA Ledger Entry` (5601), `G/L Entry` (17) og hreyfingar á mótreikningi, og `totals.totalDebitLCY/totalCreditLCY` endurspegla fjárhagsáhrifin.

### Svarsvið

Sami umslag og hjá `Inventory.ItemJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]` með `tableCaption` + `id`/`primaryKey`/`fields` á hvert atriði). Sérstakt:

| Svið | Lýsing |
|------|--------|
| `predictedDocumentNos` | Tómt fyrir Maintenance bókun (engar G/L færslur). Fyllt út fyrir fjárhags-samtvæmdar bókunargerðir. |
| `totals` | Alltaf `balanced=true` með núllupphæðum fyrir Maintenance bókun. |

### Rekstraráminningar

- **Stýring á `FA Posting Type` ræðst af afskriftarbókinni.** Hver `G/L Integration - {Type}` flagg á FA Depreciation Book ræður hvort bókun þeirrar gerðar verði að fara um **aðalfærslubók** (þegar `true`) í staðinn fyrir FA Journal.
  - Þegar `G/L Integration - Acquisition Cost = true` (sjálfgefið BC), verða Acquisition Cost línur með `Account Type = Fixed Asset` að vera bókaðar í gegnum `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post`. Tilraun í FA Journal skilar: `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...`.
  - Sama gildir um Depreciation, Disposal, Maintenance og aðrar gerðir.
- **CRONUS demo athugun:** Á `FYRIRTÆKI` afskriftarbókinni eru öll `G/L Integration - {Type}` flögg sjálfgefið `true`, svo eina FA bókunargerðin sem heppnast í FA Journal er ein þar sem flaggið er `false`. Til að prufukeyra FA Journal gegn CRONUS, settu viðeigandi flagg tímabundið í `false`.
- **Fyrir fjárhags-samtvæmdar bókunargerðir mælum við með aðalfærslubók** — notaðu `Finance.GeneralJournal.PreviewPost` með `Account Type = Fixed Asset` og `FA Posting Type = {Acquisition Cost \| Depreciation \| Disposal}`.

### Villur

BC sannvottunarvillur skila sér orðrétt. Algengar villur:
- `FA journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `FA journal batch {template}|{batch} not found.`
- `FA journal batch {template}|{batch} has no lines to post.`
- `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` — `G/L Integration - {Type}` flagg er `true`. Annaðhvort skiptu um flagg eða notaðu GeneralJournal leiðina.
- `Posting preview failed and no entries were captured. The FA journal cannot be posted in its current state.` — sjaldgæf heildarvilla.

### Tengdar skilaboðategundir

- [Finance.FAJournal.Check](#financefajournalcheck) - Sannvottaðu án þess að herma bókun.
- [Finance.FAJournal.Post](#financefajournalpost) - Raunveruleg bókun.
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) - Ráðlögð leið fyrir fjárhags-samtvæmdar FA bókanir.

---

## Útfærsluupplýsingar

### Hlutkenni

| Hlutategund | Hlutkennni | Heiti hlutar |
|-------------|-----------|--------------|
| Enum-gildi | 10077935 | Finance.GeneralJournal.Check |
| Útfærslukóðaeining | 10078105 | Gen. Journal Check Impl ori |
| Hjálparkóðaeining | 10077955 | Gen. Journal Check Help ori |
| Enum-gildi | 10077936 | Finance.GeneralJournal.Post |
| Útfærslukóðaeining | 10078106 | Gen. Journal Post Impl ori |
| Hjálparkóðaeining | 10077956 | Gen. Journal Post Help ori |
| Enum-gildi | 10077937 | Finance.GeneralJournal.SetupNewLine |
| Útfærslukóðaeining | 10078104 | Gen. Jnl. SetupLine Impl ori |
| Hjálparkóðaeining | 10077954 | Gen. Jnl. SetupLine Help ori |
| Enum-gildi | 10077938 | Finance.GeneralJournal.ReverseRegister |
| Útfærslukóðaeining | 10078107 | Gen. Jnl. Reverse Reg Impl ori |
| Hjálparkóðaeining | 10077952 | Gen. Jnl. Reverse Reg Help ori |
| Enum-gildi | 10077939 | Finance.GeneralJournal.ReverseTransaction |
| Útfærslukóðaeining | 10078108 | Gen. Jnl. Reverse Trx Impl ori |
| Hjálparkóðaeining | 10077953 | Gen. Jnl. Reverse Trx Help ori |
| Hjálparkóðaeining | 10078103 | Gen. Jnl. Reverse Process ori |
| Enum-gildi | 10078088 | Finance.FAJournal.SetupNewLine |
| Útfærslukóðaeining | 10078099 | FA Jnl. SetupLine Impl ori |
| Hjálparkóðaeining | 10077948 | FA Jnl. SetupLine Help ori |
| Enum-gildi | 10078089 | Finance.FAJournal.Check |
| Útfærslukóðaeining | 10078100 | FA Journal Check Impl ori |
| Hjálparkóðaeining | 10077949 | FA Journal Check Help ori |
| Enum-gildi | 10078090 | Finance.FAJournal.Post |
| Útfærslukóðaeining | 10078101 | FA Journal Post Impl ori |
| Hjálparkóðaeining | 10077950 | FA Journal Post Help ori |
| Enum-gildi | 10078124 | Finance.FAJournal.PreviewPost |
| Útfærslukóðaeining | 10078098 | FA Jnl. Preview Post Impl ori |
| Hjálparkóðaeining | 10077947 | FA Jnl. Preview Post Help ori |

### Skráarstaðsetningar

```
app/src/Message Type/
  Implementations/Finance/
    GenJournalCheckImpl.Codeunit.al
    GenJournalPostImpl.Codeunit.al
    GenJournalSetupNewLineImpl.Codeunit.al
    GenJnlReverseRegisterImpl.Codeunit.al
    GenJnlReverseTransImpl.Codeunit.al
    GenJnlReverseProcess.Codeunit.al
  Help/Finance/
    GenJournalCheckHelp.Codeunit.al
    GenJournalPostHelp.Codeunit.al
    GenJournalSetupNewLineHelp.Codeunit.al
    GenJnlReverseRegisterHelp.Codeunit.al
    GenJnlReverseTransHelp.Codeunit.al
  Implementations/FixedAssets/
    FAJnlSetupLineImpl.Codeunit.al
    FAJournalCheckImpl.Codeunit.al
    FAJournalPostImpl.Codeunit.al
    FAJnlPreviewPostImpl.Codeunit.al
  Help/FixedAssets/
    FAJnlSetupLineHelp.Codeunit.al
    FAJournalCheckHelp.Codeunit.al
    FAJournalPostHelp.Codeunit.al
    FAJnlPreviewPostHelp.Codeunit.al
```

### Prófanir

| Prófunarkóðaeining | Hlutkennni | Lýsing |
|--------------------|-----------|--------|
| Gen. Journal Check Tests | 95334 | Prófanir á sannvottun dagbókar |
| Gen. Journal Post Tests | 95335 | Prófanir á bókun dagbókar |
| Gen. Journal Finance Tests | 95379 | Prófanir á SetupNewLine, ReverseRegister, ReverseTransaction |

### Sjá einnig

- [Data Message Types](/foundation/message-types/data/) — `Data.Records.Get` og `Data.Records.Set` til að vinna með dagbókarlínur
- [Metadata Message Types](/foundation/message-types/metadata/) — `Help.Tables.Get` til að sækja reitaupplýsingar fyrir Gen. Journal Line
- [Sales Message Types](/foundation/message-types/sales/) — Skilaboðategundir söluskjala

---

## Finance.VAT.CalcAndPostSettlement

**Stefna**: Innlæg

**Tilgangur**: Reiknar og bókar (valkvætt) VSK-uppgjör með því að keyra skýrslu 20 *Calc. and Post VAT Settlement*. Þegar `post=false` (sjálfgefið) skilar svarinu eingöngu samtölu þeirra VSK-færslna sem yrðu gerðar upp. Þegar `post=true` keyrir skýrslan bókunina og svarið inniheldur einnig nýja fjárhagsskráningarnúmerið ásamt bili VSK-færslna sem bókunin myndaði.

### Uppgjörsferli

1. Þjónustubeiðandi sendir forskoðunarbeiðni (`post=false`) til að sjá samtölur og sundurliðun fyrir tímabil og uppgjörsreikning.
2. Þjónustubeiðandi yfirfer `totals` og `byPostingGroup`; engin bókun hefur átt sér stað.
3. Þjónustubeiðandi sendir sömu beiðni með `post=true` til að bóka:
   - Síðasta `G/L Register."No."` er fest í minni.
   - Bókun er falin sérstökum codeunit sem stillir færibreytur skýrslunnar gegnum `InitializeRequest` viðmót skýrslu 20 og keyrir hana í bakgrunni með `SaveAs` í straum sem er fleygt. (Skýrsla 20 er með útlit, svo `RunModal` myndi reyna óstudda niðurhalsbeiðni til biðlara í vefþjónustulotunni; `SaveAs` vinnur og bókar án hennar.) Villur sem skýrslan kastar eru fangaðar inn í svar án þess að bakvelta umlykjandi færslu.
   - Eftir keyrslu er ný `G/L Register` (No. hærra en upphafsgildið) fundin og `No.`, `From VAT Entry No.`, `To VAT Entry No.` skilað í svari.
4. Uppgjörið færir opnu VSK-færslurnar á `settlementAccountNo` fjárhagsreikninginn og lokar þeim. Einstakar VSK-færslur eru ekki í svarinu — sækja má þær með `Data.Records.Get` á `VAT Entry` síaða eftir `Entry No.` á milli skilanna.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.VAT.CalcAndPostSettlement",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "startingDate": "2026-01-01",
    "endingDate": "2026-01-31",
    "postingDate": "2026-02-01",
    "documentNo": "VAT-2026-01",
    "settlementAccountNo": "2150",
    "post": true,
    "showAmountsInAddCurrency": false,
    "vatBusPostingGroup": "DOMESTIC|EU",
    "vatProdPostingGroup": "VAT24",
    "type": "Sale"
  }
}
```

### Reitir í beiðni

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `startingDate` | dagsetning | Já | Fyrsta bókunardagsetning sem uppgjörið nær yfir. |
| `endingDate` | dagsetning | Já | Síðasta bókunardagsetning. Verður að vera jöfn eða stærri en `startingDate`. |
| `postingDate` | dagsetning | Já | Bókunardagsetning fyrir fjárhagsfærslu uppgjörsins. |
| `documentNo` | Code[20] | Já | Skjalanúmer fyrir fjárhagsfærslu uppgjörsins. |
| `settlementAccountNo` | Code[20] | Já | Markreikningur. Verður að vera til, Bókunartegund og ekki læstur. |
| `post` | boolean | Nei (sjálfgefið `false`) | `true` keyrir skýrsluna og bókar; `false` skilar einungis samtölu. |
| `showAmountsInAddCurrency` | boolean | Nei | Setur samsvarandi valkost skýrslunnar. |
| `vatBusPostingGroup` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `vatProdPostingGroup` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `vatRegistrationNo` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `type` | texti | Nei | Valkvæð sía á `Type` (`Purchase`, `Sale`, eða `Purchase\|Sale`). |

### Snið svars

**Forskoðun (`post=false`)**

```json
{
  "status": "Success",
  "posted": false,
  "documentNo": "VAT-2026-01",
  "postingDate": "2026-02-01",
  "settlementAccountNo": "2150",
  "startingDate": "2026-01-01",
  "endingDate": "2026-01-31",
  "showAmountsInAddCurrency": false,
  "lcyCode": "ISK",
  "totals": {
    "vatBase": 1000000.00,
    "vatAmount": 240000.00,
    "vatBaseACY": 0.00,
    "vatAmountACY": 0.00,
    "entryCount": 42
  },
  "byPostingGroup": [
    {
      "type": "Sale",
      "vatBusPostingGroup": "DOMESTIC",
      "vatProdPostingGroup": "VAT24",
      "entryCount": 15,
      "vatBase": 600000.00,
      "vatAmount": 144000.00,
      "vatBaseACY": 0.00,
      "vatAmountACY": 0.00
    }
  ]
}
```

**Bókað (`post=true`)** bætir við:

```json
{
  "status": "Success",
  "posted": true,
  "glRegisterNo": 1234,
  "fromVATEntryNo": 5678,
  "toVATEntryNo": 5720,
  "settlementVATEntryCount": 43
}
```

**Villa**

```json
{
  "status": "Error",
  "error": "Settlement G/L Account 2150 must have Account Type = Posting.",
  "callstack": "..."
}
```

`callstack` er aðeins til staðar þegar villa á uppruna í einangruðu skýrslukeyrslunni.

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | texti | `Success` eða `Error`. |
| `posted` | boolean | `true` aðeins ef `post=true` var beiðni *og* skýrslukeyrsla heppnaðist. |
| `documentNo`, `postingDate`, `settlementAccountNo` | — | Endurspeglar innsláttinn. |
| `startingDate`, `endingDate` | dagsetning | Bil bókunardagsetninga sem gerðar voru upp. |
| `lcyCode` | Code[10] | LCY kóði úr Fjárhagsstillingum. |
| `totals.vatBase` / `vatAmount` | tugatala | Heildarsamtölur í LCY. |
| `totals.vatBaseACY` / `vatAmountACY` | tugatala | Samtölur í auka-skýrslugjaldmiðli. |
| `totals.entryCount` | heiltala | Fjöldi opinna VSK-færslna sem síurnar finna. |
| `byPostingGroup[]` | listi | Ein færsla fyrir hverja samsetningu `Type` + `VAT Bus./Prod. Posting Group`. |
| `glRegisterNo` | heiltala | *Aðeins bókað.* `G/L Register."No."` sem skýrslan stofnaði. |
| `fromVATEntryNo` / `toVATEntryNo` | heiltala | *Aðeins bókað.* Bil `VAT Entry."Entry No."` sem uppgjörið myndaði. |
| `settlementVATEntryCount` | heiltala | *Aðeins bókað.* `toVATEntryNo - fromVATEntryNo + 1`. |

### Sannvottun

| Skoðun | Villuboð |
|--------|----------|
| `startingDate` til staðar | `startingDate is required.` |
| `endingDate` til staðar | `endingDate is required.` |
| `postingDate` til staðar | `postingDate is required.` |
| `documentNo` til staðar | `documentNo is required.` |
| `settlementAccountNo` til staðar | `settlementAccountNo is required.` |
| `endingDate >= startingDate` | `endingDate (X) must be on or after startingDate (Y).` |
| Reikningur til | `Settlement G/L Account X does not exist.` |
| `Account Type = Posting` | `Settlement G/L Account X must have Account Type = Posting.` |
| Reikningur ekki læstur | `Settlement G/L Account X is blocked.` |
| Að minnsta kosti ein opin VSK-færsla | `No open VAT entries match the supplied filters.` |

### Villumeðhöndlun

Sannvottunarvillur skila `status=Error` með reitnum `error`. Villur sem koma frá raunverulegri skýrslukeyrslu bæta einnig við reitnum `callstack` til greiningar. Einangraði bókunarcodeunit-inn tryggir að misheppnuð skýrslukeyrsla bakvelti ekki færslu skilaboðakerfisins.

### Athugasemdir

- Opnar VSK-færslur eru valdar með `SetRange(Closed, false)` ásamt umbeðnum síum. Sömu síur eru sendar í skýrsluna svo forskoðaðar og bókaðar færslur séu þær sömu.
- Samanteknun notar `CalcSums(Base, Amount, "Additional-Currency Base", "Additional-Currency Amount")`.
- Einstakar VSK-færslur eru ekki í svarinu til að halda svari hæfilegu. Sækja má þær með `Data.Records.Get` á `VAT Entry` síaða með `Entry No.` á milli `fromVATEntryNo` og `toVATEntryNo`.

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.Post](#financegeneraljournalpost)
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost)

---

## Finance.VAT.CalcAndPostSettlement

**Stefna**: Innlæg

**Tilgangur**: Reiknar og bókar (valkvætt) VSK-uppgjör með því að keyra skýrslu 20 *Calc. and Post VAT Settlement*. Þegar `post=false` (sjálfgefið) skilar svarinu eingöngu samtölu þeirra VSK-færslna sem yrðu gerðar upp. Þegar `post=true` keyrir skýrslan bókunina og svarið inniheldur einnig nýja fjárhagsskráningarnúmerið ásamt bili VSK-færslna sem bókunin myndaði.

### Uppgjörsferli

1. Þjónustubeiðandi sendir forskoðunarbeiðni (`post=false`) til að sjá samtölur og sundurliðun fyrir tímabil og uppgjörsreikning.
2. Þjónustubeiðandi yfirfer `totals` og `byPostingGroup`; engin bókun hefur átt sér stað.
3. Þjónustubeiðandi sendir sömu beiðni með `post=true` til að bóka:
   - Síðasta `G/L Register."No."` er fest í minni.
   - Bókun er falin sérstökum codeunit sem stillir færibreytur skýrslunnar gegnum `InitializeRequest` viðmót skýrslu 20 og keyrir hana í bakgrunni með `SaveAs` í straum sem er fleygt. (Skýrsla 20 er með útlit, svo `RunModal` myndi reyna óstudda niðurhalsbeiðni til biðlara í vefþjónustulotunni; `SaveAs` vinnur og bókar án hennar.) Villur sem skýrslan kastar eru fangaðar inn í svar án þess að bakvelta umlykjandi færslu.
   - Eftir keyrslu er ný `G/L Register` (No. hærra en upphafsgildið) fundin og `No.`, `From VAT Entry No.`, `To VAT Entry No.` skilað í svari.
4. Uppgjörið færir opnu VSK-færslurnar á `settlementAccountNo` fjárhagsreikninginn og lokar þeim. Einstakar VSK-færslur eru ekki í svarinu — sækja má þær með `Data.Records.Get` á `VAT Entry` síaða eftir `Entry No.` á milli skilanna.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Finance.VAT.CalcAndPostSettlement",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "startingDate": "2026-01-01",
    "endingDate": "2026-01-31",
    "postingDate": "2026-02-01",
    "documentNo": "VAT-2026-01",
    "settlementAccountNo": "2150",
    "post": true,
    "showAmountsInAddCurrency": false,
    "vatBusPostingGroup": "DOMESTIC|EU",
    "vatProdPostingGroup": "VAT24",
    "type": "Sale"
  }
}
```

### Reitir í beiðni

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `startingDate` | dagsetning | Já | Fyrsta bókunardagsetning sem uppgjörið nær yfir. |
| `endingDate` | dagsetning | Já | Síðasta bókunardagsetning. Verður að vera jöfn eða stærri en `startingDate`. |
| `postingDate` | dagsetning | Já | Bókunardagsetning fyrir fjárhagsfærslu uppgjörsins. |
| `documentNo` | Code[20] | Já | Skjalanúmer fyrir fjárhagsfærslu uppgjörsins. |
| `settlementAccountNo` | Code[20] | Já | Markreikningur. Verður að vera til, Bókunartegund og ekki læstur. |
| `post` | boolean | Nei (sjálfgefið `false`) | `true` keyrir skýrsluna og bókar; `false` skilar einungis samtölu. |
| `showAmountsInAddCurrency` | boolean | Nei | Setur samsvarandi valkost skýrslunnar. |
| `vatBusPostingGroup` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `vatProdPostingGroup` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `vatRegistrationNo` | texti | Nei | Valkvæð sía á VSK-færslur. |
| `type` | texti | Nei | Valkvæð sía á `Type` (`Purchase`, `Sale`, eða `Purchase\|Sale`). |

### Snið svars

**Forskoðun (`post=false`)**

```json
{
  "status": "Success",
  "posted": false,
  "documentNo": "VAT-2026-01",
  "postingDate": "2026-02-01",
  "settlementAccountNo": "2150",
  "startingDate": "2026-01-01",
  "endingDate": "2026-01-31",
  "showAmountsInAddCurrency": false,
  "lcyCode": "ISK",
  "totals": {
    "vatBase": 1000000.00,
    "vatAmount": 240000.00,
    "vatBaseACY": 0.00,
    "vatAmountACY": 0.00,
    "entryCount": 42
  },
  "byPostingGroup": [
    {
      "type": "Sale",
      "vatBusPostingGroup": "DOMESTIC",
      "vatProdPostingGroup": "VAT24",
      "entryCount": 15,
      "vatBase": 600000.00,
      "vatAmount": 144000.00,
      "vatBaseACY": 0.00,
      "vatAmountACY": 0.00
    }
  ]
}
```

**Bókað (`post=true`)** bætir við:

```json
{
  "status": "Success",
  "posted": true,
  "glRegisterNo": 1234,
  "fromVATEntryNo": 5678,
  "toVATEntryNo": 5720,
  "settlementVATEntryCount": 43
}
```

**Villa**

```json
{
  "status": "Error",
  "error": "Settlement G/L Account 2150 must have Account Type = Posting.",
  "callstack": "..."
}
```

`callstack` er aðeins til staðar þegar villa á uppruna í einangruðu skýrslukeyrslunni.

### Reitir í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | texti | `Success` eða `Error`. |
| `posted` | boolean | `true` aðeins ef `post=true` var beiðni *og* skýrslukeyrsla heppnaðist. |
| `documentNo`, `postingDate`, `settlementAccountNo` | — | Endurspeglar innsláttinn. |
| `startingDate`, `endingDate` | dagsetning | Bil bókunardagsetninga sem gerðar voru upp. |
| `lcyCode` | Code[10] | LCY kóði úr Fjárhagsstillingum. |
| `totals.vatBase` / `vatAmount` | tugatala | Heildarsamtölur í LCY. |
| `totals.vatBaseACY` / `vatAmountACY` | tugatala | Samtölur í auka-skýrslugjaldmiðli. |
| `totals.entryCount` | heiltala | Fjöldi opinna VSK-færslna sem síurnar finna. |
| `byPostingGroup[]` | listi | Ein færsla fyrir hverja samsetningu `Type` + `VAT Bus./Prod. Posting Group`. |
| `glRegisterNo` | heiltala | *Aðeins bókað.* `G/L Register."No."` sem skýrslan stofnaði. |
| `fromVATEntryNo` / `toVATEntryNo` | heiltala | *Aðeins bókað.* Bil `VAT Entry."Entry No."` sem uppgjörið myndaði. |
| `settlementVATEntryCount` | heiltala | *Aðeins bókað.* `toVATEntryNo - fromVATEntryNo + 1`. |

### Sannvottun

| Skoðun | Villuboð |
|--------|----------|
| `startingDate` til staðar | `startingDate is required.` |
| `endingDate` til staðar | `endingDate is required.` |
| `postingDate` til staðar | `postingDate is required.` |
| `documentNo` til staðar | `documentNo is required.` |
| `settlementAccountNo` til staðar | `settlementAccountNo is required.` |
| `endingDate >= startingDate` | `endingDate (X) must be on or after startingDate (Y).` |
| Reikningur til | `Settlement G/L Account X does not exist.` |
| `Account Type = Posting` | `Settlement G/L Account X must have Account Type = Posting.` |
| Reikningur ekki læstur | `Settlement G/L Account X is blocked.` |
| Að minnsta kosti ein opin VSK-færsla | `No open VAT entries match the supplied filters.` |

### Villumeðhöndlun

Sannvottunarvillur skila `status=Error` með reitnum `error`. Villur sem koma frá raunverulegri skýrslukeyrslu bæta einnig við reitnum `callstack` til greiningar. Einangraði bókunarcodeunit-inn tryggir að misheppnuð skýrslukeyrsla bakvelti ekki færslu skilaboðakerfisins.

### Athugasemdir

- Opnar VSK-færslur eru valdar með `SetRange(Closed, false)` ásamt umbeðnum síum. Sömu síur eru sendar í skýrsluna svo forskoðaðar og bókaðar færslur séu þær sömu.
- Samanteknun notar `CalcSums(Base, Amount, "Additional-Currency Base", "Additional-Currency Amount")`.
- Einstakar VSK-færslur eru ekki í svarinu til að halda svari hóflegu. Sækja má þær með `Data.Records.Get` á `VAT Entry` síaða með `Entry No.` á milli `fromVATEntryNo` og `toVATEntryNo`.

### Tengdar skilaboðategundir

- [Finance.GeneralJournal.Post](#financegeneraljournalpost)
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost)

---

## Finance.VATStatement.Preview

**Stefna**: Innlæg (skrifvarinn)

**Tilgangur**: Endurgerð á stöðluðu BC síðunni 474 *Forskoðun VSK-yfirlits* fyrir tiltekið VSK-yfirlitssniðmát/-nafn. Fer í gegnum línur VSK-yfirlits og skilar reiknuðu Column Amount fyrir hverja línu með skýrslu 12 `"VAT Statement".CalcLineTotal` — nákvæmlega sama API og síða 474 notar, þannig að gildin stemma. Engin bókun og engin skrif í gagnagrunn.

Til að telja upp sniðmát og nöfn skal kalla Data.Records.Get á VAT Statement Template (tafla 256) eða VAT Statement Name (tafla 257).

### Beiðnasnið

```json
{
  "specversion": "1.0",
  "type": "Finance.VATStatement.Preview",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "templateName": "DEFAULT",
    "name": "DEFAULT",
    "selection": "Open and Closed",
    "periodSelection": "Within Period",
    "dateFilter": "01/01/25..31/01/25",
    "countryRegionFilter": "",
    "rowNoFilter": "",
    "showAmountsInAddCurrency": false
  }
}
```

### Beiðnareitir

| Reitur | Gerð | Skylda | Lýsing |
|--------|------|--------|--------|
| `templateName` | Code[10] | Já | Nafn VSK-yfirlitssniðmáts. Verður að vera til. |
| `name` | Code[10] | Já | Nafn VSK-yfirlits innan sniðmátsins. Verður að vera til. |
| `selection` | texti | Nei (sjálfgefið `Open and Closed`) | `Open`, `Closed` eða `Open and Closed`. |
| `periodSelection` | texti | Nei (sjálfgefið `Within Period`) | `Within Period` eða `Before and Within Period`. |
| `dateFilter` | texti | Nei | Sía sett á `Date Filter` FlowFilter á VSK-yfirlitsnafni. |
| `countryRegionFilter` | texti | Nei | Síubreyta fyrir `Country/Region Filter` skýrslubreytuna. |
| `rowNoFilter` | texti | Nei | Valkvæð sía á `Row No.` til að skila hluta lína. |
| `showAmountsInAddCurrency` | boolean | Nei (sjálfgefið `false`) | Þegar `true` eru fjárhæðir reiknaðar í viðbótarmynt. |

### Svarsnið

**Velheppnað**

```json
{
  "status": "Success",
  "templateName": "DEFAULT",
  "name": "DEFAULT",
  "description": "Default VAT Statement",
  "selection": "Open and Closed",
  "periodSelection": "Within Period",
  "dateFilter": "01/01/25..31/01/25",
  "countryRegionFilter": "",
  "showAmountsInAddCurrency": false,
  "lineCount": 12,
  "lines": [
    {
      "lineNo": 10000,
      "rowNo": "100",
      "description": "VAT Sales 24%",
      "type": "VAT Entry Totaling",
      "amountType": "Amount",
      "genPostingType": "Sale",
      "vatBusPostingGroup": "DOMESTIC",
      "vatProdPostingGroup": "VAT24",
      "accountTotaling": "",
      "rowTotaling": "",
      "print": true,
      "printWith": "Sign",
      "newPage": false,
      "boxNo": "",
      "columnAmount": 240000.00
    }
  ]
}
```

**Villa**

```json
{
  "status": "Error",
  "error": "VAT Statement Name DEFAULT does not exist in template DEFAULT."
}
```

### Svarsreitir

| Reitur | Gerð | Lýsing |
|--------|------|--------|
| `status` | strengur | `Success` eða `Error`. |
| `templateName` / `name` | Code[10] | Endurómun beiðninnar. |
| `description` | Text[100] | Lýsing VSK-yfirlitsnafns. |
| `lineCount` | heiltala | Fjöldi VSK-yfirlitslína í svarinu. |
| `lines[]` | listi | Ein færsla á VSK-yfirlitslínu. |
| `lines[].columnAmount` | aukastafur \| false | Reiknað Column Amount. `false` fyrir `Description`-línur eða þegar `CalcLineTotal` skilar engri upphæð. |
| `lines[].printWith` | strengur | `Sign` eða `Opposite Sign`. Þegar `Opposite Sign` er `columnAmount` þegar snúið við. |

Aðrir reitir eru endurómun af samsvarandi reitum í VAT Statement Line — sjá ensku skjölun fyrir nákvæma töflu.

### Athugasemdir

- Útfærslan kallar `Report "VAT Statement".InitializeRequest` einu sinni og fer svo í gegnum `VAT Statement Line` í `Row No.` röð og kallar `CalcLineTotal` fyrir hverja línu.
- `Description`-línur sleppa útreikningi og fá `columnAmount = false`.
- Línur með `Print with = Opposite Sign` fá `columnAmount` snúið við til að passa við síðu 474.

### Tengdar Skilaboðategundir

- [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) — reiknar og bókar raunverulegt VSK-uppgjör. Sömu VSK-færslur, flokkaðar eftir bókunarflokkum í stað yfirlitslína. Sjá [VSK-uppgjörsferlið](#vsk-uppgjörsferlið) fyrir heildarferlið.
- [Data.Records.Get](/foundation/message-types/data/)

---

## VSK-uppgjörsferlið

Heildarferli sem tengir [Finance.VATStatement.Preview](#financevatstatementpreview) og [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) saman. Báðar skilaboðategundir lesa sömu `VAT Entry`-töfluna; þær eru ólíkar í því hvernig þær flokka færslurnar og hvað þær gera við niðurstöðuna.

### Hugtök

- **VAT Entry** (tafla 254): ein lína á hverja bókaða VSK-bera færslu. Inniheldur `Type` (`Purchase` / `Sale` / `Settlement`), `Posting Date`, `Base`, `Amount`, `Closed`, `Closed by Entry No.` og bókunarflokkana.
- **Opin vs. lokuð**: VSK-færsla er *opin* meðan `Closed = false`. Uppgjörið lokar opnu færslum tímabilsins og merkir `Closed by Entry No.` með númeri nýju Settlement-færslunnar.
- **VAT Statement** (töflur 256/257/258): notendaskilgreind skýrsluuppsetning sem flokkar opnar og/eða lokaðar VSK-færslur í línur. Notað fyrir VSK-skýrsluna til skattyfirvalda.
- **Uppgjörsfjárhagsreikningur**: fjárhagsreikningur sem tekur við nettó-VSK til greiðslu eða endurkröfu. Verður að vera af gerð `Posting` og óblokkaður.
- **Skýrsla 20 "Calc. and Post VAT Settlement"**: stöðluð BC-skýrsla sem framkvæmir uppgjörið. Skráir nýjar `Type=Settlement` VSK-færslur sem jafna út þær opnu, merkir opnu færslurnar sem lokaðar og skrifar samsvarandi fjárhagsfærslur.
- **Skýrsla 12 "VAT Statement"**: stöðluð BC-skýrsla sem reiknar `Column Amount` fyrir hverja línu í VSK-yfirliti. Síða 474 "VAT Statement Preview" kallar `Report 12.CalcLineTotal` fyrir hverja línu.

### Staðlað BC-vinnuferli

1. **Bóka færslur tímabilsins** — sölureikninga, innkaupareikninga o.s.frv. Hver færsla skráir eina eða fleiri `VAT Entry`-línur með `Closed = false`.
2. **Forskoða VSK-skýrsluna** með VSK-yfirlitinu. *Bifröst-jafngildi: `Finance.VATStatement.Preview`.*
3. **Forskoða uppgjörssamtölu**. *Bifröst-jafngildi: `Finance.VAT.CalcAndPostSettlement` með `post=false`.*
4. **Leysa misræmi**: ef skref 2 og 3 stemma ekki er VSK-yfirlitið rangt skilgreint — lagaðu það og endurtaktu frá skrefi 2.
5. **Bóka uppgjörið**. *Bifröst-jafngildi: `Finance.VAT.CalcAndPostSettlement` með `post=true`.*
6. **Skila VSK-skýrslunni** með `Column Amount` úr skrefi 2.
7. **Greiða eða endurkrefjast** nettófjárhæðar á uppgjörsreikningnum.

### Tvær ólíkar samantektir á sömu gögnum

| Atriði | `Finance.VATStatement.Preview` | `Finance.VAT.CalcAndPostSettlement` |
|--------|-------------------------------|------------------------------------|
| Flokkun | Per VAT Statement Line (Row No.) | Per VAT Bus. + VAT Prod. Posting Group |
| Sía | Skilgreining `VAT Statement Line` | JSON-síur á `VAT Entry` |
| Val | Open / Closed / Open and Closed | Aðeins opnar (`Closed = false`) |
| Dagsetningarsvið | `Date Filter` FlowFilter | `Posting Date` bil |
| Hliðaráhrif | Engin (skrifvarið) | Engin ef `post=false`; lokar færslum + bókar ef `post=true` |
| Undirliggjandi skýrsla | Skýrsla 12 `CalcLineTotal` per línu | Skýrsla 20 `Execute` fyrir allt uppgjörið |

### Samræmingarregla

Fyrir rétt skilgreint VSK-yfirlit er summa VSK-fjárhæðarlína `Finance.VATStatement.Preview` fyrir tímabil jöfn `totals.vatAmount` úr `Finance.VAT.CalcAndPostSettlement` fyrir sama tímabil og sömu bókunarflokka. Ef þær stemma ekki:

- VSK-yfirlitið vantar bókunarflokkasamsetningu sem er til í VSK-færslunum, eða
- Lína notar `Print with = Opposite Sign` rangt, eða
- Sía línunnar á `Account Totaling` / `Row Totaling` er röng.

### Sjálfvirkni gegn endurkeyrslu

Endurkeyrsla á árangursríku bókuðu uppgjöri fyrir sama tímabil (án nýrra bókana á milli) mistekst með `No open VAT entries match the supplied filters.` Þetta er ætluð vörn: uppgjör er aðeins leyft einu sinni á tímabili fyrir hverja síusamsetningu.

---

## Finance.Currency.AdjustExchangeRates

**Stefna**: Innlæg

**Tilgangur**: Keyrir BC `Exch. Rate Adjmt. Process` (kódaeining 699) til gengisleiðréttingar erlendra gjaldmiðla. Tveir hamir:

- `post=false` (sjálfgefið): aðeins forskoðun — fangar hermdar fjárhags-, viðskiptamanna-, lánardrottna-, starfsmanna- og bankafærslur með BC posting-preview ramma og rúllar til baka. Engar breytingar verða eftir í gagnagrunninum.
- `post=true`: keyrir leiðréttinguna inni í einangraðri `Codeunit.Run`. Svarið inniheldur nýju fjárhagsskráninguna, bil nýrra fjárhagsfærslna og sundurliðun aðlagaðra LCY-fjárhæða eftir gjaldmiðli.

### Beiðnasnið

Bifröst stikar:
```json
{
  "specversion": "1.0",
  "type": "Finance.Currency.AdjustExchangeRates",
  "source": "dynamics365/businesscentral",
  "id": "<event-guid>",
  "time": "2025-12-31T00:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "endingDate": "2025-12-31",
    "postingDate": "2025-12-31",
    "documentNo": "FX-2025-12",
    "currencyCode": "USD|EUR",
    "adjustCustomers": true,
    "adjustVendors": true,
    "adjustEmployees": false,
    "adjustBankAccounts": true,
    "adjustGLAccounts": true,
    "post": true
  }
}
```

### Beiðnastikar

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| endingDate | Date | Já | Síðasta bókunardagsetning sem tekið er tillit til. Allar opnar fjárhagsfærslur með bókunardagsetningu á eða fyrir þennan dag eru metnar. |
| postingDate | Date | Já | Bókunardagsetning fyrir leiðréttingarfærslurnar. |
| documentNo | Code[20] | Já | Skjalanúmer á leiðréttingarfærslunum. |
| post | Boolean | Nei (sjálfgefið false) | `true` til að keyra og bóka; `false` fyrir aðeins forskoðun. |
| currencyCode | Text | Nei | BC-síutjáning (t.d. `USD` eða `USD\|EUR`). Sjálfgefið allir erlendir gjaldmiðlar sem skilgreindir eru í BC. |
| adjustCustomers | Boolean | Nei (sjálfgefið true) | Leiðrétta nákvæmar viðskiptamannafærslur. |
| adjustVendors | Boolean | Nei (sjálfgefið true) | Leiðrétta nákvæmar lánardrottnafærslur. |
| adjustEmployees | Boolean | Nei (sjálfgefið true) | Leiðrétta nákvæmar starfsmannafærslur. |
| adjustBankAccounts | Boolean | Nei (sjálfgefið true) | Leiðrétta bankareikningsfærslur. |
| adjustGLAccounts | Boolean | Nei (sjálfgefið true) | Leiðrétta gjaldmiðlasöldur fjárhagsreikninga. |
| postingDescription | Text[100] | Nei | Lýsing á leiðréttingarlínunum. Sjálfgefið: `Exchange rate adjustment <currencyCode-sía-eða-tóm> <endingDate>`. |

Að minnsta kosti einn `adjust*` rofi verður að vera `true`; annars mistekst staðfesting beiðninnar.

### Bókunarhlið

Þessi skilaboðategund krefst heimildasafnsins `BIFROST GL Post ori` til viðbótar við `BIFROST API ori`. Bæði forskoðun og bókun framfylgja `Posting Gate ori` fyrir bókunartegundina `G/L`; hliðið er athugað áður en stikar eru lesnir, þannig að synjun nær aldrei inn í BC leiðréttingarvélina. Án heimildasafnsins skilar beiðnin `status=Error` með skilaboðunum `Posting denied: missing 'BIFROST GL Post ori' permission set.` — engar forskoðunarfærslur eru gerðar og engin fjárhagsskráning er stofnuð.

### Uppsetning gjaldmiðla

BC kódaeining 699 krefst nokkurra reikningsreita á hverjum gjaldmiðli sem tekur þátt í keyrslu, **þar með talið gjaldmiðlum sem síann útilokar þegar `adjustGLAccounts=true`** (G/L-jöfnunarstaðfestingin lykkjar yfir alla gjaldmiðla, ekki bara þá síuðu). Útfyllið gjaldmiðlaspjaldið fyrir fyrstu keyrslu:

| Reitur á gjaldmiðli | Notað af | Hvenær staðfest |
|---|---|---|
| `Unrealized Gains Acc.` / `Unrealized Losses Acc.` | Allar leiðréttingarfasar | Sérhver keyrsla sem endurmetur færslur í þessum gjaldmiðli |
| `Realized Gains Acc.` / `Realized Losses Acc.` | Endurmat ítarfærslna | Viðskiptamenn / lánardrottnar / starfsmenn / bankar |
| `Realized G/L Gains Account` / `Realized G/L Losses Account` (reitir 40/41) | Endurmat fjárhagsreikningasaldna | Aðeins þegar `adjustGLAccounts=true` — en staðfest á **öllum** gjaldmiðlum óháð `currencyCode` síunni |

Vantar á `Unrealized Gains Acc.` veldur `Unrealized Gains Acc. must have a value in Currency: Code=<XYZ>.` Vantar á `Realized G/L Gains Account` veldur sömu villu og er algengasti misskilningurinn — setjið `adjustGLAccounts=false` fyrir endurmat ítarfærslna eingöngu, eða útfyllið reitina 40/41 á öllum virkum gjaldmiðlum.

### Svarssnið — Bókun (post=true)

```json
{
  "status": "Success",
  "posted": true,
  "postingDate": "2025-12-31",
  "endingDate": "2025-12-31",
  "documentNo": "FX-2025-12",
  "postingDescription": "Exchange rate adjustment USD|EUR 2025-12-31",
  "currencyFilter": "USD|EUR",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": false,
  "adjustBankAccounts": true,
  "adjustGLAccounts": true,
  "lcyCode": "ISK",
  "totals": {
    "totalDebitLCY": 152034.55,
    "totalCreditLCY": 152034.55,
    "netLCY": 0.00,
    "newGLEntryCount": 18
  },
  "byCurrency": [
    {
      "currencyCode": "USD",
      "adjustedBaseLCY": 84020.10,
      "adjustedAmtLCY": 1024.55,
      "registerCount": 3
    }
  ],
  "glRegisterNo": 4321,
  "fromGLEntryNo": 98765,
  "toGLEntryNo": 98782,
  "newGLEntryCount": 18,
  "durationMs": 412
}
```

### Svarssnið — Forskoðun (post=false)

```json
{
  "status": "Success",
  "posted": false,
  "rollback": true,
  "postingDate": "2025-12-31",
  "endingDate": "2025-12-31",
  "documentNo": "FX-2025-12-PREVIEW",
  "postingDescription": "Exchange rate adjustment  2025-12-31",
  "currencyFilter": "",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": true,
  "adjustBankAccounts": true,
  "adjustGLAccounts": true,
  "lcyCode": "ISK",
  "totals": {
    "balanced": true,
    "totalDebitLCY": 152034.55,
    "totalCreditLCY": 152034.55
  },
  "preview": [
    {
      "tableId": 17,
      "tableCaption": "G/L Entry",
      "entryCount": 18,
      "entries": [ /* valdar reitir á hverja línu */ ]
    }
  ],
  "durationMs": 287
}
```

### Skýringar

- Stakar `G/L Entry` línur eru ekki innskotnar í bókunarsvarið. Notið `Data.Records.Get` á `G/L Entry` síað eftir `Entry No.` á milli `fromGLEntryNo` og `toGLEntryNo` þegar þörf er á línuupplýsingum.
- `byCurrency` sameinar Account Type og Posting Group með `CalcSums` yfir `Exch. Rate Adjmt. Reg.` (tafla 86).
- `adjustVATEntries` er **ekki** í boði. VSK-færslur eru leystar með [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement).
- Forskoðunarleiðin notar staðlaðan BC posting-preview ramma: `BindSubscription(ExchRateAdjmtProcess) + GenJnlPostPreview.SetContext + Run`. Föngnu færslurnar koma fram í gegnum `Posting Preview Event Handler` og eru varpaðar með `Preview Helper ori.AddTableToPreview`.
- Bókunarleiðin einangrar keyrsluna í `Codeunit "Curr. Adj Exch Rates Proc oriess"` svo villur sem kódaeining 699 vekur birtast sem `status=Error` án þess að ytri viðskiptin rúllist til baka.

### Villumeðhöndlun

Staðfestingarvillur skila `status=Error` og `error` reit sem lýsir bilun. Villur úr undirliggjandi leiðréttingarvél við bókun innihalda `callstack` reit til greiningar. Staðfestar aðstæður:
- Allir nauðsynlegir reitir til staðar (`endingDate`, `postingDate`, `documentNo`)
- Að minnsta kosti einn `adjust*` rofi sannur
- Bókunarhlið `G/L` veitt

Algengar vélarvillur (bæði bókunar- og forskoðunarleið skila þeim sem `status=Error`):

| Villuskilaboð | Orsök | Lausn |
|---|---|---|
| `Unrealized Gains Acc. must have a value in Currency: Code=XYZ.` | Vantar reiti 6/7/8/9 á gjaldmiðlaspjald | Útfyllið reitina Unrealized/Realized Gains/Losses Acc. á gjaldmiðlaspjaldinu |
| `Realized G/L Gains Account must have a value in Currency: Code=XYZ.` | `adjustGLAccounts=true` á gjaldmiðli án reita 40/41 | Útfyllið reitina 40/41 á öllum virkum gjaldmiðlum eða setjið `adjustGLAccounts=false` |
| `You must specify a Posting Date.` | `postingDate` vantar eða ógilt | Sendið ISO-8601 dagsetningu (`YYYY-MM-DD`) |
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallenda vantar `BIFROST GL Post ori` | Úthlutið heimildasafninu; hliðið keyrir á undan vélinni |

### Athuguð hegðun

Heildarprófun með USD + EUR á BC 27 staðbundnum (LCY = ISK, ARC = EUR), sáð með tveimur opnum dagbókarlínum (USD 50,00 / EUR 25,00, báðar jafnaðar í gegnum jöfnunarreikning), gaf samkvæmar og afturkræfar niðurstöður:

**Forskoðun (`post=false`)** — 4 hermdar fjárhagsfærslur, jafnaðar, engar gagnagrunnsbreytingar:

```json
{
  "status": "Success", "posted": false, "rollback": true,
  "currencyFilter": "USD|EUR", "lcyCode": "ISK",
  "totals": { "balanced": true, "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11 },
  "preview": [ { "tableId": 17, "tableCaption": "G/L Entry", "entryCount": 4, "entries": [ /* ... */ ] } ],
  "durationMs": 437
}
```

| Fjárhagsreikningur | Debet (LCY) | Kredit (LCY) | Lýsing |
|---|---:|---:|---|
| 2320 (USD Unrealized Gains) | 6.520,41 |  | USD endurmat ítarfærslna |
| 6700 (USD Unrealized Losses) |  | 6.520,41 | USD á móti |
| 5420 (EUR Unrealized Gains) |  | 3.244,70 | EUR endurmat ítarfærslna |
| 7250 (EUR Unrealized Losses) | 3.244,70 |  | EUR á móti |

**Bókun (`post=true`)** — sama snið, framkvæmt sem fjárhagsskráning 1119, færslur 4369–4372:

```json
{
  "status": "Success", "posted": true,
  "glRegisterNo": 1119, "fromGLEntryNo": 4369, "toGLEntryNo": 4372,
  "newGLEntryCount": 4,
  "totals": { "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11, "netLCY": 0.00, "newGLEntryCount": 4 },
  "byCurrency": [
    { "currencyCode": "USD", "adjustedBaseLCY": 0.00, "adjustedAmtLCY":  6520.41, "registerCount": 1 },
    { "currencyCode": "EUR", "adjustedBaseLCY": 0.00, "adjustedAmtLCY": -3244.70, "registerCount": 1 }
  ],
  "durationMs": 328
}
```

Athyglisvert: `adjustedBaseLCY` er `0,00` þegar undirliggjandi opnar færslur nettast nú þegar í núll LCY í upprunalega gjaldmiðlinum (algengt fyrir nýlega bókaðar jöfnunarfærslur); aðeins `adjustedAmtLCY` endurspeglar FX-mismuninn. `byCurrency` heildartölurnar samrýmast `totals.totalDebitLCY - totals.totalCreditLCY = 0` því hver gjaldmiðlaaðlögun bókar jafnað par af óinnleystum hagnaði/tapi.

### Þekktar gildrur

- **Staðfesting gjaldmiðla keyrir fyrst**: Vantar `Unrealized Gains Acc.` á **einhvern** gjaldmiðil í BC fyrirtækinu hættir keyrslu með villu áður en síann er notuð. `currencyCode` stikinn þrengir hverju er breytt, ekki hvað er staðfest.
- **`adjustGLAccounts` víkkar staðfestingarsviðið**: Að setja það `true` bætir reitum 40/41 við staðfestingu á öllum virkum gjaldmiðlum, ekki bara þeim í `currencyCode`. Notið `false` fyrir endurmat ítarfærslna eingöngu þegar reitir 40/41 eru ekki útfylltir alls staðar.
- **Forskoðun rúllar að fullu til baka**: Forskoðunarleiðin rúllar til baka inni í bókunartransaction vélarinnar; engin `Exch. Rate Adjmt. Reg.` lína, engin G/L Entry, engin ítarfærsla verður eftir. Notið frjálslega fyrir hvað-ef greiningu.
- **`byCurrency` er tómt í aðgerðalausum keyrslum**: Ef engar opnar færslur falla innan dagsetningarrammans er `byCurrency` `[]` og `newGLEntryCount` er `0`; `status` helst `Success`.
- **`durationMs` útilokar þáttun**: Það mælir aðeins innpakkaðan `Codeunit.Run` fyrir bókun eða `Run` fyrir forskoðun. Almenn skilaboða-aukakostnaður (~10–30 ms) er ekki innifalinn.

### Leiðbeiningar fyrir AI-kallenda

- Keyrið `post=false` fyrst til að skoða hermdar fjárhagsfærslur og `balanced` fánann. Hafnið keyrslu á hverri ójafnaðri eða óvæntri reikningssamsetningu.
- Þegar niðurstöður eru sýndar mennsku skal taka saman `byCurrency[]` per gjaldmiðil (`adjustedAmtLCY` er FX-mismunurinn í LCY) og tengja `glRegisterNo` á fjárhagsskráningarsíðu með `Help.Page.Get` ef smellanlegur tengill er æskilegur.
- Fyrir línuupplýsingar úr bókaðri keyrslu skal fylgja eftir með `Data.Records.Get` á `G/L Entry` síað eftir `Entry No.` á milli `fromGLEntryNo` og `toGLEntryNo`. Bókunarsvarið sleppir línulínum til að halda álagi takmörkuðu.
- Lítið á `adjustedBaseLCY = 0` sem væntanlegt fyrir stuttvarandi FCY-saldur sem eru lokuð á sama tímabili; merkið ekki sem villu.
- Ef kallið skilar `Unrealized Gains Acc. must have a value in Currency: Code=...` lagið fyrst gjaldmiðlaspjaldið — endurtekning skilaboðanna með sama gögn lukkast þegar grunngögnin eru fullkláruð.

### Tengdar skilaboðategundir

- [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) — sérstakt reglubundið uppgjör fyrir VSK-færslur.
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) / [Finance.GeneralJournal.Post](#financegeneraljournalpost) — handvirkar gjaldmiðlatengdar færslur í gegnum dagbækur.
- [Data.Records.Get](/foundation/message-types/data/) — sækja stakar `G/L Entry` línur á bilinu `fromGLEntryNo..toGLEntryNo`, eða `Exch. Rate Adjmt. Reg.` til að skoða Account Type / Posting Group sundurliðun.
