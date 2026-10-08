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
minna. Bifröst gefur kallanda aldrei meira en Business Central leyfir þegar, fyrir utan lestur
breytingaskrárfærslna og hluta uppsetningar ([hverra, og hvers vegna](/documentation/end-customers/permissions/#does-a-bifröst-permission-set-give-a-user-more-rights)),
og reitaaðgangur, breytingaskrárverndin og bókunarheimildasamstæðurnar geta þrengt það enn frekar.

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

**Reitaaðgangur** (**Uppsetning › Reitaaðgangur**) heldur völdum reitum frá einum notanda eða forriti í gegnum Bifröst,
til dæmis bankareikningsnúmerum starfsmanna; ekkert breytist í Business Central biðlaranum. **Breytingaskrárvernd** á
Uppsetningu Bifröst ræður hvort breytingar í gegnum Bifröst verði að skilja eftir slóð í breytingaskrá. Ef þú notar Bifröst
með bókhaldi, ákveddu þetta með það í huga: bókhaldsskyldur þínar eru áfram þínar, og annálar Bifröst koma ekki í stað
þinna eigin gagna.

Tegundir lína í reitaaðgangi, stillingar verndarinnar og sjálfgefna stillingin, viðkvæmir reitir, algenga uppsetningin
*loka öllum breytingum og opna svo eina töflu* og gögnin sem Bifröst ver alltaf:
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
- **Aðgangurinn er þinn að stilla.** Hver sem hefur `BIFROST Full ori` (eða SUPER) getur opnað öll skilaboð á Bifröst
  skilaboðum. Sá sem hefur `BIFROST Read ori` sér aðeins eigin skilaboð. Gefðu `BIFROST Full ori` aðeins þeim sem
  þurfa.
:::

## Leyndarmál {#secrets}

**Uppsetning › Leyndarmál** telur upp auðkennin sem Bifröst forrit þurfa, til dæmis aðgangslykil að öðru kerfi: hvaða
forrit, hvað það er, hvort það er skráð, og hvenær og af hverjum. Notaðu **Skrá...** til að slá inn gildi og
**Hreinsa** til að fjarlægja það. Gildin eru geymd fyrir fyrirtækið (eða fyrirtækið og notandann), aldrei sýnd aftur, og
aldrei afrituð milli fyrirtækja.

![Leyndarmál forrita Bifröst](/img/guides/is-is/secrets.png)

Listinn fyllist þegar þú setur upp Bifröst forrit sem tengjast öðrum kerfum. Í staðbundinni uppsetningu biður
uppsetningarleiðsögnin um leyndarmál þeirra í einu valfrjálsu skrefi. Í skýinu skráirðu þau á **Uppsetning › Leyndarmál**.

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

**Eftir að forrit er sett upp skaltu keyra uppsetningarleiðsögnina aftur** (**Leyfi › Uppsetningarleiðsögn**). Hún sýnir
hvort útleið HTTP sé virk fyrir nýja forritið (veldu **Virkja HTTP fyrir öll forrit** í skrefi 2), og í staðbundinni
uppsetningu biður hún um auðkennin. Í skýinu skráirðu þau á **Uppsetning › Leyndarmál**.

## Notendaleyfissamningurinn og leiðsögnin {#the-license-agreement-and-the-wizard}

**Leyfi › Uppsetningarleiðsögn** má keyra aftur hvenær sem er, til dæmis til að lesa slóð Bifröst MCP-þjónsins eða
samþykkistengilinn í skrefi 5 í leiðsögninni. Lokaðu henni með **X** ef þú vilt ekki ljúka henni aftur.

**Leyfi › Afturkalla samþykki notendaleyfissamnings** dregur samþykki fyrirtækisins á [notkunarskilmálunum](/licensing/eula/)
til baka. Öllum Bifröst köllum frá fyrirtækinu er þá hafnað þar til uppsetningarleiðsögninni er lokið aftur. Business
Central spyr áður en það gerir það.

![Afturkalla samþykki spyr fyrst](/img/guides/is-is/revoke-eula.png)

## Notkun og mörk {#usage-and-limits}

Bifröst telur **skilaboð**: ein fyrir hvert vel heppnað kall sem vinnur verk. Hjálpar-, minnis-, setu-, vefkróka- og
breytingaskrárköll Bifröst eru ekki talin.

- **Mörk sem þú getur sett.** Mánaðarlegur skilaboðakvóti fyrir hvert fyrirtæki og hvern notanda stöðvar notkun við mörk
  sem þú velur. Reitirnir, hvað `0` þýðir og hvað gerist þegar kvóta er náð: [Mánaðarlegir kvótar](/licensing/license-types/#monthly-quotas).
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

Hér er eini staðurinn til að leita þegar einhverju er hafnað. Línurnar fylgja því sem notendur segja frá, með orðunum úr
[Þegar hann segir nei](/documentation/end-customers/users/#when-it-says-no); síðustu línurnar eru það sem þú sérð sjálfur.
Til að finna kall opnarðu **Bifröst skilaboð** og síar á notandann og tímann.

| Það sem þú heyrir eða sérð | Af hverju | Hvað á að gera |
|---|---|---|
| Aðstoðarmaðurinn hefur alls engin Business Central verkfæri | Ekki er kveikt á Bifröst-tengingunni í þessu spjalli | Notandinn kveikir á henni; sjá [Tengdu aðstoðarmanninn](/setup/connect-your-ai/#claude) |
| Engin umhverfi eða fyrirtæki birtast þegar aðstoðarmaðurinn tengist | Samþykkið fyrir fyrirtækjaforritið *Origo Bifrost*, sem gefið er einu sinni í Microsoft Entra ID, vantar | [Skref 3: Samþykktu einu sinni](/setup/consent/) |
| Innskráningarleiðirnar finnast ekki þegar tengingunni er bætt við, eða innskráning mistekst | Slóð Bifröst MCP-þjónsins er röng, eða innskráningin sjálf mistekst | Athugaðu slóðina úr skrefi 5 í leiðsögninni. Sé hún rétt, hafðu samband við Business Central samstarfsaðilann þinn og sendu villuboðin óbreytt |
| *Hver er ég?* svarar með öðrum notanda | Notandinn skráði sig inn í tenginguna með öðrum reikningi | Í tengingunni velur notandinn **Disconnect** og tengist svo aftur með Business Central reikningnum sínum |
| Það þarf fyrst að samþykkja verkfærið, með tengli | **Tegund samþykktar** notandans krefst þess að hvert nýtt verkfæri (uppruni setu) sé samþykkt einu sinni | Notandinn opnar tengilinn og samþykkir (með `BIFROST SrcApOwn ori`), eða sendir þér hann og þú samþykkir á sömu síðu (með `BIFROST SrcApAdm ori`); sjá [Samþykkja uppruna setu](/help/foundation/session-source-approval/). Stillingin: [Ákveddu hvaða verkfæri mega starfa fyrir notanda](/setup/business-central/#decide-which-tools-may-act-for-a-user) |
| *Aðgerðin er ekki í boði* | Forritið sem býður hana er ekki uppsett í þessu fyrirtæki, leyndarmál sem hún þarf er ekki skráð, eða slökkt er á henni fyrir þennan notanda: Bifröst býður aðgerð aðeins notanda sem hefur heimildirnar sem hún þarf | Settu forritið upp af [forritalistanum](/apps/) og keyrðu uppsetningarleiðsögnina aftur; skráðu leyndarmálið á **Uppsetning › Leyndarmál**; athugaðu heimildasamstæður notandans ([Heimildasamstæður og hlið](/documentation/end-customers/permissions/)) |
| Hann getur það ekki enn | Ekkert uppsett forrit hefur aðgerð fyrir það verk | Skoðaðu [forritalistann](/apps/), eða sjá [Vantar eitthvað?](/documentation/how-it-works/#what-it-covers-and-how-it-grows) |
| Hann getur alls ekki kallað í Bifröst | Notandinn hefur ekki `BIFROST API ori` | Úthlutaðu henni; sjá [Úthluta og athuga](/documentation/end-customers/permissions/#assign-and-check) |
| *Bókun hafnað: vantar '...' heimildasamstæðu* | Notandann vantar bókunarhliðið sem er nefnt | Úthlutaðu þeirri samstæðu; sjá [Hvaða hlið opnar hvað](/documentation/end-customers/permissions/#which-gate-opens-what) |
| Að hann hafi ekki heimildir á tiltekinni töflu | Notandann vantar sjálfa heimild Business Central | Úthlutaðu venjulegri heimildasamstæðu Business Central, eins og fyrir biðlarann |
| Ekki er hægt að senda samþykktarbeiðnir | Notandinn hefur ekki `BIFROST ApprAdm ori` | Úthlutaðu henni |
| Hluta svarsins vantar | Lína í reitaaðgangi sem felur reitinn fyrir notandanum, sjálfgefið falinn reitur, eða **Virða næmi gagna** | Skoðaðu línur notandans á **Yfirliti reitaaðgangs Bifröst**; sjá [Reitaaðgangur](/documentation/end-customers/data-access/#field-access) og [Viðkvæmir reitir](/documentation/end-customers/data-access/#sensitive-fields) |
| *Breytingaskrárverndin lokar reitnum* | Breytingaskráin skráir ekki breytingar á reitnum | Skráðu reitinn í **Uppsetningu breytingaskrár**, bættu við undanþágu, eða gefðu notandanum línu sem fer framhjá verndinni; sjá [Breytingaskrárverndin](/documentation/end-customers/data-access/#the-changelog-write-guard) |
| *Reiturinn er lokaður fyrir skrifum eða ekki leyfður* | Lína í reitaaðgangi sem lokar reitnum, sjálfgefin vernd, eða gögn sem Bifröst ver alltaf | Skoðaðu línur notandans á **Yfirliti reitaaðgangs Bifröst**; sjá [Reitaaðgangur](/documentation/end-customers/data-access/#field-access) og [Viðkvæmir reitir](/documentation/end-customers/data-access/#sensitive-fields) |
| *Reiturinn tilheyrir grunnstillingu fyrirtækisins* | Einn af [grunnstillingarreitum fyrirtækisins](/documentation/end-customers/data-access/#company-configuration-fields) | Settu fyrirtækið upp sem notandi með `BIFROST Force ori` og biddu fulltrúann að þvinga breytinguna |
| Ekki er hægt að lesa eða breyta töflunni | Ein af [töflunum sem Bifröst ver alltaf](/documentation/end-customers/data-access/#what-bifröst-always-protects), eða notandinn hefur ekki heimild á hana í Business Central | Notaðu síðu Business Central í staðinn, eða veittu heimildina |
| Bifröst hafnar köllum fyrir fyrirtækið | Uppsetningarleiðsögninni hefur ekki verið lokið í þessu fyrirtæki, eða samþykki notendaleyfissamningsins var afturkallað | Keyrðu uppsetningarleiðsögnina (**Leyfi › Uppsetningarleiðsögn**) og veldu **Ljúka**; sjá [Keyrðu uppsetningarleiðsögnina](/setup/business-central/#run-the-setup-wizard) |
| *Prufuleyfi Bifröst hefur ekki verið virkjað* | Í framleiðsluumhverfi í skýinu er prufuleyfið virkjað þegar uppsetningarleiðsögninni lýkur | Ljúktu uppsetningarleiðsögninni, eða veldu **Leyfi › Samstilla**; sjá [Fyrirframgreitt leyfi](/licensing/license-types/#prepaid) |
| Heimildin er uppurin | Mánaðarlegum skilaboðakvóta notandans eða fyrirtækisins er náð | Hækkaðu kvótann, eða bíddu næsta almanaksmánaðar; sjá [Mánaðarlegir kvótar](/licensing/license-types/#monthly-quotas) |
| Köllum er hafnað, og svæðið Leyfi sýnir engin skilaboð eftir | Fyrirframgreiddu skilaboðin eru uppurin | Hafðu samband við Business Central samstarfsaðilann þinn; sjá [Fyrirframgreitt leyfi](/licensing/license-types/#prepaid) |
| Í sandkassa er köllum hafnað eftir mörg köll á einum degi | Álagsþak sandkassa á Bifröst MCP-þjóninum | Sjá [Álagsþak](/licensing/rate-limits/) |
| Svör bera viðvörun um kvótann, eða Uppsetning Bifröst segir að leyfiskvótinn sé að klárast | Mánaðarlegur kvóti eða fyrirframgreiddur pottur er að verða búinn | Skoðaðu svæðið Leyfi og **Leyfisnotkun**; sjá [Mánaðarlegir kvótar](/licensing/license-types/#monthly-quotas) og [Fyrirframgreitt leyfi](/licensing/license-types/#prepaid) |
| Eitthvað var bókað sem hefði ekki átt að bóka, eða kall mistókst með tæknilegri villu | - | Finndu kallið á **Bifröst skilaboðum**: beiðnina, svarið og kallandann. Svar kalls sem mistókst segir hvað fór úrskeiðis |
| Svæðið Leyfi virðist úrelt | - | **Leyfi › Samstilla**, síðan **Leyfi › Tengingastaða** |
| Nýtt Bifröst forrit virkar ekki | Útleið HTTP er ekki virk fyrir það, eða leyndarmál þess eru ekki skráð | Keyrðu uppsetningarleiðsögnina aftur; athugaðu **Uppsetning › Leyndarmál** |

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
