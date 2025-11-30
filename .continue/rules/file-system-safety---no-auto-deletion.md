---
globs: "**/*"
description: Critical safety rule to prevent accidental data loss. Many folders
  contain generated or cached content essential for builds. Always confirm with
  user before deletion.
alwaysApply: true
---

NEVER delete files or folders (dist, docs, node_modules, etc.) without explicit user permission. Always ask before destructive operations. Verify file existence before operations.