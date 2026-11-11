---
id: index
title: "Spurt og svarað"
sidebar_label: "Spurt og svarað"
sidebar_position: 1
slug: /
displayed_sidebar: null
description: "Svör við algengum spurningum um Bifröst: hvernig MCP-þjónninn skráir notendur inn, hver geymir tókana, heimildirnar sem beðið er um og öryggisprófanir."
---

# Spurt og svarað

Smelltu á spurningu til að sjá svarið.

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

Bifröst MCP-þjónninn starfar sem OAuth-milliliður fyrir framan Microsoft Entra ID.

- **Entra tókar.** Þegar notandi skráir sig inn gefur Entra út aðgangstóka og endurnýjunartóka til MCP-þjónsins.
  Þjónninn geymir báða, dulkóðaða í hvíld, í eigin gagnagrunni. Þeir eru aldrei sendir til gervigreindarbiðlarans.
- **Tókar gervigreindarbiðlarans.** Gervigreindarbiðlarinn fær sérstaka aðgangs- og endurnýjunartóka sem
  MCP-þjónninn gefur út. Þeir virka aðeins gagnvart MCP-þjóninum og innihalda engin Microsoft-auðkenni. Hvern
  endurnýjunartóka biðlarans má aðeins nota einu sinni: hver endurnýjun skilar nýjum tóka og ógildir þann gamla.
  Hann virkar líka aðeins fyrir þá biðlaraskráningu sem hann var gefinn út fyrir.
- **Endurnýjun.** Þegar tóki MCP-þjónsins er notaður endurnýjar þjónninn Entra tóka notandans hjá Microsoft. Ef
  Microsoft hafnar því (notandinn var gerður óvirkur, setunni var rift eða Conditional Access krefst þess) mistekst
  endurnýjun biðlarans og notandinn þarf að skrá sig inn aftur.

</details>

<details id="ending-access">
<summary>Hve lengi varir aðgangur notanda og hvernig er honum lokið?</summary>

Þar sem MCP-þjónninn geymir Entra endurnýjunartóka notandans heldur gervigreindarbiðlari notandans áfram að virka án
nýrrar innskráningar þar til aðganginum er lokið eða Microsoft hafnar endurnýjun. Hann starfar alltaf sem sá
notandi, með heimildum þess notanda.

- **Fyrir einn notanda:** gerðu notandann óvirkan eða riftu setum hans í Microsoft Entra ID. Næsta endurnýjun
  mistekst og notandinn þarf að skrá sig inn aftur.
- **Fyrir alla fyrirtækjaheildina:** gerðu fyrirtækjaforritið *Origo Bifrost* óvirkt eða eyddu því; sjá
  [Afturkalla það](/setup/consent/#withdraw-it).

</details>

<details id="azure-resource-manager">
<summary>Af hverju biður samþykkisskjárinn um Azure Resource Manager?</summary>

Azure Resource Manager er fyrir notendur sem hafa aðgang að mörgum leigjendum (tenants) með sama aðganginum.
MCP-þjónninn nær í hann á sama hátt og Business Central: fyrir hönd innskráða notandans, með heimildum notandans
sjálfs.

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
