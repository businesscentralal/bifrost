---
id: time-sheet-date
title: "Dagsetning vinnuskýrslu"
sidebar_position: 1
---

**Dagsetning vinnuskýrslu** er dálkur í línum sölureikninga og sölukreditreikninga, bæði bókaðra og óbókaðra.
Hann sýnir dagsetningu vinnunnar sem línan reikningsfærir, svo viðskiptavinur sjái fyrir hvaða dag hver
verkefnalína er.

Dálkinn bætir Bifröst verkefni (Bifrost Projects) við á fjórar síður: **Sölureikningur**,
**Sölukreditreikningur**, **Bókaður sölureikningur** og **Bókaður sölukreditreikningur**. Hann er rétt á
undan **Lýsing** og er skrifvarinn.

## Hvað hann sýnir

Þegar reikningur eða kreditreikningur er stofnaður út frá verkáætlunarlínum, til dæmis með **Stofna
sölureikning** á áætlunarlínunum, fær hver ný sölulína dagsetninguna úr áætlunarlínunni sem hún kom frá:
**Dagsetning skjals** áætlunarlínunnar, eða **Áætlunardagsetningu** hennar ef dagsetning skjals er auð.
Bókun afritar dagsetninguna í bókuðu reikningslínuna eða kreditreikningslínuna.

Dálkurinn er auður í línu sem var ekki stofnuð út frá verkefni, til dæmis línu sem er slegin inn handvirkt.
Hann er líka auður ef engin áætlunarlína finnst fyrir línuna.

Reikningar og kreditreikningar sem voru til þegar Bifröst verkefni voru sett upp eða uppfærð eru fyllt út á
sama hátt einu sinni, fyrir línur sem koma úr verkefni og hafa enga dagsetningu. Dagsetningu sem er þegar til
staðar er aldrei breytt.

## Hvenær dálkurinn sést

Dálkurinn sést í fyrirtæki sem hefur reikningslínur eða kreditreikningslínur sem voru stofnaðar út frá
verkefnum, og er falinn í fyrirtæki sem hefur engar slíkar. Business Central ákveður þetta þegar línuhlutinn
opnast, þannig að valið gildir fyrir fyrirtækið en ekki fyrir hvert skjal: í fyrirtæki sem reikningsfærir
verkefni sést dálkurinn líka á skjali án verkefnalína, þar sem hann er auður.

Dálkurinn krefst einnig notkunarsviðsins **Verkefni** (Jobs), eins og aðrar verkefnaaðgerðir.

## Sýna eða fela dálkinn sjálf

Hver notandi getur sýnt eða falið dálkinn með sérsníðingu. Veldu **Stillingar**, síðan **Sérsníða**, á
síðunni og bættu við eða fjarlægðu **Dagsetning vinnuskýrslu**. Valið gildir aðeins fyrir þann notanda.

## Lesið utan Business Central

Reiturinn kemur fram í almennum færslulestri Bifröst MCP-þjónsins sem `TimeSheetDateori`. Engin ný
skilaboðategund bætist við.
