import Mithril from 'mithril';
import Application from 'flarum/common/Application';

declare global {
    const m: Mithril.Static;

    // Necessary because we can't import app for common namespace
    const app: Application;
}
