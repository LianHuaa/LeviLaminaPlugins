let peizhi = new JsonConfigFile("./plugins/make/Data/config.json");
let jsonkill = new JsonConfigFile("./plugins/make/Data/kill.json");

peizhi.init('随机传送',{
    "开关":"关",
    "传送范围":2000
});
peizhi.init('玩家传送',{
    "开关":"关"
});
peizhi.init('家园传送',{
    "开关":"关",
    "家园数量":8
});
peizhi.init('返回死亡点',{
    "开关":"关"
});
peizhi.init('进服回满状态',{
    "开关":"关"
});
peizhi.init('禁止生物踩踏压力板',{
    "开关":"关"
});
peizhi.init('禁止主末世界重生锚',{
    "开关":"关"
});
peizhi.init('耕地防踩',{
    "开关":"关"
});
peizhi.init('苦力怕防炸',{
    "开关":"关"
});
peizhi.init('后台显示玩家聊天',{
    "开关":"关"
});
peizhi.init('头顶显示信息',{
    "开关":"关",
    "信息":"@name@N血量:@plh/@PLH 饱食:@plb/@PLB 延迟:@ping@N等级:@level 击杀:@plkill 丢包:@PING"
});
peizhi.init('菜单',{
    "开关":"关",
    "物品":"Stick"
});
peizhi.init('聊天格式',{
    "开关":"关"
});
peizhi.init('自动拾取',{
  "开关":"关"
});
peizhi.init('村民保护',{
  "开关":"关"
});
peizhi.init('快速回血',{
    "开关":"关"
});
peizhi.init("进出服记录",{
    "开关":"关"
});

{
//随机传送
mc。regPlayerCmd("tpr","随机传送",function(pl,args){
    let g = peizhi.get('随机传送');
    if(g["开关"] == "开"){
    let mini = g["传送范围"];
    let max = g["传送范围"] * 2;
    let sjs = Math.floor(Math.random() * max) - mini;
    let sj = Math.floor(Math.random() * max) - mini;
    pl.teleport(pl.pos.x + sjs,220,pl.pos.z + sj,pl.pos.dimid);
    let id = setInterval(()=>{
        if(pl.inWorld == 1){
            let tf = pl.getBlockStandingOn();
            if(tf.type == "minecraft:air"){
                mc.runcmdEx(`effect ${pl.realName} blindness 3 5 true`);
                mc.runcmdEx(`effect ${pl.realName} slow_falling 3 0 true`);
                pl.sendText("传送中勿操作",5);
            }else{
                mc.runcmdEx(`effect ${pl.realName} blindness 1 0 true`);
                clearInterval(id);
            }
        }else{
            clearInterval(id);
        }
    },1000);
    }
},0);
}

{
//玩家传送
mc.regPlayerCmd("tpa","传送",function(pl,args){
    let g = peizhi.get('玩家传送');
    if(g["开关"] == "开"){
        let pllist = mc.getOnlinePlayers();
        let plarr = [];
        for (let i in pllist) {
            if (pllist[i].realName != pl.realName) {
                plarr.push(pllist[i].realName);
            } else {
                continue;
            }
        }
        let tparr = ["我→→→→TA","TA→→→→我"];
        if (plarr.length != 0){
        let fm = mc.newCustomForm();
        fm.setTitle("传送");
        fm.addDropdown("玩家列表",plarr,0);
        fm.addStepSlider("传送参数",tparr,0);
        pl.sendForm(fm,function(pl,data){
            if(data != null){
            let pla;
            if(tparr[data[1]] == "我→→→→TA"){
                pla = mc.getPlayer(plarr[data[0]]);
                return tpa(pl,pla);
            }else if(tparr[data[1]] == "TA→→→→我"){
                pla = mc.getPlayer(plarr[data[0]]);
                return tpaa(pl,pla);
            }
        }
        });
    }else{
        let fm = mc.newCustomForm();
            fm.setTitle("传送");
            fm.addLabel("暂无其他玩家在线");
            fm.addLabel("传送不可用");
            pl.sendForm(fm,function(pl,data){});
    }
    }
});
function tpa(pl,pla){
    pla.sendModalForm("传送请求",`玩家${pl.realName}请求传送到你这里`,"接受","拒绝",function(pla,res){
        switch (res) {
            case true:
                pl.teleport(pla.pos);
                break;
            default:
                pla.tell(`${pl.realName}向你发起的传送已失效`);
                pl.tell('对方有事在忙,稍后再试');
                break;
        }
    });
}
function tpaa(pl,pla){
    pla.sendModalForm('传送请求', `玩家${pl.realName}请求你传送到TA那里`, '接受', '拒绝', function (pla, result) {
        switch (result) {
            case true:
                pla.teleport(pl.pos);
                break;
            default:
                pla.tell(`${pl.realName}向你发起的传送已失效`);
                pl.tell('对方有事在忙,稍后再试');
                break;
        }
    });
}
}

{
//家园传送
let json = file.readFrom('.\\plugins\\make\\Data\\homelist.json');
if (json == null) {
        file.writeTo('.\\plugins\\make\\Data\\homelist.json', '{}');
}
let lista;
function llist (){
    json = file.readFrom('.\\plugins\\make\\Data\\homelist.json');
    lista = JSON.parse(json);
}
llist ();
function addlist() {
    file.writeTo('.\\plugins\\make\\Data\\homelist.json', JSON.stringify(lista, null, 4));
}
mc.regPlayerCmd('home','家园',(pl)=>{
    let g = peizhi.get('家园传送');
    if(g["开关"] == "开"){
    return home(pl);
    }
});
function home(pl){
    let fm = mc.newSimpleForm();
    fm.setTitle('家园');
    fm.addButton('前往家园');
    fm.addButton('添加家园');
    fm.addButton('删除家园');
    pl.sendForm(fm,function(pl,id){
        switch(id) {
    case 0:
        go(pl);
        break;
    case 1:
        add(pl);
        break;
    case 2:
        del(pl);
        break;
    default:
        break;
} 
    });
}

function go(pl){
    let arr = [];
    llist();
    for (let i in lista[pl.realName]){
        arr.push(i);
    }
    let fm = mc.newSimpleForm();
    fm.setTitle('前往家园');
    arr.forEach((ar)=>{fm.addButton(ar)});
    pl.sendForm(fm,(pl,id)=>{
        if(id != null){
            let pos = lista[pl.realName][arr[id]];
            pl.teleport(pos.x,pos.y,pos.z,pos.dimid);
        }else {
            return home(pl);
        }
    });
}

function add(pl){
    let g = peizhi.get('家园传送');
    let fm = mc.newCustomForm();
    fm.setTitle('添加家园');
    fm.addInput('输入名称');
    pl.sendForm(fm,(pl,data)=>{
        if(data != null){
            if(data[0] != ''){
        let list = {
                x:Math.trunc(pl.pos.x),
                y:Math.trunc(pl.pos.y),
                z:Math.trunc(pl.pos.z),
                dimid:pl.pos.dimid
            };
            if(lista[pl.realName] == null){
                llist();
                lista[pl.realName] = {};
                lista[pl.realName][data[0]] = list;
                addlist();
            }else {
                llist();
                let arr = [];
                for(let i in lista[pl.realName]){
                    arr.push(lista[pl.realName][i]);
                }
                for (let i in lista[pl.realName]){
                if(data[0] != i){
                if(arr.length < g["家园数量"]){
                    llist();
                    lista[pl.realName][data[0]] = list;
                    addlist();
                    pl.tell(`添加 ${data[0]} 完成`,5);
                }else {
                    pl.tell(`不能大于${g["家园数量"]}个家园`,5);
                }
                }else {
                    pl.tell('有重名的家园',5);
                }
            }
            }
            }else {
                pl.tell('输入不能为空',5);
            }
        }
    });
}

function del(pl){
    let arr = [];
    llist();
    for (let i in lista[pl.realName]){
        arr.push(i);
    }
    let fm = mc.newSimpleForm();
    fm.setTitle('删除家园');
    arr.forEach((ar)=>{fm.addButton(ar)});
    pl.sendForm(fm,(pl,id)=>{
        if(id != null){
            pl.sendModalForm('二次确认',`删除 ${arr[id]} 后\n将会消失很久很久~~~`,'确定','取消',(pl,res)=>{
                if(res == true){
                    delete lista[pl.realName][arr[id]];
                    pl.tell(`已删除家园 ${arr[id]}`,5);
                    return home(pl);
                }else {
                    return home(pl);
                }
            });
        }else {
            return home(pl);
        }
    });
}
}

{
//回光返照
mc.regPlayerCmd('back','回光返照',function(pl,args){
	let g = peizhi.get('返回死亡点');
	if(g["开关"] == "开"){
	let kil = pl.lastDeathPos;
    pl.sendModalForm("要回去吗",`返回坐标:${kil}`,"确认","取消",function(pl,res){
        if (res == true){
            pl.teleport(kil);
        }
    });}
	});
	}
	
{
	//进服回满状态
mc.listen("onJoin", function (pl) {
    let g = peizhi.get('进服回满状态');
    if(g["开关"] == "开"){
        let plb = pl.getAttributes()[9]["Max"];
        pl.heal(pl.maxHealth);
        pl.setHungry(plb);
        }
});
}

{
//禁止生物踩踏压力板
mc.listen("onStepOnPressurePlate", function (en, pressurePlate) {
    let g = peizhi.get('禁止生物踩踏压力板');
    if(g["开关"] == "开"){
    let enp = en.isPlayer();
    if (enp == false) {
        return false;
    }
    }
});
}

{
//重生锚
mc.listen("onUseRespawnAnchor", function (pl, pos) {
    let g = peizhi.get('禁止主末世界重生锚');
    if(g["开关"] == "开"){
    if (pos.dimid == 0) {
        pl.tell("禁止在主世界使用重生锚!!!");
        return false;
    }
    else if (pos.dimid == 2) {
        pl.tell("禁止在末地使用重生锚!!!");
        return false;
    }
    }
});
}

{
//耕地防踩
mc.listen("onFarmLandDecay",function (pos, entity){
    let g = peizhi.get('耕地防踩');
    if(g["开关"] == "开"){
    return false;
    }
});
}

{
//苦力怕防炸
mc.listen("onEntityExplode",function(source,pos,radius,maxResistance,isDestroy,isFire){
    let g = peizhi.get('苦力怕防炸');
    if(source.name == "Creeper" && g["开关"] == "开"){
        return false;
    }
});
}

{
//检测玩家聊天
mc.listen("onChat",function(pl,msg){
    let g = peizhi.get('后台显示玩家聊天');
    if(g["开关"] == "开"){
    log(`${pl.realName}>>${msg}`);
    }
});
}

{
//头顶显示信息
//@name名字 @N换行 @plh当前血量 @PLH最大血量 @plb当前饱食 @PLB最大饱食 @ping延迟 @PING丢包 @level等级 @plkill击杀数 @os设备类型 @money计分板 @MONEY经济插件
//@erm玩家权限 @mode玩家模式
mc.listen("onJoin",function(pl){
    let g = peizhi.get('头顶显示信息');
    if(g["开关"] == "开"){
    let pljs = jsonkill.get(pl.realName);
    if(pljs == null){
    jsonkill.init(pl.realName,0);
    }
    let id = setInterval(()=>{
    if(pl.inWorld == 1){
        let na = g["信息"];
        let name = na.replace(/@name/g,`${pldv.name(pl)}`).replace(/@N/g,`\n`).replace(/@plh/g,`${pldv.plh(pl)}`).replace(/@PLH/g,`${pldv.plhm(pl)}`).replace(/@plb/g,`${pldv.plb(pl)}`).replace(/@PLB/g,`${pldv.plbm(pl)}`).replace(/@ping/g,`${pldv.ping(pl)}`).replace(/@PING/g,`${pldv.pingi(pl)}`).replace(/@level/g,`${pldv.level(pl)}`).replace(/@plkill/g,`${pldv.plkill(pl)}`).replace(/@os/g,`${pldv.os(pl)}`).replace(/@money/g,`${pldv.smoney(pl)}`).replace(/@MONEY/g,`${pldv.money(pl)}`).replace(/@erm/g,`${pldv.erm(pl)}`).replace(/@mode/g,`${pldv.mode(pl)}`)
        pl.rename(name);
    }else if(pl.isTrading == true){
        pl.rename(`${pl.realName}\n皮燕子交易中`);
    }else{
        clearInterval(id);
    }
},300);
}
});
//击杀监听
mc.listen("onMobDie", function(mob,source,cause){
    if(source != null && source.isPlayer() == true){
    let pl = source.toPlayer();
    let ge = jsonkill.get(pl.realName);
    if(ge == null){
      jsonkill.set(pl.realName,1);
    }else{
        ge = jsonkill.get(pl.realName);
        let rs = Number(ge) + 1;
        jsonkill.set(pl.realName,`${rs}`);
    }}
});

let pldv = {
name:function (pl){
    let name = pl.realName;
    return Format.White + name + Format.Clear;
},
plh:function (pl){
    return Format.Red + pl.health + Format.Clear;
},
plhm:function (pl){
    return Format.Red + pl.maxHealth + Format.Clear;
},
plb:function (pl){
    let plb = pl.getAttributes()[9]["Current"];
    return Format.Gold + plb + Format.Clear;
},
plbm:function (pl){
    let plbm = pl.getAttributes()[9]["Max"];
    return Format.Gold + plbm + Format.Clear;
},
ping:function (pl){
    let ping = pl.getDevice().lastPing;
    if(ping > 60){
        return Format.DarkRed + ping + Format.Clear;
    }else if(ping > 30){
        return Format.Yellow + ping + Format.Clear;
    }else{
        return Format.Green + ping + Format.Clear;
    }
},
level:function (pl){
    let level = pl.getLevel();
    return Format.Aqua + level + Format.Clear;
},
plkill:function (pl){
    let kill = jsonkill.get(pl.realName);
    let ar = Number(kill);
    return Format.Red + ar + Format.Clear;
},
pingi:function (pl){
    let pingi = pl.getDevice().lastPacketLoss;
    return Format.Green + pingi.toFixed(2) + Format.Clear;
},
os:function (pl){
    let os = pl.getDevice().os;
    if (os == "Android"){
        return "安卓";
    }else if(os == "iOS"){
        return "苹果";
    }else if(os == "Windows10"){
        return "电脑";
    }else if(os == "Win32"){
        return "电脑";
    }else{
        return "未知";
    }
},
smoney:function (pl){
    let money = mc.getScoreObjective("money");
    if(money != null){
        let get = pl.getScore("money");
        return get;
    }else{
        return "不存在";
    }
},
money:function (pl){
    let tf = File.exists("./plugins/LegacyMoney/LegacyMoney.dll");
    if(tf == true){
        let money = pl.getMoney();
        return money;
    }else{
        return "不存在";
    }
},
erm:function (pl){
    let erm = pl.permLevel;
    if(erm == 0){
        return "成员";
    }else if(erm == 1){
        return "管理员";
    }else if(erm == 4){
        return "控制台";
    }else{
        return "未知";
    }
},
mode:function (pl){
    let mode = pl.gameMode;
    if(mode == 0){
        return "生存";
    }else if(mode == 1){
        return "创造";
    }else if(mode == 2){
        return "冒险";
    }else if(mode == 6){
        return "旁观";
    }else{
        return "未知";
    }
}
}
mc.listen("onPlayerCmd", function (pl, cmd) {
    if (pl.name != pl.realName) {
        pl.rename(`${pl.realName}`);
    }
});
}

{
//菜单
mc.listen("onUseItemOn",function(pl,item,block,side,pos){
    let g = peizhi.get('菜单');
    let tpapl = peizhi.get('玩家传送');
    let homepl = peizhi.get('家园传送');
    let tprpl = peizhi.get('随机传送');
    let backpl = peizhi.get('返回死亡点');
    let nam = g["物品"];
    if(item.name == nam && g["开关"] == "开"){
        let fm = mc.newSimpleForm();
        fm.setTitle('菜单列表');
        fm.addButton('玩家传送');
        fm.addButton('家园传送');
        fm.addButton('回光返照');
        fm.addButton('随机传送');
        fm.addButton('原地去世');
        pl.sendForm(fm,(pl,id)=>{
            switch (id) {
            case 0:
                if(tpapl["开关"] == "开"){
                pl.runcmd('tpa');
                }else{
                    pl.tell('玩家传送未开启');
                }
                break;
            case 1:
                if(homepl["开关"] == "开"){
                pl.runcmd('home');
                }else{
                    pl.tell('家园传送未开启');
                }
                break;
            case 2:
                if(backpl["开关"] == "开"){
                pl.runcmd('back');
                }else{
                    pl.tell('回光返照未开启');
                }
                break;
            case 3:
                if(tprpl["开关"] == "开"){
                pl.runcmd('tpr');
                }else{
                    pl.tell('随机传送未开启');
                }
                break;
            case 4:
                pl.kill();
                break;
            default:
                break;
        }
        });
    }
});
}

{
//改变聊天信息
mc.listen("onChat",(pl,msg)=>{
    let g = peizhi.get('聊天格式');
    if(g["开关"] == "开"){
        let dv = pl.getDevice();
        mc.broadcast(`${Format.Aqua}<${pl.realName}>${Format.Green}[${dv.lastPing}ms]${Format.Gold}[${pl.pos.dim}]${Format.Clear} >> ${msg}`);
        return false;
    }
});
}

{
//输入命令改变原名
mc.listen('onPlayerCmd',(pl,cmd)=>{
    pl.rename(pl.realName);
})
}

//自动拾取
{
    mc.listen("onDestroyBlock", (pl, bl) => {
      let g = peizhi.get('自动拾取');
      if(g["开关"] == "开"){
        setTimeout(() => {
            mc.runcmdEx(`tp @e[x=${bl.pos.x},y=${bl.pos.y},z=${bl.pos.z},r=2,type=minecraft:item] @a[name=${pl.realName}]`);
        }, 0);}
    });
    mc.listen("onMobDie",(mob,source,cause)=> {
      let g = peizhi.get('自动拾取');
      if(g["开关"] == "开"){
          if(source == null){
              return;
        }else if(source.isPlayer() == true && mob.type != "minecraft:zombie_pigman"){
        let plm = source.toPlayer();
        setTimeout(() => {
            mc.runcmdEx(`tp @e[x=${mob.pos.x},y=${mob.pos.y},z=${mob.pos.z},r=2,type=minecraft:item] @a[name=${plm.realName}]`);
        },0);
        }}
    });
}
//村民保护
{
mc.listen('onMobHurt',(mob,source,damage,cause) => {
  let g = peizhi.get("村民保护");
  if(g["开关"] == "开"){
    if (mob.type == "minecraft:villager" || mob.type == "minecraft:villager_v2" && source.isPlayer() != true) {
      return false
    }
  }
});
}
//快速回血
{
mc.listen("onAte",(pl,it) => {
    let g = peizhi.get('快速回血');
    if(g["开关"] == "开" && it.type != "minecraft:pufferfish" || it.type != "potion"){
        let id = setInterval(() => {
            if (pl.health != pl.maxHealth && pl.inWorld == 1) {
                pl.heal(1);
            }else{
                clearInterval(id);
            }
        },500);
    }
});
}
//进出服记录
{
mc.listen("onConsoleCmd",(cmd)=>{
    if(cmd == "stop"){
            let pl = mc.getOnlinePlayers();
            pl.forEach((arr)=>{arr.kick("服务器已关闭 详情询问管理员");});
    }
});
mc.listen("onJoin",function(pl){
    let jj = jinfu.get(pl.realName);
    let ti = system.getTimeStr();
    let g = peizhi.get("进出服记录");
    if(g["开关" == "开"]){
    if(jinfu.get(pl.realName) == null){
        jinfu.set(pl.realName,{
            "进服日期":`${ti}`,
            "近期进服":`${ti}`,
            "退出时间":"游戏中"
        }
        );
    }else{
        jinfu.set(pl.realName,{
            "进服日期":`${jj["进服日期"]}`,
            "近期进服":`${ti}`,
            "退出时间":"游戏中"
        }
        );
    }
    }
});
mc.listen("onLeft",function(pl){
    let jj = jinfu.get(pl.realName);
    let ti = system.getTimeStr();
    let g = peizhi.get("进出服记录");
    if(g["开关" == "开"]){
    jinfu.set(pl.realName,{
        "进服日期": `${jj["进服日期"]}`,
        "近期进服": `${jj["近期进服"]}`,
        "退出时间": `${ti}`
    });
}
});
}
