import {Vnode} from 'mithril';
import {ComponentAttrs} from 'flarum/common/Component';
import Modal from 'flarum/common/components/Modal';
import icon from 'flarum/common/helpers/icon';
import LinkButton from 'flarum/common/components/LinkButton';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

interface Inspection {
    englishText: string
    text: string
    extension?: {
        name: string
        title: string
        icon: any
    }
    file?: {
        path: string
        line?: number
    }
    url?: string
}

interface InspectTranslationModalAttrs extends ComponentAttrs {
    translation: string
}

// @ts-ignore Modal.view not type-hinted
export default class InspectTranslationModal extends Modal {
    inspection: Inspection | null = null
    attrs!: InspectTranslationModalAttrs

    oninit(vnode: Vnode<InspectTranslationModalAttrs, this>) {
        super.oninit(vnode);

        app.request({
            url: app.forum.attribute('apiUrl') + '/inspect-translation',
            method: 'GET',
            params: {
                key: vnode.attrs.translation,
            },
        }).then(response => {
            this.inspection = response;
            m.redraw();
        });
    }

    className() {
        return 'Modal--small TranslationInspectorModal';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.title');
    }

    content() {
        if (!this.inspection) {
            return LoadingIndicator.component();
        }

        return m('.Modal-body', [
            m('dl.TranslationInspectorKey', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.key')),
                m('dd', this.attrs.translation),
            ]),
            m('dl.TranslationInspectorOriginal', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.original')),
                m('dd', this.inspection.englishText),
            ]),
            m('dl.TranslationInspectorActual', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.actual')),
                m('dd', this.inspection.text),
            ]),
            m('dl.TranslationInspectorExtension', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.extension')),
                this.inspection.extension ? m('dd', [
                    m('span.TranslationInspectorExtensionIcon', {
                        style: this.inspection.extension.icon,
                    }, this.inspection.extension.icon?.name ? icon(this.inspection.extension.icon.name) : null),
                    m('span.TranslationInspectorExtensionTitle', this.inspection.extension.title),
                    m('span.TranslationInspectorExtensionName', this.inspection.extension.name),
                ]) : m('dd', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.extension-unknown')),
            ]),
            this.inspection.file ? m('dl.TranslationInspectorPath', [
                m('dt', app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.path')),
                m('dd', this.filePath(this.inspection)),
            ]) : null,
            this.inspection.url ? LinkButton.component({
                className: 'Button Button--block TranslationInspectorEditButton',
                icon: 'fab fa-github',
                href: this.inspection.url,
                external: true,
                target: '_blank',
                rel: 'nofollow noopener',
            }, app.translator.trans('clarkwinkelmann-translation-inspector.lib.modal.edit')) : null,
        ]);
    }

    filePath(inspection: Inspection): string | Vnode {
        if (!inspection.file) {
            return '';
        }

        const path = inspection.file.path + (inspection.file.line ? ':' + inspection.file.line : '');

        if (inspection.url) {
            return m('a', {
                href: inspection.url,
                external: true,
                target: '_blank',
            }, path);
        }

        return path;
    }
}
