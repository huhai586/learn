/**
 * Created by huhai on 2016/4/7.
 */
//先检查屏蔽功能的开关
chrome.storage.sync.get("open",function(obj){
    //判断status
    var open=obj.open;
    if(!open){
        //如果处于关闭状态
       return
    }else{
        //打开状态
        doFilter()
    }
});

//chrome.storage.sync.set({blocked:['cccyer','拖鞋抽脸','飞鹰玩姑娘','e800','cocoss','希尔伯特大弟子']},function(){console.log("保存成功")});


//chrome.runtime.sendMessage("huhai");
//判断是什么类型的页面
function doFilter(){
    var blockUsers;
    chrome.storage.sync.get("blocked",function(obj){

        blockUsers=obj.blocked;
        if(blockUsers.length==0) return
        var href=window.location.href;
        var detail=/viewthread/.test(href);
        if(detail){
            //如果是帖子详情页面
            filterPost()
        }else{
            //如果是帖子列表页面
            filterDataList()

        }
    })



    function filterDataList(){
        $("table.datatable td.author a").each(function(){
            var username=$(this).html();
            //检查blockUsers里面是否有这个user
            var checkIfExists= filterName(username);
            if(checkIfExists){
                var parents=$(this).parents("tbody[id^='normalthread']");
                parents.remove()
            }

        })

    }
//------------------------------------------------
    function filterPost(){
        //遍历每一个a
        $("#postlist .postinfo a").each(function(){
            //
            var username=$(this).html();
            //检查blockUsers里面是否有这个user
            var checkIfExists= filterName(username);
            if(checkIfExists){
                var parents=$(this).parents("div[id^='post_']");
                parents.remove()
            }
        })
    }


    function filterName(name){
        var checkIfExists= _.indexOf(blockUsers,name);
        if(checkIfExists==-1){
            //代表不存在
            return false;
        }else{
            //代表存在
            return true;
        }
    }
}