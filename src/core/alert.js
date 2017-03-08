import Base from "../base.js";
import { append, addTheme, createElement } from "../share/util.js";
import theme from "../core/theme";
import { EVENT_STATE } from '../state/index.js';

export default class Alert extends Base {
    constructor( props ) {
        super( props, true );
        this.setState( props );
        this.initProps( props );
    }

    setState( props ) {

    }

    initProps( props ) {
        props = Object.assign( props, theme.currentTheme );
        props.buttons = {
            ok: props.ok || props.buttons.ok,
        }

        this.render( props );
    }
}