# Translation Inspector

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-translation-inspector/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-translation-inspector.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-translation-inspector) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-translation-inspector.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-translation-inspector) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

Enable forum users to find details about translations.

Features:

- A link in the session dropdown enables "inspect" mode
- When "inspect" mode is active, all translatable texts are highlighted
- Clicking on a text brings up a modal with details about the translation key, which extension provides it, and a link to the source file if it's on GitHub
- If you are in a context where you cannot click the inspect button (for example as guest or inside a modal), you can run `startTranslationInspection()` from the browser console

> Caution: if you have private extensions or local extenders installed, this extension could expose their repository URLs, names, icons or relative paths to some of their yaml files to users with the Inspect permission!

With the current feature set it probably doesn't make much sense to install this extension on a production forum.
It is more meant as a developer tool.

## Installation

    composer require clarkwinkelmann/flarum-ext-translation-inspector

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-translation-inspector)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-translation-inspector)
- [Discuss](https://discuss.flarum.org/d/26192)
