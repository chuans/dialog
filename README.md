# dialog对话框 #
### 多功能弹出对话框小插件
* * *
* * *

#### 方法说明
*   customs (自定义对话框)
*   confirm (弹出确定取消框)
*   alert   (弹出确认框)
<br>

***
***

### 代码示例参数说明

#####  初始化方法
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




