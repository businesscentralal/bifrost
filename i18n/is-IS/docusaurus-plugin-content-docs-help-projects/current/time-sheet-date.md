---
id: time-sheet-date
title: "Dagsetning vinnuskýrslu"
sidebar_position: 5
---

**Dagsetning vinnuskýrslu** er dálkur í línum sölureikninga og sölukreditreikninga, bæði bókaðra og
óbókaðra. Hann sýnir dagsetningu vinnunnar sem línan reikningsfærir, svo viðskiptavinurinn sjái hvaða dag
hver verkefnalína á við.

Bifröst verkefni bæta dálkinum við fjórar síður: **Sölureikningur**, **Sölukreditreikningur**, **Bókaður
sölureikningur** og **Bókaður sölukreditreikningur**. Hann er næst á undan **Lýsing** og ekki er hægt að
breyta honum.

<!-- screenshot: Sales Invoice, Time Sheet Date column 1033 -->
<!-- screenshot: Sales Invoice, Time Sheet Date column 1039 -->

## Hvað hann sýnir {#what-it-shows}

Þegar reikningur eða kreditreikningur er stofnaður út frá áætlunarlínum verkefnis, til dæmis með
**Stofna sölureikning** á áætlunarlínunum, fær hver ný sölulína dagsetningu áætlunarlínunnar sem hún kom
frá: **Dagsetning skjals** í áætlunarlínunni, eða **Áætlunardagsetning** ef dagsetning skjals er auð. Við
bókun fylgir dagsetningin með í línu bókaða reikningsins eða kreditreikningsins.

Dálkurinn er auður í línu sem var ekki stofnuð út frá verkefni, til dæmis línu sem var slegin inn
handvirkt. Hann er líka auður ef engin áætlunarlína finnst fyrir línuna.

Reikningar og kreditreikningar sem voru þegar til þegar Bifröst verkefni voru sett upp eða uppfærð eru
fylltir út á sama hátt, einu sinni, í línum sem komu úr verkefni og hafa enga dagsetningu. Dagsetningu sem
er þegar skráð er aldrei breytt.

## Hvenær dálkurinn sést {#when-the-column-is-visible}

Dálkurinn sést í fyrirtæki sem á reiknings- eða kreditreikningslínur sem voru stofnaðar út frá
verkefnum, en er falinn í fyrirtæki sem á engar slíkar línur. Business Central ákveður þetta þegar
línuhlutinn opnast, svo valið gildir fyrir fyrirtækið en ekki hvert skjal fyrir sig: í fyrirtæki sem
reikningsfærir verkefni sést dálkurinn líka á skjali án verkefnalína, og er þá auður.

Dálkurinn krefst líka notkunarsviðsins **Verkefni** (Jobs), eins og aðrar verkefnaaðgerðir.

## Sýna eða fela dálkinn sjálf {#show-or-hide-the-column-yourself}

Hver notandi getur sýnt eða falið dálkinn með sérstillingu. Veldu **Stillingar** og svo **Sérstilla** á
síðunni, og bættu við eða fjarlægðu **Dagsetning vinnuskýrslu**. Valið gildir aðeins fyrir þann notanda.

Meira um forritið: [Bifröst verkefni](/projects/).
