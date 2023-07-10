ll.registerPlugin('宫内莲华', '宫内莲华', [0, 0, 8]);


let json = new JsonConfigFile('./plugins/GNLH/GNLH.json', '{"头顶显示":"开", "攻击显血":"开","耕地防踩":"开","禁止重生锚":"开","禁止生物踩压力板":"开","获取村民蛋":"关","回满状态":"开", "金萝卜效果":"开"}');
let jsonback = new JsonConfigFile('./plugins/GNLH/BACK.json');



//头顶信息显示
{
    let cc, hs, jhs, chs, ls;
    cc = Format.Clear;
    hs = Format.DarkRed;
    jhs = Format.Yellow;
    chs = Format.Gold;
    ls = Format.Green;

    mc.listen('onJoin', function (pl) {
        let tm = setInterval(function () {
            if (pl.inWorld == true && json.get("头顶显示") == "开") {
                let name, ping, pingl, plh, plb;
                name = dy.name(pl);
                ping = dy.ping(pl);
                pingl = dy.pingl(pl);
                plh = dy.plh(pl);
                plb = dy.plb(pl);
                pl.rename(`${name}\n${hs}血量:${plh} ${hs}饱食:${plb}\n${ls}延迟:${ping} ${ls}丢包:${pingl}`);
            }
            else {
                return clearInterval(tm);
            }
        }, 200);
    }
    );

    //玩家信息
    let dy = {
        //名字
        "name": function (pl) {
            let name = pl.realName;
            switch (true) {
                case name:
                    return name
                    break;
                default:
                    return name
                    break;
            };
        },
        //延迟
        "ping": function (pl) {
            let ping = pl.getDevice().lastPing;
            switch (true) {
                case ping <= 40:
                    //绿色
                    return ls + ping + cc
                    break;
                case ping <= 70:
                    //橙黄色
                    return chs + ping + cc
                    break;
                default:
                    //红色
                    return hs + ping + cc
                    break;
            };
        },
        //丢包
        "pingl": function (pl) {
            let pingl = pl.getDevice().lastPacketLoss;
            switch (true) {
                case pingl <= 5:
                    //绿色
                    return ls + parseInt(pingl) + cc
                    break;
                case pingl <= 1:
                    //橙黄色
                    return chs + parseInt(pingl) + cc
                    break;
                default:
                    //红色
                    return hs + parseInt(pingl) + cc
                    break;
            };
        },
        //血量
        "plh": function (pl) {
            let plh = pl.health;
            switch (true) {
                case plh <= 20:
                    //绿色
                    return ls + plh + cc
                    break;
                case plh <= 15:
                    //橙黄色
                    return chs + plh + cc
                    break;
                case plh <= 10:
                    //黄色
                    return jhs + plh + cc
                    break;
                case plh <= 5:
                    //红色
                    return hs + plh + cc
                    break;
                default:
                    //原色
                    return plh + cc
                    break;
            };
        },
        //饱食
        "plb": function (pl) {
            let plb = pl.getAttributes()[9]["Current"];
            switch (true) {
                case plb <= 20:
                    //绿色
                    return ls + plb + cc
                    break;
                case plb <= 15:
                    //橙黄色
                    return chs + plb + cc
                    break;
                case plb <= 10:
                    //黄色
                    return jhs + plb + cc
                    break;
                case plb <= 5:
                    //红色
                    return hs + plb + cc
                    break;
                default:
                    //原色
                    return plb + cc
                    break;
            };
        }
    };
};



//攻击显示血量和伤害
{
    //let arr = ["minecraft:tnt", "minecraft:armor_stand", "minecraft:ender_crystal", "minecraft:leash_knot", "minecraft:boat", "minecraft:minecart", "minecraft:chest_minecart", "minecraft:command_block_minecart", "minecraft:hopper_minecart", "minecraft:tnt_minecart", "minecraft:chest_boat"];

    mc.listen('onAttackEntity', function (pl, en, dm) {
        let enh = en.health - 1;
        let et = en.type;
        let fdg = Format.DarkGreen;
        let fdr = Format.DarkRed;
        let em = en.maxHealth;
        if (et != "minecraft:tnt" && et != "minecraft:armor_stand" && et != "minecraft:ender_crystal" && et != "minecraft:leash_knot" && et != "minecraft:boat" && et != "minecraft:minecart" && et != "minecraft:chest_minecart" && et != "minecraft:command_block_minecart" && et != "minecraft:hopper_minecart" && et != "minecraft:tnt_minecart" && et != "minecraft:chest_boat" && json.get("攻击显血") == "开") {
            pl.tell(`${fdg}血量:${fdr}${em}/${enh} ` + `${fdg}造成伤害:${fdr}${dm}`, 5);
        } else {
            return;
        }
    }
    );
};




//杂项
{
    //耕地监听
    mc.listen("onFarmLandDecay", function (pos, entity) {
        if (json.get("耕地防踩") == "开") {
            return false;
        }
        else {
            return;
        }
    });
    //禁止主世界末地使用重生锚
    mc.listen("onUseRespawnAnchor", function (pl, pos) {
        if (pos.dimid == 0 && json.get("禁止重生锚") == "开") {
            pl.tell("禁止在主世界使用重生锚!!!");
            return false;
        }
        else if (pos.dimid == 2 && json.get("禁止重生锚") == "开") {
            pl.tell("禁止在末地使用重生锚!!!");
            return false;
        }
        else {
            return;
        }
    });
    //禁止生物踩压力板
    mc.listen("onStepOnPressurePlate", function (en, pressurePlate) {
        let enp = en.isPlayer();
        if (enp == false && json.get("禁止生物踩压力板") == "开") {
            return false;
        }
        else {
            return;
        }
    });

    //玩家输入命令使用真实玩家名
    mc.listen("onPlayerCmd", function (pl, cmd) {
        if (pl.name != pl.realName) {
            pl.rename(`${pl.realName}`);
        }
        else {
            return;
        }
    });

    //村民变成村民蛋1
    mc.listen("onAttackEntity", function (pl, en, da) {
        let it = pl.getHand();
        if (it.type == "minecraft:stone_sword" && en.type == "minecraft:villager" && json.get("获取村民蛋") == "开") {
            en.kill();
            pl.clearItem("minecraft:stone_sword", 1);
            mc.runcmdEx(`give ${pl.realName} minecraft:villager_spawn_egg 1`);
            pl.refreshItems();
        }
        else if (it.type == "minecraft:stone_sword" && en.type == "minecraft:villager_v2" && json.get("获取村民蛋") == "开") {
            en.kill();
            pl.clearItem("minecraft:stone_sword", 1);
            mc.runcmdEx(`give ${pl.realName} minecraft:villager_spawn_egg 1`);
            pl.refreshItems();
        }
        else {
            return;
        }
    });
    //金萝卜添加效果
    mc.listen("onAte", function (pl, it) {
        if (it.type == "minecraft:golden_carrot" && json.get("金萝卜效果") == "开") {
            pl.addEffect(8, 6000, 1, false);
            pl.addEffect(1, 6000, 1, false);
            pl.addEffect(16, 6000, 0, false);
        }
        else {
            return;
        }
    });
    //进服恢复满状态
    mc.listen("onJoin", function (pl) {
        if (json.get("回满状态") == "开") {
            let plb = pl.getAttributes()[9]["DefaultMax"]
            pl.heal(pl.maxHealth);
            pl.setHungry(plb);
        }
        else {
            return;
        }
    });
    //中文motd
    mc.listen("onServerStarted", function motd() {
        let jsonget = json.get("中文motd");
        if (jsonget == null) {
            json.set("中文motd", { "状态": "开", "变换时间": "4", "显示文本": ["§2motd1", "§4motd2", "§6motd3"] });
            return motd();
        } else if (jsonget["状态"] == "开") {
            let sj = jsonget["变换时间"];
            let motd = jsonget["显示文本"];
            return motd1(sj, motd);

        } else {
            return;
        }
    });
    //motd1
    function motd1(sj, motd) {
        let i = 0;
        let tm = setInterval(function () {
            if (i != motd.length) {
                mc.setMotd(motd[i]);
                i++;
            }
            else if (i == motd.length) {
                i = 0;
                mc.setMotd(motd[i]);
                i++;
            } else {
                log("motd出错");
            }
        }, 1000 * `${sj}`);
    }
};


//传送菜单
{
    //文件写入
    if (json.get("玩家传送") == null) {
        json.set("玩家传送", "关");
    } else {
        //空
    };

    //命令注册
mc.listen("onServerStarted",function(){
	if (json.get("玩家传送") == "开"){
    mc.regPlayerCmd('tpa', '玩家传送', function (pl, args) {
		return tpamenu(pl);
		});
	}else {
            //空
        }
    });
    //传送选择
    function tpamenu(pl) {
        let pll = mc.getOnlinePlayers();
        let plname = [];
        let mo = ["自己→→→→别人", "别人→→→→自己"]
        for (let i in pll) {
            if (pll[i].realName != pl.realName) {
                plname.push(pll[i].realName);
            } else {
                continue;
            }
        }
        let menu = mc.newCustomForm();
        menu.setTitle('传送菜单');
        menu.addDropdown('玩家选择', plname, 0);
        menu.addDropdown('模式选择', mo, 0);
        pl.sendForm(menu, function (pl, data) {
            let pla
            if (data != null && data != undefined) {
                if (plname[data[0]] != undefined && mo[data[1]] == "自己→→→→别人") {
                    pla = mc.getPlayer(plname[data[0]]);
                    tpaa(pl, pla);
                } else if (plname[data[0]] != undefined && mo[data[1]] == "别人→→→→自己") {
                    pla = mc.getPlayer(plname[data[0]]);
                    tpal(pl, pla);
                } else {
                    pl.tell('玩家选择出错');
                    return;
                }
            } else {
                //空
            }
        });
    };

    //自己→→→→别人
    function tpaa(pl, pla) {
        pla.sendModalForm('传送请求', `玩家${pl.realName}请求传送到你这里`, '接受', '拒绝', function (pla, result) {
            switch (result) {
                case true:
                    pl.teleport(pla.pos);
                    break;
                default:
                    pla.tell(`${pl.realName}的传送请求失效`);
                    pl.tell('对方有事在忙,稍后再试');
                    break;
            }
        })
    };

    //别人→→→→自己
    function tpal(pl, pla) {
        pla.sendModalForm('传送请求', `玩家${pl.realName}请求你传送到他(她)那里`, '接受', '拒绝', function (pla, result) {
            switch (result) {
                case true:
                    pla.teleport(pl.pos);
                    break;
                default:
                    pla.tell(`${pl.realName}的传送请求失效`);
                    pl.tell('对方有事在忙,稍后再试');
                    break;
            }
        })
    };
};

//回光返照
{
	//文件创建
	if (json.get("回光返照") == null) {
        json.set("回光返照", "关");
    } else {
        //空
    };
	
	//命令注册
mc.listen("onServerStarted",function(){
	if (json.get("回光返照") == "开"){
	mc.regPlayerCmd('back','回光返照',function(pl,args){
	return backmenu(pl);
	});
	}else{
		//空
		}
}
);
//记录成盒信息
let arr = [];
mc.listen("onPlayerDie",function(pl,source){
		for(let i in pl.pos){
		let pos = pl.pos[i]
		arr.push(pos)
		}
		jsonback.set(`${pl.realName}`,{"X":parseInt(arr[1]),"Y":parseInt(arr[2]),"Z":parseInt(arr[3]),'世界':`${arr[4]}`,'ID':arr[5]});
		}
		);
//返回函数
function backmenu(pl){
	if(jsonback.get(`${pl.realName}`) == null){
	pl.sendModalForm('回光返照','还未记录位置快去死一死吧','确认','取消',function(pl,dd){
		if (dd == true){
			// 空
			}else if(dd == false){
				//空
			}else {
				//空
				}
		}
		)
		}else{
			let jsonget = jsonback.get(`${pl.realName}`);
			pl.sendModalForm('回光返照',`位置:(${jsonget["世界"]}.${jsonget['X']}.${jsonget['Y']}.${jsonget['Z']})\n是否返回`,'确认','取消',function(pl,dd){
		if(dd == true){
			let jsonget = jsonback.get(`${pl.realName}`);
			pl.teleport(jsonget['X'],jsonget['Y'],jsonget['Z'],jsonget['ID']);
			arr = [];
			}else{
				//空
			}
		}
		)
	}
}
};


//家园传送
{
	
	
	}