# zero_step_webgl

# WebGL���ָ��


## ��¼����

### WebGL���޽���������
* ��ͳopengl����
ʹ����������ɫ����������ǰ̨���͡���̨����  
ǰ̨��Ӧ��Ļ����̨�ǳ���ʵ����Ⱦ��Ŀ�꣬һ֡����л����ߡ�  
���ú�����  
glutSwapBuffers()  
eglSwapBuffers()  

* webgl
����������������У�����ԭ��˵��������Զ���⵽���Ʋ���������Ļ����ʾ��  

#### �ҵ���⣺  
* ˢ�º����Ĳ�ͬ�����ǵ������ߵ�ʵ�ֲ��졣  
  ��ͳopengl������window��mac��android�£�����һ����ѭ�������ƣ�  
```  
    while (true) {
        EventDispatch();  //��� �����¼��ɷ�
        MainLoop();  //��ҵ��
        Draw();  //��Ⱦ
        SwapBuffer();
    }
```  
   ��һ֡�ڿ�������ѭ�� һ��ͨ���¼�����ÿ��ѭ���Ľ���  
   ���磺win�»Ὣ�¼�������  

* ���������������ʽ����ͬ��  
  ͨ��ʱ�����ص��ķ�ʽ  ÿ��60֡  
  �����������û�б�Ҫʹ��������ɫ������  ÿ�λص�ʱˢ��һ�μ���  
  ���������ʣ�  
    ʲôʱ��ˢ�� ����ǰ/��  ��ô�ж���������ĵ��þ�������ˢ��֡����ģ�  
    ����ԭ�ģ�  
      jsִ�н����� ����������ɫ��������� �����޸Ĺ���ͬ������Ļ��  
      ����һ����������¼��������µĵ��� Ҳ���ں���ִ����� ���ظ������  
    �����չ��  
      ��һ�μ����� ����jsִ��һ��� ����һ��
      ����ͨ��frame�����ĵ��� ÿ��ִ���� Ҳ����һ��
      �¼������Ĳ��� �᲻�������Ⱦ���ࣿ  
      Ӧ�ò��� ��Ϊ������ǵ��̵߳� ǰһ�εĺ���ִ����Żᴥ���¼�����  
      
    �����ʣ�  
      ���ж��frame��������  ÿ�������飿��  һ����Ϸ����ѭ��ֻ����һ��!!  
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

ע�⣺  
  alert() confirm() �����Ὣ����Ȩ��;��������� ������ǰˢ�³�������������  
  ����ҪС�����ຯ��  























