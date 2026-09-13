---
id: orchestrator-playbook-run
title: "Orchestrator.Playbook.Run"
sidebar_label: "Orchestrator.Playbook.Run"
sidebar_position: 10
description: "Request and response contract for the Orchestrator.Playbook.Run Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Keyrir a Bifrost Playbook immediately og returns the execution niðurstaða. Valfrjálstly pass an initial request payload.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook kóði to execute |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `initialRequest` | Object | No | JSON payload passed to step 1 |

## Svar

```json
{ "status": "Success", "instanceId": "<guid>", "playbookCode": "MYPLAYBOOK",
  "playbookStatus": "Completed", "stepsExecuted": 3, "stepsFailed": 0, "itemsProcessed": 10 }
```

## Keyrir samstundis eins lengi og þarf

The whole playbook executes inside this call og the response er written aðeins at
the end. A caller that times out first gets nothing, while the server carries on:
the instance er left at `Running` og never completes, because the kóði that would
write the completion belongs to the session that was abandoned.

An LLM step inside a forEach er the usual cause — a per-vara call against a slow
model turns a twelve-second playbook í several minutes. Notaðu
`Orchestrator.Playbook.Enqueue`, eða invoke this tegund asynchronously, fyrir anything
that er not reliably quick, og read `Playbook Step Log ori` to follow progress.

`itemsProcessed` counts forEach iterations summed over every step, not distinct
vörur. Ekki present it to a notandi as a færsla count.

