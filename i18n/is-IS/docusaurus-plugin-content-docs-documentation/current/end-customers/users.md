---
id: users
sidebar_position: 2
title: "Notkun Bifröst"
sidebar_label: "Notendur"
description: "Hvað þú getur beðið gervigreindaraðstoðarmann að gera í Business Central í gegnum Bifröst, hvað hann gerir ekki, og hvað á að gera þegar hann segir nei."
---

# Notkun Bifröst

Einhver í fyrirtækinu þínu hefur tengt gervigreindaraðstoðarmann, til dæmis Copilot eða Claude, við Business Central og
sagt þér að nú getirðu beðið hann að gera hluti. Bifröst er hlutinn sem breytir beiðni þinni í eitthvað sem Business
Central gerir. Þessi síða segir hvað það þýðir fyrir þig.

## Áður en þú byrjar {#before-you-start}

- **Hvar á að spyrja.** Í gervigreindaraðstoðarmanninum sem fyrirtækið þitt tengdi, til dæmis Microsoft Copilot eða
  Claude. Kerfisstjórinn segir þér hver það er og hvernig hann er opnaður.
- **Tengstu einu sinni.** Bættu Bifröst við aðstoðarmanninn og skráðu þig inn með vinnureikningnum þínum; skrefin eru í
  [Tengdu gervigreindaraðstoðarmanninn](/setup/connect-your-ai/#add-bifröst-to-the-assistant).
- **Í fyrsta sinn** gæti Bifröst gefið þér tengil til að samþykkja aðstoðarmanninn áður en hann getur starfað fyrir þig.
  Opnaðu hann, eða sendu kerfisstjóranum. Aðstoðarmaðurinn sjálfur gæti líka spurt áður en hann notar Bifröst-verkfæri,
  eins og Claude gerir með **Allow once**: leyfðu það þegar þú þekkir beiðnina.
- **Fyrsta spurning til að prófa:** *„Hver er ég í Business Central?"* Svarið ætti að vera þinn eigin notandi og þitt
  fyrirtæki. Ef fyrirtækið er rangt, biddu hann að skipta um fyrirtæki; ef notandinn er rangur, hættu og láttu
  kerfisstjórann vita.

## Hvernig samtal lítur út {#what-a-conversation-looks-like}

> **Þú:** Bókaðu sölupöntunina fyrir Adatum frá því í gær.
>
> **Aðstoðarmaður:** Ég fann sölupöntun 1023 fyrir Adatum Corporation, dagsetta 17. september, 3 línur, 412.500 kr.
> Á ég að sýna þér fyrst hvað bókunin myndi gera?
>
> **Þú:** Já, sýndu mér.
>
> **Aðstoðarmaður:** Bókunin myndi stofna reikningslínur fyrir vörurnar 3, viðskiptamannafærslu upp á 412.500 kr. og
> samsvarandi fjárhags- og VSK-færslur. Á ég að bóka hana?
>
> **Þú:** Já.
>
> **Aðstoðarmaður:** Bókað. Reikningur 103045 var stofnaður.

Hér er raunverulegt svar, í Claude, við spurningu um birgðir:

![Raunverulegt svar í Claude: hve mikið af vöru 1896-S er hægt að lofa í þessari viku](/img/setup/claude-answer-availability.png)

Talan 510 gerir ráð fyrir 7 einingum sem eru í pöntun og eiga að koma í vikunni; aðstoðarmaðurinn segir það, og gefur
örugga tölu, 503, ef þær tefjast.

**Athugaðu það sjálf(ur).** Biddu um tengil á færsluna, og opnaðu hana í Business Central:

![Claude fær tengil á vöruna frá Business Central. Leigjandinn er falinn á myndinni.](/img/setup/claude-answer-link.png)

Tengillinn opnar síðuna í Business Central með þínum eigin réttindum, svo þú sérð sömu tölur og svarið byggði á:

![Vöruspjaldið sem tengillinn opnar: birgðir 510, 7 á innkaupalínum og 6 á sölulínum](/img/setup/bc-item-card-from-link.png)

Á bak við samtal eins og það hér að ofan spurði aðstoðarmaðurinn Bifröst hvaða aðgerðir væru til, las leiðbeiningarnar
um bókun sölupöntunar, spurði þig um það eina sem hann gat ekki vitað, og síðan bókaði Business Central pöntunina með sömu
athugunum, númeraröðum og færslum og þegar þú bókar hana sjálf(ur).

## Hvað þú getur spurt um {#what-you-can-ask}

Það þarf ekki að kenna aðstoðarmanninum hvað er hægt: hann spyr Bifröst um listann yfir það sem hann getur gert í
Business Central. Sá listi stækkar með forritunum sem fyrirtækið þitt hefur sett upp.

import AskOrAct from '@site/src/components/AskOrAct';

<AskOrAct />

- **Flettu einhverju upp.** *„Hver er staða Adatum?" · „Er vara 1896-S til á lager?" · „Hvaða sölupantanir eru komnar
  fram yfir afhendingardag?"* Þetta les aðeins.
- **Gerðu eitt.** *„Gefðu út pöntun 1023." · „Bókaðu innkaupareikninginn frá Fabrikam."* Aðstoðarmenn spyrja yfirleitt
  áður en þeir breyta einhverju; ef þinn gerir það ekki, segðu honum að gera það. Fyrir bókun getur hann sýnt þér fyrst
  hvað bókunin myndi gera.
- **Gerðu röð af hlutum.** *„Stofnaðu sölureikning fyrir septembertímana í Adatum-verkinu og sendu hann."* Nokkrar
  aðgerðir í röð, þar sem niðurstaða einnar nærir þá næstu. Ef skref mistekst getur aðstoðarmaðurinn sagt þér hvert og af
  hverju.
- **Notaðu það sem önnur forrit bæta við.** Hvert Bifröst forrit sem fyrirtækið þitt setur upp bætir við eigin aðgerðum,
  og aðstoðarmaðurinn getur sameinað þær í sama samtali; sjá [forritalistann](/apps/).
- **Spurðu hvað er hægt.** *„Hvað geturðu gert með innkaupapantanir?"* Aðstoðarmaðurinn flettir því upp í Bifröst og
  segir þér.

## Athugaðu hvað aðstoðarmaðurinn gerði {#check-what-the-assistant-did}

- **Opnaðu færsluna.** Biddu um tengil á hana og opnaðu hana í Business Central, eins og að ofan.
- **Sjáðu hvert kall.** Hvert kall sem aðstoðarmaður gerir fyrir þig er geymt á **Bifröst skilaboðum**
  (**Uppsetning Bifröst › Skilaboð › Bifröst skilaboð**). Hver lína er eitt kall: hvað var gert, hvort það tókst, og hvaða
  verkfæri kallaði. Veldu línu til að sjá beiðnina og svarið. Ef kall mistókst segir svarið hvað fór úrskeiðis á mæltu
  máli.

## Hvað aðstoðarmaðurinn man {#what-the-assistant-remembers}

Aðstoðarmenn gleyma öllu milli spjalla. Bifröst gefur þeim minni í Business Central sem þeir geta lesið næst:

- **Fyrirtækisminni**, sameiginlegt öllum í fyrirtækinu: venjur á borð við *Fjárhagsárið okkar byrjar 1. júlí*.
- **Notandaminni**, aðeins þitt: hvernig þú vilt hafa hlutina, til dæmis *Sýndu upphæðir án aukastafa*.

Biddu aðstoðarmanninn að muna eitthvað (*„Mundu að fjárhagsárið okkar byrjar 1. júlí"*), eða gleyma því. Þú sérð minnin
í Business Central á **Uppsetning Bifröst › Tengt › Minni**.

![Fyrirtækisminni](/img/guides/is-is/company-memory.png)

![Notandaminni](/img/guides/is-is/user-memory.png)

Til að breyta fyrirtækisminninu þarf heimild sem kerfisstjórinn veitir (`BIFROST CoMem ori`). Settu ekki lykilorð eða
persónuupplýsingar í minni: allir í fyrirtækinu geta lesið fyrirtækisminnið.

## Samþykki nýs aðstoðarmanns {#approving-a-new-assistant}

Fyrirtækið þitt gæti krafist þess að hver nýr aðstoðarmaður eða verkfæri sé samþykkt einu sinni áður en það getur starfað
fyrir þig. Í fyrsta sinn sem þú notar það gefur aðstoðarmaðurinn þér þá tengil. Opnaðu hann í Business Central og
samþykktu verkfærið, eða sendu kerfisstjóranum tengilinn. Eftir það virkar það eins og venjulega.

## Hver getur notað það {#who-can-use-it}

Hver sá sem kerfisstjóri hefur veitt Bifröst-heimildirnar fyrir notanda sinn í Business Central. Aðstoðarmaðurinn vinnur
þá með nákvæmlega réttindi þess notanda. Það er engin sérstök innskráning í Bifröst og ekkert að setja upp; þú bætir
Bifröst aðeins einu sinni við aðstoðarmanninn. Ef aðstoðarmaðurinn nær alls ekki í Business Central, spurðu
kerfisstjórann.

## Hvað það gerir ekki {#what-it-will-not-do}

- **Neitt sem þú mátt ekki.** Aðstoðarmaðurinn vinnur sem þú, með þínum heimildum. Ef þú getur ekki bókað reikninga í
  Business Central getur hann það ekki heldur.
- **Fer ekki framhjá Business Central.** Bókunarreglur, villuprófanir og endurskoðunarslóðin gilda eins og í Business
  Central biðlaranum.
- **Skilar ekki reitum sem kerfisstjórinn hefur takmarkað** fyrir Bifröst. Svarið sleppir þeim einfaldlega.
- **Starfar ekki fyrir þig úr aðstoðarmanni sem enginn hefur samþykkt**, ef fyrirtækið þitt krefst samþykktar. Nýr
  aðstoðarmaður þarf þá að vera samþykktur einu sinni áður en hann getur starfað sem þú.

**Hann getur raunverulega bókað, sent og eytt**, með þínum réttindum. Aðstoðarmaðurinn er samt hugbúnaður sem getur
misskilið þig: segðu *„sýndu mér fyrst"*, og lestu það sem hann leggur til áður en þú segir já.

## Þegar hann segir nei {#when-it-says-no}

| Aðstoðarmaðurinn segir | Það þýðir | Hvern á að spyrja |
| --- | --- | --- |
| Hann hefur engin Business Central verkfæri, eða svarar eins og Bifröst sé ekki til | Ekki er kveikt á tengingunni í þessu spjalli. Kveiktu á henni (í Claude: **+**, síðan **Connectors**) og spurðu aftur. | Þú |
| Aðgerðin er ekki í boði | Slökkt er á henni í fyrirtækinu þínu, eða forritið sem býður hana er ekki uppsett. | Kerfisstjórann |
| Hann getur það ekki enn | Engin aðgerð er til fyrir þetta verk í forritunum sem þú hefur. Það er ekki villa: annað forrit gæti haft hana, eða það er hægt að smíða hana; sjá [Vantar eitthvað?](/documentation/how-it-works/#what-it-covers-and-how-it-grows). | Kerfisstjórann eða samstarfsaðilann |
| Þú hefur ekki heimild | Þú hefur ekki þá heimild í Business Central, og aðstoðarmaðurinn hefur nákvæmlega þín réttindi. | Kerfisstjórann |
| Hluta svarsins vantar | Þeir reitir eru takmarkaðir fyrir þig. | Kerfisstjórann, ef þú þarft þá |
| Það þarf fyrst að samþykkja verkfærið, með tengli | Fyrirtækið þitt krefst þess að ný aðstoðarverkfæri séu samþykkt einu sinni. Opnaðu tengilinn, eða sendu kerfisstjóranum hann. | Þú, eða kerfisstjórinn |
| Heimildin er uppurin | Fyrirtækið þitt getur takmarkað hve mikið aðstoðarmaðurinn gerir í hverjum mánuði, fyrir alla eða fyrir þig, og þeim mörkum er náð. | Kerfisstjórann |
| Bifröst hafnar köllum fyrir fyrirtækið | Uppsetningarleiðsögninni hefur ekki verið lokið í þessu fyrirtæki. | Kerfisstjórann |
| Eitthvað var bókað sem hefði ekki átt að bóka | Aðstoðarmaðurinn gerði það sem hann var beðinn um, með þínum réttindum. Bakfærðu það í Business Central eins og hverja aðra bókun og láttu kerfisstjórann vita; hver beiðni og hvert svar er skráð, svo það má rekja. | Kerfisstjórann |

Ef aðstoðarmaðurinn bregst með því sem lítur út fyrir að vera tæknileg villa, biddu hann að sýna þér villutextann. Svar
Bifröst segir hvað fór úrskeiðis á mæltu máli. Kerfisstjórinn getur líka séð hvert kall sem aðstoðarmaðurinn gerði fyrir
þig, á síðunni **Bifröst skilaboð** í Business Central.

## Góðar venjur {#good-habits}

- **Byrjaðu hvert spjall á tengitextanum** (**Biðja um Tengingu**) sem kerfisstjórinn gefur þér, og athugaðu fyrirtækið í
  fyrsta svarinu.
- **Segðu „sýndu mér fyrst"** áður en eitthvað er bókað, sent eða eytt.
- **Biddu um tengla** og opnaðu færslurnar þegar svarið skiptir máli.
- **Hafðu eitt verk í hverju spjalli**: langt spjall gerir aðstoðarmanninum auðveldara að rugla hlutum saman.
- **Láttu kerfisstjórann vita** þegar aðstoðarmaðurinn gerir eitthvað óvænt. Bifröst skilaboð sýna nákvæmlega hvað gerðist.

## Næst {#next}

- [Hvernig Bifröst virkar](/documentation/how-it-works/): hugmyndirnar á bak við það
