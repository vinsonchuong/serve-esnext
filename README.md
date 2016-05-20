# serve-esnext
[![Build Status](https://travis-ci.org/vinsonchuong/serve-esnext.svg?branch=master)](https://travis-ci.org/vinsonchuong/serve-esnext)

Seamlessly run ES.Next code in the browser.

Currently, when starting a new JavaScript web application project, a
significant amount of time is spent coordinating different libraries to
compile ES.Next into ES5 and load it into the browser. External dependencies
have to be declared and configured via configuration files committed to the
codebase.

The WHATWG is developing the
[JavaScript Loader Standard](https://github.com/whatwg/loader), which defines
how browsers should handle the `import` and `export` keywords.

`serve-esnext` coordinates and configures the necessary libraries to implement
the JavaScript Loader Standard without requiring additional configuration.

## Installing
`serve-esnext` is available as an
[npm package](https://www.npmjs.com/package/serve-esnext).

## Usage
In `package.json`, run `serve-esnext` as follows:

```json
{
  "name": "project",
  "private": true,
  "scripts": {
    "start": "serve-esnext"
  }
}
```

`serve-esnext` assumes the following project directory structure:

```text
package.json
src
  index.html
  index.js
```

The `index.html` should import `index.js` as follows:

```html
<!doctype html>
<meta charset="utf-8">
<script type="module" src="project"></script>
```

From the command line, run:

```bash
npm start
```

The application can be accessed from `http://localhost:8080`.

## Development
### Getting Started
The application requires the following external dependencies:
* Node.js

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```
