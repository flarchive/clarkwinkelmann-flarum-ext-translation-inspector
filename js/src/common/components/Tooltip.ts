import {ClassComponent} from 'mithril';
import icon from 'flarum/common/helpers/icon';
import InspectorGlobal from '../InspectorGlobal';

export default class Tooltip implements ClassComponent {
    view() {
        return m('.TranslationInspectorTooltip', [
            icon('fas fa-highlighter'),
            m('h3', app.translator.trans('clarkwinkelmann-translation-inspector.lib.tooltip.title')),
            m('p', app.translator.trans('clarkwinkelmann-translation-inspector.lib.tooltip.description')),
            m('p', m('a', {
                href: '#',
                onclick(event: Event) {
                    event.preventDefault();
                    InspectorGlobal.selecting = false;
                },
            }, app.translator.trans('clarkwinkelmann-translation-inspector.lib.tooltip.cancel'))),
        ]);
    }
}
