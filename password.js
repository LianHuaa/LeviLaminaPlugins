//注册插件
//本插件似乎有问题懒得改了,这个插件没什么用
ll.registerPlugin("114514登录器", "恶臭的密码登陆", [1, 1, 4]);
//创建文件夹
let json = new JsonConfigFile('./plugins/1145141919810/PasswordLogin.json');

//配置文档创建默认信息
mc.listen("onJoin", function(player) {
    var record = json.get(player.name);
    if (record == null) {
        var text = {
            "密码": null
        }
        json.set(player.name, text);
        return loginWindow(player);
    } else {
        return loginWindow(player);
    }
}
);


function loginWindow(player) {
    if (json.get(player.name)["密码"] == null) {
        var cd = mc.newCustomForm();
        cd.setTitle("注册窗口");
        cd.addInput("输入密码", "输入密码注册");
        cd.addLabel("text1");
        cd.addLabel("text2");
        cd.addLabel("text3");
   //If you need to display more copies, just add
        cd.addLabel("text4");
        player.sendForm(cd, function(player, data) {
            var record = json.get(player.name);
            if (data == null) {
                player.tell("未注册");
            } else if (data[0] == "") {
                return loginWindow(player);
            } else {
                record["密码"] = data[0];
                json.set(player.name, record);
            }
            if (json.get(player.name)["密码"] != null) {
                return loginWindow(player);
            }
        }
        )
    } else if (json.get(player.name)["密码"] != null) {
        var cd2 = mc.newCustomForm()
        cd2.setTitle("登录窗口")
        cd2.addInput("登录密码", "输入密码登录进入")
        cd2.addLabel("text1");
        cd2.addLabel("text2");
        cd2.addLabel("text3");
   //If you need to display more copies, just add
        cd2.addLabel("text4");
        player.sendForm(cd2, function(player, data) {
            if (data == null) {
                player.tell("未登录");
            } else if (data[0] == "") {
                return loginWindow(player);
            } else if (data[0] != json.get(player.name)["密码"]) {
                return loginWindow(player);
            } else if (data[0] == json.get(player.name)["密码"]) {
                player.sendToast("提示", "加入游戏");
            }
        }
        )
    }
}
