<?php

namespace ClarkWinkelmann\TranslationInspector\Controllers;

use ClarkWinkelmann\TranslationInspector\Locale\ExtendedTranslator;
use Flarum\Extension\Extension;
use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\Application;
use Flarum\Foundation\Paths;
use Flarum\Http\RequestUtil;
use Flarum\Locale\Translator;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class InspectTranslationController implements RequestHandlerInterface
{
    protected $translator;
    protected $validation;
    protected $paths;
    protected $manager;

    public function __construct(Translator $translator, Factory $validation, Paths $paths, ExtensionManager $manager)
    {
        $this->translator = $translator;
        $this->validation = $validation;
        $this->paths = $paths;
        $this->manager = $manager;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertCan('clarkwinkelmann-translation-inspector.inspect');

        $key = Arr::get($request->getQueryParams(), 'key');

        $this->validation->make([
            'key' => $key,
        ], [
            'key' => ['required', 'regex:~^[A-Za-z0-9_-]+\.(forum|admin|lib)\.~'],
        ])->validate();

        $englishText = $this->translator->trans($key, [], null, 'en');

        if (!$englishText) {
            return new JsonResponse(['Translation doesnt exist'], 400);
        }

        $inspection = [
            'englishText' => $englishText,
            'text' => $this->translator->trans($key),
        ];

        $translator = new ExtendedTranslator($this->translator);

        $path = realpath($translator->getTranslationSource($this->translator->getLocale(), $key));

        // Most likely, the file will be in vendor, so this should shorten it to something we can work with relative to Flarum
        $pathInVendor = str_replace($this->paths->vendor, '', $path);

        // We check that the path is at least two folders in, this will give us the <vendor/name> of the package
        if (preg_match('~^/([A-Za-z0-9_-]+/[A-Za-z0-9_-]+)/(.+\.ya?ml)$~', $pathInVendor, $matches) === 1) {
            $packageName = $matches[1];
            $yamlFilePathInPackage = $matches[2];
            $sourceUrl = null;
            $version = null;

            /**
             * @var Extension $extension
             */
            $extension = $this->manager->getExtensions()->first(function (Extension $extension) use ($packageName) {
                return $extension->name === $packageName;
            });

            if ($extension) {
                $inspection['extension'] = [
                    'name' => $extension->name,
                    'title' => $extension->composerJsonAttribute('extra.flarum-extension.title'),
                    'icon' => $extension->getIcon(),
                ];

                $inspection['file'] = [
                    'path' => $yamlFilePathInPackage,
                ];

                $sourceUrl = $extension->composerJsonAttribute('source.url');
                $version = $extension->getVersion();
            }

            // We need a special handle for core since it's not an extension
            if ($packageName === 'flarum/core') {
                $inspection['extension'] = [
                    'name' => 'flarum/core',
                    'title' => 'Flarum Core',
                    'icon' => [],
                ];

                $inspection['file'] = [
                    'path' => $yamlFilePathInPackage,
                ];

                $sourceUrl = 'https://github.com/flarum/core';
                $version = 'v' . Application::VERSION;
            }

            if ($sourceUrl && preg_match('~^(https://github\.com/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+)(\.git)?$~', $sourceUrl, $matches) === 1) {
                $line = $this->findLineNumber($path, $key);

                $version = str_replace(['-dev', 'dev-'], '', $version) ?: 'master';

                $inspection['url'] = $matches[1] . '/blob/' . $version . '/' . $yamlFilePathInPackage . ($line ? '#L' . $line : '');

                $inspection['file']['line'] = $line;
            }
        }

        return new JsonResponse($inspection);
    }

    /**
     * Attempts to find the line number on which the translation is defined
     * This is not a full Yaml parser, and probably won't work on all files
     * This method assumes:
     * - That the provided key is present in the file
     * - That every key is has its own line
     * - That the indentation is constant across the full file
     * @param string $filename
     * @param string $key
     * @return int|null
     */
    protected function findLineNumber(string $filename, string $key): ?int
    {
        $yaml = file_get_contents($filename);

        // We take the space before "forum:" or "admin:" as the reference for one indentation
        if (preg_match('~^(\s+)(forum|admin)\s*:~m', $yaml, $matches) !== 1) {
            return null;
        }

        $oneIndent = $matches[1];

        $keyPath = explode('.', $key);
        $depth = 0;

        foreach (explode("\n", $yaml) as $index => $line) {
            $lookFor = '~^' . preg_quote(str_repeat($oneIndent, $depth) . $keyPath[$depth], '~') . '\s*:~';

            // If this is the next part of the key, we go one level deeper
            // We don't care about going a level back up, since we assume the key exists and will be in this level
            if (preg_match($lookFor, $line) === 1) {
                $depth++;

                if ($depth === count($keyPath)) {
                    // Line number is index + 1
                    return $index + 1;
                }
            }
        }

        return null;
    }
}
