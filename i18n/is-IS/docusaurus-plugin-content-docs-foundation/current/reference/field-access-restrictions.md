---
id: field-access-restrictions
title: "Field access restrictions"
sidebar_position: 4
---

Bifröst API styður hæfnina að takmarka API-aðgang á reitastigsstigi. Reitir geta verið lokaðir
fyrir lestur, skrif eða hvort tveggja í gegnum stillingarborðið — án þess að breyta neinum AL-kóða.

---

## Takmörkunartegundir

| Tegund | Gildi | API les? | API skrifar? | Lýsing |
|---|---|---|---|---|
| Both | 0 | ✗ | ✗ | Reitur er algerlega útilokaður frá API |
| Read | 1 | ✗ | ✓ | Reitur getur verið skrifaður en er látinn þegjandi við lestur |
| Write | 2 | ✓ | ✗ | Reitur má vera lesinn en skrif eru stöðvuð með villu |
| Bypass | 3 | ✓ | ✓ | Takmörkun óvirk — reitur er aðgengilegur alla vega (notað til að undanskilja reiti úr breiðari takmarkana) |

### Hegðun við lestur (`Data.Records.Get`, `CSV.Records.Get`)

Reitir með `Read` eða `Both` tegund eru **þegjandi** slepptir frá útgangi: enginn villudagar, reiturinn
birtist einfaldlega ekki í JSON-svaritöflum. Þetta tryggir bakwardstengda samhæfni.

### Hegðun við skrif (`Data.Records.Set`)

Ef kallari reynir að skrifa í reit sem er lokaður með `Write` eða `Both` tegund, skilar API villu
með skýru skilaboði: `"Field 'FieldName' is write-restricted in table 'TableName'."` Skrifun
fer ekki fram þrátt fyrir villu — örar breytingar á öðrum reitum í sömu beiðni eru framkvæmdar
áður en villan kemur upp.

---

## Algildisreglur (wildcards)

Kerfið styður tvö algildisgildi til að setja takmarkanir á breiðum grundvelli án þess að búa til færslur fyrir hvern reit eða hverja töflu:

| Algildisgildi | Merking | Staðfestingarregla |
|---|---|---|
| **Svæðisnúmer = 0** | Allir reitir í tilgreindri töflu | Töflunúmer verður að vera gild tafla (eða 0) |
| **Töflunúmer = 0** | Allar töflur fyrir notandann | Svæðisnúmer er sjálfkrafa sett í 0 (ekki hægt að tilgreina reit án töflu) |

### Uppflettingarröð (fallback-keðja)

Þegar athugað er hvort reitur sé takmarkaður, metur kerfið færslur í þessari röð:

1. **Nákvæm færsla** — Notandi + Tafla + Reitur
2. **Allir reitir** — Notandi + Tafla + Svæðisnúmer = 0
3. **Allar töflur** — Notandi + Töflunúmer = 0 + Svæðisnúmer = 0

Fyrsta samsvörun gildir. Ef engin færsla finnst á neinu stigi er reiturinn ótakmarkaður.

### Staðfestingarreglur

- Þegar Töflunúmer er sett á 0 er Svæðisnúmer **sjálfkrafa sett á 0** og heiti reits sýnir `<Öll svæði>`
- Reynsla á að setja Svæðisnúmer á annað gildi en 0 þegar Töflunúmer = 0 skapar villu: *„Svæðisnúmer verður að vera 0 þegar töflunúmer er 0 (allar töflur)."*
- Uppfletting á svæðisnúmeri er óvirk þegar Töflunúmer = 0

### Dæmi

| Tafla | Reitur | Tegund | Áhrif |
|---|---|---|---|
| Customer (18) | Name (2) | Read | Einungis þessi reitur er lokaður frá lestur |
| Customer (18) | 0 (allir) | Write | Allir reitir í Customer eru lokaðir frá skrifum |
| 0 (allar) | 0 (allir) | Both | Allar töflur og allir reitir eru algerlega lokaðir |

---

## Uppsetning reitaðgangstakmarka

### Leið í BC

Valmynd → Þjónusta → Bifröst → **Reitaðgangstakmörk** (Field Access Restrictions)

### Útlit síðu

Stillingarsíðan sýnir þrjár dálkar:

- **Tafla** — nafn töflunnar
- **Reitur** — nafn reitsins sem takmarkaður er
- **Tegund** — `Both`, `Read`, `Write` eða `Bypass`

Auk þess er hægt að takmarkaðara notkun:

- **Notandi** — `(All Users)` eða ákveðinn nafn BC-notanda

Þegar `(All Users)` er valinn á tegund `Both`, `Read` eða `Write`, gildir takmörkun um alla API-kallara
nema þeir sem hafa sérstaka `Bypass`-færslu stillt fyrir sig.

### Bæta við takmörkun

1. Opnaðu **Reitaðgangstakmörk** síðuna.
2. Veldu eða sláðu inn heiti **Töflu** (t.d. `Customer`).
3. Veldu **Reit** í þeirri töflu (t.d. `Credit Limit (LCY)`).
4. Veldu **Tegund**: `Both`, `Read`, `Write` eða `Bypass`.
5. Valfrjálst: Veldu ákveðinn **Notanda** til að beita einungis á þann notanda.
6. Vistaðu.

**Athugið:** Þegar BC útfærsla er með Azure AD auðkenningu (service principal) er auðkennirinn
settur út sem `ENTRA/{clientId}` útlit. AAD-notendur eru ekki með BC-notendanöfn, svo notendatengdar
takmarkanir eiga aðeins við um gagnaðgenga BC-notendur, ekki API-þjónustur.

### Dæmi um notkun

**Loka lestur á viðkvæmum fjárhagsreitum:**

| Tafla | Reitur | Tegund | Notandi |
|---|---|---|---|
| Customer | Credit Limit (LCY) | Both | (All Users) |
| Customer | Balance (LCY) | Read | (All Users) |
| Customer | Balance Due (LCY) | Read | (All Users) |

**Undanskilja tiltekinn samþættingarnotanda:**

| Tafla | Reitur | Tegund | Notandi |
|---|---|---|---|
| Customer | Credit Limit (LCY) | Both | (All Users) |
| Customer | Credit Limit (LCY) | Bypass | SVC_INT_USR |

Í þessu dæmi geta allir notendur/API-þjónustur ekki lesið né skrifað `Credit Limit (LCY)`, nema
`SVC_INT_USR`-notandinn sem fær fullan aðgang.

---

## API-tilvísun

### Tafla 10077889 — Field Access ori

| Reitur nr. | Heiti reits | Tegund | Lýsing |
|---|---|---|---|
| 1 | Table No. | Integer | Töflunúmer töflunnar sem takmarkaður reitur tilheyrir |
| 2 | Field No. | Integer | Reitanúmer reitsins sem er takmarkaður |
| 3 | User Name | Code[50] | BC-notendanafn. `(All Users)` = allar keyrslur |
| 4 | Restriction Type | Enum | `Both` (0), `Read` (1), `Write` (2), `Bypass` (3) |
| 5 | Table Name | Text[250] | Heiti töflu (ritlæst, sótt sjálfkrafa) |
| 6 | Field Name | Text[250] | Heiti reits (ritlæst, sótt sjálfkrafa) |

### Kóðaeining 10077895 — Field Access ori

Þessi kóðaeining útfærir athuganarrök fyrir reitaðgangstakmörk.

**Opinberar aðferðir:**

```al
/// <summary>
/// Athugar hvort reitur sé lokaður frá lestur fyrir gefinn notanda.
/// </summary>
procedure IsReadRestricted(TableNo: Integer; FieldNo: Integer; UserName: Code[50]): Boolean

/// <summary>
/// Athugar hvort reitur sé lokaður frá skrifum fyrir gefinn notanda.
/// </summary>
procedure IsWriteRestricted(TableNo: Integer; FieldNo: Integer; UserName: Code[50]): Boolean

/// <summary>
/// Skilar lista yfir alla takmarkaða reiti í töflu fyrir gefinn notanda.
/// </summary>
procedure GetRestrictedFields(TableNo: Integer; UserName: Code[50]; var BifrostFieldAccess: Record "Field Access ori")
```

---

## Þróunarsnotkun

Reitaðgangstakmörk eru framfylgt sjálfkrafa af `Data.Records.Get` og `Data.Records.Set`
meðhöndlun skilaboðategunda. Þú þarft ekki að kalla á `Field Access ori`
kóðaeininguna beint nema þú sért að smíða eigin viðbætur ofan á Bifröst grunninn.

Ef þú vilt athuga hvort ákveðinn reitur sé lokaður í kóða:

```al
var
    BifrostFieldAccessMgt: Codeunit "Field Access ori";
begin
    if BifrostFieldAccessMgt.IsWriteRestricted(Database::Customer, 21, UserId()) then
        Error('Reitur er lokaður frá skrifum.');
end;
```

---

## Þekktar takmarkanir

- Reitaðgangstakmörk gilda **einungis** um Bifröst API-aðgerðir. Þær takmarka ekki bein BC-UI aðgerðir, REST API-kall eða önnur API-lag.
- BLOB-reitar og Media-reitar eru sjálfkrafa undanskildir Bifröst API; reitatakmörk eru ekki nauðsynleg fyrir þær tegundir.
- Þegar reitur hefur bæði `(All Users)` takmörkun og `Bypass`-færslu fyrir ákveðinn notanda, þá fær Bypass-notandinn alltaf fullan aðgang.
