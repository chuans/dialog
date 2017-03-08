"use strict";

/**
 * 事件相关的状态管理
 * @type {{clickMaskCloseWindow: boolean}}
 */
export let EVENT_STATE = {
    /**
     * @name        clickMaskCloseWindow（点击遮罩层事件开关）
     * @desc        是否开启点击背景遮罩层 关闭弹窗
     * @default     false -> 默认关闭
     */
    clickMaskCloseWindow: false,

    /**
     * @name        theme（系统主题配置）
     * @desc        当前主题选择
     * @default     1( refreshing ) -> 默认为清爽主题
     * @default     2( iosTheme ) ->   仿IOS主题
     */
    theme: 'refreshing',

    /**
     * @name        customTheme（自定义主题配置）
     * @desc        是否开启自定义主题(开启后会忽略系统主题配置)
     * @default     false -> 默认关闭
     */
    customTheme : false ,

    /**
     * @name        isOpenAnimation（是否开启显示和关闭动画）
     * @desc        开启动画后会在head里面添加一段css样式保证动画顺利执行
     * @default     false -> 默认关闭
     */
    isOpenAnimation : false ,

    /**
     * @name        hideCloseBtn（是否隐藏取消按钮）
     * @desc        是否隐藏取消按钮在自定义或者确认取消框使用
     * @default     false -> 默认开启
     */
    hideCloseBtn : false ,
}


