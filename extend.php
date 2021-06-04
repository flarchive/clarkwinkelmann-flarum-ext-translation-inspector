<?php

namespace ClarkWinkelmann\TranslationInspector;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/common.less'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/common.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/inspect-translation', 'inspect-translation', Controllers\InspectTranslationController::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canInspectTranslations', function (ForumSerializer $serializer): bool {
            return $serializer->getActor()->can('clarkwinkelmann-translation-inspector.inspect');
        }),
];
