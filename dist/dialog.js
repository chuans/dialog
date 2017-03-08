(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Modal = factory());
}(this, (function () { 'use strict';

var EVENT_STATE = {
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
  customTheme: false,

  /**
   * @name        isOpenAnimation（是否开启显示和关闭动画）
   * @desc        开启动画后会在head里面添加一段css样式保证动画顺利执行
   * @default     false -> 默认关闭
   */
  isOpenAnimation: false,

  /**
   * @name        hideCloseBtn（是否隐藏取消按钮）
   * @desc        是否隐藏取消按钮在自定义或者确认取消框使用
   * @default     false -> 默认开启
   */
  hideCloseBtn: false
};

/**
 * appendChild的扩展方法     可添加多个子集
 * @param sourTarget        添加到的父元素
 * @param targetArr         被添加的元素
 */
function append(sourTarget, targetArr) {
    for (var i = 0; i < targetArr.length; i++) {
        sourTarget.appendChild(targetArr[i]);
    }
}

/**
 * 添加主题方法
 * @param el        所有操作的dom对象（命名规则）
 * @param props     用户传入的值对象
 */
function addTheme(el, props) {
    var custom = true || EVENT_STATE.customTheme;
    var _props = props.customTheme;
    if (custom) {
        for (var key in el) {
            if (key === 'buttons') {
                for (var s_key in el[key]) {
                    el[key][s_key].style.cssText = _props[key][s_key];
                }
                continue;
            }
            el[key].style.cssText = _props[key];
        }
    }
}

/**
 * 创建一个dom对象
 * @param name              dom对象的标签名
 * @param className         dom对象的class名字
 * @return {Element}        返回该对象
 */
function createElement(name, className) {
    var dom = document.createElement(name);
    className && (dom.className = className);
    return dom;
}

/**
 * 判断一个对象是否为空
 * @param e
 * @return {boolean}
 */

var theme = {
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
        buttons: [{
            cancel: 'line-height:40px;display:inline-block;padding:0 10px;cursor:pointer;'
        }, {
            ok: 'line-height:40px;display:inline-block;padding:0 10px;cursor:pointer;'
        }]
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
        buttons: [{
            cancel: 'line-height:45px;display:inline-block;cursor:pointer;width:50%;border-right:1px solid #e2e2e2;box-sizing:border-box;'
        }, {
            ok: 'line-height:45px;display:inline-block;cursor:pointer;width:50%;'
        }]
    },

    //保存当前所用的主题
    currentTheme: {},

    //保存开始结束动画的样式表 最终会插入头部
    animationStyle: '.dialog-warp.fade .dialog-main-box{-webkit-transform:scale(1)!important;transform:scale(1)!important;-webkit-transition:all 0.3s 0s;transition:all 0.3s 0s;}'
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Base = function () {
    function Base(props, isExtend) {
        classCallCheck(this, Base);

        !isExtend && this.init(props);
    }

    createClass(Base, [{
        key: "init",
        value: function init(props) {
            //如果用户不传入任何参数
            if (!props) props = {};
            //如果用户传入了自定义主题则开启自定义主题模式否则使用默认主题
            if (props.customTheme !== undefined) {
                EVENT_STATE.customTheme = true;
            } else {
                var _theme = props.theme || EVENT_STATE.theme;
                if (_theme == 1 || _theme === 'refreshing') {
                    _theme = 'refreshing';
                } else if (_theme == 2 || _theme === 'iosTheme') {
                    _theme = 'iosTheme';
                } else {
                    console.warn('系统里没有你选择的主题，默认使用“refreshing”主题');
                    _theme = 'refreshing';
                }
                EVENT_STATE.theme = _theme;
                props.customTheme = theme[EVENT_STATE.theme];
                props.customTheme.warp = theme.warp;
            }

            //是否开启点击背景关闭
            if (props.clickMaskCloseWindow !== undefined) {
                EVENT_STATE.clickMaskCloseWindow = props.clickMaskCloseWindow;
            }
            //是否开启动画
            if (props.isOpenAnimation !== undefined) {
                EVENT_STATE.isOpenAnimation = props.isOpenAnimation;
            }

            //设置当前主题
            theme.currentTheme = Object.assign(theme.currentTheme, props);
        }

        /**
         * 创建按钮
         * @param props  用户传入的所有参数
         * @param el     当前已经创建好的dom树
         * @return       返回一个当前按钮组成的数组
         */

    }, {
        key: "createBut",
        value: function createBut(props, el) {
            var me = this;
            var buts = [];
            var _pButtons = props.buttons;
            var _pCustom = props.customTheme.buttons;
            for (var i = 0; i < _pCustom.length; i++) {
                var _loop = function _loop(key) {
                    if (!props.buttons[key]) return "continue";

                    var domBtn = el.buttons[key];
                    //创建
                    domBtn = createElement('div', 'dialog-button-' + key);
                    //赋值
                    var text = void 0;
                    //兼容文本
                    if (_pButtons[key].text) {
                        text = _pButtons[key].text;
                    } else {
                        if (key === 'ok') {
                            text = '确定';
                        } else if (key === 'cancel') {
                            text = '取消';
                        }
                    }
                    domBtn.innerHTML = text;
                    domBtn.style.cssText = _pCustom[i][key];
                    domBtn.key = key;

                    if (EVENT_STATE.hideCloseBtn && key === 'cancel') {
                        domBtn.style.display = 'none';
                    }
                    //绑定点击事件
                    domBtn.onclick = function (e) {
                        var callback = void 0;
                        if (typeof _pButtons[key] === 'function') {
                            callback = _pButtons[key];
                        } else {
                            callback = _pButtons[key].callback;
                        }
                        var isClose = callback && callback(el.warp);
                        if (key === 'cancel' || isClose) {
                            me.remove(el.warp);
                        }
                    };
                    buts.push(domBtn);
                };

                for (var key in _pCustom[i]) {
                    var _ret = _loop(key);

                    if (_ret === "continue") continue;
                }
            }
            return buts;
        }

        /**
         *创建所有的dom元素
         */

    }, {
        key: "createDomTree",
        value: function createDomTree(props) {
            var _this = this;

            var el = {
                warp: createElement('div', 'dialog-warp'),
                mask: createElement('div', 'dialog-mask'),
                box: createElement('div', 'dialog-main-box'),
                header: createElement('div', 'dialog-header'),
                body: createElement('div', 'dialog-body'),
                footer: createElement('div', 'dialog-footer'),
                buttons: {}
            };
            if (!props.title) {
                delete el.header;
            }
            if (EVENT_STATE.clickMaskCloseWindow) {
                el.mask.onclick = function () {
                    _this.remove(el.warp);
                };
            }
            return el;
        }

        /**
         * 添加动画样式到头部
         */

    }, {
        key: "addAnimationStyle",
        value: function addAnimationStyle() {
            var style = createElement('style');
            style.type = 'text/css';
            style.innerHTML = theme.animationStyle;
            document.head.appendChild(style);
        }

        /**
         * 渲染并显示弹窗界面
         * @param props  用户传入的所有参数
         */

    }, {
        key: "render",
        value: function render(props) {

            var el = this.createDomTree(props);

            //创建按钮
            if (props.buttons) {
                var buts = this.createBut(props, el);
                append(el.footer, buts);
            }

            var box = [el.body, el.footer];

            //当头部不存在的时候忽略头部信息
            if (el.header) {
                el.header.innerHTML = props.title;
                box.unshift(el.header);
            }

            //添加内容
            el.body.innerHTML = props.content;
            append(el.box, box);
            append(el.warp, [el.mask, el.box]);
            //添加主题样式
            addTheme(el, props);

            //添加动画
            if (EVENT_STATE.isOpenAnimation) {
                //添加动画样式
                this.addAnimationStyle();

                el.warp.style.opacity = '0';
                setTimeout(function () {
                    el.warp.className += ' fade';
                }, 10);
            } else {
                //当没有动画时把缩放设置为原始值
                el.box.style.webkitTransform = 'scale(1)';
            }
            //渲染弹窗
            el.warp.style.zIndex = '9999';
            document.body.appendChild(el.warp);
            el.warp.style.opacity = '1';
        }

        /**
         * 删除弹窗界面根节点
         * @param element    根节点
         */

    }, {
        key: "remove",
        value: function remove(element) {
            document.body.removeChild(element);
        }
    }]);
    return Base;
}();

var Custom = function (_Base) {
    inherits(Custom, _Base);

    function Custom(props) {
        classCallCheck(this, Custom);

        var _this = possibleConstructorReturn(this, (Custom.__proto__ || Object.getPrototypeOf(Custom)).call(this, props, true));

        _this.setState(props);
        _this.initProps(props);
        return _this;
    }

    createClass(Custom, [{
        key: "setState",
        value: function setState(props) {
            //是否隐藏取消按钮
            if (props.hideCloseBtn !== undefined) {
                EVENT_STATE.hideCloseBtn = props.hideCloseBtn;
            }
        }
    }, {
        key: "initProps",
        value: function initProps(props) {
            props = Object.assign(props, theme.currentTheme);

            //渲染dom
            this.render(props, this.el);
        }
    }]);
    return Custom;
}(Base);

var Confirm = function (_Base) {
    inherits(Confirm, _Base);

    function Confirm(props) {
        classCallCheck(this, Confirm);

        var _this = possibleConstructorReturn(this, (Confirm.__proto__ || Object.getPrototypeOf(Confirm)).call(this, props, true));

        _this.setState(props);
        _this.initProps(props);
        return _this;
    }

    createClass(Confirm, [{
        key: "setState",
        value: function setState(props) {
            //是否隐藏取消按钮
            if (props.hideCloseBtn !== undefined) {
                EVENT_STATE.hideCloseBtn = props.hideCloseBtn;
            }
        }
    }, {
        key: "initProps",
        value: function initProps(props) {
            props = Object.assign(props, theme.currentTheme);
            props.buttons = {
                ok: props.buttons.ok,
                cancel: props.buttons.cancel
            };
            //渲染dom
            this.render(props);
        }
    }]);
    return Confirm;
}(Base);

var Alert = function (_Base) {
    inherits(Alert, _Base);

    function Alert(props) {
        classCallCheck(this, Alert);

        var _this = possibleConstructorReturn(this, (Alert.__proto__ || Object.getPrototypeOf(Alert)).call(this, props, true));

        _this.setState(props);
        _this.initProps(props);
        return _this;
    }

    createClass(Alert, [{
        key: "setState",
        value: function setState(props) {}
    }, {
        key: "initProps",
        value: function initProps(props) {
            props = Object.assign(props, theme.currentTheme);
            props.buttons = {
                ok: props.ok || props.buttons.ok
            };

            this.render(props);
        }
    }]);
    return Alert;
}(Base);

var Dialog = function () {
    function Dialog(props) {
        classCallCheck(this, Dialog);

        new Base(props);
        return this;
    }

    createClass(Dialog, [{
        key: "customs",
        value: function customs(props) {
            return new Custom(props);
        }
    }, {
        key: "confirm",
        value: function confirm(props) {
            return new Confirm(props);
        }
    }, {
        key: "alert",
        value: function alert(props) {
            return new Alert(props);
        }
    }]);
    return Dialog;
}();

return Dialog;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlcyI6WyIuLi9zcmMvc3RhdGUvaW5kZXguanMiLCIuLi9zcmMvc2hhcmUvdXRpbC5qcyIsIi4uL3NyYy9jb3JlL3RoZW1lLmpzIiwiLi4vc3JjL2Jhc2UuanMiLCIuLi9zcmMvY29yZS9jdXN0b20uanMiLCIuLi9zcmMvY29yZS9jb25maXJtLmpzIiwiLi4vc3JjL2NvcmUvYWxlcnQuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICog5LqL5Lu255u45YWz55qE54q25oCB566h55CGXHJcbiAqIEB0eXBlIHt7Y2xpY2tNYXNrQ2xvc2VXaW5kb3c6IGJvb2xlYW59fVxyXG4gKi9cclxuZXhwb3J0IGxldCBFVkVOVF9TVEFURSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgICAgICAgIGNsaWNrTWFza0Nsb3NlV2luZG9377yI54K55Ye76YGu572p5bGC5LqL5Lu25byA5YWz77yJXHJcbiAgICAgKiBAZGVzYyAgICAgICAg5piv5ZCm5byA5ZCv54K55Ye76IOM5pmv6YGu572p5bGCIOWFs+mXreW8ueeql1xyXG4gICAgICogQGRlZmF1bHQgICAgIGZhbHNlIC0+IOm7mOiupOWFs+mXrVxyXG4gICAgICovXHJcbiAgICBjbGlja01hc2tDbG9zZVdpbmRvdzogZmFsc2UsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSAgICAgICAgdGhlbWXvvIjns7vnu5/kuLvpopjphY3nva7vvIlcclxuICAgICAqIEBkZXNjICAgICAgICDlvZPliY3kuLvpopjpgInmi6lcclxuICAgICAqIEBkZWZhdWx0ICAgICAxKCByZWZyZXNoaW5nICkgLT4g6buY6K6k5Li65riF54i95Li76aKYXHJcbiAgICAgKiBAZGVmYXVsdCAgICAgMiggaW9zVGhlbWUgKSAtPiAgIOS7v0lPU+S4u+mimFxyXG4gICAgICovXHJcbiAgICB0aGVtZTogJ3JlZnJlc2hpbmcnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgICAgICAgIGN1c3RvbVRoZW1l77yI6Ieq5a6a5LmJ5Li76aKY6YWN572u77yJXHJcbiAgICAgKiBAZGVzYyAgICAgICAg5piv5ZCm5byA5ZCv6Ieq5a6a5LmJ5Li76aKYKOW8gOWQr+WQjuS8muW/veeVpeezu+e7n+S4u+mimOmFjee9rilcclxuICAgICAqIEBkZWZhdWx0ICAgICBmYWxzZSAtPiDpu5jorqTlhbPpl61cclxuICAgICAqL1xyXG4gICAgY3VzdG9tVGhlbWUgOiBmYWxzZSAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSAgICAgICAgaXNPcGVuQW5pbWF0aW9u77yI5piv5ZCm5byA5ZCv5pi+56S65ZKM5YWz6Zet5Yqo55S777yJXHJcbiAgICAgKiBAZGVzYyAgICAgICAg5byA5ZCv5Yqo55S75ZCO5Lya5ZyoaGVhZOmHjOmdoua3u+WKoOS4gOautWNzc+agt+W8j+S/neivgeWKqOeUu+mhuuWIqeaJp+ihjFxyXG4gICAgICogQGRlZmF1bHQgICAgIGZhbHNlIC0+IOm7mOiupOWFs+mXrVxyXG4gICAgICovXHJcbiAgICBpc09wZW5BbmltYXRpb24gOiBmYWxzZSAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSAgICAgICAgaGlkZUNsb3NlQnRu77yI5piv5ZCm6ZqQ6JeP5Y+W5raI5oyJ6ZKu77yJXHJcbiAgICAgKiBAZGVzYyAgICAgICAg5piv5ZCm6ZqQ6JeP5Y+W5raI5oyJ6ZKu5Zyo6Ieq5a6a5LmJ5oiW6ICF56Gu6K6k5Y+W5raI5qGG5L2/55SoXHJcbiAgICAgKiBAZGVmYXVsdCAgICAgZmFsc2UgLT4g6buY6K6k5byA5ZCvXHJcbiAgICAgKi9cclxuICAgIGhpZGVDbG9zZUJ0biA6IGZhbHNlICxcclxufVxyXG5cclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgeyBFVkVOVF9TVEFURSB9IGZyb20gJy4uL3N0YXRlL2luZGV4LmpzJztcclxuXHJcbi8qKlxyXG4gKiBhcHBlbmRDaGlsZOeahOaJqeWxleaWueazlSAgICAg5Y+v5re75Yqg5aSa5Liq5a2Q6ZuGXHJcbiAqIEBwYXJhbSBzb3VyVGFyZ2V0ICAgICAgICDmt7vliqDliLDnmoTniLblhYPntKBcclxuICogQHBhcmFtIHRhcmdldEFyciAgICAgICAgIOiiq+a3u+WKoOeahOWFg+e0oFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZCggc291clRhcmdldCwgdGFyZ2V0QXJyICkge1xyXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGFyZ2V0QXJyLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgIHNvdXJUYXJnZXQuYXBwZW5kQ2hpbGQoIHRhcmdldEFyclsgaSBdICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmt7vliqDkuLvpopjmlrnms5VcclxuICogQHBhcmFtIGVsICAgICAgICDmiYDmnInmk43kvZznmoRkb23lr7nosaHvvIjlkb3lkI3op4TliJnvvIlcclxuICogQHBhcmFtIHByb3BzICAgICDnlKjmiLfkvKDlhaXnmoTlgLzlr7nosaFcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZSggZWwsIHByb3BzICkge1xyXG4gICAgbGV0IGN1c3RvbSA9IHRydWUgfHwgRVZFTlRfU1RBVEUuY3VzdG9tVGhlbWU7XHJcbiAgICBsZXQgX3Byb3BzID0gcHJvcHMuY3VzdG9tVGhlbWU7XHJcbiAgICBpZiAoIGN1c3RvbSApIHtcclxuICAgICAgICBmb3IgKCBsZXQga2V5IGluIGVsICkge1xyXG4gICAgICAgICAgICBpZiAoIGtleSA9PT0gJ2J1dHRvbnMnICkge1xyXG4gICAgICAgICAgICAgICAgZm9yICggbGV0IHNfa2V5IGluIGVsWyBrZXkgXSApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbFsga2V5IF1bIHNfa2V5IF0uc3R5bGUuY3NzVGV4dCA9IF9wcm9wc1sga2V5IF1bIHNfa2V5IF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbFsga2V5IF0uc3R5bGUuY3NzVGV4dCA9IF9wcm9wc1sga2V5IF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIOWIm+W7uuS4gOS4qmRvbeWvueixoVxyXG4gKiBAcGFyYW0gbmFtZSAgICAgICAgICAgICAgZG9t5a+56LGh55qE5qCH562+5ZCNXHJcbiAqIEBwYXJhbSBjbGFzc05hbWUgICAgICAgICBkb23lr7nosaHnmoRjbGFzc+WQjeWtl1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAgICAgICAg6L+U5Zue6K+l5a+56LGhXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCggbmFtZSwgY2xhc3NOYW1lICkge1xyXG4gICAgbGV0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIG5hbWUgKTtcclxuICAgIGNsYXNzTmFtZSAmJiAoZG9tLmNsYXNzTmFtZSA9IGNsYXNzTmFtZSk7XHJcbiAgICByZXR1cm4gZG9tO1xyXG59XHJcblxyXG4vKipcclxuICog5Yik5pat5LiA5Liq5a+56LGh5piv5ZCm5Li656m6XHJcbiAqIEBwYXJhbSBlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eU9iamVjdChlKXtcclxuICAgIGxldCB0IDtcclxuICAgIGZvciAoIHQgaW4gZSApXHJcbiAgICAgICAgcmV0dXJuICExIDtcclxuICAgIHJldHVybiAhMFxyXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHdhcnA6ICdwb3NpdGlvbjpmaXhlZDtsZWZ0OjA7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtiYWNrZ3JvdW5kOm5vbmU7ei1pbmRleDotMTtvcGFjaXR5OjA7JyxcclxuICAgIC8qKlxyXG4gICAgICog5riF54i95Li76aKYKOaJgOacieagt+W8j+S7pee6r+aWh+Wtl+aYvuekuilcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaGluZzoge1xyXG4gICAgICAgIG1hc2s6ICdiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjAxKTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7cmlnaHQ6MDtib3R0b206MDstd2Via2l0LXRyYW5zaXRpb246YWxsIDAuM3MgMHM7dHJhbnNpdGlvbjphbGwgMC4zcyAwczstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKTt0cmFuc2Zvcm06c2NhbGUoMSk7JyxcclxuICAgICAgICBib3g6IFwiYmFja2dyb3VuZDogI2ZmZmZmZjtwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogNTAlO3RvcDogNTAlO3otaW5kZXg6IDEwMDA7Y29sb3I6ICM4MDgwODA7bWFyZ2luLXRvcDogLTI1JTsgbWFyZ2luLWxlZnQ6IC00MCU7Ym94LXNoYWRvdzowIDEwcHggNDBweCByZ2JhKDAsMCwwLC42KTtwYWRkaW5nOjEwcHggMjBweDtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6ODAlO1wiLFxyXG4gICAgICAgIGhlYWRlcjogJ2hlaWdodDozMHB4O2NvbG9yOiM5MDkwOTA7Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6MzBweDsnLFxyXG4gICAgICAgIGJvZHk6ICd3aWR0aDoxMDAlO2hlaWdodDo2MHB4O3BhZGRpbmctdG9wOjEwcHg7Ym94LXNpemluZzpib3JkZXItYm94O2xpbmUtaGVpZ2h0OjI0cHg7Y29sb3I6IzVmNWY1ZicsXHJcbiAgICAgICAgZm9vdGVyOiAnaGVpZ2h0OjQwcHg7b3ZlcmZsb3c6aGlkZGVuO2NvbG9yOiMxMmNjZWE7dGV4dC1hbGlnbjpyaWdodCcsXHJcbiAgICAgICAgYnV0dG9uczogWyB7XHJcbiAgICAgICAgICAgIGNhbmNlbDogJ2xpbmUtaGVpZ2h0OjQwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7cGFkZGluZzowIDEwcHg7Y3Vyc29yOnBvaW50ZXI7J1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgb2s6ICdsaW5lLWhlaWdodDo0MHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MCAxMHB4O2N1cnNvcjpwb2ludGVyOydcclxuICAgICAgICB9IF1cclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIOS7v0lPU+S4u+mimFxyXG4gICAgICovXHJcbiAgICBpb3NUaGVtZToge1xyXG4gICAgICAgIG1hc2s6ICdiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjUpO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDtyaWdodDowO2JvdHRvbTowOycsXHJcbiAgICAgICAgYm94OiBcImJhY2tncm91bmQ6ICNmZmZmZmY7cG9zaXRpb246IGFic29sdXRlO2xlZnQ6IDUwJTt0b3A6IDUwJTt6LWluZGV4OiAxMDAwO2NvbG9yOiAjODA4MDgwO21hcmdpbi10b3A6IC0yNSU7IG1hcmdpbi1sZWZ0OiAtNDAlO3BhZGRpbmctdG9wOjIwcHg7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjgwJTtib3JkZXItcmFkaXVzOjEycHg7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoLjAxKTt0cmFuc2Zvcm06c2NhbGUoLjAxKTtcIixcclxuICAgICAgICBoZWFkZXI6ICdoZWlnaHQ6MzBweDtjb2xvcjojMDAwMDAwO2ZvbnQtc2l6ZToxNnB4O2xpbmUtaGVpZ2h0OjMwcHg7dGV4dC1hbGlnbjpjZW50ZXI7JyxcclxuICAgICAgICBib2R5OiAnd2lkdGg6MTAwJTtoZWlnaHQ6NTJweDtwYWRkaW5nLXRvcDoxMHB4O2JveC1zaXppbmc6Ym9yZGVyLWJveDtsaW5lLWhlaWdodDoyMHB4O2NvbG9yOiMyMzIzMjM7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjEzcHg7cGFkZGluZzo1cHggMjVweDsnLFxyXG4gICAgICAgIGZvb3RlcjogJ2hlaWdodDo0NXB4O292ZXJmbG93OmhpZGRlbjtjb2xvcjojMDI3NWY2O3RleHQtYWxpZ246Y2VudGVyO2JvcmRlci10b3A6MXB4IHNvbGlkICNlMmUyZTI7Ym94LXNoYWRvdzowIDFweCAxcHggcmdiYSgwLDAsMCwuMDIpIGluc2V0OycsXHJcbiAgICAgICAgYnV0dG9uczogWyB7XHJcbiAgICAgICAgICAgIGNhbmNlbDogJ2xpbmUtaGVpZ2h0OjQ1cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y3Vyc29yOnBvaW50ZXI7d2lkdGg6NTAlO2JvcmRlci1yaWdodDoxcHggc29saWQgI2UyZTJlMjtib3gtc2l6aW5nOmJvcmRlci1ib3g7J1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgb2s6ICdsaW5lLWhlaWdodDo0NXB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2N1cnNvcjpwb2ludGVyO3dpZHRoOjUwJTsnXHJcbiAgICAgICAgfSBdXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5L+d5a2Y5b2T5YmN5omA55So55qE5Li76aKYXHJcbiAgICBjdXJyZW50VGhlbWU6IHt9LFxyXG5cclxuICAgIC8v5L+d5a2Y5byA5aeL57uT5p2f5Yqo55S755qE5qC35byP6KGoIOacgOe7iOS8muaPkuWFpeWktOmDqFxyXG4gICAgYW5pbWF0aW9uU3R5bGU6ICcuZGlhbG9nLXdhcnAuZmFkZSAuZGlhbG9nLW1haW4tYm94ey13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpIWltcG9ydGFudDt0cmFuc2Zvcm06c2NhbGUoMSkhaW1wb3J0YW50Oy13ZWJraXQtdHJhbnNpdGlvbjphbGwgMC4zcyAwczt0cmFuc2l0aW9uOmFsbCAwLjNzIDBzO30nLFxyXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBFVkVOVF9TVEFURSB9IGZyb20gJy4vc3RhdGUvaW5kZXguanMnO1xyXG5pbXBvcnQgeyBhcHBlbmQsIGFkZFRoZW1lLCBjcmVhdGVFbGVtZW50ICB9IGZyb20gXCIuL3NoYXJlL3V0aWwuanNcIjtcclxuaW1wb3J0IHRoZW1lIGZyb20gXCIuL2NvcmUvdGhlbWVcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBwcm9wcywgaXNFeHRlbmQgKSB7XHJcbiAgICAgICAgIWlzRXh0ZW5kICYmIHRoaXMuaW5pdCggcHJvcHMgKTtcclxuICAgIH1cclxuICAgIGluaXQoIHByb3BzICkge1xyXG4gICAgICAgIC8v5aaC5p6c55So5oi35LiN5Lyg5YWl5Lu75L2V5Y+C5pWwXHJcbiAgICAgICAgaWYoIXByb3BzKSBwcm9wcyA9IHt9IDtcclxuICAgICAgICAvL+WmguaenOeUqOaIt+S8oOWFpeS6huiHquWumuS5ieS4u+mimOWImeW8gOWQr+iHquWumuS5ieS4u+mimOaooeW8j+WQpuWImeS9v+eUqOm7mOiupOS4u+mimFxyXG4gICAgICAgIGlmICggcHJvcHMuY3VzdG9tVGhlbWUgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgRVZFTlRfU1RBVEUuY3VzdG9tVGhlbWUgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBfdGhlbWUgPSBwcm9wcy50aGVtZSB8fCBFVkVOVF9TVEFURS50aGVtZTtcclxuICAgICAgICAgICAgaWYgKCBfdGhlbWUgPT0gMSB8fCBfdGhlbWUgPT09ICdyZWZyZXNoaW5nJyApIHtcclxuICAgICAgICAgICAgICAgIF90aGVtZSA9ICdyZWZyZXNoaW5nJ1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBfdGhlbWUgPT0gMiB8fCBfdGhlbWUgPT09ICdpb3NUaGVtZScgKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhlbWUgPSAnaW9zVGhlbWUnXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oICfns7vnu5/ph4zmsqHmnInkvaDpgInmi6nnmoTkuLvpopjvvIzpu5jorqTkvb/nlKjigJxyZWZyZXNoaW5n4oCd5Li76aKYJyApO1xyXG4gICAgICAgICAgICAgICAgX3RoZW1lID0gJ3JlZnJlc2hpbmcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEVWRU5UX1NUQVRFLnRoZW1lID0gX3RoZW1lO1xyXG4gICAgICAgICAgICBwcm9wcy5jdXN0b21UaGVtZSA9IHRoZW1lWyBFVkVOVF9TVEFURS50aGVtZSBdO1xyXG4gICAgICAgICAgICBwcm9wcy5jdXN0b21UaGVtZS53YXJwID0gdGhlbWUud2FycDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5piv5ZCm5byA5ZCv54K55Ye76IOM5pmv5YWz6ZetXHJcbiAgICAgICAgaWYgKCBwcm9wcy5jbGlja01hc2tDbG9zZVdpbmRvdyAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBFVkVOVF9TVEFURS5jbGlja01hc2tDbG9zZVdpbmRvdyA9IHByb3BzLmNsaWNrTWFza0Nsb3NlV2luZG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+aYr+WQpuW8gOWQr+WKqOeUu1xyXG4gICAgICAgIGlmICggcHJvcHMuaXNPcGVuQW5pbWF0aW9uICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgIEVWRU5UX1NUQVRFLmlzT3BlbkFuaW1hdGlvbiA9IHByb3BzLmlzT3BlbkFuaW1hdGlvbjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+iuvue9ruW9k+WJjeS4u+mimFxyXG4gICAgICAgIHRoZW1lLmN1cnJlbnRUaGVtZSA9IE9iamVjdC5hc3NpZ24oIHRoZW1lLmN1cnJlbnRUaGVtZSwgcHJvcHMgKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rmjInpkq5cclxuICAgICAqIEBwYXJhbSBwcm9wcyAg55So5oi35Lyg5YWl55qE5omA5pyJ5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0gZWwgICAgIOW9k+WJjeW3sue7j+WIm+W7uuWlveeahGRvbeagkVxyXG4gICAgICogQHJldHVybiAgICAgICDov5Tlm57kuIDkuKrlvZPliY3mjInpkq7nu4TmiJDnmoTmlbDnu4RcclxuICAgICAqL1xyXG4gICAgY3JlYXRlQnV0KCBwcm9wcywgZWwgKSB7XHJcbiAgICAgICAgbGV0IG1lID0gdGhpcztcclxuICAgICAgICBsZXQgYnV0cyA9IFtdO1xyXG4gICAgICAgIGxldCBfcEJ1dHRvbnMgPSBwcm9wcy5idXR0b25zO1xyXG4gICAgICAgIGxldCBfcEN1c3RvbSA9IHByb3BzLmN1c3RvbVRoZW1lLmJ1dHRvbnM7XHJcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgX3BDdXN0b20ubGVuZ3RoOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGZvciAoIGxldCBrZXkgaW4gX3BDdXN0b21bIGkgXSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggIXByb3BzLmJ1dHRvbnNbIGtleSBdICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRvbUJ0biA9IGVsLmJ1dHRvbnNbIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgLy/liJvlu7pcclxuICAgICAgICAgICAgICAgIGRvbUJ0biA9IGNyZWF0ZUVsZW1lbnQoICdkaXYnLCAnZGlhbG9nLWJ1dHRvbi0nICsga2V5ICk7XHJcbiAgICAgICAgICAgICAgICAvL+i1i+WAvFxyXG4gICAgICAgICAgICAgICAgbGV0IHRleHQ7XHJcbiAgICAgICAgICAgICAgICAvL+WFvOWuueaWh+acrFxyXG4gICAgICAgICAgICAgICAgaWYgKCBfcEJ1dHRvbnNbIGtleSBdLnRleHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IF9wQnV0dG9uc1sga2V5IF0udGV4dDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBrZXkgPT09ICdvaycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAn56Gu5a6aJztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBrZXkgPT09ICdjYW5jZWwnICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJ+WPlua2iCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9tQnRuLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICBkb21CdG4uc3R5bGUuY3NzVGV4dCA9IF9wQ3VzdG9tWyBpIF1bIGtleSBdO1xyXG4gICAgICAgICAgICAgICAgZG9tQnRuLmtleSA9IGtleTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIEVWRU5UX1NUQVRFLmhpZGVDbG9zZUJ0biAmJiBrZXkgPT09ICdjYW5jZWwnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy/nu5Hlrprngrnlh7vkuovku7ZcclxuICAgICAgICAgICAgICAgIGRvbUJ0bi5vbmNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIF9wQnV0dG9uc1sga2V5IF0gPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gX3BCdXR0b25zWyBrZXkgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gX3BCdXR0b25zWyBrZXkgXS5jYWxsYmFjaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0Nsb3NlID0gY2FsbGJhY2sgJiYgY2FsbGJhY2soIGVsLndhcnAgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGtleSA9PT0gJ2NhbmNlbCcgfHwgaXNDbG9zZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWUucmVtb3ZlKCBlbC53YXJwICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJ1dHMucHVzaCggZG9tQnRuICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ1dHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKuWIm+W7uuaJgOacieeahGRvbeWFg+e0oFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVEb21UcmVlKCBwcm9wcyApIHtcclxuICAgICAgICBsZXQgZWwgPSB7XHJcbiAgICAgICAgICAgIHdhcnA6IGNyZWF0ZUVsZW1lbnQoICdkaXYnLCAnZGlhbG9nLXdhcnAnICksXHJcbiAgICAgICAgICAgIG1hc2s6IGNyZWF0ZUVsZW1lbnQoICdkaXYnLCAnZGlhbG9nLW1hc2snICksXHJcbiAgICAgICAgICAgIGJveDogY3JlYXRlRWxlbWVudCggJ2RpdicsICdkaWFsb2ctbWFpbi1ib3gnICksXHJcbiAgICAgICAgICAgIGhlYWRlcjogY3JlYXRlRWxlbWVudCggJ2RpdicsICdkaWFsb2ctaGVhZGVyJyApLFxyXG4gICAgICAgICAgICBib2R5OiBjcmVhdGVFbGVtZW50KCAnZGl2JywgJ2RpYWxvZy1ib2R5JyApLFxyXG4gICAgICAgICAgICBmb290ZXI6IGNyZWF0ZUVsZW1lbnQoICdkaXYnLCAnZGlhbG9nLWZvb3RlcicgKSxcclxuICAgICAgICAgICAgYnV0dG9uczoge30sXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggIXByb3BzLnRpdGxlICkge1xyXG4gICAgICAgICAgICBkZWxldGUgZWwuaGVhZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihFVkVOVF9TVEFURS5jbGlja01hc2tDbG9zZVdpbmRvdyl7XHJcbiAgICAgICAgICAgIGVsLm1hc2sub25jbGljayA9ICgpPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShlbC53YXJwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDliqjnlLvmoLflvI/liLDlpLTpg6hcclxuICAgICAqL1xyXG4gICAgYWRkQW5pbWF0aW9uU3R5bGUoKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gY3JlYXRlRWxlbWVudCggJ3N0eWxlJyApO1xyXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnIDtcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSB0aGVtZS5hbmltYXRpb25TdHlsZSA7XHJcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuLLmn5PlubbmmL7npLrlvLnnqpfnlYzpnaJcclxuICAgICAqIEBwYXJhbSBwcm9wcyAg55So5oi35Lyg5YWl55qE5omA5pyJ5Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIHJlbmRlciggcHJvcHMgKSB7XHJcblxyXG4gICAgICAgIGxldCBlbCA9IHRoaXMuY3JlYXRlRG9tVHJlZSggcHJvcHMgKTtcclxuXHJcbiAgICAgICAgLy/liJvlu7rmjInpkq5cclxuICAgICAgICBpZiAoIHByb3BzLmJ1dHRvbnMgKSB7XHJcbiAgICAgICAgICAgIGxldCBidXRzID0gdGhpcy5jcmVhdGVCdXQoIHByb3BzLCBlbCApO1xyXG4gICAgICAgICAgICBhcHBlbmQoIGVsLmZvb3RlciwgYnV0cyApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJveCA9IFsgZWwuYm9keSwgZWwuZm9vdGVyIF07XHJcblxyXG4gICAgICAgIC8v5b2T5aS06YOo5LiN5a2Y5Zyo55qE5pe25YCZ5b+955Wl5aS06YOo5L+h5oGvXHJcbiAgICAgICAgaWYgKCBlbC5oZWFkZXIgKSB7XHJcbiAgICAgICAgICAgIGVsLmhlYWRlci5pbm5lckhUTUwgPSBwcm9wcy50aXRsZTtcclxuICAgICAgICAgICAgYm94LnVuc2hpZnQoIGVsLmhlYWRlciApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/mt7vliqDlhoXlrrlcclxuICAgICAgICBlbC5ib2R5LmlubmVySFRNTCA9IHByb3BzLmNvbnRlbnQ7XHJcbiAgICAgICAgYXBwZW5kKCBlbC5ib3gsIGJveCApXHJcbiAgICAgICAgYXBwZW5kKCBlbC53YXJwLCBbIGVsLm1hc2ssIGVsLmJveCBdIClcclxuICAgICAgICAvL+a3u+WKoOS4u+mimOagt+W8j1xyXG4gICAgICAgIGFkZFRoZW1lKCBlbCwgcHJvcHMgKTtcclxuXHJcbiAgICAgICAgLy/mt7vliqDliqjnlLtcclxuICAgICAgICBpZiAoIEVWRU5UX1NUQVRFLmlzT3BlbkFuaW1hdGlvbiApIHtcclxuICAgICAgICAgICAgLy/mt7vliqDliqjnlLvmoLflvI9cclxuICAgICAgICAgICAgdGhpcy5hZGRBbmltYXRpb25TdHlsZSgpO1xyXG5cclxuICAgICAgICAgICAgZWwud2FycC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbC53YXJwLmNsYXNzTmFtZSArPSAnIGZhZGUnO1xyXG4gICAgICAgICAgICB9LCAxMCApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy/lvZPmsqHmnInliqjnlLvml7bmiornvKnmlL7orr7nva7kuLrljp/lp4vlgLxcclxuICAgICAgICAgICAgZWwuYm94LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5riy5p+T5by556qXXHJcbiAgICAgICAgZWwud2FycC5zdHlsZS56SW5kZXggPSAnOTk5OSc7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZWwud2FycCApO1xyXG4gICAgICAgIGVsLndhcnAuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIoOmZpOW8ueeql+eVjOmdouagueiKgueCuVxyXG4gICAgICogQHBhcmFtIGVsZW1lbnQgICAg5qC56IqC54K5XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSggZWxlbWVudCApIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBlbGVtZW50ICk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCBCYXNlIGZyb20gXCIuLi9iYXNlLmpzXCI7XHJcbmltcG9ydCB7IGFwcGVuZCwgYWRkVGhlbWUsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vc2hhcmUvdXRpbC5qc1wiO1xyXG5pbXBvcnQgdGhlbWUgZnJvbSBcIi4uL2NvcmUvdGhlbWVcIjtcclxuaW1wb3J0IHsgRVZFTlRfU1RBVEUgfSBmcm9tICcuLi9zdGF0ZS9pbmRleC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b20gZXh0ZW5kcyBCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcclxuICAgICAgICBzdXBlciggcHJvcHMsIHRydWUgKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKCBwcm9wcyApO1xyXG4gICAgICAgIHRoaXMuaW5pdFByb3BzKCBwcm9wcyApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YXRlKCBwcm9wcyApIHtcclxuICAgICAgICAvL+aYr+WQpumakOiXj+WPlua2iOaMiemSrlxyXG4gICAgICAgIGlmICggcHJvcHMuaGlkZUNsb3NlQnRuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgRVZFTlRfU1RBVEUuaGlkZUNsb3NlQnRuID0gcHJvcHMuaGlkZUNsb3NlQnRuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0UHJvcHMoIHByb3BzICkge1xyXG4gICAgICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbiggcHJvcHMsIHRoZW1lLmN1cnJlbnRUaGVtZSApO1xyXG5cclxuICAgICAgICAvL+a4suafk2RvbVxyXG4gICAgICAgIHRoaXMucmVuZGVyKCBwcm9wcyAsIHRoaXMuZWwgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlIGZyb20gXCIuLi9iYXNlLmpzXCI7XHJcbmltcG9ydCB7IGFwcGVuZCwgYWRkVGhlbWUsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vc2hhcmUvdXRpbC5qc1wiO1xyXG5pbXBvcnQgdGhlbWUgZnJvbSBcIi4uL2NvcmUvdGhlbWVcIjtcclxuaW1wb3J0IHsgRVZFTlRfU1RBVEUgfSBmcm9tICcuLi9zdGF0ZS9pbmRleC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maXJtIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XHJcbiAgICAgICAgc3VwZXIoIHByb3BzLCB0cnVlICk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSggcHJvcHMgKTtcclxuICAgICAgICB0aGlzLmluaXRQcm9wcyggcHJvcHMgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGF0ZSggcHJvcHMgKSB7XHJcbiAgICAgICAgLy/mmK/lkKbpmpDol4/lj5bmtojmjInpkq5cclxuICAgICAgICBpZiAoIHByb3BzLmhpZGVDbG9zZUJ0biAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBFVkVOVF9TVEFURS5oaWRlQ2xvc2VCdG4gPSBwcm9wcy5oaWRlQ2xvc2VCdG47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFByb3BzKCBwcm9wcyApIHtcclxuICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHByb3BzLCB0aGVtZS5jdXJyZW50VGhlbWUgKTtcclxuICAgICAgICBwcm9wcy5idXR0b25zID0ge1xyXG4gICAgICAgICAgICBvazogcHJvcHMuYnV0dG9ucy5vayxcclxuICAgICAgICAgICAgY2FuY2VsOiBwcm9wcy5idXR0b25zLmNhbmNlbCxcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/muLLmn5Nkb21cclxuICAgICAgICB0aGlzLnJlbmRlciggcHJvcHMgICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZSBmcm9tIFwiLi4vYmFzZS5qc1wiO1xyXG5pbXBvcnQgeyBhcHBlbmQsIGFkZFRoZW1lLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL3NoYXJlL3V0aWwuanNcIjtcclxuaW1wb3J0IHRoZW1lIGZyb20gXCIuLi9jb3JlL3RoZW1lXCI7XHJcbmltcG9ydCB7IEVWRU5UX1NUQVRFIH0gZnJvbSAnLi4vc3RhdGUvaW5kZXguanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWxlcnQgZXh0ZW5kcyBCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBwcm9wcyApIHtcclxuICAgICAgICBzdXBlciggcHJvcHMsIHRydWUgKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKCBwcm9wcyApO1xyXG4gICAgICAgIHRoaXMuaW5pdFByb3BzKCBwcm9wcyApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YXRlKCBwcm9wcyApIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFByb3BzKCBwcm9wcyApIHtcclxuICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHByb3BzLCB0aGVtZS5jdXJyZW50VGhlbWUgKTtcclxuICAgICAgICBwcm9wcy5idXR0b25zID0ge1xyXG4gICAgICAgICAgICBvazogcHJvcHMub2sgfHwgcHJvcHMuYnV0dG9ucy5vayxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCBwcm9wcyApO1xyXG4gICAgfVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmltcG9ydCBDdXN0b20gZnJvbSBcIi4vY29yZS9jdXN0b20uanNcIjtcclxuaW1wb3J0IENvbmZpcm0gZnJvbSBcIi4vY29yZS9jb25maXJtLmpzXCI7XHJcbmltcG9ydCBBbGVydCBmcm9tIFwiLi9jb3JlL2FsZXJ0LmpzXCI7XHJcbmltcG9ydCBCYXNlIGZyb20gXCIuL2Jhc2UuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyB7XHJcbiAgICBjb25zdHJ1Y3RvciggcHJvcHMgKSB7XHJcbiAgICAgICAgbmV3IEJhc2UoIHByb3BzICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tcyggcHJvcHMgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDdXN0b20oIHByb3BzICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlybSggcHJvcHMgKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb25maXJtKCBwcm9wcyApO1xyXG4gICAgfVxyXG5cclxuICAgIGFsZXJ0KCBwcm9wcyApIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFsZXJ0KCBwcm9wcyApIDtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiRVZFTlRfU1RBVEUiLCJhcHBlbmQiLCJzb3VyVGFyZ2V0IiwidGFyZ2V0QXJyIiwiaSIsImxlbmd0aCIsImFwcGVuZENoaWxkIiwiYWRkVGhlbWUiLCJlbCIsInByb3BzIiwiY3VzdG9tIiwiY3VzdG9tVGhlbWUiLCJfcHJvcHMiLCJrZXkiLCJzX2tleSIsInN0eWxlIiwiY3NzVGV4dCIsImNyZWF0ZUVsZW1lbnQiLCJuYW1lIiwiY2xhc3NOYW1lIiwiZG9tIiwiZG9jdW1lbnQiLCJCYXNlIiwiaXNFeHRlbmQiLCJpbml0IiwidW5kZWZpbmVkIiwiX3RoZW1lIiwidGhlbWUiLCJ3YXJuIiwid2FycCIsImNsaWNrTWFza0Nsb3NlV2luZG93IiwiaXNPcGVuQW5pbWF0aW9uIiwiY3VycmVudFRoZW1lIiwiT2JqZWN0IiwiYXNzaWduIiwibWUiLCJidXRzIiwiX3BCdXR0b25zIiwiYnV0dG9ucyIsIl9wQ3VzdG9tIiwiZG9tQnRuIiwidGV4dCIsImlubmVySFRNTCIsImhpZGVDbG9zZUJ0biIsImRpc3BsYXkiLCJvbmNsaWNrIiwiY2FsbGJhY2siLCJpc0Nsb3NlIiwicmVtb3ZlIiwicHVzaCIsInRpdGxlIiwiaGVhZGVyIiwibWFzayIsInR5cGUiLCJhbmltYXRpb25TdHlsZSIsImhlYWQiLCJjcmVhdGVEb21UcmVlIiwiY3JlYXRlQnV0IiwiZm9vdGVyIiwiYm94IiwiYm9keSIsInVuc2hpZnQiLCJjb250ZW50IiwiYWRkQW5pbWF0aW9uU3R5bGUiLCJvcGFjaXR5Iiwid2Via2l0VHJhbnNmb3JtIiwiekluZGV4IiwiZWxlbWVudCIsInJlbW92ZUNoaWxkIiwiQ3VzdG9tIiwic2V0U3RhdGUiLCJpbml0UHJvcHMiLCJyZW5kZXIiLCJDb25maXJtIiwib2siLCJjYW5jZWwiLCJBbGVydCIsIkRpYWxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTU8sSUFBSUEsY0FBYzs7Ozs7O3dCQU1DLEtBTkQ7Ozs7Ozs7O1NBY2QsWUFkYzs7Ozs7OztlQXFCUCxLQXJCTzs7Ozs7OzttQkE0QkgsS0E1Qkc7Ozs7Ozs7Z0JBbUNOO0NBbkNaOztBQ0hQOzs7OztBQUtBLEFBQU8sU0FBU0MsTUFBVCxDQUFpQkMsVUFBakIsRUFBNkJDLFNBQTdCLEVBQXlDO1NBQ3RDLElBQUlDLElBQUksQ0FBZCxFQUFpQkEsSUFBSUQsVUFBVUUsTUFBL0IsRUFBdUNELEdBQXZDLEVBQTZDO21CQUM5QkUsV0FBWCxDQUF3QkgsVUFBV0MsQ0FBWCxDQUF4Qjs7Ozs7Ozs7O0FBU1IsQUFBTyxTQUFTRyxRQUFULENBQW1CQyxFQUFuQixFQUF1QkMsS0FBdkIsRUFBK0I7UUFDOUJDLFNBQVMsUUFBUVYsWUFBWVcsV0FBakM7UUFDSUMsU0FBU0gsTUFBTUUsV0FBbkI7UUFDS0QsTUFBTCxFQUFjO2FBQ0osSUFBSUcsR0FBVixJQUFpQkwsRUFBakIsRUFBc0I7Z0JBQ2JLLFFBQVEsU0FBYixFQUF5QjtxQkFDZixJQUFJQyxLQUFWLElBQW1CTixHQUFJSyxHQUFKLENBQW5CLEVBQStCO3VCQUN2QkEsR0FBSixFQUFXQyxLQUFYLEVBQW1CQyxLQUFuQixDQUF5QkMsT0FBekIsR0FBbUNKLE9BQVFDLEdBQVIsRUFBZUMsS0FBZixDQUFuQzs7OztlQUlKRCxHQUFKLEVBQVVFLEtBQVYsQ0FBZ0JD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
