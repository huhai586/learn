/**
 * Created by huhai on 2016/4/7.
 */
var uidDOM=$("a[href='space.php?uid=679606']");
if(uidDOM){
    //如果找到了
    var parents=uidDOM.parents("div[id^='post_']")
    console.log(uidDOM)
    console.log(parents)
    parents.remove()
    parents.hide()
    test
}