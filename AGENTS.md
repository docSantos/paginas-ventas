<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:custom-environment-rules -->

# Project Rules & Environment Settings

- **Operating System:** Windows
- **Shell:** PowerShell
- **File Management:** Do not use Unix/Bash heredocs (`cat << 'EOF' > ...`) or Bash-specific redirection operators in terminal commands. Use internal editor tools (`write_to_file`, `create_file`) to write, modify, and create files.
- **Terminal Execution:** When running commands, ensure strict PowerShell compatibility (avoid `touch`, `&&`, or unescaped operators).

<!-- END:custom-environment-rules -->