// obj:运动对象，json:运动物体运动{attr,iTarget},fn:回调函数，time:运动时间快慢
function startMove(obj, json, fn, time) {
	obj.flag = false; //标志运动完成
	if(obj.anmating==true){
		return ;
	}
	clearTimeout(obj.timer);
	obj.anmating=true;
	obj.timer = setTimeout(
		function() {
			for(var attr in json) {
				var icur = 0;
				if(attr == 'opacity') {
					icur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
				} else {
					icur = parseInt(getStyle(obj, attr));
				}
				var speed = (json[attr] - icur) / 8;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				if((icur == json[attr])){
					obj.flag = true;
				}
				if(attr == 'opacity') {
					obj.style.filter = 'alpha(opacity:' + (icur + speed) + ')';
					obj.style.opacity = (icur + speed) / 100;

				} else {
					obj.style[attr] = icur + speed + 'px';
				}
				if(obj.flag) {
					clearTimeout(obj.timer);
					if(fn) {
						fn();
					}
					obj.anmating=false;
					return ;
				}
			}
			setTimeout(arguments.callee,time);
		}, time);
}

function getStyle(obj, attr) { //获取样式封装函数
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}