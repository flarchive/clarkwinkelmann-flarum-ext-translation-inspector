<?php

namespace ClarkWinkelmann\TranslationInspector\Locale;

use Flarum\Locale\Translator;
use Symfony\Component\Translation\MessageCatalogueInterface;
use Symfony\Component\Translation\MetadataAwareInterface;

/**
 * We need to load the translations again with our custom loader
 * Problems are:
 * - The resources are private, so there's no way to get them out of Flarum's Translator
 * - The cache path is private and cannot be modified, and clearing the cache isn't a viable option for performance
 *
 * As a workaround, manually call the method that loads the resources and then retrieve the catalogue
 * This bypasses the cache, but requires calling an internal protected method
 * This is achieved by extending the translator to gain access to protected methods
 *
 * This could break with any change to Symfony's internal doLoadCatalogue method
 *
 * Note to future self: it was not easier to get the list of resources and parse them, because the resources aren't part
 * of the cached data, meaning we have to run doLoadCatalogue again anyway
 */
class ExtendedTranslator extends Translator
{
    protected $translator;

    public function __construct(Translator $translator)
    {
        parent::__construct($translator->getLocale());

        $this->translator = $translator;
        $this->translator->addLoader('prefixed_yaml', new PrefixedYamlLoaderWithMetadata());
    }

    public function getTranslationSource($locale, $key)
    {
        $this->translator->doLoadCatalogue($locale);

        /**
         * @var MetadataAwareInterface $catalogue
         */
        $catalogue = $this->translator->getCatalogue($locale);

        // Flarum loads all translations in the INTL domain so that's where the meta will be available
        return $catalogue->getMetadata($key, 'messages' . MessageCatalogueInterface::INTL_DOMAIN_SUFFIX);
    }
}
