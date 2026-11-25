## 28.0.16 — date set on release day

### Added
- **My Bifröst Dashboards.** Each user can keep a personal list of favourite dashboards, in their own order, and open them from one place.
- **Save dashboards as PDF.** The dashboard viewer and full screen have **Save as PDF**. The PDF shows the current dashboard in A4 landscape and carries the data behind it as attached JSON and CSV files, with the refresh time and parameters.
- **Dashboard-only permission set.** A new permission set lets a user view and refresh dashboards with their own business-data permissions, without access to Bifrost Setup or the request log pages.
- **Bifrost Chat on the Dashboards list.** Users with Chat permission and a configured provider see the chat next to the Dashboards list, with the selected dashboard as context.
- **App identity in status answers.** The status that Bifröst reports about itself now includes the installed app id of Foundation and of each Bifröst app, so an assistant can match it to the published versions list.
- **Shared field-read rules for Bifröst apps.** Other Bifröst apps can now apply the same field-read restrictions and field references as Foundation, so a refusal looks the same in every app.

### Changed
- **Sync enables Vendor and Partner roles.** Running **Sync** on Bifrost Setup enables the Vendor role, the Partner role and the license configuration of the company that runs it when the registration records for that tenant and company are found. A background license refresh does not switch these roles off.
- **Permission reports explain indirect writes.** The permissions answer now lists insert, modify and delete separately, from the user's effective permissions and license limits, and explains that Bifröst operations can create or change records through their own indirect permissions even when direct writing is not allowed.
- **Icelandic wording.** A production environment is called *raunumhverfi* in Icelandic, and the usage filter shows **Raunumhverfi** and **Sandkassi**.

### Fixed
- **Writes with the Change Log turned on.** Bifröst operations that change business data no longer fail when the Business Central Change Log records the change.
- **Personal identifiers are not echoed.** When a request is refused because of an unknown parameter, the value of a personal identifier such as a national ID number is hidden in the answer and the log.
- **Write permissions with license limits.** A user who may only modify records is no longer reported as unable to write.
- **Group field access.** The group field access page now works like the user field access page, with table and field names and the same lookups.
- **"All fields" in one language.** Guard exceptions and field access rules created in different languages now show the same *All Fields* text.

