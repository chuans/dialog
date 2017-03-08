"use strict";
export default {
    warp: 'position:fixed;left:0;top:0;right:0;bottom:0;background:none;z-index:-1;opacity:0;',
    /**
     * 清爽主题(所有样式以纯文字显示)
     */
    refreshing: {
        mask: 'background:rgba(0,0,0,.01);position:absolute;left:0;top:0;right:0;bottom:0;-webkit-transition:all 0.3s 0s;transition:all 0.3s 0s;-webkit-transform:scale(1);transform:scale(1);',
        box: "background: #ffffff;position: absolute;left: 50%;top: 50%;z-index: 1000;color: #808080;margin-top: -25%; margin-left: -40%;box-shadow:0 10px 40px rgba(0,0,0,.6);padding:10px 20px;box-sizing:border-box;width:80%;",
        header: 'height:30px;color:#909090;font-size:14px;line-height:30px;',
        body: 'width:100%;height:60px;padding-top:10px;box-sizing:border-box;line-height:24px;color:#5f5f5f',
        footer: 'height:40px;overflow:hidden;color:#12ccea;text-align:right',
        buttons: [ {
            cancel: 'line-height:40px;display:inline-block;padding:0 10px;cursor:pointer;'
        }, {
            ok: 'line-height:40px;display:inline-block;padding:0 10px;cursor:pointer;'
        } ]
    },
    /**
     * 仿IOS主题
     */
    iosTheme: {
        mask: 'background:rgba(0,0,0,.5);position:absolute;left:0;top:0;right:0;bottom:0;',
        box: "background: #ffffff;position: absolute;left: 50%;top: 50%;z-index: 1000;color: #808080;margin-top: -25%; margin-left: -40%;padding-top:20px;box-sizing:border-box;width:80%;border-radius:12px;-webkit-transform:scale(.01);transform:scale(.01);",
        header: 'height:30px;color:#000000;font-size:16px;line-height:30px;text-align:center;',
        body: 'width:100%;height:52px;padding-top:10px;box-sizing:border-box;line-height:20px;color:#232323;text-align:center;font-size:13px;padding:5px 25px;',
        footer: 'height:45px;overflow:hidden;color:#0275f6;text-align:center;border-top:1px solid #e2e2e2;box-shadow:0 1px 1px rgba(0,0,0,.02) inset;',
        buttons: [ {
            cancel: 'line-height:45px;display:inline-block;cursor:pointer;width:50%;border-right:1px solid #e2e2e2;box-sizing:border-box;'
        }, {
            ok: 'line-height:45px;display:inline-block;cursor:pointer;width:50%;'
        } ]
    },

    //保存当前所用的主题
    currentTheme: {},

    //保存开始结束动画的样式表 最终会插入头部
    animationStyle: '.dialog-warp.fade .dialog-main-box{-webkit-transform:scale(1)!important;transform:scale(1)!important;-webkit-transition:all 0.3s 0s;transition:all 0.3s 0s;}',
}