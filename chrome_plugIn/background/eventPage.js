/**
 * Created by haihu on 2016/4/8.
 */


chrome.runtime.onMessage.addListener(function(msg, sender) {

    /**
     * Created by haihu on 2016/4/8.
     */
//屏蔽uid列表
    var uids=[347588,3475889,559215]
//循环列表生成css
    var blockCSS="";
    for(var i=0;i<uids.length;i++){
        if(i==(uids.length-1)){
            blockCSS=blockCSS+"div[id^='"+uids[i]+"']"
        }else{
            blockCSS=blockCSS+"div[id^='"+uids[i]+"']"+","
        }
    }

//添加css值
    blockCSS=blockCSS+"{display:none}"
    var a='body{ font-size:30px !important}'
    chrome.tabs.insertCSS(null,{file:"mystyles.css"});
});