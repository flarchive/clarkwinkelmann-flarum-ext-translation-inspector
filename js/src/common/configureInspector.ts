import {Vnode} from 'mithril';
import {override} from 'flarum/common/extend';
import Translator from 'flarum/common/Translator';
import InspectTranslationModal from './components/InspectTranslationModal';
import InspectorGlobal from './InspectorGlobal';

// @ts-ignore we make this function global as a helper
window.startTranslationInspection = function () {
    InspectorGlobal.selecting = true;
    m.redraw();
}

function wrapTranslation(translation: string, vdom: Vnode) {
    return m('span.TranslationInspectorText', {
        onclick(event: Event) {
            event.stopPropagation();
            event.preventDefault();
            InspectorGlobal.selecting = false;

            app.modal.show(InspectTranslationModal, {
                translation,
            });
        },
    }, vdom);
}

export default function () {
    override(Translator.prototype, 'trans', function (original: any, id: string, parameters: any) {
        const vdom = original(id, parameters);

        // Highlight translations, except the ones inside of the tooltip because it would prevent clicking cancel
        if (InspectorGlobal.selecting && id.indexOf('clarkwinkelmann-translation-inspector.lib.tooltip') !== 0) {
            return wrapTranslation(id, vdom);
        }

        return vdom;
    });
}
