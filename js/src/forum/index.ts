import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import HeaderPrimary from 'flarum/forum/components/HeaderPrimary';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import CommentPost from 'flarum/forum/components/CommentPost';
import configureInspector from '../common/configureInspector';
import InspectorGlobal from '../common/InspectorGlobal';
import Tooltip from '../common/components/Tooltip';

app.initializers.add('clarkwinkelmann-translation-inspector', function () {
    configureInspector();

    extend(SessionDropdown.prototype, 'items', function (items: ItemList) {
        if (!app.forum.attribute('canInspectTranslations')) {
            return;
        }

        items.add('translation-inspector', Button.component({
            icon: 'fas fa-highlighter',
            onclick() {
                InspectorGlobal.selecting = true;
            },
        }, app.translator.trans('clarkwinkelmann-translation-inspector.lib.nav.inspect')));
    });

    extend(HeaderPrimary.prototype, 'items', function (items: ItemList) {
        if (InspectorGlobal.selecting) {
            items.add('translation-suggestions', m(Tooltip));
        }
    });

    extend(DiscussionListItem.prototype, 'oninit', function (this: DiscussionListItem) {
        this.subtree.check(() => InspectorGlobal.selecting);
    });

    extend(CommentPost.prototype, 'oninit', function (this: DiscussionListItem) {
        this.subtree.check(() => InspectorGlobal.selecting);
    });
});
