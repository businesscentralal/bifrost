---
id: bifrost-queue-api
title: "Bifrost Queue API"
sidebar_label: "Bifrost Queue API"
sidebar_position: 17
---

Notaðu þessa API-síðu til að senda Bifröst skilaboð í ósamstillta vinnslu. Business Central vistar beiðnina, býr til bakgrunnsverk og skilar svarinu síðar í gegnum response-endapunkt eða vefkróka.

## Endapunktur

`/api/origo/bifrost/v1.0/queues`

## Hlutverk síðunnar

-   Tekur við Bifröst-beiðni með type, source, subject og data.
-   Býr til Bifröst skilaboðafærslu fyrir núverandi notanda.
-   Setur vinnsluna í bakgrunn og skilar tilvísun í skilaboðin.
