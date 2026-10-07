---
id: index
title: "Prófaðu"
sidebar_label: "Prófaðu"
sidebar_position: 1
slug: /
displayed_sidebar: null
description: "Prófaðu Bifröst í Business Central sandkassa: hvað á að setja upp, hvað á að spyrja fyrst og hvað á að skoða."
---

# Prófaðu

*Fyrir kerfisstjóra og alla sem meta Bifröst. Notarðu það þegar í vinnunni? Sjá
[Notkun Bifröst](/documentation/end-customers/users/).*

Besta leiðin til að sjá hvað Bifröst gerir er að spyrja það einhvers. **Business Central sandkassi** með
sýnigögnum er rétti staðurinn: ekkert sem þú prófar snertir raunverulega fyrirtækið þitt, og sandkassi þarf
engan prufutíma.

## Fljótlega leiðin, í sandkassa {#the-quick-path-in-a-sandbox}

**Hverja þarf:** Business Central kerfisstjóra sem getur stofnað sandkassa og sett upp forrit (SUPER, fyrir
útleiðandi HTTP í uppsetningarleiðsögninni), og Entra kerfisstjóra fyrir samþykkið sem gefið er einu sinni.

1. **Stofnaðu sandkassa** með sýnigögnum í stjórnstöð Business Central, eða notaðu einn sem þú átt.
2. **Settu Bifröst Foundation upp** úr Extension Marketplace. Sjá [skref 1](/setup/get-the-app/).
3. **Keyrðu uppsetningarleiðsögnina** af Uppsetningu Bifröst. Ef notandinn þinn hefur SUPER hefur hann þegar
   það sem Bifröst þarf; annars gefurðu honum `BIFROST API ori`, og `BIFROST GL Post ori` fyrir forskoðun
   bókana. Sjá [skref 2](/setup/business-central/).
4. **Samþykktu einu sinni.** Entra kerfisstjórinn þinn opnar samþykkistengilinn úr skrefi 5 í leiðsögninni.
   Sjá [skref 3](/setup/connect-your-ai/#consent-once-for-your-organisation).
5. **Tengdu aðstoðarmanninn.** Í Claude, til dæmis: bættu Bifröst við sem tengingu, skráðu þig inn með
   vinnureikningnum og kveiktu á henni í spjalli. Aðrir aðstoðarmenn virka eins. Sjá
   [Bættu Bifröst við aðstoðarmanninn](/setup/connect-your-ai/#add-bifröst-to-the-assistant).

   ![Kveikt á Bifröst Origo fyrir spjall í Claude](/img/setup/claude-connector-in-chat.png)

6. **Beindu honum að sandkassanum.** Límdu **Biðja um Tengingu** af Uppsetningu Bifröst inn í spjallið, svo
   aðstoðarmaðurinn vinni í fyrirtæki sandkassans.
7. **Spurðu** *„Hver er ég í Business Central?“* og leyfðu aðstoðarmanninum að nota Bifröst þegar hann spyr.

   ![Svarið við „Who am I in Business Central?“ í Claude](/img/setup/claude-answer-whoami.png)

Skref 4 í Settu það upp, að takmarka reiti og stilla varðveislu, getur beðið meðan þú prófar á sýnigögnum.
Gerðu það áður en þú notar raunveruleg gögn.

## Hvað á að spyrja fyrst {#what-to-ask-first}

Þegar fyrsta svarið virkar, leyfðu honum að gera meira. Hvert stig byggir á því fyrra.

| Stig | Prófaðu að spyrja | Það sem þú ættir að sjá |
|---|---|---|
| **Svara** | *„Hvaða viðskiptamenn eiga hæstu gjaldfallnu stöðuna?“* | Tölur úr lifandi gögnum |
| **Kanna** | *„Hvaða svið geturðu notað hér?“*, svo *„Hvað geturðu gert með sölutilboð?“* | Sviðin sem þú hefur, svo hvað þú getur gert í einu þeirra |
| **Framkvæma, örugglega** | *„Gefðu út nýjustu opnu sölupöntunina og sýndu mér hvað bókun hennar myndi gera.“* | Útgefin pöntun og forskoðun bókunar. Ekkert bókað |
| **Tengja saman** | *„Hvaða sölupantanir eru komnar fram yfir afhendingardag? Flokkaðu þær eftir viðskiptamanni, með útistandandi upphæð.“* | Margar aðgerðir, eitt svar |

Prófaðu svo eigin spurningar: þær sem þú þyrftir venjulega skýrslu fyrir.

Spurt hvað hann getur gert, á mæltu máli:

![Svar Claude við „What can you do for me in this Business Central?“, flokkað eftir sviðum](/img/setup/claude-what-can-you-do.png)

Forskoðun bókunar: hvað bókun sölupöntunar myndi stofna, áður en nokkuð er bókað:

![Forskoðun Claude á bókun sölupöntunar: færslurnar sem hún myndi stofna, og ekkert bókað](/img/setup/claude-posting-preview.png)

## Hvað á að skoða {#what-to-look-at}

- **Bifröst skilaboð** í Business Central sýnir hvert kall sem aðstoðarmaðurinn gerði, með beiðninni og
  svarinu. Það er fljótlegasta leiðin til að sjá hvernig aðstoðarmaðurinn vann úr spurningunni þinni.
- **Færslan sjálf.** Biddu um tengil á hana og opnaðu hana í Business Central; sjá
  [Athugaðu það sjálf](/documentation/end-customers/users/#what-a-conversation-looks-like).
- **Hvar hann stoppar.** Sum verk hafa enga aðgerð enn, og aðstoðarmaðurinn á að segja það. Það eru
  mörk þess sem er uppsett; [Hvað það nær yfir](/documentation/how-it-works/#what-it-covers-and-how-it-grows)
  útskýrir það, hvernig forrit bæta við, og hvern á að spyrja.
- **Þegar hann segir nei** segir svarið af hverju. [Notkun Bifröst](/documentation/end-customers/users/#when-it-says-no)
  útskýrir algengu svörin.

## Þegar þú ert tilbúin(n) {#when-you-are-ready}

Settu það upp í framleiðsluumhverfi með [Settu það upp](/setup/), og sjá [Verð](/price/) varðandi leyfið.
