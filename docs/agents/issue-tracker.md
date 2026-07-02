# Issue tracker: Local markdown

Issues and PRDs for this repo live as local markdown files under `.scratch/<feature>/`.

## Conventions

- **File location**: `.scratch/<feature>/<kebab-case-title>.md`
- **Frontmatter**: each file starts with YAML frontmatter
  ```yaml
  ---
  title: "..."
  status: open | closed | wontfix
  created: YYYY-MM-DD
  labels:
    - needs-triage
  ---
  ```
- **Body**: freeform markdown after the frontmatter
- **Listing open issues**: `ls .scratch/*/` then grep for `status: open`
- **Closing**: change `status:` to `closed` or `wontfix`
- **Labels**: the triage labels in `docs/agents/triage-labels.md` — store them in the `labels:` list in frontmatter

## When a skill says "publish to the issue tracker"

Create a new `.scratch/<feature>/<title>.md` file with frontmatter and body.

## When a skill says "fetch the relevant ticket"

Read the `.scratch/<feature>/<title>.md` file matching the issue title.
