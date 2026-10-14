# RoyceChase Site

Personal website powered by Hugo + Blowfish + Cloudflare Pages.

## Tech Stack

-   Hugo Extended
-   Blowfish Theme
-   GitHub
-   Cloudflare Pages

## Environment

Requirements: - Hugo Extended - Git - Node.js (optional)

Verify Hugo installation:

``` bash
hugo version
```

Expected:

``` text
hugo v0.xxx+extended
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

Configure theme in hugo.toml:

``` toml
theme = "blowfish"
```

## Local Development

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
git commit -m "update site"
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
├── hugo.toml
└── README.md
```

## Architecture Goal

This site is used as a personal technical brand portal.

Content includes: - Java Backend Engineering - Architecture Design -
Industrial Software - AI/RAG Experiments - HomeLab Infrastructure -
Technical Notes
