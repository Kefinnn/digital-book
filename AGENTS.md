<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git & GitHub Workflow Rule

- **Never run `git commit` automatically without the user's explicit instruction/approval.** The decision to commit always belongs to the user.
- After completing code changes, **suggest** a clear commit message / `git commit` command to the user and wait for their confirmation before committing (or let the user run it themselves).
- Note: A `.git/hooks/post-commit` hook is installed so that whenever a `git commit` is executed, it automatically pushes (`git push origin <branch>`) to GitHub.


