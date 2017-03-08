"use strict";

import { EVENT_STATE } from './state/index.js';
import { append, addTheme, createElement  } from "./share/util.js";
import theme from "./core/theme";


export default class Base {
    constructor( props, isExtend ) {
        !isExtend && this.init( props );
    }
    init( props ) {
        //如果用户不传入任何参数
        if(!props) props = {} ;
        //如果用户传入了自定义主题则开启自定义主题模式否则使用默认主题
        if ( props.customTheme !== undefined ) {
            EVENT_STATE.customTheme = true;
        } else {
            let _theme = props.theme || EVENT_STATE.theme;
            if ( _theme == 1 || _theme === 'refreshing' ) {
                _theme = 'refreshing'
            } else if ( _theme == 2 || _theme === 'iosTheme' ) {
                _theme = 'iosTheme'
            } else {
                console.warn( '系统里没有你选择的主题，默认使用“refreshing”主题' );
                _theme = 'refreshing';
            }
            EVENT_STATE.theme = _theme;
            props.customTheme = theme[ EVENT_STATE.theme ];
            props.customTheme.warp = theme.warp;
        }

        //是否开启点击背景关闭
        if ( props.clickMaskCloseWindow !== undefined ) {
            EVENT_STATE.clickMaskCloseWindow = props.clickMaskCloseWindow;
        }
        //是否开启动画
        if ( props.isOpenAnimation !== undefined ) {
            EVENT_STATE.isOpenAnimation = props.isOpenAnimation;

        }

        //设置当前主题
        theme.currentTheme = Object.assign( theme.currentTheme, props );

    }

    /**
     * 创建按钮
     * @param props  用户传入的所有参数
     * @param el     当前已经创建好的dom树
     * @return       返回一个当前按钮组成的数组
     */
    createBut( props, el ) {
        let me = this;
        let buts = [];
        let _pButtons = props.buttons;
        let _pCustom = props.customTheme.buttons;
        for ( let i = 0; i < _pCustom.length; i++ ) {
            for ( let key in _pCustom[ i ] ) {
                if ( !props.buttons[ key ] ) continue;

                let domBtn = el.buttons[ key ];
                //创建
                domBtn = createElement( 'div', 'dialog-button-' + key );
                //赋值
                let text;
                //兼容文本
                if ( _pButtons[ key ].text ) {
                    text = _pButtons[ key ].text;
                } else {
                    if ( key === 'ok' ) {
                        text = '确定';
                    } else if ( key === 'cancel' ) {
                        text = '取消';
                    }
                }
                domBtn.innerHTML = text;
                domBtn.style.cssText = _pCustom[ i ][ key ];
                domBtn.key = key;

                if ( EVENT_STATE.hideCloseBtn && key === 'cancel' ) {
                    domBtn.style.display = 'none';
                }
                //绑定点击事件
                domBtn.onclick = e => {
                    let callback;
                    if ( typeof _pButtons[ key ] === 'function' ) {
                        callback = _pButtons[ key ]
                    } else {
                        callback = _pButtons[ key ].callback;

                    }
                    let isClose = callback && callback( el.warp );
                    if ( key === 'cancel' || isClose ) {
                        me.remove( el.warp );
                    }
                };
                buts.push( domBtn );
            }
        }
        return buts;
    }

    /**
     *创建所有的dom元素
     */
    createDomTree( props ) {
        let el = {
            warp: createElement( 'div', 'dialog-warp' ),
            mask: createElement( 'div', 'dialog-mask' ),
            box: createElement( 'div', 'dialog-main-box' ),
            header: createElement( 'div', 'dialog-header' ),
            body: createElement( 'div', 'dialog-body' ),
            footer: createElement( 'div', 'dialog-footer' ),
            buttons: {},
        }
        if ( !props.title ) {
            delete el.header;
        }
        if(EVENT_STATE.clickMaskCloseWindow){
            el.mask.onclick = ()=>{
                this.remove(el.warp);
            }
        }
        return el;
    }

    /**
     * 添加动画样式到头部
     */
    addAnimationStyle() {
        let style = createElement( 'style' );
        style.type = 'text/css' ;
        style.innerHTML = theme.animationStyle ;
        document.head.appendChild(style);
    }

    /**
     * 渲染并显示弹窗界面
     * @param props  用户传入的所有参数
     */
    render( props ) {

        let el = this.createDomTree( props );

        //创建按钮
        if ( props.buttons ) {
            let buts = this.createBut( props, el );
            append( el.footer, buts );
        }

        let box = [ el.body, el.footer ];

        //当头部不存在的时候忽略头部信息
        if ( el.header ) {
            el.header.innerHTML = props.title;
            box.unshift( el.header );
        }

        //添加内容
        el.body.innerHTML = props.content;
        append( el.box, box )
        append( el.warp, [ el.mask, el.box ] )
        //添加主题样式
        addTheme( el, props );

        //添加动画
        if ( EVENT_STATE.isOpenAnimation ) {
            //添加动画样式
            this.addAnimationStyle();

            el.warp.style.opacity = '0';
            setTimeout( () => {
                el.warp.className += ' fade';
            }, 10 )
        } else {
            //当没有动画时把缩放设置为原始值
            el.box.style.webkitTransform = 'scale(1)';
        }
        //渲染弹窗
        el.warp.style.zIndex = '9999';
        document.body.appendChild( el.warp );
        el.warp.style.opacity = '1';
    }

    /**
     * 删除弹窗界面根节点
     * @param element    根节点
     */
    remove( element ) {
        document.body.removeChild( element );
    }

}
