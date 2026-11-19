---
id: bifrost-groups
title: "Hópar Bifröst"
---

Notaðu **Hópa Bifröst** til að samnýta reglur um reitaaðgang, óvirkar aðgerðir og kerfisleiðbeiningar fyrir notendur og forritsaðganga. Hópur geymir sameiginlegar Bifröst-stillingar fyrir meðlimi sína. Stjórnendur sjá um hópa og hver meðlimur getur tilheyrt einum hópi.

## Opna hópa {#open-groups}

1. Opnaðu **Uppsetningu Bifröst**.
2. Veldu **Hópar** undir aðgerðunum í **Uppsetning**.
3. Opnaðu hóp til að sjá spjaldið **Hópur Bifröst**. Listarnir **Reitaaðgangur hóps** og **Óvirkar skilaboðategundir** eru á spjaldinu.

Þú þarft heimild til að stjórna hópum Bifröst. Ef aðgangi að síðunni er hafnað skaltu biðja stjórnanda Bifröst um að gera breytinguna.

## Stofna hóp {#create-a-group}

1. Veldu **Nýtt** á síðunni **Hópar Bifröst**.
2. Sláðu inn einkvæman **Kóða** og lýsandi **Heiti**.
3. Stilltu reitaaðgang, óvirkar aðgerðir og sameiginlegar **Kerfisleiðbeiningar** á spjaldinu eftir þörfum.

| Reitur | Notkun |
| --- | --- |
| **Kóði** | Auðkennir hópinn. Til að nota annan kóða skaltu stofna annan hóp og færa meðlimina. |
| **Heiti** | Lýsir því fyrir hverja hópurinn er. |
| **Sjálfgefið** | Velur sjálfgefinn hóp. Þegar annar hópur er valinn fellur þessi stilling niður á þeim fyrri. |
| **Kerfisleiðbeiningar** | Sameiginlegar leiðbeiningar fyrir aðstoðarmanninn. Eigin leiðbeiningar meðlims hafa forgang. Ef þær eru auðar eru leiðbeiningar úthlutaða hópsins notaðar og þar á eftir leiðbeiningar sjálfgefna hópsins. |

## Úthluta meðlimum {#assign-members}

1. Farðu aftur í **Uppsetningu Bifröst** og veldu **Uppsetning notenda**.
2. Opnaðu uppsetningarspjald notandans eða forritsaðgangsins.
3. Veldu kóða hópsins í **Hópkóði**.

Veldu annan hóp til að færa meðlim. Hafðu **Hópkóði** auðan til að nota sjálfgefna hópinn. Aðild er stillt á uppsetningarspjaldi aðgangsins, ekki á hópspjaldinu.

## Stilla reitaaðgang {#set-field-access}

Bættu við línu í **Reitaaðgangur hóps** fyrir hvert svið sem þú vilt stjórna:

1. Veldu **Töflunúmer** og **Reitur nr.** Notaðu reit `0` fyrir alla reiti töflunnar eða töflu `0` og reit `0` fyrir allar töflur.
2. Veldu **Tegund takmarkana**.

| Tegund takmarkana | Áhrif |
| --- | --- |
| **Lesa** | Takmarkar lestur á völdu sviði. |
| **Skrifa** | Takmarkar skrif á völdu sviði. |
| **Bæði** | Takmarkar bæði lestur og skrif. |
| **Engin** | Afléttir takmörkun reitaaðgangs á þessu sviði og getur opnað fyrir sjálfgefnar takmarkanir. Aðrar athuganir gilda áfram. |
| **Framhjá** | Afléttir einnig breytingaskrárvörn við skrif á þessu sviði. Veitir ekki heimildir í Business Central og afléttir ekki vernduðum takmörkunum. |

Meðlimur sem hefur eigin reitaaðgangsfærslur notar þær í stað reglna hópsins. Annars gilda reglur sjálfgefna hópsins, en reglur úthlutaða hópsins koma í stað þeirra á þeim sviðum sem þær ná yfir. Regla úthlutaðs hóps fyrir heila töflu kemur í stað reglna sjálfgefna hópsins fyrir þá töflu. Regla fyrir allar töflur kemur í stað allra reglna sjálfgefna hópsins. Af þeim reglum sem eftir standa gildir sú sértækasta.

Skoðaðu eigin [reitaaðgang meðlimsins](/help/foundation/bifrost-field-accesses/) ef breyting á hópnum hefur engin áhrif. Hópreglur veita ekki heimildir í Business Central.

## Gera aðgerð óvirka eða aflétta takmörkun {#disable-or-restore-an-operation}

Veldu aðgerð í **Óvirkar skilaboðategundir** til að gera hana óaðgengilega fyrir meðlimi hópsins. Eyddu línunni til að aflétta þeirri hóptakmörkun.

Listinn tilheyrir úthlutaða hópnum eða sjálfgefna hópnum ef meðlimurinn hefur engan hóp. Listi úthlutaðs hóps er ekki sameinaður lista sjálfgefna hópsins. Þótt línu sé eytt verður aðgerðin ekki aðgengileg ef önnur skilyrði eða heimildir koma enn í veg fyrir hana.

## Fjarlægja hóp {#remove-a-group}

1. Færðu notendur og forritsaðganga hópsins í annan hóp eða hreinsaðu **Hópkóði** til að nota sjálfgefna hópinn.
2. Ef hópurinn er sjálfgefinn skaltu fyrst velja **Sjálfgefið** á öðrum hópi.
3. Eyddu ónotaða hópnum á síðunni **Hópar Bifröst**.

Reitaaðgangsfærslur hópsins og línur fyrir óvirkar aðgerðir eyðast með honum. Ekki er hægt að eyða hópi sem hefur úthlutaða meðlimi eða er sjálfgefinn.

Eftir breytingu á hópi skaltu skoða viðkomandi aðgang í [Uppsetningu notanda Bifröst](/help/foundation/bifrost-user-setup-list/) og ganga úr skugga um að hópaðild og eigin stillingar séu eins og til var ætlast.
