---
id: bifrost-user-setup-list
title: "Bifröst notandauppsetning"
sidebar_label: "Bifröst notandauppsetning"
sidebar_position: 29
---

Síðan **Bifröst notandauppsetning** sýnir uppsetningu á hvern notanda fyrir Bifröst viðbótina. Hver færsla geymir kerfisleiðbeiningar og valfrjálsar tengdar færslur sem stýra því hvernig gervigreindarþjónn finnur út hver notandinn er (notandasniðið sem hann les um kallandann).

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Öryggisauðkenni notanda** | Einstakt öryggisauðkenni Business Central notandans. |
| **Notandanafn** | Birtinganafn notandans (lesskráð, dregið af öryggisauðkenni notanda). |
| **Gjaldfærslutegund** | Lesskráð. Sem hvað skilaboð þessa notanda eru gjaldfærð: **Notandi**, **Forritsskráning**, og í áskrift **Innri**, **Sýniumhverfi** eða **Þjónustuaðili**. Ákvörðuð þegar notandinn er settur upp og uppfærð með **Samstilla** á síðunni Uppsetning Bifröst og með daglegu notkunarsamstillingunni. Sjá [Gjaldfærslutegundir í áskrift](/licensing/license-types/#charge-types). |
| **Kerfisleiðbeining** | Texti leiðbeiningarinnar sem bætt er við AI-samhengi fyrir þennan notanda. Stýrt á notandauppsetningarspjaldinu. |
| **Fjárhagslykill nr.** | Valfrjáls fjárhagslykill notaður í notandasniðinu fyrir stöðuskýrslugerð. |
| **Starfsmannsnr.** | Valfrjáls starfsmannatengsl fyrir auðkennissamhengi notandans. |
| **Viðskiptamannsnr.** | Valfrjáls viðskiptamannatengsl tengd þessum notanda. |
| **Lánardrottinanr.** | Valfrjáls lánardrottnatengsl tengd þessum notanda. |
| **Forðanr.** | Valfrjáls forðatengsl fyrir auðkennissamhengi notandans. |
| **Kóði sölumanns** | Valfrjáls sölumanns-/innkaupaaðilatengsl fyrir auðkennissamhengi notandans. |
| **Tengiliðanr.** | Valfrjáls tengiliðatengsl tengd þessum notanda. |
| **Birgðageymsla** | Valfrjáls sjálfgefinn birgðageymslukóði fyrir notandann. |

## Ábendingar

-   Notendur sem eru ekki stjórnendur sjá aðeins sína eigin færslu á þessari síðu.
-   Notandasniðið sem gervigreindarþjónn les notar þessa reiti til að leysa tengdar færslur og kerfisleiðbeininguna.
-   Þegar tengireitur er auður, fellur svarið til baka á staðlaða BC-úrlausn (t.d. Eigandi vinnuskýrslu fyrir Forða, Notandauppsetning fyrir Sölumanninn).
