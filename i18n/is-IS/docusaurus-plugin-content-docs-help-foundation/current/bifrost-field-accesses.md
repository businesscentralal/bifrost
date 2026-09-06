---
id: bifrost-field-accesses
title: "Bifröst svæðisaðgangar"
sidebar_label: "Bifröst svæðisaðgangar"
sidebar_position: 6
---

Síðan **Bifröst svæðisaðgangar** gerir kerfisstjórum kleift að skilgreina aðgangstakmarkanir á svæðastigi fyrir einstaka notendur og Entra ID (AAD) forrit. Þessar takmarkanir stjórna því hvaða svæði er hægt að lesa eða skrifa í gegnum Bifröst API (`Data.Records.Get` og `Data.Records.Set` skilaboðagerðir).

Takmarkanir eru notanda- og svæðissértækar og veita nákvæma gagnavernd án þess að breyta fyrirliggjandi hlutverkaheimildum. Aðeins svæði með skráðar takmarkanir verða fyrir áhrifum – öll önnur svæði haga sér eðlilega.

## Uppbygging síðu

### Notandasía

Efst á síðunni er síureitur fyrir **Notandanafn**. Veldu notandann eða forritið sem á að skoða eða stjórna takmörkunum fyrir. Listinn fyrir neðan er þá síaður til að sýna aðeins takmarkanir þess notanda. Notaðu uppflettingartakkann (…) til að finna tiltæka notendur og forrit. Þegar enginn notandi er valinn er takmarkanalisti aðeins lesanlegur.

### Takmarkanalisti

Sýnir allar svæðistakmarkanir sem eru skilgreindar fyrir valinn notanda. Hver lína auðkennir eitt takmarkað svæði á tiltekinni töflu og skilgreinir hvaða tegund aðgangs er lokuð.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Notandanafn** | Nafn notandans eða Entra ID forritsins sem verið er að stjórna takmörkunum fyrir. Notaðu uppflettinguna til að velja annan notanda eða forrit. |
| **Töflunúmer** | Númer Business Central töflunnar sem takmarkanin á við um. Notaðu uppflettinguna til að finna allar tiltækar töflur. |
| **Töfluheiti** | Heiti töflunnar (lesaðeins, fyllt út sjálfkrafa út frá töflunúmerinu). |
| **Svæðisnúmer** | Númer svæðisins innan töflunnar. Notaðu uppflettinguna til að finna tiltæk svæði fyrir valda töflu. |
| **Svæðisheiti** | Heiti svæðisins (lesaðeins, fyllt út sjálfkrafa út frá svæðisnúmerinu). |
| **Tegund takmarkana** | Tilgreinir hvaða tegund aðgangs er takmörkuð:
-   **Bæði** – Svæðið er útilokað úr lesvörum og er ekki hægt að breyta því. Strangar takmarkanir.
-   **Lesa** – Svæðið er útilokað úr svörum `Data.Records.Get` en er enn hægt að breyta með `Data.Records.Set`.
-   **Skrifa** – Svæðið kemur fram í lesvörum en er ekki hægt að breyta með `Data.Records.Set`.
-   **Framhjá** – Svæðið er undanskilið öllum takmörkunarprófunum. ChangeLog Write Guard leyfir skrif á þetta svæði án tillits til Breytingaskrárdekkunar. Þessi færsla lokar ekki fyrir lese- eða skrifaheimildir; hún hefur einvörðungu áhrif á mat Write Guard.

 |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Eyða öllu fyrir notanda** | Fjarlægir allar svæðisaðgangstakmarkanir fyrir valinn notanda. Staðfestingarglugginn birtist áður en haldið er áfram. |
| **Eyða öllu fyrir töflu** | Fjarlægir allar svæðisaðgangstakmarkanir sem gilda um töflu valinnar línu. Staðfestingarglugginn birtist áður en haldið er áfram. |

## Hvernig bæti ég við takmörkun

1.  Veldu notanda eða forrit með uppflettinguna á **Notandanafni** efst á síðunni.
2.  Smelltu á **Nýtt** (eða ýttu á F3) til að bæta við nýrri línu í takmarkanalistann.
3.  Sláðu inn eða flettu upp **Töflunúmer** til að auðkenna töfluna með svæðið.
4.  Sláðu inn eða flettu upp **Svæðisnúmer** til að auðkenna tiltekið svæði í þeirri töflu.
5.  Veldu viðeigandi **Tegund takmarkana**: _Bæði_, _Lesa_, _Skrifa_ eða _Framhjá_. Notaðu _Framhjá_ til að leyfa Write Guard að leyfa skrif á þetta svæði jafnvel án Breytingaskrárdekkunar.
6.  Færslan er vistuð sjálfkrafa þegar þú ferð á næstu línu eða lokar síðunni.

## Ábendingar

-   Takmarkanalisti er aðeins breytanlegur þegar notandi eða forrit er valið í síunum efst á síðunni.
-   Takmörkun er auðþekkjanleg með samsetningu notanda, töflunúmers og svæðisnúmers – tvíteknar færslur eru ekki leyfðar.
-   Takmarkanir taka gildi strax fyrir síðari API-köll; enginn endurræsing er nauðsynleg.
-   Þessar takmarkanir gilda aðeins um Bifröst API og hafa ekki áhrif á hefðbundið Business Central viðmótsaðgengi eða heimildarhlutverkahópa.
-   Svæði án takmarkanafærslna haga sér eðlilega og eru aðgengileg í gegnum API.
