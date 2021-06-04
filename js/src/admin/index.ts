import app from 'flarum/admin/app';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import HeaderSecondary from 'flarum/admin/components/HeaderSecondary';
import AdminNav from 'flarum/admin/components/AdminNav';
import configureInspector from '../common/configureInspector';
import InspectorGlobal from '../common/InspectorGlobal';
import Tooltip from '../common/components/Tooltip';

app.initializers.add('clarkwinkelmann-translation-inspector', () => {
    app.extensionData
        .for('clarkwinkelmann-translation-inspector')
        .registerPermission({
            icon: 'fas fa-highlighter',
            label: app.translator.trans('clarkwinkelmann-translation-inspector.admin.permissions.inspect'),
            permission: 'clarkwinkelmann-translation-inspector.inspect',
            allowGuest: true,
        }, 'view');

    configureInspector();

    extend(HeaderSecondary.prototype, 'items', function (items: ItemList) {
        items.add('translation-inspector', Button.component({
            className: 'Button Button--link',
            icon: 'fas fa-highlighter',
            onclick() {
                InspectorGlobal.selecting = true;
            },
        }, app.translator.trans('clarkwinkelmann-translation-inspector.lib.nav.inspect')), 10);
    });

    extend(AdminNav.prototype, 'items', function (items: ItemList) {
        if (InspectorGlobal.selecting) {
            items.add('translation-suggestions', m(Tooltip));
        }
    });
});
