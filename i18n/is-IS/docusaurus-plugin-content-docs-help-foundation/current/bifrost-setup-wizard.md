---
id: bifrost-setup-wizard
title: "Uppsetningarleiðsögn Bifröst"
sidebar_label: "Uppsetningarleiðsögn"
sidebar_position: 23
---

**Uppsetningarleiðsögn Bifröst** (setup wizard) er eini staðurinn þar sem allar Bifröst uppsetningartilkynningar birtast. Engin einstök Bifröst viðbót sýnir lengur eigin uppsetningarborða — þegar eitthvað þarfnast athygli (útleið HTTP, leyndarmál, prufuleyfi, tenging við MCP-þjóninn, heimild Entra fyrirtækjaforrits) vísar [Bifröst uppsetning](/help/foundation/bifrost-setup/) hingað, og leiðsögnin fer yfir hverja uppsettu viðbót.

Leiðsögnina má líka opna hvenær sem er úr Aðstoðaða uppsetningarlistanum (Assisted Setup), eða með **Hefja uppsetningarleiðsögn** á tilkynningunni um HTTP-beiðnir á Bifröst uppsetningu.

## Skref

| Skref | Hvað gerist |
| --- | --- |
| **1. Velkomin/n** | Útskýrir hvað leiðsögnin gerir og sýnir notendaleyfissamninginn (EULA) fyrir Bifröst Foundation. Þú verður að samþykkja hann áður en lengra er haldið. |
| **2. HTTP** | Sýnir hverja skráða Bifröst viðbót og hvort útleið HTTP-beiðnir séu virkjaðar fyrir hana. Sjá [HTTP-skref](#http-skref) hér fyrir neðan. |
| **3. Leyndarmál** _(valfrjálst)_ | Sýnir leyndarmálin sem hver uppsett Bifröst viðbót hefur skráð, svo hægt sé að skrá gildi sem vantar enn. Þetta skref hindrar aldrei **Áfram** — sjá [Leyndarmálaskref](#leyndarmálaskref) hér fyrir neðan. |
| **4. Virkjun prufuleyfis** | Sýnir stöðu prufuleyfisins (1.000 notenda- og 1.000 forritaskráningarskilaboð, úthlutað sjálfkrafa við uppsetningu) og gerir kleift að óska eftir viðbótarleyfum ef prufan er að klárast. |
| **5. Tenging við MCP-þjón** | Sýnir hvort Origo BC MCP-þjónninn nái sambandi við þetta umhverfi, og tengiupplýsingarnar sem stjórnandi þarf til að stilla hann. |
| **6. Entra fyrirtækjaforrit** | Staðfestir að Entra ID fyrirtækjaforritið sem notað er til auðkenningar API hafi verið heimilað fyrir þetta leigjendaumhverfi, með tengli á að ljúka stjórnandasamþykki ef það hefur ekki verið gert. |
| **7. Ljúka** | Merkir aðstoðuðu uppsetninguna sem lokið og lokar leiðsögninni. Hægt er að breyta öllum stillingum aftur síðar frá [Bifröst uppsetningu](/help/foundation/bifrost-setup/) eða úr leiðsögninni sjálfri. |

### HTTP-skref

Útleið HTTP er nauðsynlegt fyrir flestar Bifröst viðbætur — fyrir tilkynningar, vefkróka og köll í ytri þjónustur. Skrefið sýnir töflu (ein lína fyrir hverja uppsetta Bifröst viðbót) með heiti viðbótarinnar og núverandi HTTP-stöðu hennar.

-   **Virkja HTTP fyrir allar viðbætur** birtist þegar minnst ein uppsett Bifröst viðbót hefur enn óvirkjað útleið HTTP — ekki aðeins Bifröst Foundation sjálft. Aðgerðin virkjar útleið HTTP fyrir allar skráðar viðbætur í einu; taflan og sýnileiki aðgerðarinnar sjálfrar uppfærast sjálfkrafa á eftir.
-   Ef þú hefur ekki heimild til að breyta viðbótarstillingum er aðgerðin áfram sýnileg en **óvirk**, og athugasemd útskýrir: _„Þú hefur ekki heimild til að breyta viðbótarstillingum. Biddu stjórnanda með SUPER heimildasamstæðuna (eða skrifheimild á töfluna NAV App Setting) um að virkja Allow HttpClient Requests fyrir viðbæturnar sem taldar eru upp hér að ofan.“_
-   **Sannreyna** les HTTP-stöðu allra viðbóta aftur án þess að fara af skrefinu.

### Leyndarmálaskref

Sérhver uppsett Bifröst viðbót getur skráð leyndarmálin sem hún þarfnast í sameiginlegu leyndarmálageymsluna (sjá [Leyndarmál](/foundation/reference/secrets/)). Þetta skref telur upp öll þau leyndarmál frá öllum uppsettum viðbótum. Veldu línu og notaðu **Skrá gildi...** til að skrá það í sameiginlega dulda innsláttarglugganum.

Leyndarmál sem vantar teljast aldrei sem villa hér eða á Bifröst uppsetningu — leyndarmál sem er ekki skráð gerir einfaldlega óvirkar þær skilaboðategundir sem reiða sig á það, og má skrá síðar hvenær sem er á Bifröst uppsetningu, aðgerðinni **Leyndarmál**.

## Ábendingar

-   Leyndarmálaskrefið birtist alltaf, jafnvel þótt engin uppsett viðbót hafi enn skráð leyndarmál — þá sýnir það einfaldlega tóman lista.
-   Ekkert sem gert er í leiðsögninni er óafturkræft: **Til baka** og **Áfram** eyða aldrei gildum sem þegar hafa verið skráð, og hægt er að opna leiðsögnina aftur eins oft og þörf krefur.
-   Aðgerðin **Hefja uppsetningarleiðsögn** á tilkynningunni um HTTP-beiðnir opnar þessa sömu hjálp — það er ekkert sérstakt, styttra ferli eingöngu fyrir HTTP.
