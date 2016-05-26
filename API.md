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
         
