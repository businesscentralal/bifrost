---
id: bifrost-user-setup-list
title: "Bifröst notandauppsetning"
sidebar_label: "Bifröst notandauppsetning"
sidebar_position: 29
---

Síðan **Bifröst notandauppsetning** sýnir uppsetningu á hvern notanda fyrir Bifröst viðbótina. Hver færsla geymir kerfisleiðbeiningar og valfrjálsar tengdar færslur sem stýra því hvernig AI-knúnar skilaboðategundir (eins og `Help.WhoAmI.Get`) leysa samhengi notanda.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Öryggisauðkenni notanda** | Einstakt öryggisauðkenni Business Central notandans. |
| **Notandanafn** | Birtinganafn notandans (lesskráð, dregið af öryggisauðkenni notanda). |
| **Kerfisleiðbeining** | Texti leiðbeiningarinnar sem bætt er við AI-samhengi fyrir þennan notanda. Stýrt í gegnum `User Setup Mgt ori` kóðaeininguna eða notandauppsetningarspjaldið. |
| **Fjárhagslykill nr.** | Valfrjáls fjárhagslykill notaður af `Help.WhoAmI.Get` fyrir stöðuskýrslugerð. |
| **Starfsmannsnr.** | Valfrjáls starfsmannatengsl fyrir auðkennissamhengi notandans. |
| **Viðskiptamannsnr.** | Valfrjáls viðskiptamannatengsl tengd þessum notanda. |
| **Lánardrottinanr.** | Valfrjáls lánardrottnatengsl tengd þessum notanda. |
| **Forðanr.** | Valfrjáls forðatengsl fyrir auðkennissamhengi notandans. |
| **Kóði sölumanns** | Valfrjáls sölumanns-/innkaupaaðilatengsl fyrir auðkennissamhengi notandans. |
| **Tengiliðanr.** | Valfrjáls tengiliðatengsl tengd þessum notanda. |
| **Birgðageymsla** | Valfrjáls sjálfgefinn birgðageymslukóði fyrir notandann. |

## Ábendingar

-   Notendur sem eru ekki stjórnendur sjá aðeins sína eigin færslu á þessari síðu.
-   `Help.WhoAmI.Get` skilaboðategundin notar þessa reiti til að leysa tengdar færslur og kerfisleiðbeininguna.
-   Þegar tengireitur er auður, fellur svarið til baka á staðlaða BC-úrlausn (t.d. Eigandi vinnuskýrslu fyrir Forða, Notandauppsetning fyrir Sölumanninn).
