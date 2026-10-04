---
id: data-access
title: "Stjórnaðu því hvað fulltrúar lesa og breyta"
sidebar_label: "Hvað fulltrúar lesa og breyta"
sidebar_position: 3
description: "Fyrir kerfisstjóra: breytingaskrárverndin, reitaaðgangur, viðkvæmir reitir og gögnin sem Bifröst ver alltaf."
---

# Stjórnaðu því hvað fulltrúar lesa og breyta

Þessi síða er fyrir kerfisstjórann sem ákveður hvaða gögn gervigreindarfulltrúi eða samþætting má lesa og breyta í gegnum
Bifröst. Eftir lesturinn geturðu stillt **breytingaskrárverndina**, notað **reitaaðgang** fyrir einstaka notendur, varið
**viðkvæma reiti**, og þú veist hvaða gögn Bifröst ver alltaf. Hver má yfirleitt kalla í Bifröst, og hver má bóka, ræðst
af heimildasamstæðum: sjá [Heimildasamstæður og hlið](/documentation/end-customers/permissions/).

Allt hér er opnað frá **Uppsetningu Bifröst** og krefst `BIFROST Full ori`.

## Hvernig verndin fellur saman {#how-the-protections-fit-together}

Fulltrúi starfar alltaf sem notandi í Business Central, og samþætting sem Microsoft Entra forrit. Hver beiðni fer í gegnum
þessar athuganir, og sú strangasta ræður:

| Athugun | Stillt á | Gildir um |
|---|---|---|
| Heimildir notandans í Business Central | **Notendur**, **Microsoft Entra forrit** | Allt, eins og í biðlaranum |
| Heimildasamstæður og hlið Bifröst | Sömu síðum ([Heimildasamstæður og hlið](/documentation/end-customers/permissions/)) | Að kalla í Bifröst yfirleitt, bókun, samþykktir og aðrar aðgerðir á bak við hlið |
| Gögn sem Bifröst ver alltaf | Engu: innbyggt ([hér að neðan](#what-bifröst-always-protects)) | Alla notendur |
| Sjálfgefin vernd | Innbyggð, opnuð fyrir einn notanda með reitaaðgangi ([hér að neðan](#sensitive-fields)) | Alla notendur þar til hún er opnuð |
| **Reitaaðgangur** | **Uppsetning › Reitaaðgangur** ([hér að neðan](#field-access)) | Einn notanda eða eitt forrit |
| **Breytingaskrárvernd** | **Uppsetning Bifröst** ([hér að neðan](#the-changelog-write-guard)) | Breytingar á reitum, svo hver þeirra sé rakin í breytingaskránni |

Engin þessara stillinga breytir neinu í Business Central biðlaranum.

## Breytingaskrárverndin {#the-changelog-write-guard}

Verndin tryggir að reitur sem fulltrúi breytir sé rakinn í breytingaskrá Business Central. Hún gildir þegar fulltrúi
breytir reitum færslu, og þegar hann endurheimtir fyrra gildi úr breytingaskránni.

### Stillingin {#the-setting}

**Breytingaskrárvernd** er á **Uppsetningu Bifröst**, í hlutanum *Almennt*. **Virða næmi gagna**
([hér að neðan](#sensitive-fields)) er undir *Sýna meira*.

![Uppsetning Bifröst: Breytingaskrárvernd og Virða næmi gagna](/img/guides/is-is/setup-guard-and-sensitivity.png)

| Stilling | Fulltrúi má breyta reit þegar |
|---|---|
| **Lokað** (sjálfgefið) | breytingaskráin er virk og skráir breytingar á reitnum, eða undanþága nær til reitsins, eða notandinn hefur **Framhjá**-línu fyrir hann |
| **Með þvingunarheimild** | eins og **Lokað**; og auk þess þegar kallarinn biður um að þvinga breytinguna og hefur `BIFROST Force ori` |
| **Opið** | alltaf: engin athugun. Veldu þetta aðeins ef þú sættir þig við breytingar án slóðar |

Í öllum stillingum kemst þvinguð breyting notanda með `BIFROST Force ori` framhjá verndinni fyrir grunnstillingartöflur
fyrirtækisins; sjá [Grunnstillingarreitir fyrirtækisins](#company-configuration-fields).

### Uppsetning breytingaskrár {#change-log-setup}

Veldu **Uppsetning › Uppsetning breytingaskrár** á Uppsetningu Bifröst. Hún opnar síðu Business Central sjálfs.

![Uppsetning breytingaskrár](/img/guides/is-is/change-log-setup.png)

1. Kveiktu á **Breytingaskrá virk**. Business Central beitir henni á lotur sem hefjast eftir það.
2. Veldu **Uppsetning › Töflur** og finndu töfluna. Í **Skrá breytingar** velurðu **Allir reitir** til að ná til allra
   reita töflunnar, eða **Sumir reitir** til að velja reiti.

   ![Töflur breytingaskrár: Viðskiptamaður skráir suma reiti](/img/guides/is-is/change-log-tables.png)

3. Með **Sumir reitir** opnarðu reitalistann (**...** í **Skrá breytingar**) og hakar við **Skrá breytingar** fyrir hvern
   reit sem fulltrúar mega breyta.

   ![Reitir Viðskiptamanns: Sími er skráður](/img/guides/is-is/change-log-fields.png)

Aðeins **Skrá breytingar** skiptir máli fyrir verndina.

### Undanþágur {#guard-exceptions}

**Uppsetning › Undanþágur breytingaskrárverndar** telur upp reiti sem má breyta án breytingaskrár, fyrir alla notendur.
Bifröst bætir fjórum við við uppsetningu: **Kenni jöfnunar** og **Upphæð til jöfnunar** á viðskiptamanna- og
lánardrottnafærslum, sem jöfnun greiðslna þarf. Bættu reit hér aðeins við ef allir notendur mega breyta honum órakið.

![Undanþágur breytingaskrárverndar](/img/guides/is-is/guard-exceptions.png)

### Framhjá fyrir einn notanda {#bypass-for-one-user}

**Framhjá**-lína í **reitaaðgangi** ([hér að neðan](#field-access)) leyfir **aðeins þeim notanda eða forriti** að breyta
reitnum (eða öllum reitum töflunnar, eða allra taflna) án breytingaskrár. Hún takmarkar ekkert. Notaðu hana fyrir
samþættingu sem verður að halda reit uppfærðum þegar þú vilt ekki breytingar hennar í breytingaskránni. Fyrir alla aðra
helst verndin óbreytt.

## Reitaaðgangur {#field-access}

**Uppsetning › Reitaaðgangur** á Uppsetningu Bifröst opnar **Yfirlit reitaaðgangs Bifröst**: allar línur reitaaðgangs
allra notenda og forrita í fyrirtækinu. Veldu **Nýtt fyrir notanda...** til að bæta við línum fyrir notanda, eða
**Breyta** til að breyta línum valins notanda. Línur taka gildi strax. Nánar:
[Reitaaðgangar Bifröst](/help/foundation/bifrost-field-accesses/).

![Yfirlit reitaaðgangs Bifröst](/img/guides/is-is/field-access-overview.png)

Lína nefnir notanda (eða forrit), töflu og reit. **Töflunúmer 0** þýðir *allar töflur* og **Reitur nr. 0** þýðir *allir
reitir töflunnar*. Þegar fleiri en ein lína gæti átt við **ræður sú nákvæmasta**: línan fyrir reitinn, svo línan fyrir
töfluna, svo línan fyrir allar töflur. Aðeins sú eina lína er notuð.

| Tegund takmarkana | Lesa | Breyta | Breytingaskrárvernd |
|---|---|---|---|
| **Bæði** | Nei | Nei | - |
| **Lesa** | Nei | Já | Gildir |
| **Skrifa** | Já | Nei | - |
| **Engin** | Já | Já | Gildir |
| **Framhjá** | Já | Já | Sleppt fyrir þennan notanda |

**Engin** og **Framhjá** opna líka sjálfgefnu verndina í [Viðkvæmir reitir](#sensitive-fields) fyrir notandann: **Engin**
opnar sjálfgefið falda og sjálfgefið lokaða reiti, **Framhjá** opnar sjálfgefið lokaða reiti fyrir breytingum. Hvorug
opnar gögnin sem Bifröst [ver alltaf](#what-bifröst-always-protects).

**Beita ráðlögðu sniðmáti...** (á **Reitaaðgangar Bifröst**, síðunni sem **Breyta** og **Nýtt fyrir notanda...** opna)
bætir við **Lesa**-línum fyrir notendurna sem þú velur á símanúmerum, netföngum, kennitölum og bankaupplýsingum
viðskiptamanna, lánardrottna, tengiliða, söluskjala og bankareikninga. Það breytir aldrei línu sem er til, og lætur
notanda með línu fyrir heila töflu eða allar töflur í friði. Óhætt er að keyra það aftur, til dæmis fyrir nýja notendur.

Reitaaðgangur gildir um allt sem Bifröst les og skrifar reit fyrir reit: lestur færslna, breytingar á færslum, stofnun
skjala og færslubókarlína og endurheimt úr breytingaskrá. Bókun, samþykktum og öðrum aðgerðum á bak við hlið er stýrt með
heimildasamstæðunum ([Heimildasamstæður og hlið](/documentation/end-customers/permissions/)).

## Lokaðu öllum breytingum notanda og opnaðu svo það sem hann þarf {#block-every-change-for-a-user-then-open-what-they-need}

Algeng beiðni: *fulltrúinn má lesa, en má engu breyta nema viðskiptamönnum*. Tvær línur gera það:

| Notandi | Töflunúmer | Reitur nr. | Tegund takmarkana | Áhrif |
|---|---|---|---|---|
| notandinn | 0 (allar töflur) | 0 | **Skrifa** | Engu er hægt að breyta í gegnum Bifröst |
| notandinn | 18 (Viðskiptamaður) | 0 | **Engin** | Viðskiptamönnum er hægt að breyta aftur |

**Engin**-línan fyrir Viðskiptamann er nákvæmari en **Skrifa**-línan fyrir allar töflur, svo hún ræður fyrir alla reiti
Viðskiptamanns. Bættu við einni **Engin**-línu fyrir hverja töflu sem notandinn má breyta. Til að opna einn reit í stað
heillar töflu gefurðu línunni reitarnúmerið. Skjámyndin að ofan sýnir þessar tvær línur, ásamt **Framhjá**-línu fyrir
**Sími** á Viðskiptamanni og **Engin**-línu fyrir **Fæðingardagur** á Starfsmanni ([Viðkvæmir reitir](#sensitive-fields)).

Hafðu í huga:

- Breytingaskrárverndin gildir enn um opnuðu töflurnar: breytingaskráin verður að ná til reitanna, eða notandinn þarf
  **Framhjá**-línu.
- **Engin**-lína fyrir heila töflu opnar líka sjálfgefna vernd þeirrar töflu. **Engin**-lína á **Bankareikn.
  lánardrottins** opnar til dæmis bankareikningsnúmer lánardrottna fyrir breytingum. Opnaðu staka reiti þar.
- Notaðu ekki **Engin** fyrir allar töflur (tafla 0) til að „opna allt": það opnar alla sjálfgefna vernd fyrir notandann.
- Til að notandinn bóki ekki skaltu ekki gefa honum bókunarhlið.

## Viðkvæmir reitir {#sensitive-fields}

### Faldir eða lokaðir sjálfgefið {#hidden-or-closed-by-default}

Sumir reitir eru varðir fyrir alla notendur þar til þú opnar þá fyrir einn notanda:

| Vernd | Reitir |
|---|---|
| Faldir (hvorki lesnir né breytt) | Starfsmaður: **Fæðingardagur**, **Kennitala**, **Félagskóði**, **Félagsnúmer**, **Kyn**, **Bankanúmer**, **Númer bankareiknings**, **IBAN**, **SWIFT-kóði**. Forði: **Kennitala**. Heilu töflurnar **Ættmenni starfsmanns** og **Annað aðsetur**. |
| Lokaðir fyrir breytingum (lestur leyfður) | Bankaupplýsingar, sem hægt er að beina greiðslu annað í gegnum: **Bankareikn. lánardrottins** (bankanúmer, númer bankareiknings, kenninr., IBAN, SWIFT-kóði, greiðslumiðlunarkóði og -staðall banka), **Kóði forgangsbankareiknings** lánardrottins, **Bankareikningur viðtakanda**, **Greiðslutilvísun** og **Greiðslukóði** á færslubókarlínum og lánardrottnafærslum, bankareitir **Stofngagna** (gírónr., heiti banka, bankanúmer, númer bankareiknings, greiðslureglunr., IBAN, SWIFT-kóði) og **Bankareiknings** (númer bankareiknings, kenninr., bankanúmer, IBAN, SWIFT-kóði, greiðslumiðlunarkóði banka) |

### Flokkaðu sjálf: Virða næmi gagna {#classify-your-own-respect-data-sensitivity}

Veldu **Uppsetning › Næmi reita** á Uppsetningu Bifröst til að opna **Næmi reita Bifröst**. Hver lína flokkar reit sem
**Viðkvæmt** eða **Persónulegt**; ný lína þarf **Töflunúmer** og **Reitur nr.** **Beita ráðlagðri flokkun** fyllir inn
ráðlagðan lista; breyttu eða eyddu línum eftir þörfum.

![Næmi reita Bifröst eftir Beita ráðlagðri flokkun](/img/guides/is-is/field-sensitivities.png)

Á **Uppsetningu Bifröst**, undir *Sýna meira*, ræður **Virða næmi gagna** hvað flokkunin gerir:

- **Slökkt** (sjálfgefið): ekkert er falið.
- **Viðkvæmt**: reitir flokkaðir **Viðkvæmt** eru faldir fyrir öllum notendum, eins og sjálfgefið faldir reitir hér að
  ofan.
- **Viðkvæmt + Persónulegt**: reitir flokkaðir **Viðkvæmt** eða **Persónulegt** eru faldir.

### Opnaðu reit fyrir einn notanda {#open-a-field-for-one-user}

Bættu við **Engin**-línu í **reitaaðgangi** fyrir notandann og reitinn. Nákvæmasta línan ræður, svo reiturinn er aðeins
opnaður fyrir þann notanda og allt annað helst óbreytt. **Engin**-lína fyrir heila töflu opnar alla varða reiti þeirrar
töflu fyrir notandann.

## Það sem Bifröst ver alltaf {#what-bifröst-always-protects}

Þessi vernd er innbyggð. Engin lína í reitaaðgangi og ekkert annað forrit opnar hana.

### Hvorki lesið né breytt {#neither-read-nor-changed}

- Eigin stillingar og annálar Bifröst: Uppsetning Bifröst, reitaaðgangur, undanþágur, uppsetning eyðingaskráningar og
  eyðingaskrá, uppsetning notenda Bifröst, fyrirtækis- og notandaminni, athugasemdir, annáll beiðna og
  samþykktaannáll. Þau hafa sínar eigin síður.
- Breytingaskráin: **Uppsetning breytingaskrár**, uppsetning hennar fyrir töflur og reiti, og **Breytingaskrárfærsla**.
- Notendur og heimildir: **Notandi**, **Notandaeiginleiki**, **Sérstillingar notanda**, aðgangsstýring, töflur
  heimildasamstæðna, áskriftir, öryggishópar, aðgangur umboðsmanna og **Staða leiguleyfis**.
- Leyndarmál og tengingar: **Einangruð geymsla**, **Skyndiminni tákns**, **Uppsetning á OAuth 2.0**,
  **Þjónustutenging**, **Skjalaþjónusta** (og sviðsmyndir hennar) og **Stakt vottorð**.
- Vefkrókar: áskriftir og tilkynningar vefkróka og API-vefkróka, áskriftir ytri atburða og áskriftir vefkróka verkflæðis.
- Tölvupóstur: **Tölvupóstreikningur**, **Úthólf tölvupósts**, **Sendur tölvupóstur**, **Innhólf**, og skilaboðin,
  viðtakendurnir, viðhengin, villurnar og endurtilraunirnar á bak við þau.
- **Uppsetningarsíða reitavöktunar**, miðlunarefni (**Miðlunarefni leigjanda**, **Geymslumiðill** og þess háttar) og
  **Trúnaðarupplýsingar** starfsmanna.
- Allar töflur sem eru ekki venjulegar töflur, hafa verið fjarlægðar (úreltar) eða eru aðeins til á staðnum (on-premises).

### Lesið, en aldrei breytt {#read-but-never-changed}

- Skilaboð Bifröst (hver notandi les sín eigin; umsjónarmenn lesa öll) og skrá yfir leyndarmál forrita.
- **Notandauppsetning** Business Central: notandi gæti víkkað eigin bókunardagsetningar eða samþykktarmörk.
- Uppsetningar sem geyma leyndarmál við hlið vistfangs: **Uppsetning skjalaskiptaþjónustu**, **Uppsetning
  stafakennslaþjónustu**, **Uppsetning tengingar Microsoft Dynamics 365**, **Uppsetning Dataverse-tengingar**,
  **Uppsetning Microsoft Entra-forrits**, **Uppsetning Exchange-þjónustu**, **Office-stjórnendaskilríki**,
  **Uppsetning myndgreiningar**, **MF-félagi**, **Fyrirtækiseining** og **Microsoft Entra-forrit**.
- Samþykktir fulltrúar (uppruni setu); samþykktu þá eins og lýst er í
  [Ákveddu hvaða verkfæri mega starfa fyrir notanda](/setup/business-central/#decide-which-tools-may-act-for-a-user).
- Varðveisla og flokkun: **Uppsetning varðveislureglu** og línur hennar, **Varðveislutímabil**, **Gagnatrúnaður** og
  **Næmi reita Bifröst**.
- Bakgrunnsvinnsla og lotur: **Vinnsluraðarfærsla**, **Skrárfærsla vinnsluraðar**, **Virk lota**, **Lotuviðburður**,
  áskriftir atburða, **Áætlað verk**.
- **Sérstilling síðugagna**, vefþjónustur (**Vefþjónusta**, **Vefþjónusta leigjanda** og dálkar, síur og
  OData-stillingar hennar) og afkastamælingar.

### Stakir reitir sem eru aldrei lesnir {#single-fields-never-read}

Í töflum sem annars má lesa:

| Tafla | Aldrei lesið |
|---|---|
| Skilaboð Bifröst | Meginmál beiðni og svars, efnistegund þeirra og gjaldfærslutegundin (allri töflunni er aldrei breytt) |
| **Uppsetning skjalaskiptaþjónustu** | **Kennilykill** |
| **ADCS notandi** | **Aðgangsorð** |

### Grunnstillingarreitir fyrirtækisins {#company-configuration-fields}

Þessum reitum er aldrei breytt í daglegri notkun, því breyting myndi opna lokuð tímabil, rjúfa númeraraðir eða breyta því
sem stendur á hverjum reikningi:

| Tafla | Reitir |
|---|---|
| **Fjárhagsgrunnur** | **Bókun leyfð frá/til**, **Leyfa bókun frestana frá/til** og reiknireglur dagsetninga þeirra |
| **Reikningstímabil** | **Lokað**, **Dags. læst** |
| **Númeraröð** | **Sjálfgefin nr.röð**, **Handfærð nr.** |
| **Númeraraðarlína** | **Upphafsdagsetning**, **Upphafsnúmer**, **Lokanúmer**, **Viðvörunarnúmer**, **Bæta við nr.**, **Síðasta notað nr.**, **Upphafsröð nr.** |
| **Stofngögn** | **VSK-númer**, **Kennitala fyrirtækis** |

Til að setja fyrirtæki upp frá grunni getur fulltrúi samt breytt þeim: notandinn þarf `BIFROST Force ori` og fulltrúinn
biður um þvingaða breytingu. Slík þvinguð breyting kemst líka framhjá breytingaskrárverndinni fyrir alla reiti þessara
fimm taflna, hver sem stilling verndarinnar er, svo hægt sé að stofna nýjar númeraraðir og reikningstímabil áður en
breytingaskráin er sett upp. Án beiðni um þvingun haldast þeir lokaðir og fulltrúanum er sagt hvernig á að opna þá. Gefðu
`BIFROST Force ori` aðeins þeim sem setja upp fyrirtæki, og taktu hana af þeim á eftir. Engin lína í reitaaðgangi opnar
þessa reiti.

Önnur Bifröst forrit geta bætt við eigin vernd og lýst reit *skrifanlegan einu sinni*: hann má setja þegar færslan er
stofnuð og honum er aldrei breytt í gegnum Bifröst eftir það.

## Úrræðaleit {#troubleshooting}

| Fulltrúinn segir | Af hverju | Hvað á að gera |
|---|---|---|
| Að breytingaskrárverndin loki reitnum | Breytingaskráin skráir ekki breytingar á reitnum | Skráðu reitinn í **Uppsetningu breytingaskrár**, bættu við undanþágu, eða gefðu notandanum **Framhjá**-línu |
| Að reiturinn sé lokaður fyrir skrifum eða ekki leyfður | **Skrifa**- eða **Bæði**-lína, sjálfgefin vernd, eða gögn sem Bifröst ver alltaf | Skoðaðu línur notandans á **Yfirliti reitaaðgangs Bifröst**; opnaðu sjálfgefna vernd með **Engin** |
| Að reiturinn tilheyri grunnstillingu fyrirtækisins | Einn af [grunnstillingarreitum fyrirtækisins](#company-configuration-fields) | Settu fyrirtækið upp sem notandi með `BIFROST Force ori` og biddu fulltrúann að þvinga breytinguna |
| Að reit vanti í svarið | **Lesa**- eða **Bæði**-lína, sjálfgefið falinn reitur, eða **Virða næmi gagna** | Eins og að ofan |
| Að ekki sé hægt að lesa eða breyta töflunni | Ein af töflunum sem Bifröst ver alltaf, eða notandann vantar heimild á hana í Business Central | Notaðu síðu Business Central í staðinn, eða veittu heimildina |
| Að bókun sé hafnað | Bókunarhlið vantar | [Heimildasamstæður og hlið](/documentation/end-customers/permissions/) |

Spurðu fulltrúann hvaða reiti töflu hann má lesa og breyta: svarið tekur þegar tillit til lína notandans í reitaaðgangi og
verndarinnar.

**Næst:** [Heimildasamstæður og hlið](/documentation/end-customers/permissions/)
