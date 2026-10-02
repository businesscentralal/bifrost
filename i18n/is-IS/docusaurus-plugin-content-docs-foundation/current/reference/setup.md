---
id: setup
title: "Setup reference"
sidebar_position: 3
---

## Yfirlit

Bifröst uppsetningin veitir miðlæga stillingu fyrir val á útfærslustefnu fyrir ýmsar aðgerðir Foundation. Þetta skjal útskýrir hvernig á að stilla uppsetningartöfluna, velja útfærslur í gegnum enum-tæki og skilja viðmót-byggt skipulag.

**Nafnrými:** `Origo.Bifrost`  
**Uppsetningartafla:** `Setup ori`  
**Uppsetningarsíða:** `Setup ori` (**Uppsetning Bifröst**)

---

## Uppsetningarskipulag

Bifröst-endingurinn notar **viðmótsmiðað skipulag** þar sem:

1. **Viðmót** skilgreina samninga sem útfærslur verða að fylgja
2. **Enum-tæki** bjóða upp á valmöguleika sem útfæra tiltekin viðmót
3. **Uppsetningartafla** geymir valdar enum-gildi fyrir hvert eiginleikasvæði
4. **Aðgerðir Foundation** sækja valið viðmót úr uppsetningunni

Þetta hönnunarform leyfir:
- **Stækkunarhæfni**: Bættu við nýjum útfærslum með því að framlengja enum-tækið
- **Sveigjanleika**: Skipta um útfærslur án kóðabreytinga
- **Aðskilnað áhyggna**: Viðskiptaleg rök eru óháð útfærsluvalinu

---

## Stillireitar

### 1. Lánstraustateynd viðskiptavinar {#lnstraustateynd-viskiptavinar}

**Reitur:** `Customer Credit Limit Type`  
**Tegund:** Enum `Customer Credit Limit Type ori`  
**Viðmót:** `Customer Credit Limit ori`

**Tilgangur:** Ákvarðar hvernig lánstraustaútreikningur viðskiptavinar er framkvæmdur.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Lýsing |
|---|---|---|
| 0 | Default | Staðlaður BC lánstraustaútreikningur |

**Stækkunarhæfni:**
```al
enumextension 50100 "My Credit Limit Type" extends "Customer Credit Limit Type ori"
{
    value(50100; "Enhanced Credit Check")
    {
        Caption = 'Enhanced Credit Check';
        Implementation = "Customer Credit Limit ori" = "My Credit Limit Impl";
    }
}
```

---

### 2. Þolinmæðihlutfall lánstraustmarks {#olinmihlutfall-lnstraustmarks}

**Reitur:** `Credit Limit Tolerance %`  
**Tegund:** Decimal  
**Svið:** 0 til 100  

**Tilgangur:** Skilgreinir þolinmæðihlutfall við athugun á hvort lánstraustamark sé farið yfir. Þetta gildi bætir við sveigjanleika í lánstraustaframfylgni með því að leyfa hlutfallslegan búfa yfir lánstraustamarkið.

**Hvernig það virkar:**

1. **Grunnútreikningur:**
   - Notað lán = Staða (SGM) + Útistandandi upphæð (SGM)
   - Eftirstandandi lán = Lánstraustamark − Notað lán

2. **Með þolinmæði:**
   - Þolinmæðiupphæð = Lánstraustamark × (Þolinmæðihlutfall ÷ 100)
   - Eftirstandandi lán með þolinmæði = Eftirstandandi lán + Þolinmæðiupphæð
   - Er farið yfir = (Eftirstandandi með þolinmæði &lt; 0)

---

### 3. Vöruverðútreikningartegund {#vruvertreikningartegund}

**Reitur:** `Item Price Calc. Type`  
**Tegund:** Enum `Item Price Calc. Type ori`  
**Viðmót:** `Item Price Calculation ori`

**Tilgangur:** Ákvarðar hvernig verðupplýsingar vöru eru sóttar.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Lýsing |
|---|---|---|
| 0 | Default | Staðlað verðlistasæki með stuðningi við viðskiptavin-sértækt verð |

**Verðvalrök (Priority order):**

1. Viðskiptavin-sértækt verð (ef viðskiptamaður er gefinn)
2. Almennt verð (allir viðskiptavinir)
3. Verð af birgðarspjaldi (ef engar verðlistalínur finnast)

---

### 4. Sjálfgefinn tungumálakóði {#sjlfgefinn-tungumlaki}

**Reitur:** `Default Language Code`  
**Tegund:** Code[10]  
**Gildir um:** allar skilaboðategundir sem skila tungumálstengdum birtiheitum

**Tilgangur:** Tilgreinir sjálfgefið tungumál þegar `lcid` er ekki tilgreint í Bifröst skilaboðum.

**Tvær-stigsaðferð:**

1. **Aðalleiðin: lcid í Bifröst skilaboðum**
   - `lcid` reiturinn er tilgreindur á skilaboðastigi (ekki í data)
   - Þegar gefið, hefur forgang yfir Default Language Code

2. **Varamöguleiki: Default Language Code**
   - Notaður þegar `lcid` er ekki tilgreint í skilaboðum
   - Ef ekki stilltur eða Language-færsla finnst ekki, er sjálfgefið **1033** (Enska — Bandaríkin)

**Algengir tungumálakóðar:**

| Tungumálakóði | Windows Language ID | Lýsing |
|---|---|---|
| ENU | 1033 | Enska — Bandaríkin |
| ISL | 1039 | Íslenska |
| DEU | 1031 | Þýska |
| FRA | 1036 | Franska |
| ESP | 1034 | Spænska |
| SVE | 1053 | Sænska |
| NOR | 1044 | Norska |
| DAN | 1030 | Danska |

**Dæmi um notkun:**

*Beiðni án lcid → Default Language Code notað:*
```json
{ "type": "Help.MessageTypes.Get", "data": {} }
```

*Beiðni með lcid → Þetta þriggur yfir Default Language Code:*
```json
{ "type": "Help.MessageTypes.Get", "lcid": 1033, "data": {} }
```

---

### 5. Reikningstegundarúlfur viðskiptavinar {#reikningstegundarlfur-viskiptavinar}

**Reitur:** `Customer Statement Type`  
**Tegund:** Enum `Customer Statement Type ori`  
**Viðmót:** `Customer Statement ori`

**Tilgangur:** Ákvarðar hvaða útfærsla er notuð til að búa til PDF-reikninga viðskiptavinar.

**Tiltæk útfærslur:**

| Gildi | Heiti | Lýsing |
|---|---|---|
| 0 | Standard Statement | Notar BC skýrsluval fyrir C.Statement |

**Sjálfgefið gildi:** `Standard Statement` (gildi 0).

---

### 6. ChangeLog-skrifjörn {#changelog-skrifjrn}

**Reitur:** `ChangeLog Write Guard`  
**Tegund:** Enum `ChangeLog Write Guard Type ori`  
**Viðmót:** `ChangeLog Write Guard ori`  
**Gildir um:** almenn skrif færslna í Bifröst og endurheimt reitargildis úr breytingaskránni

**Tilgangur:** Stýrir hvaða reiti almenn skrif færslna mega skrifa í. Þegar virk, kannast verndin hvert markreit á móti BC Change Log uppsetningunni áður en skrif er framkvæmt.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Hegðun |
|---|---|---|
| 0 | Open | Allir reitir mega skrifaðir — sama og hegðun án verndar. Sjálfgefið. |
| 1 | Blocked | Aðeins reitir með Change Log Modification-rakningu mega skrifaðir. Allir aðrir hafnaðir. |
| 2 | Via force | Sama og Blocked nema hægt er að fara framhjá með því að senda `"force": true` með skrifunum **og** hafa `BIFROST Force ori` heimildarsett. |

**Nota `force` sniðgang (aðeins Via force stillingu):** kallandinn sendir `"force": true` með skrifunum.

**Athugasemdir:**

- Breyting á verndinni í `Blocked` eða `Via force` krefst þess að BC Change Log eiginleikinn sé virkur
- Gervigreindarþjónn getur athugað fyrir fram hvort breytingaskráin nái yfir reitinn
- Án `BIFROST Force ori` heimildarsetts er beiðninni hafnað jafnvel með `force: true`

---
### 7. Tegund útflutnings á heiti fyrirtækis {#tegund-tflutnings-heiti-fyrirtkis}

**Reitur:** `Export Company Name Type`  
**Tegund:** Enum `Company Name Type ori`  
**Viðmót:** `Company Name ori`  
**Gildir um:** CSV-útflutning færslna og eyddra færslna

**Tilgangur:** Velur hvaða heiti fyrirtækis er skrifað í `$Company` dálkinn í CSV-útflutningum. Reiturinn stýrir einum, kerfisúkekkilegum vali sem báðir CSV-útflutningar leysa einu sinni á beiðni (svo allar línur í sama útflutningi nota sama gildi).

**Tiltæk gildi:**

| Gildi | Birtiheiti | Hegðun |
|---|---|---|
| 0 | Heiti fyrirtækis | Skilar `CompanyName()` (tæknilegt `Company.Name`). Sjálfgefið. Stöðugt þótt birtingarheitið sé endurnefnt. |
| 1 | Birtingarheiti fyrirtækis | Skilar `Company."Display Name"`. Þegar birtingarheitið er autt fellur það til baka á `CompanyName()` svo `$Company` dálkurinn er aldrei autður. |

**Hvenær á að nota hvert gildi:**

- **Heiti fyrirtækis** — móttökukerfi sem nota heitið sem auðkenni (skipting í gagnavatni, Open Mirroring lendingarsvæði, bc2adls). Endurnefningar á birtingarheiti mega ekki breyta skiptingarlykli.
- **Birtingarheiti fyrirtækis** — CSV-notendur sem eru manneskjur (rekstrarskýrslur, könnun). Birtingarheiti er notendavænna og samsvarar því sem sjást í BC.

**Lausn:** CSV-útflutningur sækir heiti fyrirtækis einu sinni á beiðni og endurnotar gildið fyrir hverja línu í `$Company` dálknum.

**Stækkanleiki:**

```al
enumextension 50104 "My Company Name Type" extends "Company Name Type ori"
{
    value(50100; "Legal Name")
    {
        Caption = 'Legal Name';
        Implementation = "Company Name ori" = "My Legal Name Impl";
    }
}
```

---
## Uppsetningaraðgerðir

### GetRecordOnce()

**Tilgangur:** Tryggir að uppsetningarfærslan sé aðeins hlaðin einu sinni á hverja færslu.

**Hegðun:**
- Kannar hvort færslan hafi þegar verið lesin í þessari keyrslu
- Ef ekki, reynir að sækja færsluna
- Ef færsla er ekki til, stofnar hana með sjálfgefnum gildum
- Stillir `RecordHasBeenRead` fána til að koma í veg fyrir endurteknar lesningar

**Notkun:**
```al
BifrostSetup.GetRecordOnce();
```

---

### InsertIfNotExists()

**Tilgangur:** Stofnar uppsetningarfærslu ef hún er ekki til.

**Notkun:**
```al
BifrostSetup.InsertIfNotExists();
```

---

## Heimildarsett

Bifröst viðbótin inniheldur nokkur heimildarsett sem stýra aðgangi að ákveðnum eiginleikum.

### BIFROST ApprAdm ori

**Heiti:** `BIFROST ApprAdm ori`  
**Úthlutanlegt:** Já

**Tilgangur:** Stýrir hvaða notendur mega senda skjöl til samþykktar í gegnum Bifröst. Notandi sem er ekki með þetta heimildarsett fær villusvar þegar gervigreindarþjónn eða samþætting reynir að senda skjal til samþykktar.

**Villa þegar vantar:**

```
User <UserSecurityId> does not have permissions to send documents to approval via Bifrost.
```

**Úthlutun:** Úthlutið í gegnum venjulega BC **Heimildarsett** síðu eða í gegnum notendaflokk.

### BIFROST Force ori

**Tilgangur:** Nauðsynlegt til að fara framhjá ChangeLog Write Guard þegar `"force": true` er notað í almennum skrifum færslna þar sem verndin er stillt á **Via force**. Sjá [ChangeLog Write Guard](#changelog-skrifjrn) fyrir nánari upplýsingar.

### Bókunarhlið (Bifröst G/L / Item / FA / Job / Resource Posting)

Allar skilaboðategundir sem bóka eða bakfæra færslur í höfuðbækur eru með hlið per bókunarsviði. Notandi sem ekki hefur viðeigandi heimildarsett fær villuskil án nokkurra hliðaráhrifa:

```
Bókun hafnað: vantar '<heiti heimildasamstæðu>' heimildasamstæðu.
```

Heimildarsettin fimm eru sjálfstæð og **eru ekki innifalin í `BIFROST Read ori` eða `BIFROST Full ori`** — þeim verður að úthluta sérstaklega.

| Heimildarsett | Hvað það leyfir |
|---|---|
| `BIFROST GL Post ori` | Bókun færslubóka og bakfærslu skráa og færslna, bókun bankaafstemminga og VSK-uppgjörs, bókun og bakfærslu jöfnunar viðskiptamanna og lánardrottna, bókun sölu- og innkaupaskjala |
| `BIFROST ItemPost ori` | Bókun birgðabóka, millifærslupantana og samsetningarpantana |
| `BIFROST FA Post ori` | Bókun eignabóka |
| `BIFROST Job Post ori` | Bókun verkbóka |
| `BIFROST Res Post ori` | Bókun forðabóka |

**Athugið:** Bókun sölu- og innkaupaskjala er gætt af **G/L eingöngu** þrátt fyrir að hún geti búið til vöru- og aðrar færslur í framhaldinu. Hliðið endurspeglar áform notandans um að ræsa bókun, ekki færslurnar sem BC skrifar að lokum.

---

## Tengd skjöl

- **[API_Reference.md](/foundation/reference/api/)**: API-endapunktar og auðkenning

