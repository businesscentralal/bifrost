---
id: bifrost-setup-wizard
title: "Uppsetningarleiðsögn Bifröst"
sidebar_label: "Uppsetningarleiðsögn"
sidebar_position: 23
---

**Uppsetningarleiðsögn Bifröst** er eini áfangastaður allra uppsetningartilkynninga Bifröst. Ekkert einstakt Bifröst-forrit sýnir eigin uppsetningartilkynningu — þegar eitthvað þarfnast athygli (leyfissamningurinn, útleiðar HTTP, auðkenni, prufuleyfið, tengingin við MCP-þjóninn) vísar [Uppsetning Bifröst](/help/foundation/bifrost-setup/) hingað og leiðsögnin fer yfir öll forrit sem eru uppsett.

Opnaðu hana úr listanum Aðstoðuð uppsetning, með **Uppsetningarleiðsögn** á Uppsetning Bifröst eða með **Hefja uppsetningarleiðsögn** í tilkynningu á Uppsetning Bifröst. Hvert fyrirtæki keyrir hana einu sinni: þar til leiðsögninni er lokið hafnar Bifröst öllum köllum fyrirtækisins.

## Skref

| Skref | Hvað gerist |
| --- | --- |
| **1. Velkomin í Bifröst** | Útskýrir hvað Bifröst geymir hjá Origo (einstefnutætigildi af leigjandaauðkenninu þínu, stillingar þessa fyrirtækis og skilaboðanotkun þess) og sýnir notendaleyfissamninginn. Veldu **Ég samþykki notendaleyfissamninginn** til að halda áfram. |
| **2. Virkja HTTP-biðlarabeiðnir** | Telur upp öll uppsett Bifröst-forrit og hvort þau megi senda útleiðar HTTP-beiðnir. Sjá [HTTP-skref](#http-step). |
| **3. Auðkenni** _(valfrjálst)_ | Telur upp auðkennin sem uppsettu forritin þurfa svo þú getir skráð gildi sem vantar. Sjá [Auðkennaskref](#credentials-step). |
| **4. Leyfi** | Fer eftir umhverfinu - sjá [Leyfisskref](#licensing-step). |
| **5. MCP-þjónustenging og heimild forrits** | Aðeins í skýinu. Sýnir vefslóð MCP-þjónsins sem þú bætir við gervigreindarvirkið þitt, tengilinn sem stjórnandi (alstjórnandi eða forritastjórnandi í Microsoft Entra) notar til að heimila Origo Bifrost-fyrirtækjaforritið og tengla á Bifröst-tenginguna í verslunum gervigreindarvirkja. |
| **6. Uppsetningu lokið** | Veldu **Ljúka** til að samþykkja leyfissamninginn fyrir þetta fyrirtæki, skrá fyrirtækið hjá leyfisþjónustunni og, í framleiðsluumhverfi, virkja prufuleyfið. Aðstoðaða uppsetningin er þá merkt sem lokið. |

Uppsetningar á staðnum sleppa skrefi 5.

### HTTP-skref {#http-step}

Flest Bifröst-forrit þurfa útleiðar HTTP — Bifröst Foundation þarf það til að ná sambandi við leyfisþjónustuna. Skrefið sýnir listann [Bifröst-forrit](/help/foundation/registered-apps/) með HTTP-stöðu hvers forrits.

-   **Virkja HTTP fyrir öll forrit** birtist hvenær sem að minnsta kosti eitt uppsett Bifröst-forrit er enn með útleiðar HTTP óvirkt. Aðgerðin virkjar útleiðar HTTP fyrir öll forritin á listanum í einu.
-   Ef þú hefur ekki heimild til að breyta stillingum viðbóta er aðgerðin óvirk og athugasemd útskýrir: _„Þú hefur ekki heimild til að breyta stillingum viðbóta. Biddu kerfisstjóra sem hefur SUPER heimildasafnið (eða skrifheimild á töfluna NAV App Setting) um að virkja Leyfa HttpClient-beiðnir fyrir forritin hér að ofan.“_
-   **Staðfesta** les HTTP-stöðu allra forrita aftur án þess að fara af skrefinu.

### Auðkennaskref {#credentials-step}

Hvert uppsett Bifröst-forrit getur skráð auðkennin sem það þarf í sameiginlegu leyndarmálageymsluna (sjá [Leyndarmál](/foundation/reference/secrets/)). Listinn [Auðkenni](/help/foundation/wizard-credentials/) sýnir þau öll. Veldu línu og síðan **Skrá gildi...** til að slá inn gildi.

Auðkenni sem vantar eru aldrei villa, hvorki hér né á Uppsetning Bifröst — auðkenni sem er ekki skráð gerir óvirkar þær skilaboðategundir sem eru háðar því og hægt er að skrá það síðar með **Leyndarmál** á Uppsetning Bifröst.

### Leyfisskref {#licensing-step}

| Umhverfi | Hvað skrefið sýnir |
| --- | --- |
| **Framleiðsluumhverfi (í skýinu)** | Prufuleyfið: **1.000 notendaskilaboð + 1.000 forritsskráningarskilaboð**, virkjað einu sinni fyrir hvern Microsoft Entra leigjanda. **Ljúka** virkjar það ef leigjandinn hefur ekki fengið prufuleyfi. Á fyrirframgreiddu leyfi útskýrir skrefið einnig hvernig áskriftarleyfið hefst: þegar Bifröst samstarfsaðili þinn býður leigjandanum sem viðskiptavin og þú samþykkir. |
| **Sandkassi** | **Sandkassaleyfi**: ekki þarf prufuleyfi og Bifröst sjálft takmarkar ekki skilaboð; opinberi MCP-þjónninn leyfir 1.000 skilaboð á 24 klukkustundum fyrir hvern Microsoft Entra leigjanda. Fyrir ótakmarkaðar prófanir í sandkassa skaltu nota staðbundna MCP-þjóninn úr [businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp). |
| **Á staðnum** | Hvernig staðbundni MCP-þjónninn er settur upp við hlið uppsetningarinnar og **Staðfesta tengingu** fyrir tenginguna við leyfisþjónustuna sem Origo lét fylgja leyfinu á staðnum. Ekki er hægt að halda áfram fyrr en tengingin hefur verið staðfest. |

Sjá [Leyfi og samstarfsaðilakerfi](/foundation/licensing) um leyfislíkanið.

## Ábendingar

-   Ný uppsetning byrjar alltaf á **fyrirframgreiddu** leyfi. **Áskriftarleyfið** hefst síðar, þegar leigjandinn samþykkir boð frá Bifröst samstarfsaðila - sjá [Að vera viðskiptavinur](/foundation/licensing/customer/).
-   Ekkert sem þú gerir í leiðsögninni er óafturkræft: **Til baka** og **Áfram** henda aldrei gildum sem þú hefur þegar skráð og þú getur keyrt leiðsögnina aftur hvenær sem er.
-   **Afturkalla samþykki notendaleyfissamnings** á Uppsetning Bifröst dregur samþykkið til baka fyrir fyrirtækið; keyrðu leiðsögnina aftur til að endurheimta það.
