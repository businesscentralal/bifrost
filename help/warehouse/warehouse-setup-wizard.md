---
id: warehouse-setup-wizard
title: "Set up Bifrost Warehouse"
sidebar_position: 1
---

**Set up Bifrost Warehouse** is the assisted setup for Bifrost Warehouse. It is for the administrator who
sets the app up: it shows what Warehouse adds to Bifröst, checks that outgoing HTTP is allowed through
Foundation, and explains which permission sets users need.

Open **Assisted Setup**, and choose **Set up Bifrost Warehouse** under **Extensions**. You can run the
guide again at any time.

## Steps

**Welcome to Bifrost Warehouse.** Describes the Warehouse operations: bin content, open warehouse
activities, receipts and shipments from creation through preview to posting, and picks and put-aways
from creation to registering. AI assistants and other systems use these operations through Bifröst as
the signed-in user, within that user's permissions. **Show operations** opens
[Available Message Types](/help/foundation/bifrost-message-type-list/), where the installed operations are
listed. **Documentation** opens the [Warehouse documentation](/warehouse/).

**HTTP through Bifrost Setup.** Bifröst needs outgoing HTTP for licensing.

| Field | Description |
| --- | --- |
| **HTTP enabled** | Shows whether **Allow HttpClient Requests** is turned on for Bifrost Warehouse. The guide only reads the setting. |

If HTTP is not enabled, **Enable HTTP in Bifrost Setup** opens the
[Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/); Foundation makes the change. Come back
and choose **Verify** to read the current setting again. If you may not change extension settings,
the step says so: ask an administrator with the **SUPER** permission set to allow the requests.

**User access.** Explains the Warehouse permission sets:

| Permission set | Allows |
| --- | --- |
| `BIFROST WhsePost ori` | Warehouse posting and registering warehouse activities. |
| `BIFROST WhseInv ori` | In addition, invoicing when a warehouse shipment is posted. |

Users also need the Bifröst permission sets from Foundation. Assign the sets to users directly or
through a Microsoft Entra security group; **Open Users** and **Open Permission Sets** open the standard
pages. The guide never assigns permissions.

**Ready to finish.** Summarises **Warehouse operations**, **HTTP** (**Done** or **Needs an
administrator**) and **Access guidance**. **Finish** marks the assisted setup complete, also when HTTP
still needs an administrator. Closing the guide early leaves its completion status unchanged.

Use **Back** and **Next** to move between the steps.

## Responsibility

The guide does not change HTTP settings, record consent or assign permissions. Enabling HTTP goes
through Foundation's administrator flow, and who may post and invoice is decided by the permission sets
you assign.
