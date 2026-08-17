# Contributing

Thanks for helping make RSS imports more reliable.

## Before opening an issue

- Remove private URLs, tokens and personal information from feed samples.
- Search existing issues for the same importer or feed behavior.
- Include the smallest XML sample that reproduces the problem when possible.

## Development

1. Fork and clone the repository.
2. Create a focused branch.
3. Install dependencies with `npm install`.
4. Add or update tests for behavior changes.
5. Run `npm test` and `npm run build`.
6. Open a pull request describing the feed problem and expected output.

Keep dependencies minimal and preserve article structure unless an element is clearly unsafe.
