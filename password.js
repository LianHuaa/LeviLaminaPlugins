//注册插件
ll.registerPlugin("114514登录器", "恶臭的密码登陆", [1, 1, 4]);
//创建文件夹
let json = new JsonConfigFile('./plugins/1145141919810/PasswordLogin.js');

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
        player.sendForm(cd, function(player, data) {
            var record = json.get(player.name);
            if (data == null && data == undefined) {
                return loginWindow(player);
            } else if (data[0] == "") {
                return loginWindow(player);
            } else {
                record["密码"] = data[0];
                json.set(player.name, record);
            }
            if (json.get(player.name)["密码"] != null) {
                loginWindow(player);
            }
        }
        )
    } else if (json.get(player.name)["密码"] != null) {
        var cd2 = mc.newCustomForm()
        cd2.setTitle("登录窗口")
        cd2.addInput("登录密码", "输入密码登录进入")
        player.sendForm(cd2, function(player, data) {
            if (data == null) {
                return loginWindow(player);
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
