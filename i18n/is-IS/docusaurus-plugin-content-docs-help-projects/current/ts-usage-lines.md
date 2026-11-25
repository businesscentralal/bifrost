---
id: ts-usage-lines
title: "Notkunarlínur tímaskýrslna"
sidebar_position: 4
---

**Notkunarlínur tímaskýrslna** sýnir vörur og forða sem fólk hefur skráð sem notað á tímaskýrslum sínum,
til dæmis vörur teknar úr bíl eða ekna kílómetra, og hvar hver lína er stödd: frá skráningu, í gegnum
samþykkt, í færslubók og bókun. Síðan er fyrir samþykkjendur og skrifstofuna sem fylgja notkuninni eftir,
og henni er ekki hægt að breyta.

Notkunarlínur eru skráðar, sendar inn, samþykktar, hafnað, fluttar í færslubækur og bakfærðar í gegnum
aðstoðarmann eða samþættingu, með eigin prófunum Business Central. Síðan sýnir niðurstöðuna.

Leitaðu að **Notkunarlínur tímaskýrslna** í Business Central til að opna síðuna.

![Notkunarlínur tímaskýrslna](/img/projects/is-is/ts-usage-lines.png)

## Ferill notkunarlínu {#how-a-usage-line-moves}

| Staða | Merking |
| --- | --- |
| **Opin** | Skráð af eiganda tímaskýrslunnar, ekki enn send inn. |
| **Send inn** | Eigandi tímaskýrslunnar hefur sent hana til samþykktar. |
| **Samþykkt** | Samþykkt af samþykkjandanum sem er skráður á tímaskýrsluna. |
| **Hafnað** | Samþykkjandinn hafnaði henni, eftir atvikum með athugasemd. Eigandinn getur sent hana inn aftur. |
| **Flutt í færslubók** | Færð í færslubókarlínu: vörunotkun í birgðabók, notkun forða í forðabók, og notkun á tímaskýrslulínu með verkefni í verkbók. Flutningurinn bókar ekkert. Ef færslubókarlínunni er eytt fær notkunarlínan aftur stöðuna **Samþykkt**. |
| **Bókað** | Færslubókarlínan var bókuð í Business Central. Bókaða línu má bakfæra einu sinni; þá er hún merkt **Bakfært** og hægt er að stofna færslubókarlínu með gagnstæðu magni. |

## Reitir {#fields}

| Reitur | Hvað hann sýnir |
| --- | --- |
| **Færslunr.** | Númer notkunarlínunnar. |
| **Tímaskýrslunr.** | Tímaskýrslan sem notkunin tilheyrir. |
| **Línunr. tímaskýrslu** | Tímaskýrslulínan sem notkunin er tengd við. |
| **Aðfangsnr. starfsmanns** | Forðinn sem skráði notkunina, forði eigandans á tímaskýrslunni. |
| **Tegund** | **Vara** eða **Aðfang**. |
| **Nr.** | Vöru- eða forðanúmerið. |
| **Dagsetning** | Dagsetning notkunarinnar, innan tímabils tímaskýrslunnar. |
| **Magn** | Magnið sem var notað. |
| **Einingarkóði** | Mælieiningin. |
| **Staðsetningarkóði** | Staðsetningin sem varan var tekin úr, til dæmis bíll tæknimannsins. |
| **Hólfkóði** | Hólfið sem varan var tekin úr. |
| **Lotunr.** | Lotunúmer vörunnar sem var notuð. |
| **Raðnr.** | Raðnúmer vörunnar sem var notuð. |
| **Lýsing** | Lýsing á notkuninni. |
| **Staða** | Hvar línan er stödd, eins og í töflunni hér fyrir ofan. |
| **Bakfært** | Valið þegar bókuð notkun hefur verið bakfærð. |
| **Samþykkt af** | Hver samþykkti notkunina. |
| **Heiti færslubókarsniðmáts** | Færslubókarsniðmátið sem notkunin var flutt í. |
| **Heiti færslubókarkeyrslu** | Færslubókarkeyrslan sem notkunin var flutt í. |
| **Línunr. færslubókar** | Línunúmer færslubókarinnar. |

Síðan hefur engar eigin aðgerðir.

## Gott að vita {#good-to-know}

- **Eigendur senda inn, samþykkjendur ákveða.** Aðeins eigandi tímaskýrslunnar getur sent notkunarlínur
  hennar inn, og aðeins samþykkjandinn sem er skráður á tímaskýrsluna getur samþykkt þær eða hafnað þeim,
  aldrei eigandinn.
- **Bókað er í færslubókinni.** Flutningur stofnar aðeins færslubókarlínur. Bókaðu þær úr færslubókinni í
  Business Central eins og hverja aðra færslubókarlínu; staðsetning, hólf og lotu- eða raðnúmer fylgja
  línunni.
- **Kílómetrar úr heimsókn** eru skráðir sem opin notkunarlína fyrir **Akstursforði** á
  [Uppsetning verkefna](/help/projects/projects/). Þeir eru ekki sendir inn fyrr en tæknimaðurinn sendir
  þá inn.
- **Heimildir.** Samþykkjendur og skrifstofan þurfa `PROJ USAGE ori` ásamt `BIFROST Full ori`;
  `BIFROST Read ori` með `PROJ USAGE ori` nægir til að skoða. Vettvangstæknimenn skrá og senda inn eigin
  notkun með `PROJ FIELD TECH ori` og `BIFROST Read ori`.
- **Aðeins breytt með aðgerðunum.** Aðstoðarmaður getur ekki breytt stöðu, tengingu við tímaskýrslu eða
  samþykkt notkunarlínu með almennum gagnaaðgerðum Bifröst.

Meira um forritið: [Bifröst verkefni](/projects/). Vörur úr bíl tæknimanns:
[Uppsetning tæknimanna](/help/projects/technician-setup/).
