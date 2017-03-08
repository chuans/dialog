"use strict";
import { EVENT_STATE } from '../state/index.js';

/**
 * appendChild的扩展方法     可添加多个子集
 * @param sourTarget        添加到的父元素
 * @param targetArr         被添加的元素
 */
export function append( sourTarget, targetArr ) {
    for ( let i = 0; i < targetArr.length; i++ ) {
        sourTarget.appendChild( targetArr[ i ] );
    }
}

/**
 * 添加主题方法
 * @param el        所有操作的dom对象（命名规则）
 * @param props     用户传入的值对象
 */
export function addTheme( el, props ) {
    let custom = true || EVENT_STATE.customTheme;
    let _props = props.customTheme;
    if ( custom ) {
        for ( let key in el ) {
            if ( key === 'buttons' ) {
                for ( let s_key in el[ key ] ) {
                    el[ key ][ s_key ].style.cssText = _props[ key ][ s_key ];
                }
                continue;
            }
            el[ key ].style.cssText = _props[ key ];
        }
    }
}


/**
 * 创建一个dom对象
 * @param name              dom对象的标签名
 * @param className         dom对象的class名字
 * @return {Element}        返回该对象
 */
export function createElement( name, className ) {
    let dom = document.createElement( name );
    className && (dom.className = className);
    return dom;
}

/**
 * 判断一个对象是否为空
 * @param e
 * @return {boolean}
 */
export function isEmptyObject(e){
    let t ;
    for ( t in e )
        return !1 ;
    return !0
}