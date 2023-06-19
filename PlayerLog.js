//注册插件
let name1 = '玩家记录';
let intr1 = '记录玩家信息';
let ver11 = [0, 0, 1];
let othe1 = {'作者':'宫内莲华','网站':'htpp'};
ll.registerPlugin(name1, intr1, ver11, othe1);


//创建配置文件
let json1 = new JsonConfigFile('./logs/plls/pllist.json');

//检测进服
mc.listen("onJoin", function(pl){
	let tm = system.getTimeStr();
	let json2 = json1.get(pl.realName);
	if (json2 == null){
		let text = {
			"初次进服": `${tm}`,
			"后续进服": "",
			"退出时间": "",
			"退出坐标": ""
		};
		json1.set(pl.realName, text);
		return;
	}else {
	let jjs = json1.get(pl.realName)["初次进服"];
	let jjs2 = json1.get(pl.realName)["退出时间"];
	let jjs3 = json1.get(pl.realName)["退出坐标"];
		let text = {
			"初次进服": `${jjs}`,
			"后续进服": `${tm}`,
			"退出时间": `${jjs2}`,
			"退出坐标": `${jjs3}`
		};
		json1.set(pl.realName, text);
		return;
	}
});

//检测退服
mc.listen("onLeft", function(pl){
	let tm = system.getTimeStr();
	let jjs = json1.get(pl.realName)["初次进服"];
	let jjs1 = json1.get(pl.realName)["后续进服"];
	let json2 = json1.get(pl.realName);
	if (json2 != pl.realName){
		let text = {
			"初次进服": `${jjs}`,
			"后续进服": `${jjs1}`,
			"退出时间": `${tm}`,
			"退出坐标": `${pl.blockPos}`
		};
		json1.set(pl.realName, text);
		return;
	}else{
		return;
	}
});
