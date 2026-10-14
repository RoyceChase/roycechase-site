# RoyceChase Site

Personal website powered by Hugo + Blowfish + Cloudflare Pages.

## Tech Stack

-   Hugo Extended
-   Blowfish Theme
-   GitHub
-   Cloudflare Pages

## Environment

Requirements: Hugo Extended 0.168.0 and Git.

Verify Hugo installation:

``` bash
hugo version
```

Expected:

``` text
hugo v0.168.0+extended
```

## Initialize Project

Create Hugo site:

``` bash
hugo new site . --force
```

Install Blowfish theme:

``` bash
git submodule add https://github.com/nunocoracao/blowfish.git themes/blowfish
```

Configure theme in `config/_default/hugo.toml`:

``` toml
theme = "blowfish"
```

## Configuration

- `config/_default/hugo.toml`: domain, title, default language, pagination and output formats.
- `config/_default/params.toml`: author, social links, appearance, homepage and article settings.
- `config/_default/menus.toml`: navigation entries and display order.

Hugo loads this directory automatically. Keep site configuration here instead of adding a second root `hugo.toml`. The site currently uses Chinese only; article files stay in `content/posts/`.

The homepage uses Blowfish's profile layout and lists the five latest posts. JSON output supports site search. Add Projects and About navigation when those pages exist. Theme defaults remain inherited; only project-specific settings are overridden.

## Local Development

See [AGENTS.md](AGENTS.md) for project rules and [docs/TODO.md](docs/TODO.md) for the backlog.

## Specification Maintenance

OpenSpec 1.14.1 is initialized for Codex. `.agents/skills/` holds generated workflows; `openspec/config.yaml` holds project context. `openspec/specs/` stores implemented requirements, while `openspec/changes/` stores proposals and archives. These files belong in version control.

Requires Node.js >=20.19.0. Local Node.js 20.18.0 currently emits an engine warning and needs updating. OpenSpec is a development tool, not a Hugo build dependency.

``` bash
npx --yes @fission-ai/openspec@1.14.1 list
npx --yes @fission-ai/openspec@1.14.1 validate --all
```

Use `openspec-propose` to prepare a feature, `openspec-apply-change` to implement it, and `openspec-archive-change` after completion. Simple documentation edits do not need a full proposal. Update the backlog and relevant specifications after each change.

## Run Locally

Start local server:

``` bash
hugo server
```

Open:

``` text
http://localhost:1313
```

## Build

Generate production files:

``` bash
hugo --minify
```

## Deployment Flow

``` text
Local
 |
Git Commit
 |
Push GitHub
 |
Cloudflare Pages Build
 |
Deploy Website
```

## Git Workflow

``` bash
git add .
git commit -m "feat: configure personal portal"
git push
```

## Theme Maintenance

Update theme:

``` bash
git submodule update --remote --merge
```

## Project Structure

``` text
roycechase-site
├── content
├── static
├── assets
├── themes
│   └── blowfish
├── config
│   └── _default
│       ├── hugo.toml
│       ├── params.toml
│       └── menus.toml
└── README.md
```

## Architecture Goal

This site is used as a personal technical brand portal.

Content includes: - Java Backend Engineering - Architecture Design -
Industrial Software - AI/RAG Experiments - HomeLab Infrastructure -
Technical Notes
