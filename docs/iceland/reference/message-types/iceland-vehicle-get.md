---
id: iceland-vehicle-get
title: "Iceland.Vehicle.Get"
sidebar_label: "Iceland.Vehicle.Get"
sidebar_position: 72
description: "Request and response contract for the Iceland.Vehicle.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Searches the Icelandic vehicle registry (Samgöngustofa) via the island.is
public GraphQL API. Returns technical and administrative data for a vehicle.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public island.is API.

## Use when
- You need to look up vehicle details by registration number (permno), plate number (regno), or VIN for customs, import, or fleet management.
- You want to verify a vehicle exists in the Icelandic registry before creating a purchase order.
- You need CO2/WLTP emission data for customs duty calculation with `Iceland.Customs.Calculate`.

## Request

- **Subject** (required): Registration number (permno), plate number (regno), or 17-character VIN.
  - Registration number (permno): fixed identifier assigned by Samgöngustofa (e.g. `AB123`).
  - Plate number (regno): the number shown on the vehicle plate, including custom plates.
  - Case-insensitive. Spaces are not significant.
- **Body**: Not used. Leave empty or pass `{}`.

## Response fields

| Field | Description |
|-------|-------------|
| `permno` | Permanent vehicle number (fastanúmer) — stable internal registry ID |
| `regno` | Current registration/plate number |
| `vin` | Vehicle Identification Number (17 chars) |
| `make` | Manufacturer name |
| `vehicleCommercialName` | Commercial model name |
| `color` | Color in Icelandic |
| `newRegDate` | Latest Icelandic registration date (ISO) |
| `firstRegDate` | Original first registration date (ISO) |
| `vehicleStatus` | `Virkt` = active, `Afskráð` = deregistered |
| `nextVehicleMainInspection` | Next mandatory roadworthiness inspection date (ISO) |
| `co2` / `co2WLTP` | CO2 emissions in g/km — NEDC and WLTP standards |
| `weightedCo2` / `weightedCo2WLTP` | Weighted CO2 (used for hybrid vehicles) |
| `mass` | Unladen mass in kg |
| `massLaden` | Laden mass in kg |
| `co` | Carbon monoxide emissions |
| `typeNumber` | Samgöngustofa type approval number |

## Authentication

None required — public API.

## AI/Agent playbook
1. Supply the registration number (permno), plate number (regno), or VIN as subject.
2. Check `vehicleStatus = Virkt` before proceeding with any purchase or registration workflow.
3. Use `co2WLTP` and `weightedCo2WLTP` as inputs to `Iceland.Customs.Calculate` for vehicle import duty.
4. If the response contains `"payload": "null"`, no vehicle matched the search term.
5. `firstRegDate` is the original manufacture/first registration; `newRegDate` is the latest Icelandic registration.
Capability boundary: reads public registry data only; no external write operations.

## Example

Subject `RE105` returns the full vehicle record for that plate number.

## Errors
- `Subject is required. Provide a registration number (permno), plate number (regno), or VIN.` — subject missing.
- `Failed to parse island.is response as JSON.` — API returned unexpected format.
- `"payload": "null"` — no vehicle found for the given search term.

## Troubleshooting - outbound HTTP blocked
If a call fails with an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://api.island.is`.

