<!-- 浏览人数添加接口：

```
URL      /ask/addLook
TYPE     POST
method   ask_id
return   {
            code : 200,
            data : data,
            message : 'success'
        }

```

信息吐槽接口：

```
URL      /ask/debase
TYPE     POST
method   ask_id
return   {
            code : 200,
            data : data,
            message : 'success'
        }

``` -->

<!-- 关联应用：

```
avoscloud add <origin> <appId>
```

这里的 appId 填上你在 LeanCloud 上创建的某一应用的 appId 即可。origin 则有点像 Git 里的 remote 名称。

启动项目：

```
avoscloud
```

应用即可启动运行：[localhost:3000](http://localhost:3000)

## 部署到 LeanEngine


部署到测试环境：
```
avoscloud deploy
```

部署到生产环境：
```
avoscloud publish
```

## 相关文档

* [LeanEngine 指南](https://leancloud.cn/docs/leanengine_guide-node.html)
* [JavaScript 指南](https://leancloud.cn/docs/js_guide.html)
* [JavaScript SDK API](https://leancloud.cn/api-docs/javascript/index.html)
* [命令行工具详解](https://leancloud.cn/docs/cloud_code_commandline.html)
* [LeanEngine FAQ](https://leancloud.cn/docs/cloud_code_faq.html) -->
