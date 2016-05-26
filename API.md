# 问我API

获取所有信息:
ask/allask `[get]` 
`page`  `N`  `信息页数`
`size`  `N`   `每页显示数量`
`staus` `N`  `信息状态   默认:已上架信息     *staus == 1   上架
                                   * staus == 2   审批中
                                   * staus == 5   审批未通过
                                   * staus == 3   未上架
                                   * staus == 4   所有
                                   * staus == 6   删除`
`type` `N`   `信息一级标签`

获取隐藏信息:
ask/askhide `[get]`
`ask_id` `Y`  `id`
`username` `Y` 

获取信息详情:
ask/askdetail  `[get]`
               `ask_id` `Y`  `id`
               `username` `Y` 

获取信息(有隐藏): 
ask/getask    `[get]`
              `ask_id` `Y`  `id`
             
admin获取信息:
ask/askadmin  `[get]`
            `ask_id` `Y`  `id`
            
编辑信息:
ask/askedit    `[post]`
        `ask_id`   `Y`
        `username`  `Y`
        `type`     `N`   `一级标签`
        `price`     `N`  `信息价格`
        `geo_x`     `N`   `坐标x`
        `geo_y`     `N`   `坐标y`
        `position`   `N`    `地理位置`
        `reason`     `N`   `推荐理由`    
        `content_show`    `N`    `显式信息`
        `content_hide`    `N`    `隐式信息`
        `tag`       `N`   `二级标签`
        `remark`     `N`    `备注`
        
踩赞:
ask/like  `[get]`
`ask_id`   `Y`
`username`  `Y`
`type`    `Y`   `type == 1  赞    ==2踩`

         
查看是否踩赞:
ask/islike   `[get]`
`ask_id`   `Y`
`username`  `Y`

获取踩赞信息:
ask/getlike  `[get]`
`ask_id`   `Y`
获取我的信息:
ask/myask   `[get]`
`page`  `N`  `信息页数`
`size`  `N`   `每页显示数量`
`staus` `N`  `信息状态   默认:已上架信息     *staus == 1   上架
                                   * staus == 2   审批中
                                   * staus == 5   审批未通过
                                   * staus == 3   未上架
                                   * staus == 4   所有
                                   * staus == 6   删除`
删除信息:
ask/del   `[get]`
`ask_id`   `Y`
`username`  `Y`
上架信息:
ask/up    `[]`

