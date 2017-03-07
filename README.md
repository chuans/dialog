# dialog对话框 #
### 多功能弹出对话框小插件
* * *
* * *

#### 方法一览
*   customs (自定义对话框)
*   confirm (弹出确定取消框)
*   alert   (弹出确认框)
<br>

***

## 代码示例参数说明

###  初始实例化方法 new Modal();

```javascript
//引入文件
import Modal from 'dialog' ;
//调用初始化方法
let dialog = new Modal( {
    theme : '1',
    clickMaskCloseWindow: true,
    isOpenAnimation: false,
    customTheme : {
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
    }
} );
```
#### 实例化参数配置说明

| 属性名  | 参数说明 | 值类型 |  是否必须 | 默认值 |
| ---------- | -----------| ---------- | ----------- | -----------|
| theme   | 可选的主题类型,具体设置详见下表 | String & Number   | 否 | refreshing |
| clickMaskCloseWindow | 点击背景区域是否可以关闭对话框 | Boolean  | 否  | false |
| isOpenAnimation   | 是否开启对话框出现时的动画 | Boolean  | 否   | false |
| customTheme   | 自定义主题的样式(如果设置了自定义主题，则会忽略主题类型的设置),具体设置详见下表 | Object  | 否   | null |

***

>##### theme  可选主题类型：refreshing  1（清爽主题）& iosTheme || 2（仿ios主题）
>| 参数值  | 说明 |
>| ---------- | -----------|
>| refreshing  或者 1   |  使用清爽主题  |
>| iosTheme  或者 2   |  使用仿IOS主题  |

***

>##### customTheme  自定义主题的样式
>| 参数值  | 说明 | 值类型 |
>| ---------- | -----------| -----------|
>| mask | 遮罩层的样式 | String |
>| box | 主体内容区域样式 | String |
>| header | 标题部分样式 | String |
>| body | 具体内容区样式 | String |
>| footer | 页脚区域样式 | String |
>| buttons | 页脚里面按钮的样式(具体参数详见下表) | Array |

>>##### buttons  自定义按钮的样式(可以有多个按钮)，每个按钮为一个对象 <br>，每个对象的顺序会影响最终渲染时的排列,每个属性名需对应调用时设置buttons属性的值的key一致

确定按钮对象参数值见下表
>>| 参数值  | 说明 |
>>| ---------- | -----------|
>>| cancel   | 确定按钮样式（默认确定按钮key为cancel）  |

取消按钮对象参数值见下表
>>| 参数值  | 说明 |
>>| ---------- | -----------|
>>| ok   | 确定按钮样式（默认确定按钮key为ok）  |

自定义按钮对象参数值见下表
>>| 参数值  | 说明 |
>>| ---------- | -----------|
>>| xxx  | 确定按钮样式（默认确定按钮key为xxx）  |


***





