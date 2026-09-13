---
id: iceland-vehicle-get
title: "Iceland.Vehicle.Get"
sidebar_label: "Iceland.Vehicle.Get"
sidebar_position: 72
description: "Beiðni- og svarsamningur fyrir Iceland.Vehicle.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Searches the Icelandic vehicle registry (Samgöngustofa) via the island.er
public GraphQL API. Skilar technical og administrative data fyrir a vehicle.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public island.er API.

## Notað þegar
- You need til look up vehicle details by registration number (permno), plate number (regno), eða VIN fyrir customs, import, eða fleet management.
- You want til verify a vehicle exists in the Icelandic registry áður en creating a purchase order.
- You need CO2/WLTP emission data fyrir customs duty calculation með `Iceland.Customs.Calculate`.

## Beiðni

- **Subject** (nauðsynlegt): Registration number (permno), plate number (regno), eða 17-character VIN.
  - Registration number (permno): fixed identifier assigned by Samgöngustofa (e.g. `AB123`).
  - Plate number (regno): the number shown on the vehicle plate, þar á meðal custom plates.
  - Case-insensitive. Spaces eru not significant.
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar fields

| Reitur | Lýsing |
|-------|-------------|
| `permno` | Permanent vehicle number (fastanúmer) — stable internal registry ID |
| `regno` | Current registration/plate number |
| `vin` | Vehicle Identification Number (17 chars) |
| `make` | Manufacturer Heiti |
| `vehicleCommercialName` | Commercial model Heiti |
| `color` | Color in Icelandic |
| `newRegDate` | Latest Icelandic registration date (ISO) |
| `firstRegDate` | Original first registration date (ISO) |
| `vehicleStatus` | `Virkt` = active, `Afskráð` = deregistered |
| `nextVehicleMainInspection` | Next mandatory roadworthiness inspection date (ISO) |
| `co2` / `co2WLTP` | CO2 emissions in g/km — NEDC og WLTP standards |
| `weightedCo2` / `weightedCo2WLTP` | Weighted CO2 (used fyrir hybrid vehicles) |
| `mass` | Unladen mass in kg |
| `massLaden` | Laden mass in kg |
| `co` | Carbon monoxide emissions |
| `typeNumber` | Samgöngustofa Gerð approval number |

## Authentication

None nauðsynlegt — public API.

## Leiðbeiningar fyrir gervigreind/umboð
1. Supply the registration number (permno), plate number (regno), eða VIN as subject.
2. Check `vehicleStatus = Virkt` áður en proceeding með any purchase eða registration Verkflæði.
3. Notaðu `co2WLTP` og `weightedCo2WLTP` as inputs til `Iceland.Customs.Calculate` fyrir vehicle import duty.
4. Ef Svarið contains `"payload": "null"`, no vehicle matched the search term.
5. `firstRegDate` er the original manufacture/first registration; `newRegDate` er the latest Icelandic registration.
Capability boundary: reads public registry data Aðeins; no external write operations.

## Dæmi

Subject `RE105` Skilar fulla vehicle færsla fyrir that plate number.

## Errors
- `Subject is required. Provide a registration number (permno), plate number (regno), or VIN.` — subject missing.
- `Failed to parse island.is response as JSON.` — API returned unexpected format.
- `"payload": "null"` — no vehicle found fyrir the given search term.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://api.island.is`.


