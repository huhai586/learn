

window.pubAttributes={blocked:[]};
$('.switch-checkbox').bootstrapSwitch({
    onText:"打开",
    offText:"关闭",
    size:"small",
    onColor:"success"
});
//注册开关事件
$('.switch-checkbox').on('switchChange.bootstrapSwitch', function (e, data) {
    console.log(data);
    chrome.storage.sync.set({open:data},function(){console.log("操作成功了")});
});

chrome.storage.sync.get("open",function(obj){
    //判断status
    var open=obj.open;
     $('.switch-checkbox').bootstrapSwitch('state',open)

});


//展示被屏蔽的人

function showBlock(){
    chrome.storage.sync.get("blocked",function(obj){
        if(obj.blocked==undefined){
            $(".blockedUser ul").html("暂无被屏蔽的ID");
            return
        }
        //判断status
        var blockArray=obj.blocked;
        var length=blockArray.length;
        var closeSpan='<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
        if(length!=0){
            //不为0
            var blockedUser=""
            _.each(blockArray,function(element,index){
                var solo='<li class="block-solo"><i>'+element+"</i>"+closeSpan+'</li>';
                blockedUser=blockedUser+solo
            });
            $(".blockedUser ul").html(blockedUser);
            window.pubAttributes.blocked=blockArray;
        }else{
            $(".blockedUser ul").html("暂无被屏蔽的ID")
        }

    });
}

showBlock()

$("#submit").on("click",function(){
    //处理点击
    var getData=getInput();
    if(getData){
        console.log("最后的数组是")
        console.log(getData);
        chrome.storage.sync.set({blocked:getData},function(){
            $(".infoBar").removeClass("alert-warning").addClass("alert-success").html("保存成功").slideDown(300)
            setTimeout(function(){
                $(".infoBar").slideUp()
            },2000);
            showBlock();
            //清空输入框
            $("#inputUser").val("")
        });

    }

});

function getInput(){
    //处理输入
    var inputData=$("#inputUser").val().trim();
    var inputToArray=inputData.split(/[ ]/);
    //循环遍历每个Array值，清理格式
    _.each(inputToArray,function(ele,index){
        inputToArray[index]=ele.trim();
    });
    //去除false值
    inputToArray= _.compact(inputToArray);
    if(inputToArray.length==0){
        $(".infoBar").removeClass("alert-success").addClass("alert-warning").html("你没有输入数据").slideDown(300)
        setTimeout(function(){
            $(".infoBar").slideUp()
        },2000);
        return false
    }
    var arrayConact=inputToArray.concat(window.pubAttributes.blocked);
    //清理重复的值
    var endArray=_.uniq(arrayConact);
    return endArray
    //
}

//监听点击事件
$(".blockedUser").on("click","span.glyphicon",function(){
    var username=$(this).siblings("i").html();
    chrome.storage.sync.get("blocked",function(obj){
        var deleteAfter= _.without(obj.blocked,username);
        chrome.storage.sync.set({blocked:deleteAfter},function(){
            window.location.reload()
        })
    })

})

