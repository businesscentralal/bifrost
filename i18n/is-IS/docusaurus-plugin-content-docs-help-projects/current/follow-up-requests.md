---
id: follow-up-requests
title: "Eftirfylgnibeiðnir verkefna"
sidebar_position: 2
---

**Eftirfylgnibeiðnir verkefna** sýnir þá viðbótarvinnu sem tæknimenn hafa beðið um á verkhlutum, og hvað
verkefnisstjórinn ákvað um hverja beiðni. Tæknimaður notar síðuna til að sjá eigin beiðnir; verkefnisstjóri
notar hana til að sjá beiðnir á verkefnunum sem hann stýrir.

Beiðni er send úr aðstoðarmanni tæknimannsins, oftast í lok heimsóknar: „það þarf að skipta um seinni
dæluventilinn, um þrjár stundir, í næstu viku“. Í henni kemur fram verkhlutinn sem hún kom frá, forði
tæknimannsins, lýsing og eftir atvikum áætlaðar stundir, vörur, óskadagsetning, forgangur og myndir.
Verkefnisstjórinn breytir beiðninni síðan í verkefnavinnu eða hafnar henni, líka í gegnum aðstoðarmann.
Síðan sýnir beiðnirnar og niðurstöðuna en breytir þeim ekki.

Leitaðu að **Eftirfylgnibeiðnir verkefna** í Business Central til að opna síðuna.

<!-- screenshot: Project Follow-up Requests 1033 -->
<!-- screenshot: Project Follow-up Requests 1039 -->

## Hvaða beiðnir þú sérð {#which-requests-you-see}

- **Tæknimaður** sér beiðnirnar sem hann sendi sjálfur.
- **Verkefnisstjóri** sér beiðnir á verkefnum þar sem hann er **verkefnisstjóri**, eða þar sem
  **ábyrgðarmaður** verkefnisins er forði sem hann á tímaskýrslurnar fyrir. Verkefnisstjóri er sá sem má
  breyta verkhlutum og áætlunarlínum í Business Central.

## Reitir {#fields}

| Reitur | Hvað hann sýnir |
| --- | --- |
| **Beiðninúmer** | Númer beiðninnar. |
| **Verkefnisnúmer** | Verkefnið sem beiðnin varðar. |
| **Upprunalegur verkþáttur** | Verkhlutinn sem tæknimaðurinn vann við þegar beiðnin var send. |
| **Forði tæknimanns** | Forði tæknimannsins. |
| **Lýsing** | Hvað þarf að gera. |
| **Áætlaðar stundir** | Mat tæknimannsins á því hve margar stundir verkið tekur, ef það er gefið. |
| **Óskadagsetning** | Hvenær helst ætti að vinna verkið, ef hún er gefin. |
| **Forgangur** | Hversu áríðandi tæknimaðurinn segir verkið vera, ef það er gefið. |
| **Staða** | **Opin** þar til verkefnisstjórinn tekur ákvörðun, síðan **Umbreytt** eða **Hafnað**. |
| **Stofnaður verkþáttur** | Verkhlutinn sem beiðninni var breytt í, nýr eða sem var þegar til. |
| **Áætlunarlína forða** | Áætlunarlína forða sem var stofnuð fyrir áætluðu stundirnar þegar beiðninni var breytt. |
| **Ákvörðunartími** | Hvenær beiðninni var breytt eða henni hafnað. |
| **Ástæða höfnunar** | Hvers vegna beiðninni var hafnað. |

Síðan hefur engar eigin aðgerðir.

## Þegar beiðni er breytt í verk {#what-converting-does}

Þegar beiðni er breytt verður hún að verkefnavinnu, í einu skrefi sem annaðhvort tekst að fullu eða
breytir engu:

- **Nýr eða núverandi verkhluti.** Beiðnin verður að nýjum verkhluta, sem fær númer á eftir upprunalega
  verkhlutanum samkvæmt **Hækkun verkþáttanúmers við eftirfylgni** á
  [Uppsetning verkefna](/help/projects/projects/), eða vinnunni er bætt við verkhluta sem er þegar til,
  sjálfgefið upprunalega verkhlutann.
- **Áætlunarlínur.** Áætluðu stundirnar verða að áætlunarlínu forða. Vörur með vörunúmeri verða að
  áætlunarlínum vöru; vörur sem aðeins er lýst með orðum verða að textalínum.
- **Forskoðun fyrst.** Aðstoðarmaður verkefnisstjórans getur sýnt hvað breytingin myndi stofna, án þess
  að nokkuð sé vistað, áður en beiðninni er breytt.
- **Ekkert er bókað.** Beiðni sem hefur verið breytt í verk má svo bjóða viðskiptavininum í tilboði eins
  og aðra verkefnavinnu.

## Gott að vita {#good-to-know}

- **Ákvörðun er endanleg.** Beiðni er breytt eða henni hafnað einu sinni; ekki er hægt að ákveða aftur.
  Ástæða höfnunar er geymd á beiðninni.
- **Opnum beiðnum má enn breyta.** Á meðan beiðni er opin getur tæknimaðurinn sem sendi hana eða
  ábyrgur verkefnisstjóri breytt efni hennar. Eftir ákvörðun er hún geymd óbreytt.
- **Tæknimenn taka ekki ákvarðanir.** Aðstoðarmaður tæknimanns getur sent og skoðað beiðnir, en ekki
  breytt þeim í verk eða hafnað þeim.
- **Heimildir.** Tæknimenn þurfa `BIFROST Read ori` og `PROJ FIELD TECH ori`. Verkefnisstjórar þurfa
  `BIFROST Full ori` og heimild til að breyta verkhlutum og áætlunarlínum. Kveikt verður að vera á
  **Virkt** á Uppsetning verkefna.
- **Engin skilaboð eru send.** Enginn fær tilkynningu þegar beiðni er send; verkefnisstjórinn sér hana
  hér og í sínum aðstoðarmanni.

Meira um forritið: [Bifröst verkefni](/projects/).
