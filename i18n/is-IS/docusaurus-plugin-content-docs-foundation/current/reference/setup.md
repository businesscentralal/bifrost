---
id: setup
title: "Uppsetningarviðmiðun"
sidebar_position: 3
---

## Yfirlit

Þessi síða er fyrir kerfisstjóra. Hún lýsir stillingunum á síðunni **Uppsetning Bifröst**,
samþættingar- og eyðingarskránum, uppsetningu fyrir hvern notanda og heimildasöfnunum sem þú úthlutar
notendum. Uppsetningarleiðsögnin og fyrstu skrefin eru í [Uppsetningu](/setup/) (á ensku í bili).

---

## Stillingarreitir

### 1. Tegund hámarksskuldar viðskiptamanns {#customer-credit-limit-type}

**Reitur:** `Customer Credit Limit Type` (Tegund hámarksskuldar viðskiptamanns)  
**Tegund:** Valkostur

**Tilgangur:** Ákvarðar hvernig hámarksskuld viðskiptamanns er reiknuð þegar aðstoðarmaður eða
samþætting athugar lánsstöðu viðskiptamanns.

**Möguleg gildi:**

| Gildi | Skjátexti | Lýsing |
|-------|-----------|--------|
| 0 | Sjálfgefið | Hefðbundinn útreikningur Business Central á hámarksskuld |

---

### 2. Vikmörk hámarksskuldar % {#credit-limit-tolerance}

**Reitur:** `Credit Limit Tolerance %` (Vikmörk hámarksskuldar %)  
**Tegund:** Tugabrot  
**Bil:** 0 til 100  
**Aukastafir:** 0:2

**Tilgangur:** Skilgreinir vikmörk í prósentum þegar athugað er hvort viðskiptamaður sé kominn yfir
hámarksskuld. Vikmörkin gefa svigrúm með því að leyfa hlutfallslegt bil umfram sjálfa hámarksskuldina.

**Hvernig það virkar:**

Þegar athugað er hvort viðskiptamaður sé kominn yfir hámarksskuld:

1. **Grunnútreikningur:**
   - Hámarksskuld (SGM) = hámarksskuld sem skráð er á viðskiptamanninn
   - Notuð skuld = Staða (SGM) + Útistandandi upphæð (SGM)
   - Eftirstandandi = Hámarksskuld − Notuð skuld

2. **Með vikmörkum:**
   - Vikmarkaupphæð = Hámarksskuld × (Vikmörk % ÷ 100)
   - Eftirstandandi með vikmörkum = Eftirstandandi + Vikmarkaupphæð
   - Farið yfir = (Eftirstandandi með vikmörkum &lt; 0)

**Dæmi:**

Gefið:
- Hámarksskuld viðskiptamanns: 10.000,00 SGM
- Núverandi staða: 5.000,00 SGM
- Útistandandi pantanir: 5.500,00 SGM
- Vikmörk %: 10,00%

Útreikningur:
- Notuð skuld: 5.000 + 5.500 = 10.500,00 SGM
- Eftirstandandi: 10.000 − 10.500 = **−500,00 SGM** (500 yfir)
- Vikmarkaupphæð: 10.000 × 0,10 = 1.000,00 SGM
- Eftirstandandi með vikmörkum: −500 + 1.000 = **500,00 SGM** (innan vikmarka)
- Farið yfir hámarksskuld: **nei** (því eftirstandandi með vikmörkum er yfir 0)

**Notkun:**
- Leyfa smávægilega tímabundna umframskuld hjá traustum viðskiptamönnum
- Gefa svigrúm fyrir tímamun milli pantana og greiðslna
- Fækka handvirkum inngripum í tilvikum á mörkunum
- Halda viðskiptamönnum ánægðum en stýra áhættunni samt

---

### 3. Tegund verðútreiknings vöru {#item-price-calc-type}

**Reitur:** `Item Price Calculation Type` (Tegund verðútreiknings vöru)  
**Tegund:** Valkostur

**Tilgangur:** Ákvarðar hvernig verðupplýsingar vöru eru reiknaðar þegar aðstoðarmaður eða
samþætting spyr um verð vöru.

**Möguleg gildi:**

| Gildi | Skjátexti | Lýsing |
|-------|-----------|--------|
| 0 | Sjálfgefið | Sækir verð úr verðlistum, með stuðningi við verð fyrir tiltekinn viðskiptamann |

**Hvernig sjálfgefna gildið virkar:**
- Sækir virkar söluverðlistalínur vörunnar
- Styður verðlista fyrir tiltekinn viðskiptamann og verðlista fyrir alla viðskiptamenn
- Síar eftir:
  - númeri viðskiptamanns
  - umbeðinni afhendingardagsetningu (fyrir verð sem gilda á tilteknum dögum)
  - vörunúmeri
  - afbrigðiskóða (valfrjálst)
  - lágmarksmagni
- Skilar verði í staðbundnum gjaldmiðli (SGM)
- Reiknar VSK (án VSK og með VSK)
- Styður magnþrepaverð

**Hvernig verð er valið:**

1. **Verð fyrir tiltekinn viðskiptamann:**
   - Ef númer viðskiptamanns fylgir beiðninni
   - Finnur verðlista sem tengdir eru þeim viðskiptamanni
   - Síar upphafs- og lokadagsetningar á móti umbeðinni afhendingardagsetningu
   - Tekur tillit til lágmarksmagns

2. **Verð fyrir alla viðskiptamenn:**
   - Ef ekkert verð finnst fyrir viðskiptamanninn, eða enginn viðskiptamaður er tilgreindur
   - Finnur verðlista sem gilda fyrir alla viðskiptamenn
   - Sama síun á dagsetningar og magn

3. **Verð af birgðaspjaldi:**
   - Skilar verði af birgðaspjaldinu ef ekkert annað finnst
   - Inniheldur ein.verð og kostnaðarverð vörunnar
   - Aðeins ef engar verðlistalínur finnast

---

### 4. Sjálfgefinn tungumálakóði {#default-language-code}

**Reitur:** `Default Language Code` (Sjálfgefinn tungumálakóði)  
**Tegund:** Code[10]  
**Tengist:** Language.Code  
**Gildir um:** allar skilaboðategundir sem skila texta á tilteknu tungumáli

**Tilgangur:** Tilgreinir sjálfgefið tungumál þegar unnin eru skilaboð sem skila texta á tilteknu
tungumáli (svo sem skjátextum, lýsingum og heitum reita). Reiturinn er varaleið fyrir allt kerfið
þegar `lcid` (Windows Language ID) er ekki tilgreint í Bifröst-skilaboðunum.

**Hvernig það virkar:**

Bifröst velur tungumál svars í tveimur skrefum:

1. **Fyrst: `lcid` skilaboðanna**
   - `lcid` má tilgreina á skilaboðunum sjálfum (ekki í `data`)
   - Þegar það er gefið gengur það framar sjálfgefna tungumálakóðanum

2. **Varaleið: Sjálfgefinn tungumálakóði**
   - Ef `lcid` er ekki tilgreint í skilaboðunum er sjálfgefni tungumálakóðinn notaður
   - Foundation les Windows Language ID úr tungumálafærslunni sem valin er
   - Ef reiturinn er auður er sjálfgefinn tungumálakóði fyrirtækisupplýsinga notaður, síðan **1033** (enska, Bandaríkin)

**Staðfesting:**

Reiturinn er staðfestur þegar hann er settur.

Það tryggir að:
- tungumálakóðinn sé til í töflunni Tungumál
- tungumálafærslan hafi gilt Windows Language ID
- hægt sé að sækja skjátexta á tungumálinu

**Algengir tungumálakóðar:**

| Tungumálakóði | Windows Language ID | Lýsing |
|---------------|---------------------|--------|
| ENU | 1033 | Enska, Bandaríkin |
| ISL | 1039 | Íslenska |
| DEU | 1031 | Þýska |
| FRA | 1036 | Franska |
| ESP | 1034 | Spænska |
| SVE | 1053 | Sænska |
| NOR | 1044 | Norska (bókmál) |
| DAN | 1030 | Danska |

**Dæmi:**

**Stilling:**
- Sjálfgefinn tungumálakóði: `ISL`
- Windows Language ID fyrir ISL: `1039`

**Beiðni (án lcid):**
```json
{
  "type": "Help.MessageTypes.Get",
  "data": {}
}
```

**Niðurstaða:**
- Foundation finnur sjálfgefna tungumálið → 1039
- Skjátextar koma á íslensku

**Beiðni (með lcid):**
```json
{
  "type": "Help.MessageTypes.Get",
  "lcid": 1033,
  "data": {}
}
```

**Niðurstaða:**
- `lcid` skilaboðanna er notað → 1033
- Skjátextar koma á ensku (gengur framar sjálfgefna gildinu)

Allar skilaboðategundir sem skila texta á tilteknu tungumáli virða sjálfgefna tungumálakóðann.

**Athugið:**

- Sjálfgefinn tungumálakóði er **skyldureitur** á síðunni Uppsetning Bifröst (merktur með stjörnu)
- Breyting á sjálfgefna tungumálakóðanum gildir frá næstu skilaboðum; ekki þarf að endurræsa neitt
- `Help.MessageTypes.Get` og `Help.Implementation.Get` svara líka á þessu tungumáli þegar beiðnin hefur ekkert `lcid`

---

### 5. Tegund yfirlits viðskiptamanns {#customer-statement-type}

**Reitur:** `Customer Statement Type` (Tegund yfirlits viðskiptamanns)  
**Tegund:** Valkostur

**Tilgangur:** Ákvarðar hvernig PDF-yfirlit viðskiptamanns eru búin til þegar aðstoðarmaður eða
samþætting biður um yfirlit viðskiptamanns.

**Möguleg gildi:**

| Gildi | Heiti | Lýsing |
|-------|-------|--------|
| 0 | Staðlað yfirlit | Notar skýrsluval Business Central fyrir `C.Statement` til að búa til PDF-skjalið |

**Sjálfgefið gildi:** `Staðlað yfirlit` (gildi 0) — notar skýrsluvalið sem sett er upp fyrir `C.Statement`.

---

### 6. Breytingaskrárvernd {#changelog-write-guard}

**Reitur:** `ChangeLog Write Guard` (Breytingaskrárvernd)  
**Tegund:** Valkostur  
**Gildir um:** almenn skrif færslna í Bifröst og endurheimt reitargildis úr breytingaskránni

**Tilgangur:** Stýrir því í hvaða reiti almenn skrif færslna mega skrifa. Þegar verndin er virk ber
hún hvern reit sem á að skrifa í saman við uppsetningu breytingaskrár Business Central áður en skrifað
er.

**Möguleg gildi:**

| Gildi | Skjátexti | Hegðun |
|-------|-----------|--------|
| 0 | Opið | Skrifa má í alla reiti, eins og án verndar. |
| 1 | Lokað | Aðeins má skrifa í reiti sem breytingaskráin skráir breytingar á, eða sem eru á [Undanþágum breytingaskrárverndar](/help/foundation/changelog-guard-exceptions/). Öllum öðrum er hafnað. Sjálfgefið. |
| 2 | Með þvingunarheimild | Eins og Lokað, en fram hjá takmörkuninni má fara með því að senda `"force": true` með skrifunum **og** hafa heimildasafnið `BIFROST Force ori`. |

**Staðfesting:**

Til að stilla verndina á `Lokað` eða `Með þvingunarheimild` þarf breytingaskrá Business Central að
vera virk.

**Að nota `force` (aðeins með þvingunarheimild):** kallandinn sendir `"force": true` með skrifunum.
Án heimildasafnsins `BIFROST Force ori` er skrifunum hafnað, jafnvel með `force: true`.

**Að athuga hvort breytingaskráin nái yfir reit:** aðstoðarmaður getur athugað fyrir fram hvort
breytingaskráin nái yfir reit. Ef hún gerir það ekki og verndin er `Lokað` eða
`Með þvingunarheimild` er skrifunum hafnað nema `force: true` sé notað (aðeins með
þvingunarheimild).

---

### 7. Tegund heitis fyrirtækis í útflutningi {#export-company-name-type}

**Reitur:** `Export Company Name Type` (Tegund heitis fyrirtækis í útflutningi)  
**Tegund:** Valkostur  
**Gildir um:** CSV-útflutning færslna og eyddra færslna

**Tilgangur:** Velur hvaða heiti fyrirtækis er skrifað í dálkinn `$Company` í CSV-útflutningi. Valið
gildir um báða CSV-útflutningana, og allar línur eins útflutnings bera sama gildi.

**Möguleg gildi:**

| Gildi | Skjátexti | Hegðun |
|-------|-----------|--------|
| 0 | Heiti fyrirtækis | Tæknilegt heiti fyrirtækisins. Sjálfgefið. Breytist ekki þótt birtingarheitinu sé breytt. |
| 1 | Birtingarheiti fyrirtækis | Birtingarheiti fyrirtækisins. Ef birtingarheitið er autt er tæknilega heitið notað, svo dálkurinn `$Company` er aldrei auður. |

**Hvenær hvort gildi á við:**

- **Heiti fyrirtækis** — móttökukerfi sem nota fyrirtækið sem auðkenni (skipting í gagnavatni,
  lendingarsvæði Open Mirroring, bc2adls). Breyting á birtingarheiti má ekki breyta
  skiptingarlyklinum.
- **Birtingarheiti fyrirtækis** — CSV-skrár sem fólk les (rekstrarskýrslur, tilfallandi greiningar).
  Birtingarheitið er læsilegra og er það sem notendur sjá í Business Central.

---

## Bifröst samþætting

**Tafla:** `Integration ori`  
**Síða:** **Bifröst samþætting**  
**Aðgangur:** Uppsetning Bifröst → Skilaboð → Bifröst samþætting

### Tilgangur

Bifröst samþætting er rekstrarskrá yfir atburði. Hver færsla tilgreinir:
- **Uppruna** (`Source`): ytra kerfið eða forritið sem atburðurinn kom frá
- **Töflukenni** (`Table Id`): töfluna í Business Central sem atburðurinn varðar
- **Töfluheiti** (`Table Name`): heiti töflunnar, flett upp sjálfkrafa
- **Dags. og tíma** (`Date & Time`): nákvæma dagsetningu og tíma atburðarins
- **Bakfært** (`Reversed`): hvort færslan var búin til fyrir mistök og síðan bakfærð

Aðallykill töflunnar er `Source + Table Id + Date & Time`, svo hver samsetning uppruna, töflu og tíma
er einstök.

### Reitir

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `Source` | Text[250] | Auðkenni ytra kerfisins eða forritsins. Skylt. |
| `Table Id` | Integer | Kenni töflunnar í Business Central. |
| `Table Name` | Text[30] | Reiknað heiti töflunnar. Skrifvarið. |
| `Date & Time` | DateTime | Tími atburðarins. Skylt. |
| `Reversed` | Boolean | Merkir færslu sem bakfærða (búin til fyrir mistök). |

### Aðgangur í gegnum API

Færslur í þessari töflu má lesa og skrifa með almennum lestri og skrifum færslna í Bifröst, og flytja
út sem CSV-skrá fyrir Open Mirroring.

### Varðveislureglur

Taflan Bifröst samþætting er skráð í varðveislureglur Business Central. Kerfisstjórar geta látið eyða
gömlum færslum sjálfkrafa undir **Stjórnun → Gagnastjórnun → Varðveislureglur**.

---

## Eyðingarskrá

### Uppsetning eyðingarskráningar

**Tafla:** `Delete Setup ori`  
**Síða:** **Uppsetning eyðingarskráningar**  
**Aðgangur:** Leit → Uppsetning eyðingarskráningar

Uppsetning eyðingarskráningar stýrir því hvaða töflum í Business Central eyðingar eru skráðar úr í
eyðingarskrána. Hver lína skráir eina töflu. Þegar færslu í þeirri töflu er eytt er eyðingin skráð
sjálfkrafa.

#### Reitir

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `Table Id` | Integer | Taflan sem fylgst er með. Skylt. |
| `Table Name` | Text[250] | Skjátexti töflunnar, flett upp sjálfkrafa. Skrifvarið. |
| `Store Record` (Vista færslu) | Boolean | Ef hakað er við er öll færslan vistuð sem JSON þegar henni er eytt. |

Breyting á uppsetningu eyðingarskráningar gildir frá næstu eyðingu; ekki þarf að endurræsa neitt.

### Eyðingarskrá

**Tafla:** `Delete Log ori`  
**Síða:** **Bifröst eyðingaskrá**  
**Aðgangur:** Leit → Bifröst eyðingaskrá

Eyðingarskráin er skrifvarin endurskoðunarslóð. Ein færsla verður til fyrir hverja færslu sem eytt er
úr töflu sem fylgst er með.

#### Reitir

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `Entry No.` | Integer | Raðnúmer, aðallykill. |
| `Table Id` | Integer | Kenni töflunnar sem eydda færslan tilheyrði. |
| `Table Name` | Text[250] | Skjátexti töflunnar, flett upp sjálfkrafa. Skrifvarið. |
| `Record System Id` | Guid | SystemId eyddu færslunnar. |
| `Json Data` | Blob | Öll færslan sem JSON (aðeins fyllt þegar hakað er við `Store Record` í uppsetningunni). |
| `Deleted At` | DateTime | Tími eyðingarinnar. |
| `User ID` | Code[50] | Notandinn sem eyddi færslunni. |

#### Aðgerðir á síðunni

- **Flytja út JSON** — sækir vistuðu JSON-færsluna sem `{TableName}-{SystemId}.json`. Aðeins virkt
  þegar `Json Data` hefur gildi.

#### Varðveislureglur

Eyðingarskráin er skráð í varðveislureglur Business Central. Kerfisstjórar geta látið eyða gömlum
færslum sjálfkrafa undir **Stjórnun → Gagnastjórnun → Varðveislureglur**, með reitinn `Deleted At`
sem viðmiðunardagsetningu.

#### Aðgangur í gegnum API

Færslur eyðingarskrárinnar má lesa með almennum lestri færslna í Bifröst og flytja út sem CSV.

---

## Notandauppsetning

**Tafla:** `User Setup ori`  
**Síða:** **Bifröst notandauppsetning**  
**Spjald:** **Ritill notandauppsetningar**  
**Aðgangur:** Leit → Bifröst notandauppsetning (flokkur: Stjórnun)

### Tilgangur

Uppsetning fyrir hvern notanda í Bifröst. Hver færsla geymir kerfisleiðbeiningar og valfrjálsar
tengingar við færslur sem fara í notandasniðið sem aðstoðarmaður les um kallandann.
Kerfisleiðbeiningarnar gera gervigreindarkerfum kleift að laga hegðun sína að hverjum notanda.
Valfrjálsu tengireitirnir (forði, sölumaður, starfsmaður, fjárhagsreikningur, viðskiptamaður,
lánardrottinn, tengiliður) ganga framar sjálfgefnu uppflettingunni, svo kerfisstjórar geta sjálfir
ráðið hvaða færslur birtast í notandasniðinu.

### Reitir

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `User Security ID` | Guid | Aðallykill. Tengist töflunni `User`. |
| `User Name` | Code[50] | Notandanafn (flett upp í `User`). |
| `System Prompt` (Kerfisleiðbeiningar) | Blob | Texti leiðbeininganna, vistaður sem UTF-8. |
| `G/L Account No.` | Code[20] | Valfrjálst. Fjárhagsreikningur fyrir hlutann `dueFromToOwner` í notandasniðinu. |
| `Employee No.` | Code[20] | Valfrjálst. Gengur framar hlutunum `employee` og `manager` í notandasniðinu (sleppir uppflettingu frá forða til starfsmanns). |
| `Customer No.` | Code[20] | Valfrjálst. Viðskiptamaður fyrir hlutann `customer` í notandasniðinu. |
| `Vendor No.` | Code[20] | Valfrjálst. Lánardrottinn fyrir hlutann `vendor` í notandasniðinu. |
| `Resource No.` | Code[20] | Valfrjálst. Gengur framar hlutanum `resource` í notandasniðinu (sleppir uppflettingu eftir eiganda tímablaðs). |
| `Salesperson Code` | Code[20] | Valfrjálst. Gengur framar hlutanum `salesperson` í notandasniðinu (sleppir uppflettingu í notandauppsetningu). |
| `Contact No.` | Code[20] | Valfrjálst. Tengiliður fyrir hlutann `contact` í notandasniðinu. |
| `Location Code` | Code[10] | Valfrjálst. Frátekið til síðari nota. |

### Aðgangsstýring

Síðan stýrir aðgangi í lögum:

1. **Sjálfvirk stofnun:** þegar síðan er opnuð er færsla stofnuð fyrir núverandi notanda ef hún er
   ekki til.
2. **Sjálfsafgreiðsla:** notendur án fullra heimilda á töflunni sjá og breyta aðeins eigin
   leiðbeiningum.
3. **Kerfisstjórar:** notendur með fullar heimildir á gögnum töflunnar (RMID) sjá og breyta
   leiðbeiningum allra notenda.

### Ritillinn

Ritill notandauppsetningar býður upp á fjöllínu textareit. Þegar vistað er eru `<div>`-merki fjarlægð
áður en leiðbeiningarnar eru geymdar.

---

## Heimildasöfn

Bifröst Foundation kemur með nokkur heimildasöfn sem stýra aðgangi að tilteknum eiginleikum. Þeim er
úthlutað notendum og Entra-forritum á hefðbundnu síðunni **Heimildasöfn**.

### BIFROST ApprAdm ori

**Heiti:** `BIFROST ApprAdm ori`  
**Úthlutanlegt:** Já

**Tilgangur:** Stýrir því hvaða notendur mega senda skjöl til samþykktar í gegnum Bifröst. Notandi sem
hefur ekki þetta heimildasafn fær villusvar þegar aðstoðarmaður eða samþætting reynir að senda skjal
til samþykktar.

**Villa þegar það vantar:**

```
User <UserSecurityId> does not have permissions to send documents to approval via Bifrost.
```

### BIFROST Force ori

**Tilgangur:** Þarf til að fara fram hjá breytingaskrárverndinni með `"force": true` í almennum
skrifum færslna þegar verndin er stillt á **Með þvingunarheimild**. Sjá
[Breytingaskrárvernd](#changelog-write-guard).

### Bókunarhlið (Bifrost G/L / Item / FA / Job / Resource Posting) {#posting-gates-bifrost-gl--item--fa--job--resource-posting}

Hver skilaboðategund sem bókar eða bakfærir færslur í höfuðbækur er varin með heimildasafni fyrir
sitt svið. Notandi sem hefur ekki viðeigandi heimildasafn fær villusvar og ekkert annað gerist:

```
Posting denied: missing '<permission set name>' permission set.
```

Heimildasöfnin fimm eru sjálfstæð og **eru ekki innifalin í `BIFROST Read ori` eða
`BIFROST Full ori`**; þeim þarf að úthluta sérstaklega.

| Heimildasafn | Hvað það leyfir |
|---|---|
| `BIFROST GL Post ori` | Bókun almennra færslubóka og bakfærslu bókunarskráa og færslna, bókun bankaafstemminga og VSK-uppgjörs, bókun og bakfærslu jöfnunar viðskiptamanna og lánardrottna, bókun sölu- og innkaupaskjala |
| `BIFROST ItemPost ori` | Bókun birgðafærslubóka, millifærslupantana og samsetningarpantana |
| `BIFROST FA Post ori` | Bókun eignafærslubóka |
| `BIFROST Job Post ori` | Bókun verkfærslubóka |
| `BIFROST Res Post ori` | Bókun forðafærslubóka |

**Athugið:** Bókun sölu- og innkaupaskjala er aðeins varin með **G/L**-heimildasafninu, þótt hún geti
í framhaldinu búið til birgðafærslur og aðrar færslur. Hliðið stendur fyrir ásetning notandans um að
bóka, ekki færslurnar sem Business Central skrifar á endanum.

---

## Tengd skjöl

- **[API-viðmiðun](/foundation/reference/api/)**: API-endapunktar, skilaboðaumslagið og form svara
- **[Aðgangur að svæðum](/foundation/reference/field-access-restrictions/)**: takmarkanir á því hvaða reiti má lesa og skrifa
