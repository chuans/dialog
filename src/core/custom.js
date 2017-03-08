import Base from "../base.js";
import { append, addTheme, createElement } from "../share/util.js";
import theme from "../core/theme";
import { EVENT_STATE } from '../state/index.js';

export default class Custom extends Base {
    constructor( props ) {
        super( props, true );
        this.setState( props );
        this.initProps( props );
    }

    setState( props ) {
        //是否隐藏取消按钮
        if ( props.hideCloseBtn !== undefined) {
            EVENT_STATE.hideCloseBtn = props.hideCloseBtn;
        }
    }

    initProps( props ) {
        props = Object.assign( props, theme.currentTheme );

        //渲染dom
        this.render( props , this.el );
    }
}