---
id: index
title: "Spurt og svarað"
sidebar_label: "Spurt og svarað"
sidebar_position: 1
slug: /
displayed_sidebar: null
description: "Svör við algengum spurningum um notkun Bifröst, tengingu aðstoðarmanna, gögn, heimildir, innskráningu og öryggi."
---

# Spurt og svarað

Smelltu á spurningu til að sjá svarið.

## Notkun Bifröst {#using-bifrost}

<details id="what-can-my-assistant-do">
<summary>Hvaða gögn getur aðstoðarmaðurinn séð eða breytt í Business Central og hvenær biður hann um staðfestingu?</summary>

Aðstoðarmaðurinn vinnur fyrir þína hönd. Hvað hann má sjá eða breyta fer eftir leyfinu þínu í
Business Central, heimildum fyrir hverja aðgerð og þeim Bifröst-forritum og takmörkunum sem
fyrirtækið hefur sett upp. Kerfisstjóri getur til dæmis falið reiti og sérstaka heimild þarf til
að bóka í gegnum Bifröst.

Bifröst krefst þess að aðstoðarmaðurinn staðfesti breytingu áður en hann sendir hana í
framleiðsluumhverfi. Uppflettingar þurfa ekki þessa staðfestingu en aðstoðarmaðurinn gæti samt
beðið um leyfi til að nota verkfæri. Segðu **„Sýndu mér fyrst“** áður en þú biður hann að bóka,
senda eða eyða einhverju. Athugaðu
fyrirtækið og fyrirhugaða breytingu áður en þú samþykkir hana. Sjá
[Hvað þú getur spurt um](/documentation/end-customers/users/#what-you-can-ask).

</details>

<details id="where-does-my-data-go">
<summary>Hvert fara gögnin mín úr Business Central þegar ég nota aðstoðarmann og hver geymir afrit?</summary>

- **Þjónustuveitandi aðstoðarmannsins** fær niðurstöðurnar sem Bifröst skilar. Samningur fyrirtækisins
  við hann og stillingar þjónustunnar ráða því hvað hann má geyma eða nota.
- **Hýst Bifröst-þjónusta Origo** flytur beiðnir og svör á milli án þess að geyma innihald þeirra.
  Origo geymir aðskilin þjónustugögn, til dæmis vegna leyfa og tæknilegrar greiningar.
- **Business Central hjá þínu fyrirtæki** geymir beiðnirnar og svörin í **Bifröst skilaboðum**
  samkvæmt varðveislustillingum fyrirtækisins.

Sjá [Hvert gögnin þín fara](/documentation/how-it-works/#where-your-data-goes) og
[Persónuverndaryfirlýsinguna](/licensing/privacy/).

</details>

<details id="connect-and-approve">
<summary>Hvaða aðstoðarmenn get ég tengt og hver þarf að samþykkja tenginguna?</summary>

Þú getur meðal annars tengt Claude, Microsoft 365 Copilot ef það er í boði fyrir fyrirtækið þitt
og ChatGPT eða annan aðstoðarmann þar sem fjartengdir MCP-þjónar eru leyfðir. Sjá
[Veldu aðstoðarmanninn](/setup/pick-your-assistant/#which-assistant) fyrir valkosti og uppsetningu.

Stjórnandi í Microsoft Entra [veitir samþykki einu sinni](/setup/consent/) fyrir fyrirtækið og
kerfisstjórinn í Business Central veitir þér Bifröst-heimildir. Á vinnusvæði fyrirtækisins gæti
stjórnandi líka þurft að bæta við eða samþykkja tenginguna. Ef Business Central biður um sérstakt
samþykki, sjá [Samþykki nýs aðstoðarmanns](/documentation/end-customers/users/#approving-a-new-assistant).

</details>

<details id="missing-company-or-sandbox">
<summary>Af hverju sé ég ekki fyrirtækið mitt eða sandkassann á listanum?</summary>

- **Sandkassi:** sandkassar eru sjálfgefið faldir á fyrirtækjalistanum. Biddu aðstoðarmanninn að
  sýna sandkassa líka.
- **Nýtt fyrirtæki eða umhverfi:** biddu aðstoðarmanninn að endurnýja fyrirtækjalistann.
- **Fyrirtæki í öðrum leigjanda:** límdu
  [tengitexta fyrirtækisins](/setup/first-question/#tell-the-assistant-where-to-work) inn í spjallið.

Ef þú finnur fyrirtækið enn ekki skaltu biðja kerfisstjórann að athuga aðganginn þinn og hvort
Bifröst hafi verið sett upp í fyrirtækinu.

</details>

<details id="check-before-retrying">
<summary>Ef svar við aðgerð berst ekki innan tímamarka, hvernig athuga ég hvort hún fór í gegn áður en ég reyni aftur?</summary>

Þótt svar berist ekki innan tímamarka þýðir það ekki að aðgerðin hafi mistekist eða verið stöðvuð.
Business Central gæti enn verið að vinna úr beiðninni eða hafa þegar lokið henni.

1. Ef aðstoðarmaðurinn er með tilvísun í upphaflegu beiðnina skaltu biðja hann að athuga stöðu
   hennar án þess að senda aðgerðina aftur.
2. Opnaðu færsluna í rétta fyrirtækinu og athugaðu hana (t.d. hvort reikningur hafi þegar verið
   bókaður). Leitaðu að beiðninni og svari hennar í
   [Bifröst skilaboðum](/documentation/end-customers/users/#check-what-the-assistant-did).
3. Reyndu aðeins aftur þegar þú veist að aðgerðin fór ekki í gegn og bíður ekki afgreiðslu. Ef
   þú ert ekki viss skaltu senda kerfisstjóranum tímann og tilvísun í beiðnina ef hún liggur fyrir.

</details>

## Innskráning og aðgangur {#sign-in-and-access}

<details id="on-behalf-of">
<summary>Hvernig fær Bifröst MCP-þjónninn tókann sem hann notar til að kalla á Business Central?</summary>

Með **on-behalf-of** skiptum. Þegar notandi skráir sig inn gefur Microsoft Entra ID út tóka fyrir þann notanda til
Bifröst MCP-þjónsins. Til að kalla á Business Central skiptir þjónninn honum fyrir Business Central tóka fyrir hönd
notandans. Tóka notandans er ekki einfaldlega skilað áfram.

Þar með keyrir hvert kall sem innskráði notandinn og heimildir notandans sjálfs gilda alltaf.

</details>

<details id="refresh-tokens">
<summary>Hver geymir endurnýjunartókana: þjónn Origo eða gervigreindarbiðlarinn?</summary>

Þegar aðstoðarmaður notar innskráningu í gegnum Bifröst starfar MCP-þjónninn sem OAuth-milliliður
milli aðstoðarmannsins og Microsoft Entra ID.

- **Entra tókar.** MCP-þjónninn geymir tókana sem hann fær frá Microsoft Entra ID og sendir þá
  ekki til aðstoðarmannsins. Sjá [hvernig Origo verndar innskráningartóka](#stored-sign-ins).
- **Tókar gervigreindarbiðlarans.** Gervigreindarbiðlarinn fær sérstaka aðgangs- og endurnýjunartóka sem
  MCP-þjónninn gefur út. Þeir virka aðeins gagnvart MCP-þjóninum og innihalda engin Microsoft-auðkenni. Hvern
  endurnýjunartóka biðlarans má aðeins nota einu sinni: hver endurnýjun skilar nýjum tóka og ógildir þann gamla.
  Hann virkar líka aðeins fyrir þá biðlaraskráningu sem hann var gefinn út fyrir.

</details>

<details id="stored-sign-ins">
<summary>Geymir Origo innskráningarupplýsingar notenda á sínum þjónum? Ef svo er, hvernig eru þær varðar og hve lengi eru þær geymdar?</summary>

**Já, þegar aðstoðarmaðurinn notar innskráningu í gegnum Bifröst.** Origo geymir aðgangs- og
endurnýjunartóka frá Microsoft Entra ID svo tengingin haldist virk. Tókarnir eru dulkóðaðir í
geymslu. Origo fær ekki Microsoft-lykilorðið þitt og geymir það ekki. Aðstoðarmaður sem fær tóka
beint frá Microsoft sér sjálfur um sína endurnýjunartóka.

**Hve lengi?** Tengingin getur haldist virk á meðan Microsoft Entra ID leyfir endurnýjun tóka.
Ef Microsoft krefst nýrrar innskráningar þarftu að skrá þig inn aftur. Þegar tóki rennur út eða er
afturkallaður er ekki lengur hægt að nota hann, en það segir ekki til um hvenær honum er eytt úr
geymslu. [Hafðu samband við þjónustuver Bifrastar](/support/) til að fá upplýsingar um geymslutíma.
Sjá einnig [Persónuvernd](/licensing/privacy/) um meðferð Origo á þjónustugögnum.

</details>

<details id="ending-access">
<summary>Hve lengi varir aðgangur notanda og hvernig er honum lokið?</summary>

Aðstoðarmaður getur haldið tengingu án nýrrar innskráningar á meðan Microsoft Entra ID leyfir
endurnýjun. Hann starfar áfram fyrir hönd innskráðs notanda, með heimildum hans.

- **Fyrir einn notanda:** gerðu notandann óvirkan eða riftu setum hans í Microsoft Entra ID. Næsta endurnýjun
  mistekst og notandinn þarf að skrá sig inn aftur.
- **Fyrir alla fyrirtækjaheildina:** gerðu fyrirtækjaforritið *Origo Bifrost* óvirkt eða eyddu því; sjá
  [Afturkalla það](/setup/consent/#withdraw-it).

</details>

<details id="azure-resource-manager">
<summary>Biður Bifröst enn um heimild fyrir Azure Resource Manager?</summary>

Nei. Bifröst biður ekki lengur um heimild fyrir Azure Resource Manager (ARM) og notar hana ekki.
Enn þarf [samþykki fyrir aðgangi að Business Central](/setup/consent/#what-the-consent-grants).

Hafi fyrirtækið áður veitt ARM-heimild fellur hún ekki sjálfkrafa úr gildi. Stjórnandi í Microsoft
Entra ID getur afturkallað **Azure Service Management** án þess að afturkalla heimildina fyrir
Business Central. Sjá [útgáfuskýringar MCP frá 16. nóvember (á ensku)](/mcp/release-notes/#16-november-2026)
fyrir frekari upplýsingar og hvað á að gera ef fyrirtæki í öðrum leigjanda sést ekki.

</details>

<details id="app-credential">
<summary>Hvar er auðkenni Bifröst forritsins sjálfs geymt?</summary>

On-behalf-of skiptin nota auðkenni forritsins *Origo Bifrost*. Origo geymir það í eigin Azure leigjanda og
skiptir því út reglulega.

</details>

## Öryggisprófanir {#security-testing}

<details id="penetration-test">
<summary>Hefur Bifröst verið árásarprófað?</summary>

Já. Syndis hefur árásarprófað Bifröst.

</details>
