//tab选项卡类  tab:#tab_nav>li 图片#content>div .active为选项卡样式 content_item为div默认样式 .current为默认图片显示样式
//getConfig() 获取参数 invoke() 绑定事件  autoPlay() 自动播放
(function() {
	var Tab = function(tab) {
		var _this = this;
		this.index=0;
		this.tab = tab; //取得参数
		//默认参数
		this.config = {
			"triggerType": "mouseover", //定义鼠标触发类型
			"effect": "default", //定义切换方式
			"invoke": 1, //默认显示第几张
			"auto": false //定义切换时间
		} //默认参数
		var config = this.getConfig();
		//取得配制参数
		if(config == null) {
			config = this.config;
		} //若无参数默认为参数
		else {
			for(var Key in this.config) {
				if(config.hasOwnProperty(Key)) {
					this.config[Key] = config[Key];
				} //若存在 就变 不存在为默认值
			}
		}
		//根据triggerType绑定对象
		//保存tab
		this.ETab = this.getEleInid("tab_nav", "li");
		//保存div
		this.EDiv = this.getEleInid("content", "div");
		//绑定事件
		this.bindEvent(this.ETab);
		//进入指定张数
		this.ETab[config.invoke - 1].className="active";
		this.EDiv[config.invoke - 1].className="content_item current";
		//判断自动切换
		this.index = config.invoke - 1;
		if(config.auto && config.auto > 0) {
			//全局定时器
			this.Timer = null;
			this.autoPlay();
		}
	};
	Tab.prototype = {
		//获取配置参数方法
		getConfig: function() {
			//取得
			var config = this.tab;
			//确保配置参数
			if(config) {
				return config; //返回人工配制
			} else {
				return null; //人工未配置
			}
		},
		//取得某id某标签
		getEleInid: function(id, tagName) {
			var Ele = document.getElementById(id).getElementsByTagName(tagName);
			return Ele;
		},
		//绑定事件
		bindEvent: function(ELe) {
			var _this = this;
			if(this.config.triggerType == "click") {
				for(var i = 0; i < ELe.length; i++) {
					(function(num) {
						ELe[num].onclick = function() {
							clearInterval(_this.Timer);
							_this.invoke(ELe[num], num);
							_this.autoPlay();
						}
					})(i);
				}
			} else {
				for(var i = 0; i < ELe.length; i++) {
					(function(num) {
						ELe[num].onmouseover = function() {
							clearInterval(_this.Timer);
							_this.invoke(ELe[num], num);
							_this.autoPlay();
						}
					})(i);
				}
			}
		},
		//Tab事件驱动
		invoke: function(currentTab, num) {
			var _this_ = this;
			//当前选中的加上 actived
			//切换当前Tab内容
			//根据effect
			var effect = this.config.effect;
			var content = this.EDiv;
			//tab选中状态
			var all = currentTab.parentNode.childNodes;
			for(var i = 0, len = all.length; i < len; i++) {
				all[i].className = " ";
			}
			currentTab.className = "active";
			//div框切换
			if(this.index == num) return; //若不变 无效果 
			if(effect === "fade") {
				fadein(content[num], 20, 100);
				fadeout(content[_this_.index], 20, 100);
				_this_.index = num;
			} else {
				for(var i = 0, len = content.length; i < len; i++) {
					content[i].className = "content_item";
				}
				content[num].className = "content_item current";
				_this_.index = num;
			}
		},
		//自动切换
		autoPlay: function() {
			//每个一段时间去触发index+1
			var tab = this.ETab;
			var index = this.index;
			var length = this.ETab.length; //多少个
			var events = this.config.triggerType;
			this.Timer = setInterval(function() {
				index++;
				if(index >= length) {
					index = 0;
				}
				if(events === "mouseover") {
					tab[index].onmouseover();
				} else {
					tab[index].onclick();
				}
			}, this.config.auto);
		}
	}
	//淡入效果(事件元素，速度，透明度)
	function fadein(elem, time, opacity) {
		var val = 0; //初始透明度
		time = time || 20;
		opacity = opacity || 100;
		var speed = Math.abs(opacity / time);
		//显示元素 并且将元素设为值为0透明度
		elem.style.display = "block";
		elem.style.opacity = 0;
		(function() {
			elem.style.opacity = val / 100;
			val += speed;
			if(val <= opacity)
				setTimeout(arguments.callee, time);
		})();
	};

	function fadeout(elem, time, opacity) {
		var val = 100; //初始透明度
		time = time || 20;
		opacity = opacity || 100;
		var speed = Math.abs(opacity / time);
		//显示元素 并且将元素设为值为1透明度
		elem.style.display = "block";
		elem.style.opacity = 1;
		(function() {
			elem.style.opacity = val / 100;
			val -= speed;
			if(val >= 0)
				setTimeout(arguments.callee, time);
		})();
	}
	window.Tab = Tab;
})(window); //匿名函数自运行封装
var Tab = new Tab({
	"effect": "fade",
	"triggerType": "mouseover",
	"invoke": 1,
	"auto": 1500
}); //参数进入后 ,处理参数(重点)  new之后 初始化