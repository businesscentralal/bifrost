---
id: administrators
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /end-customers/administrators
title: "Rekstur Bifröst"
description: "Fyrir kerfisstjóra Business Central: heimildir, hvað fulltrúar mega sjá, notendur, annálar og varðveisla, leyndarmál, stillingarnar, notkun, og það sem þú berð ábyrgð á."
---

# Rekstur Bifröst: fyrir kerfisstjóra

[Settu það upp](/setup/) fer í gegnum fyrstu uppsetninguna. Þessi síða segir hvað á að vega þegar þú tekur þær ákvarðanir,
og hverju á að fylgjast með eftir það. Allt hér er á **Uppsetningu Bifröst** og krefst `BIFROST Full ori`; leyfisaðgerðir
krefjast líka `BIFROST LicAdm ori`. Hverri Bifröst-síðu í Business Central er lýst í hjálpinni í forritinu.

## Heimildir {#permissions}

Gervigreindarfulltrúi getur í mesta lagi gert það sem auðkennið sem hann keyrir sem getur gert í Business Central, og oft
minna. Bifröst gefur kallanda aldrei meira en Business Central leyfir þegar, og reitaaðgangur, breytingaskrárverndin og
bókunarheimildasamstæðurnar geta þrengt það enn frekar.

import PermissionLayers from '@site/src/components/PermissionLayers';

<PermissionLayers />

- **Hafðu hvert auðkenni eins þröngt og starfið krefst.** Gefðu hverju trausti sitt eigið auðkenni: notandi eða forrit sem
  má aðeins lesa getur ekki bókað, hvernig sem hann er beðinn.
- **Allar samstæðurnar, og hvernig hliðin virka,** eru í [Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

## Notendur og fulltrúar {#users-and-agents}

**Uppsetning › Uppsetning notenda** telur upp hvern notanda Bifröst í fyrirtækinu. Opnaðu notanda til að stilla:

- **Tegund samþykktar:** hvort samþykkja þurfi nýjan fulltrúa eða verkfæri einu sinni áður en það getur starfað fyrir
  notandann (sjá [Ákveddu hvaða verkfæri mega starfa fyrir notanda](/setup/business-central/#decide-which-tools-may-act-for-a-user)).
- **Mánaðarlegur skilaboðakvóti notanda:** mánaðarleg mörk notandans.
- **Gjaldfærslutegund** (aðeins til lestrar): hvernig skilaboð notandans eru talin. **User** fyrir fólk,
  **App Registration** fyrir samþættingar.

![Uppsetning notenda Bifröst](/img/guides/is-is/user-setup.png)

## Hvað fulltrúar mega sjá og breyta {#what-agents-may-see-and-change}

**Reitaaðgangur** (**Uppsetning › Reitaaðgangur**) telur upp reiti sem einn notandi eða eitt forrit á ekki að fá
(**Lesa**), ekki breyta (**Skrifa**), eða hvorugt (**Bæði**) í gegnum Bifröst. Ekkert breytist í Business Central
biðlaranum.

**Dæmi.** Sigga notar aðstoðarmann, en fulltrúar eiga aldrei að sjá bankareikningsnúmer starfsmanna. Veldu
**Nýtt fyrir notanda...**, veldu notanda Siggu, og bættu síðan við töflunni *Starfsmaður*, reitnum *Númer bankareiknings*
og takmörkuninni **Bæði**. Upp frá því, þegar aðstoðarmaðurinn hennar telur upp starfsmenn, kemur svarið án
bankareikningsnúmera, og aðstoðarmaðurinn getur ekki breytt þeim. Sigga sjálf sér þau áfram í Business Central.

![Yfirlit reitaaðgangs Bifröst](/img/guides/is-is/field-access-overview.png)

Reitaaðgangur hefur tvær tegundir í viðbót. **Engin** takmarkar ekkert og gengur framar víðari línu, til dæmis til að opna
eina töflu fyrir notanda sem má annars engu breyta. **Framhjá** leyfir **aðeins þeim notanda eða forriti** að breyta
reitnum án slóðar í breytingaskrá.

**Breytingaskrárvernd** á Uppsetningu Bifröst ræður hvort breytingar á færslum í gegnum Bifröst verði að skilja eftir slóð í
breytingaskrá. Hún er **Lokað** sjálfgefið: aðeins reitum sem breytingaskráin nær til er hægt að breyta, svo kveiktu á
breytingaskránni fyrir reitina sem þú vilt að fulltrúar breyti. Ef þú notar Bifröst með bókhaldi, ákveddu þetta með það í
huga: bókhaldsskyldur þínar eru áfram þínar, og annálar Bifröst koma ekki í stað þinna eigin gagna.

**Virða næmi gagna** (undir *Sýna meira*) felur reitina sem fyrirtækið þitt flokkar sem viðkvæma.

Allt þetta, með algengu uppsetningunni *loka öllum breytingum og opna svo eina töflu* og gögnunum sem Bifröst ver alltaf:
[Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/).

## Annálar og varðveisla {#logs-and-retention}

Þessir annálar eru í þínu eigin Business Central. Þeir eru gögn fyrirtækisins: taktu þá með í eigin reglur um varðveislu
og aðgang.

- **[Bifröst skilaboð](/help/foundation/bifrost-messages/)** (**Skilaboð › Bifröst skilaboð**) geyma hvert kall sem
  Bifröst fær, með beiðninni, svarinu og kallandanum, og geyma því þau gögn sem köllin skiluðu.
- **[Annáll beiðna](/help/foundation/bifrost-request-log/)** (**Skilaboð › Annáll beiðna**) geymir köllin sem Bifröst
  forrit gera til annarra kerfa, hulin nema villuleitarstilling sé á. Hann fær sjálfkrafa eins mánaðar varðveislureglu.

  ![Annáll beiðna Bifröst](/img/guides/is-is/request-log.png)

- **Eyðingaskráning** (**Aðgerðir › Eyðingaskráning**) skráir eyðingar í töflunum sem þú telur upp á
  **Uppsetning eyðingaskráningar**, hver sem eyðir. **Vista færslu** geymir afrit af hverri eyddri færslu; eyðingarnar
  eru á **Eyðingaskrá**.

  ![Uppsetning eyðingaskráningar](/img/guides/is-is/delete-setup.png)

  ![Eyðingaskrá Bifröst](/img/guides/is-is/delete-log.png)

- **Minni og uppsetning notenda** geyma frjálsan texta sem fulltrúar og notendur skrifa.

**Villuleitarstilling beiðna** (undir *Sýna meira* á Uppsetningu Bifröst) geymir fullt, óhulið meginmál beiðna og svara í
annál beiðna. Kveiktu aðeins á henni meðan villuleitað er, og slökktu aftur á eftir. Til að breyta henni þarf
`BIFROST ReqLgAdm ori`.

:::caution Athugaðu
- **Varðveislan er þín að stilla.** Notaðu **Uppsetning › Varðveislureglur**. **Bifröst skilaboð hafa ekkert
  varðveislutímabil fyrr en þú setur það**, svo skilaboð eru geymd þangað til.
- **Geymdu að minnsta kosti 31 dag** af Bifröst skilaboðum ef þú notar mánaðarlega skilaboðakvóta.
- **Aðgangurinn er þinn að stilla.** Hver sem hefur `BIFROST Read ori` eða `BIFROST Full ori` getur opnað öll skilaboð á
  Bifröst skilaboðum, svo gefðu þær samstæður aðeins þeim sem þurfa.
:::

## Leyndarmál {#secrets}

**Uppsetning › Leyndarmál** telur upp auðkennin sem Bifröst forrit þurfa, til dæmis aðgangslykil að öðru kerfi: hvaða
forrit, hvað það er, hvort það er skráð, og hvenær og af hverjum. Notaðu **Skrá...** til að slá inn gildi og
**Hreinsa** til að fjarlægja það. Gildin eru geymd fyrir fyrirtækið (eða fyrirtækið og notandann), aldrei sýnd aftur, og
aldrei afrituð milli fyrirtækja.

![Leyndarmál forrita Bifröst](/img/guides/is-is/secrets.png)

Listinn fyllist þegar þú setur upp Bifröst forrit sem tengjast öðrum kerfum; uppsetningarleiðsögnin biður um leyndarmál
þeirra í einu valfrjálsu skrefi.

## Hinar stillingarnar á Uppsetningu Bifröst {#the-other-settings-on-bifrost-setup}

Veldu **Sýna meira** í hlutanum *Almennt* til að sjá sjaldgæfari stillingarnar. Hverjum reit er lýst í
[Uppsetning Bifröst](/help/foundation/bifrost-setup/).

![Uppsetning Bifröst með Sýna meira](/img/guides/is-is/setup-show-more.png)

| Stilling | Hvað hún gerir |
|---|---|
| **Tegund hámarksskuldar** | Hvaða athugun á hámarksskuld fulltrúar nota fyrir viðskiptamenn |
| **Vikmörk hámarksskuldar %** | Hve langt yfir hámarksskuld viðskiptamaður má fara áður en það er merkt |
| **Tegund yfirlits viðskiptamanns** | Hvaða viðskiptamannayfirlit fulltrúar búa til |
| **Tegund verðútreiknings** | Hvernig verð vöru er reiknað í svörum |
| **Sjálfgefinn tungumálakóði** | Tungumál svara þegar kall biður ekki um annað |
| **Breytingaskrárvernd** | [Hvað fulltrúar mega sjá og breyta](#what-agents-may-see-and-change) |
| **Tegund heitis fyrirtækis** | Hvaða heiti fyrirtækis fer í útflutning: heiti fyrirtækisins eða birtingarheiti þess |
| **Sjálfgefin sviðsmynd tölvupósts** | Hvaða tölvupóstreikning Bifröst notar þegar kall segir það ekki |
| **Villuleitarstilling beiðna** | [Annálar og varðveisla](#logs-and-retention) |
| **Virða næmi gagna** | [Hvað fulltrúar mega sjá og breyta](#what-agents-may-see-and-change) |
| **Mánaðarlegur skilaboðakvóti fyrirtækis** | [Notkun og mörk](#usage-and-limits) |

## Þýðingar og samþættingar {#translations-and-integrations}

Undir **Tengt**:

- **Þýðingar Bifröst:** þýðingarfærslur sem ytri kerfi lesa: fyrir uppruna, tungumál og enskan texta, þýddi textinn.
- **Samþætting Bifröst:** atburðaskrá yfir samþættingarvirkni: fyrir hvern atburð, upprunakerfið, töfluna í Business
  Central og tímann. Notaðu hana til að sjá hvaða kerfi skrifaði í hvaða töflu og hvenær.

![Þýðingar Bifröst](/img/guides/is-is/translations.png)

Samþættingar fylla báðar; yfirleitt skoðarðu þær aðeins.

## Önnur Bifröst forrit {#other-bifröst-apps}

Hvert Bifröst forrit bætir við eigin sviðum. Þegar það er uppsett bætir hvert þeirra aðgerð við flokkinn **Forrit** á
Uppsetningu Bifröst, sem opnar eigin uppsetningarsíðu þess. **Forrit › Finna forrit** opnar
[forritalistann](/apps/).

![Flokkurinn Forrit](/img/guides/is-is/menu-apps.png)

**Eftir að forrit er sett upp skaltu keyra uppsetningarleiðsögnina aftur** (**Leyfi › Uppsetningarleiðsögn**). Hún kveikir
á útleið HTTP fyrir nýja forritið og biður um auðkenni sem það þarf.

## Notendaleyfissamningurinn og leiðsögnin {#the-license-agreement-and-the-wizard}

**Leyfi › Uppsetningarleiðsögn** má keyra aftur hvenær sem er, til dæmis til að lesa slóð MCP-þjónsins eða
samþykkistengilinn í skrefi 5. Lokaðu henni með **X** ef þú vilt ekki ljúka henni aftur.

**Leyfi › Afturkalla samþykki notendaleyfissamnings** dregur samþykki fyrirtækisins á [notkunarskilmálunum](/licensing/eula/)
til baka. Öllum Bifröst köllum frá fyrirtækinu er þá hafnað þar til uppsetningarleiðsögninni er lokið aftur. Business
Central spyr áður en það gerir það.

![Afturkalla samþykki spyr fyrst](/img/guides/is-is/revoke-eula.png)

## Notkun og mörk {#usage-and-limits}

Bifröst telur **skilaboð**: ein fyrir hvert vel heppnað kall sem vinnur verk. Hjálpar-, minnis-, setu-, vefkróka- og
breytingaskrárköll Bifröst eru ekki talin.

- **Mörk sem þú getur sett.** Mánaðarlegur skilaboðakvóti fyrir hvert fyrirtæki á Uppsetningu Bifröst, og fyrir hvern
  notanda á Uppsetningu notenda, stöðva notkun við mörk sem þú velur. Autt þýðir engin mörk. Þegar mörkum er náð er frekari
  köllum hafnað fram að næsta almanaksmánuði, og fulltrúinn segir það. Mörk notandans eru athuguð á undan mörkum
  fyrirtækisins.
- **Sjáðu hvað er notað** á **Aðgerðir › Leyfisnotkun**, eftir fyrirtæki, degi og tegund. **Leyfi › Samstilla** uppfærir
  tölurnar strax; bakgrunnsverk gerir það sama daglega.

Hvernig leyfismálum er háttað, og hvað gerist þegar kvóti klárast: [Leyfi](/licensing/). Verð: [Verð](/price/).

## Fylgstu með því {#keep-an-eye-on-it}

- **Mánaðarlega:** skoðaðu Leyfisnotkun og svæðið Leyfi á Uppsetningu Bifröst; athugaðu að engin mörk séu nálægt.
- **Þegar fólk skiptir um hlutverk:** lagaðu heimildasamstæður þess og línur í reitaaðgangi.
- **Þegar þú setur upp Bifröst forrit:** keyrðu uppsetningarleiðsögnina aftur.
- **Öðru hverju:** farðu yfir Bifröst skilaboð í leit að köllum sem þú áttir ekki von á, og athugaðu að slökkt sé á
  villuleitarstillingu beiðna.
- **Einu sinni:** settu varðveislutímabil, og ákveddu hver má lesa annálana.

## Úrræðaleit {#troubleshooting}

| Það sem þú sérð | Hvað á að athuga |
|---|---|
| Aðstoðarmaðurinn sýnir engin Business Central verkfæri | Ekki er kveikt á tengingunni í þessu spjalli; sjá [Tengdu aðstoðarmanninn](/setup/connect-your-ai/#claude) |
| Engin umhverfi eða fyrirtæki birtast þegar aðstoðarmaðurinn tengist | Samþykkið sem gefið er einu sinni í Microsoft Entra ID vantar; sjá [Samþykktu einu sinni fyrir fyrirtækið](/setup/connect-your-ai/#consent-once-for-your-organisation) |
| Innskráningarleiðirnar finnast ekki þegar tengingunni er bætt við, eða innskráning mistekst | Athugaðu slóð MCP-þjónsins úr skrefi 5 í leiðsögninni. Sé hún rétt, hafðu samband við samstarfsaðilann og sendu villuboðin óbreytt |
| Öllum köllum frá fyrirtækinu er hafnað | Er notendaleyfissamningurinn samþykktur? Keyrðu uppsetningarleiðsögnina |
| Köllum er hafnað undir lok mánaðar | Mánaðarleg mörk notanda eða fyrirtækis; [Notkun og mörk](#usage-and-limits) |
| Köllum er hafnað og svæðið Leyfi sýnir engin skilaboð eftir | Fyrirframgreiddu skilaboðin eru uppurin; sjá [Leyfi](/licensing/) |
| Svæðið Leyfi virðist úrelt | **Leyfi › Samstilla**, síðan **Leyfi › Tengingastaða** |
| Fulltrúi getur ekki breytt reit | Breytingaskrárverndin, uppsetning breytingaskrár, reitaaðgangur; [Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/) |
| Reit vantar í svör | Reitaaðgangur eða Virða næmi gagna; sama síða |
| Bókun er hafnað | Bókunarhlið; [Heimildasamstæður og hlið](/documentation/end-customers/permissions/) |
| Nýtt Bifröst forrit virkar ekki | Keyrðu uppsetningarleiðsögnina aftur; athugaðu **Leyndarmál** |
| Þú þarft að sjá nákvæmlega hvað fulltrúi gerði | **Bifröst skilaboð**: beiðnin, svarið og kallandinn í hverju kalli |

## Það sem þú berð ábyrgð á {#what-you-are-responsible-for}

Í stuttu máli, og eins og fram kemur í [notkunarskilmálunum](/licensing/eula/):

- **Heimildir**: hver getur kallað, og hvað hvert auðkenni nær til og getur bókað.
- **Aðstoðarmennirnir og kerfin sem þú tengir**, og samningar þínir við þjónustuaðila þeirra.
- **Það sem fulltrúar gera** undir þínum auðkennum: farðu yfir og hafðu umsjón með aðgerðum þeirra, og krefstu staðfestingar
  þar sem aðgerð skiptir máli.
- **Það sem er geymt**: varðveisla og aðgangur að annálunum í Business Central hjá þér. Hvað Bifröst geymir hjá Origo er í
  [Persónuvernd](/licensing/privacy/).
- **Bókhald**: rekjanleiki og varðveisla samkvæmt bókhaldslögum eru áfram þín.

**Næst:** [Stjórnaðu því hvað fulltrúar lesa og breyta](/documentation/end-customers/data-access/), eða
[Prófaðu](/try-it-out/) til að prófa breytingu í sandkassa fyrst.
