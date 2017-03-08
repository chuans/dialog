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
>| buttons | 页脚里面按钮的样式(具体参数详见下表 -->buttons<-- ) | Array |

##### -->buttons<-- customTheme.buttons  自定义按钮的样式(可以有多个按钮)，每个按钮为一个对象 ，每个对象的顺序会影响最终渲染时的排列,每个属性名需对应调用时设置buttons属性的值的key一致

确定按钮对象参数值见下表
>>| 参数值  | 说明 | 值类型 |
>>| ---------- | -----------| -----------|
>>| cancel   | 确定按钮样式（默认确定按钮key为cancel）  | String |

取消按钮对象参数值见下表
>>| 参数值  | 说明 |
>>| ---------- | -----------|
>>| ok   | 确定按钮样式（默认确定按钮key为ok）  |

自定义按钮对象参数值见下表
>>| 参数值  | 说明 |
>>| ---------- | -----------|
>>| xxx  | 确定按钮样式（默认确定按钮key为xxx）  |


***


###  自定义对话框调用说明

```javascript
//弹出自定义对话框
dialog.customs( {
    title: '标题',
    content: '你确定这样做吗？',
    hideCloseBtn: false,
    buttons: {
        ok: {
            text: '确定',
            callback: ( el ) => {
                console.log( '确定' );
                return true;
            },
        },
        xxx: {
            text: '查看文章',
            callback: () => {
                console.log( '文章' );
                return true;
            },
        },
        cancel: {
            text: '取消',
        }
    }
} )
//弹出确认取消框
dialog.confirm( {
    title: '请告诉我',
    content: '你是逗比吗？',
    buttons: {
        ok: {
            text : '是' ,
            callback: ( el ) => {
                console.log( '是' );
                return true;
            },
        },
        cancel: {
            text : '不是' ,
        }
    }
} )

//弹出确认框
dialog.alert( {
    content: '你确定这样做吗？',
    buttons: {
        ok(){
            return true;
        },
    }
} )
```

#### 自定义对话框参数配置说明(所有对话框基本属性值一样)

| 属性名  | 参数说明 | 值类型 |  是否必须 | 默认值 |
| ---------- | -----------| ---------- | ----------- | -----------|
| title   | 显示在头部的标题（不提供该参数将不会显示头部HTML元素） | String | 否 | null |
| content   | 显示在内容区的正文 | String | 是 | null |
| hideCloseBtn   | 是否隐藏取消按钮 | Boolean | 否 | false |
| buttons   | 按钮事件配置(详细配置见下表 -->buttons<--) | Object | 是 | null |

***

##### -->buttons<-- buttons  按钮对象参数(key,value)配置
>| 属性  | 说明 | 值类型 |
>| ---------- | -----------| -----------|
>| ok  |  确定按钮属性(具体值详见下表，所有属性共有该值，当值为一个方法的时候直接设置为点击该按钮的回调方法,默认文本为‘确定’)  | Object & Function |
>| xxx  |  自定义按钮属性  | Object |
>| cancel  |  取消按钮属性(当值为一个方法的时候直接设置为点击该按钮的回调方法,默认文本为‘取消’)  | Object  & Function  |


##### buttons['ok']  按钮对象具体属性值(注意：确定按钮需return true 可关闭对话框，或者手动removeChild )
>>| 属性  | 说明 | 值类型 | 默认值 | 是否携带参数 |
>>| ---------- | -----------| -----------| -----------| -----------|
>>| text  |  按钮显示文本  | String | 确定  |
>>| callback  |  点击该按钮执行的方法  | Function | null | element（对话框的最外层的DOM节点） |


##### alert  弹出确认框应该只有一个确认按钮






