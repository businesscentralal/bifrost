---
id: user-scenarios
title: "Quality Management user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 5
description: "Follow an inspection from creation to results, re-inspection and disposition of goods."
---

# Quality Management user scenarios

These scenarios help a quality inspector or supervisor work through an inspection with an assistant or integration and review the result in Business Central. Complete the [prerequisites](./index.md#before-you-start) first. The examples describe the outcome to request; your assistant reads the available operations from your installed environment.

## Inspect received goods

1. Select the source record for the goods and ask your assistant to create a quality inspection. Choose a template, or let the configured generation rules choose it.
2. Open the resulting inspection in Business Central and check the source and tests before recording measurements.
3. Ask the assistant to record the measured value for a named test on that open inspection. Review the recalculated result.
4. When the inspection is ready, ask the assistant to finish it. Business Central checks the result and required item tracking. Resolve any refusal before continuing.

**Result:** a finished inspection that you can review on the standard Quality Management pages. Creating the inspection does not post the source document.

## Correct a result or inspect again

1. Decide whether you need to correct the existing inspection or record a fresh inspection.
2. To correct a finished inspection, ask an authorized quality administrator to reopen it. Business Central can refuse reopening when a later re-inspection exists. Reopening keeps the stored passed and failed quantities; review them before finishing again.
3. To inspect again, request a re-inspection. Business Central uses the latest revision of the inspection, even when you selected an older one. An open source inspection must pass the standard finishing checks first.
4. Review the new open revision, record its test values and finish it when ready. The new revision starts with cleared results and regenerated template lines.

**Result:** either the existing inspection is open for correction, or a new revision preserves the history. Check which revision was created before retrying a re-inspection request.

## Separate inspected stock

1. Review the inspection's passed and failed quantities and choose which quantity to move.
2. Choose the destination location or bin and check the source stock. Your inventory permissions and Business Central's location and warehouse setup determine which methods are available.
3. Tell the assistant whether to prepare movement work or post a reclassification immediately, then confirm the intended movement.
4. Review the resulting journals, movement work or posted entries in Business Central. Do not repeat a successful request to undo it; posted stock changes need the appropriate Business Central correction process.

**Result:** the selected inspected quantity has movement work prepared or has been moved by posting, according to the method you approved.

## Return failed goods to a vendor

1. Select an inspection sourced from a purchase line, with a positive failed quantity and sufficient received quantity.
2. Ask the assistant to create a purchase return for the failed quantity. Supply a reason and the vendor's credit memo number if appropriate.
3. Open the returned purchase return order number in Business Central and check the vendor, lines and quantities.
4. Process and post the return through your usual purchasing procedure after review.

**Result:** an unposted purchase return order. Creating it does not post a vendor credit memo. Check for an existing return before asking again.

For changes included in the app, see the [release notes](./release-notes.md).
