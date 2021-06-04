<?php

namespace ClarkWinkelmann\TranslationInspector\Locale;

use Flarum\Locale\PrefixedYamlFileLoader;

class PrefixedYamlLoaderWithMetadata extends PrefixedYamlFileLoader
{
    protected $metadata;

    public function load($resource, $locale, $domain = 'messages')
    {
        $catalogue = parent::load($resource, $locale, $domain);

        $this->metadata[$domain] = [];

        foreach ($catalogue->all($domain) as $key => $value) {
            $catalogue->setMetadata($key, $resource['file'], $domain);
        }

        return $catalogue;
    }
}
