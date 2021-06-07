# zero_step_webgl

# WebGL编程指南


## 附录部分

### WebGL中无交换缓冲区
* 传统opengl程序
使用了两个颜色缓冲区：”前台“和”后台“。  
前台对应屏幕，后台是程序实际渲染的目标，一帧后会切换两者。  
常用函数：  
glutSwapBuffers()  
eglSwapBuffers()  

* webgl
由于运行在浏览器中，作者原文说浏览器会自动侦测到绘制操作并在屏幕上显示。  

#### 我的理解：  
* 刷新函数的不同，才是导致两者的实现差异。  
  传统opengl运行在window、mac、android下，都有一个主循环，类似：  
```  
    while (true) {
        EventDispatch();  //鼠标 键盘事件派发
        MainLoop();  //主业务
        Draw();  //渲染
        SwapBuffer();
    }
```  
   在一帧内可以无限循环 一般通过事件控制每次循环的节奏  
   比如：win下会将事件处理完  

* 而浏览器的驱动方式大不相同：  
  通过时间间隔回调的方式  每秒60帧  
  所以浏览器中没有必要使用两个颜色缓冲区  每次回调时刷新一次即可  
  还是有疑问？  
    什么时候刷新 调用前/后  怎么判断这个函数的调用就是用来刷新帧缓冲的？  
    作者原文：  
      js执行结束后 浏览器会对颜色缓冲区检查 若被修改过则同步到屏幕上  
      还有一种是浏览器事件触发导致的调用 也会在函数执行完后 交回给浏览器  
    理解扩展：  
      第一次加载完 所有js执行一遍后 会检查一次
      后面通过frame驱动的调用 每次执行完 也会检查一次
      事件驱动的部分 会不会打乱渲染节奏？  
      应该不会 因为浏览器是单线程的 前一次的函数执行完才会触发事件函数  
      
    新疑问：  
      若有多个frame驱动函数  每个都会检查？？  一般游戏的主循环只会有一个!!  
  ```  
    requestAnimationFrame(step);

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                    window.setTimeout(callback, 1000/60);
                };
        })();
    }
  ```  

注意：  
  alert() confirm() 函数会将控制权中途交给浏览器 导致提前刷新出缓冲区的内容  
  所以要小心这类函数  























