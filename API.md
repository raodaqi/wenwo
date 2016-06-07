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
ask/up    `[get]`
`ask_id`   `Y`
`username`  `Y`

下架信息:   
ask/cancel `[get]`
`ask_id`   `Y`
`username`  `Y`

审批信息:
ask/approval  `[post]`
`ask_id`   `Y`
`staus`    `Y`    `staus==1 审批通过, staus==5 审批未通过`
`reason`   `未通过理由`

发布信息:
ask/sendask `[post]`
`ask_id`   `Y`
        `username`  `Y`
        `type`     `Y`   `一级标签`
        `price`     `Y`  `信息价格`
        `geo_x`     `Y`   `坐标x`
        `geo_y`     `Y`   `坐标y`
        `position`   `Y`    `地理位置`
        `reason`     `Y`   `推荐理由`    
        `content_show`    `Y`    `显式信息`
        `content_hide`    `N`    `隐式信息`
        `tag`       `Y`   `二级标签`
        `remark`     `N`    `备注`
        
获取二级标签图片url:
ask/tagshow   `[get]`
`type`   `Y`   `一级标签`
`tag`     `Y`     `tagStr`

获取推荐二级标签:
ask/gettag    `[get]`
`type`  `Y`    `一级标签`
`size`  `N`   `个数`

获取购买信息:
ask/getnuy   `[get]`
`ask_id`    `Y`

获取退款信息:
ask/getrefund   `[get]`
`ask_id`    `Y`

添加二级标签:
ask/addtag   `[post]`
`type`   `Y`  `一级标签`
`tag_name`   `Y`
`url`    `Y`

微信授权:
authorization/wx  

微信支付:
authorization/pay `[get]`
`totalFee`  `Y`  `金钱  单位:分`

提现:
authorization/withdraw   `[get]`
`username`    `Y`
`amount`    `Y`    `金钱  单位:分   大于100`

获取购买/收藏信息:
hode/haved    `[post]`
`username`   `Y`     
`staus`    `N`   `* staus = 1   购买
                   * staus = 2   收藏
                   * staus = 3   所有`
                   
购买/收藏:
hode/get   `[post]`
`username`   `Y`  
`ask_id`      `Y`

删除购买:
hode/del    `[post]`
`username`   `Y`  
`ask_id`      `Y`

退款:
hode/refund   `[post]`
`username`   `Y`  
`ask_id`      `Y`
`refundInfo`  `Y`  `退款理由`

获取意见:
manage/getviews  `[get]`

管理员注册:
manage/regist   `[post]`
`name`      `Y`   
`password`   `Y`

管理员登录:
manage/login   `[post]`
`name`      `Y`   
`password`   `Y`

获取用户信息:
user/getuserinfo   `[get]`
`username`   `Y`

发表意见:
user/suggestion  `[post]`
`view`    `Y`    `意见`
`contact`    `Y`   `联系方式`

获取钱包信息:
wallet/mywallet    `[get]`
`username`   `Y`  

编辑二级标签
ask/edittag `[post]`
`type`  `Y`
`level`     `Y`
`tag_name`  `Y`
`url`   `Y`

后台下架
ask/admincancle `[post]`
`ask_id`
`username`  `必须为wenwo`
`cancle_reason`   `下架理由`

后台编辑信息
ask/adminedit  `[post]`
`ask_id`   `Y`
        `username`  `Y`   `只能为wenwo`
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
