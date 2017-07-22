(function() {
	var Fullpage = function(fullpage) {
		this.config = {
			selectors: {
				sections: "#sections", //大框
				section: ".section", //小页
				page: "#pages", //分页
				active: ".active" //某页被选中
			}, //html起名
			index: 0, //初始页面
			loop: false, //是否循环播放
			agination: true, //是否分页
			direction: "vertical", //如何显示 horizontal
			callback: null //回调函数
		}
		this.fullpage = fullpage;
		var _this = this //保存当前this
		this.newconfig = this.getConfig() //取得新实例值
		//取得配制参数
		if(this.newconfig == null) {
			this.newconfig = this.config;
		} //若无参数默认为参数
		else {
			for(var Key in this.config) {
				if(this.config.hasOwnProperty(Key) && !(this.newconfig.hasOwnProperty(Key))) {
					this.newconfig[Key] = this.config[Key];
				} //若存在 就变 不存在为默认值
			}
		}
		//获取DOM节点
		this.Doms = this.getDom();
		//设置如何滑动 设置分页 设置页面布局格式
		this.setdirection();
		_this.animating = false;
		_this.disindex(_this); //默认
		//绑定滑动动画
		_this.Doms.sections.animating = false;
		this.bind(document, "mousewheel", function(event) {
			_this.animation(_this, function() {
				if(_this.newconfig.agination == "false") {
					return; //若无分页就返回
				}
				_this.setindex(_this, _this.callback);
				_this.disindex(_this);
			}, event);
		});
		//若分页存在 绑定分页跳转动画
		if(_this.newconfig.agination) {
			for(var i = 0, length = _this.Doms.page.children.length; i < length; i++) {
				(function(num) {
					_this.bind(_this.Doms.page.children[num], "click", function() {
						clearTimeout(_this.tiemr);
						_this.goindex(_this, num, function() {
							_this.setindex(_this, _this.callback);
							_this.disindex(_this);
						})
						if(_this.newconfig.loop) {
							_this.autoPlay(_this);
						}
					});
				})(i);
			}
		}
		_this.onindex(_this);
		_this.timer = null;
		if(_this.newconfig.loop) {
			_this.autoPlay(_this);
		}
	};
	Fullpage.prototype = {
		getConfig: function() {
			//取得
			var config = this.fullpage;
			//确保配置参数
			if(config) {
				return config; //返回人工配制
			} else {
				return null; //人工未配置
			}
		},
		getDom: function() {
			var Doms = {};
			var dom = null;
			var name = this.newconfig.selectors;
			for(var key in name) {
				var cssname = (function() {
					var cssname = name[key];
					var acssname = null;
					if(cssname.split("")[0] == ".") {
						var acssname = cssname.split('.');
						acssname[0] = ".";
					}
					if(cssname.split("")[0] == "#") {
						var acssname = cssname.split('#');
						acssname[0] = "#";
					}
					return acssname;
				})();
				if(cssname[0] == ".") {
					Doms[key] = document.getElementsByClassName(cssname[1]);
				}
				if(cssname[0] == "#") {
					Doms[key] = document.getElementById((cssname[1]));
				}
			}
			return Doms;
		},
		//设置分页 设置页面布局格式
		setdirection: function() {
			if(this.newconfig.direction == "vertical") {
				if(this.newconfig.agination) {
					this.Doms.page.className = "vertical";
					for(var i = 0, length = this.Doms.section.length; i < length; i++) {
						this.Doms.page.children[i].className = "verticals";
					}
				}
			}
			if(this.newconfig.direction == "horizontal") {
				if(this.newconfig.agination) {
					this.Doms.page.className = "horizontal";
				};
				for(var i = 0, length = this.Doms.section.length; i < length; i++) {
					this.Doms.section[i].className = "section left"
					if(this.newconfig.agination) {
						this.Doms.page.children[i].className = "horizontals";
					}
				}
				this.Doms.sections.style.width = 400 + "%";
			}
		},
		fulldown: function(_this, fn) {

			startMove(_this.Doms.sections, {
				top: _this.Doms.sections.offsetTop - _this.Doms.section[0].offsetHeight
			}, fn, 20);
		},
		fullop: function(_this, fn) {
			//判断是否为垂直运动
			startMove(_this.Doms.sections, {
				top: _this.Doms.sections.offsetTop + _this.Doms.section[0].offsetHeight
			}, fn, 20);
		},
		fullright: function(_this, fn) {
			startMove(_this.Doms.sections, {
				left: _this.Doms.sections.offsetLeft - _this.Doms.section[0].offsetWidth
			}, fn, 20);

		},
		fullleft: function(_this, fn) {
			//判断是否为垂直运动
			startMove(_this.Doms.sections, {
				left: _this.Doms.sections.offsetLeft + _this.Doms.section[0].offsetWidth
			}, fn, 20);
		},
		//运动框架函数
		animation: function(_this, fn, event) {
			//判断运动
			if(_this.newconfig.direction == "vertical") {
				if(event.wheelDelta < 0) {
					if(_this.Doms.sections.offsetTop == -(_this.Doms.section.length - 1) * _this.Doms.section[0].offsetHeight) {
						return;
					}
					_this.fulldown(_this, fn);

				} //向下
				if(event.wheelDelta > 0) {
					if(_this.Doms.sections.offsetTop == 0) {
						return;
					}
					_this.fullop(_this, fn);

				} //向上
			} //竖直运动
			else {
				if(event.wheelDelta < 0) {
					if(_this.Doms.sections.offsetLeft == -(_this.Doms.section.length - 1) * _this.Doms.section[0].offsetWidth) {
						return;
					}
					_this.fullright(_this, fn);

				} //向右
				if(event.wheelDelta > 0) {

					if(_this.Doms.sections.offsetLeft == 0) {
						return;
					}
					_this.fullleft(_this, fn);
				} //向左
			} //水平运动
		},
		//绑定事件 （对象,事件,绑定函数）
		bind: function(obj, event, handler) {
			if(obj.addEventListener) {
				obj.addEventListener(event, handler, false);
			} else if(obj.attachEvent) {
				obj.attachEvent("on" + event, handler);
			} else {
				obj["on" + event] = handler;
			}
		},
		//判断当前值 确定当前为第几张  //fn为回调函数
		setindex: function(_this, fn) {
			//判断运动
			if(_this.newconfig.direction == "vertical") {
				if(_this.Doms.sections.offsetTop % _this.Doms.section[0].offsetHeight == 0) {
					_this.newconfig.index = Math.abs(_this.Doms.sections.offsetTop) / _this.Doms.section[0].offsetHeight;
					if(fn) {
						fn();
					}
				} else {
					return;
				}
			} //垂直运动 
			else {
				if(_this.Doms.sections.offsetLeft % _this.Doms.section[0].offsetWidth == 0) {
					_this.newconfig.index = Math.abs(_this.Doms.sections.offsetLeft) / _this.Doms.section[0].offsetWidth;
					if(fn) {
						fn();
					}
				} else {
					return;
				}

			} //水平运动
		},
		disindex: function(_this) {
			var li = _this.Doms.page.getElementsByTagName("li");
			for(var i = 0; i < li.length; i++) {
				li[i].className = _this.newconfig.direction + "s";
			}
			li[_this.newconfig.index].className = _this.newconfig.direction + "s" + " active";
		},
		//进入指定页 fn为回调函数
		goindex: function(_this, index, fn) {
			if(_this.newconfig.direction == "vertical") {
				startMove(_this.Doms.sections, {
					top: -index * _this.Doms.section[0].offsetHeight
				}, fn, 30);
			} else {
				startMove(_this.Doms.sections, {
					left: -index * _this.Doms.section[0].offsetWidth
				}, fn, 25);
			}
			if(fn) {
				fn();
			}
		},
		//调入默认页
		onindex: function(_this) {
			if(_this.newconfig.direction == "vertical") {
				_this.Doms.sections.style.top = -_this.newconfig.index * _this.Doms.section[0].offsetHeight + 'px';
			} else {
				_this.Doms.sections.style.left = -_this.newconfig.index * _this.Doms.section[0].offsetWidth + 'px';
			}
			_this.setindex(_this, null);
			_this.disindex(_this);
		},
		//自动播放
		autoPlay: function(_this) {
			_this.tiemr = setTimeout(function() {
				clearTimeout(_this.tiemr);
				_this.newconfig.index++;
				_this.newconfig.index %= _this.Doms.section.length;
				_this.goindex(_this, _this.newconfig.index, function() {
					_this.setindex(_this, _this.callback);
					_this.disindex(_this);
				});
				console.log("haha");
				setTimeout(arguments.callee, 5000);
			}, 5000);
		}
	};
	window.Fullpage = Fullpage;
})(window);
var fullpage = new Fullpage({
	selectors: {
		sections: "#sections", //大框
		section: ".section", //小页
		page: "#pages", //分页
		active: ".active" //某页被选中
	}, //html起名
	index: 0, //初始页面
	loop: false, //是否循环播放
	//direction: "horizontal", //如何显示 horizontal
	agination: true, //是否分页
	//如何显示
	callback: null //回调函数
});