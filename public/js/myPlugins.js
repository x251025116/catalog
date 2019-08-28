/*自定义事件：
 * 使用方法：
 * 若是dom元素添加事件：cusEvent.addEvent({"dom元素","dom事件名称",fn});
 * 若是添加自定义事件：cusEvent.addEvent({"自定义事件名称",fn});
 * 
 * cusEvent.fireEvent("事件名称(dom事件或者自定义事件)");
 * 
 * 
 * */
var cusEvent = {
	listener: {},
	addEvent: function(ele, type, fn) {
		var len = arguments.length;
		if(len == 2) {
			if(typeof this.listener[arguments[0]] === 'undefined') {
				this.listener[arguments[0]] = [];
			}
			if(typeof arguments[1] === 'function') {
				this.listener[arguments[0]].push(arguments[1]);
			}
		} else if(len == 3) {
			arguments[0].addEventListener(arguments[1], arguments[2], false);
			if(typeof this.listener[arguments[1]] === 'undefined') {
				this.listener[arguments[1]] = [];
			}
			if(typeof arguments[2] === 'function') {
				this.listener[arguments[1]].push(arguments[2]);
			}
		}
		return this;
	},
	fireEvent: function(type) {
		var arr = this.listener[type];
		if(arr instanceof Array) {
			for(var i = 0; i < arr.length; i++) {
				if(typeof arr[i] === 'function') {
					arr[i]({
						type: type
					});
				}
			}
		}
	},
	removeEvent: function(ele, type, fn) {
		var len = arguments.length;
		if(len == 2) {
			var arrayEvent = this.listener[arguments[0]];
			if(typeof arguments[0] === "string" && arrayEvent instanceof Array) {
				if(typeof arguments[1] === "function") {
					for(var i = 0, length = arrayEvent.length; i < length; i++) {
						if(arrayEvent[i] === arguments[1]) {
							this.listener[arguments[0]].splice(i, 1);
							break;
						}
					}
				} else {
					delete this.listener[arguments[0]];
				}
			}
		} else if(len == 3) {
			arguments[0].removeEventListener(arguments[1], arguments[2])
		}
		return this;
	}
};
/*自定义事件结束*/
var myPlugins = {
	//显示加载动画
	loading: {
		showLoading: function() {
			var html = '<div id="Mp_loading">' +
				'    <div class="border">' +
				'        <div class="loadingBox">' +
				'            <div class="outer"></div>' +
				'            <div class="inner"></div>' +
				'        </div>' +
				'    </div>' +
				'</div>';
			$('body').append(html);
			$('#Mp_loading').fadeIn(300);
		},
		//隐藏加载动画
		hideLoading: function() {
			$('#Mp_loading').fadeOut(300, function() {
				$(this).remove()
			});
		},
	},
	toast: {
		timer: null,
		show: function(html, time) {
			var this_ = this;
			time = time || 3000;
			$(".Mp_toast").remove();
			this.timer ? clearTimeout(this.timer) : null;
			$("body").append('<div class="Mp_toast">' +
				'			      <div>' +
				'				      <span class="toast_html">' + html + '</span>' +
				'			      </div>' +
				'		      </div>');

			$(".Mp_toast").fadeIn(300, function() {
				this_.timer = setTimeout(function() {
					this_.hide();
				}, time)
			});
		},
		hide: function() {
			$(".Mp_toast").fadeOut(300, function() {
				$(".Mp_toast").remove();
			});
		}
	},
}

$(document).ajaxStop(function() {

});

/*分页开始*/
/*
 var p = new PageNation({
			url: '1.json',
			ele: document.querySelector("#footer"),
			totalFiled: 'data.total',  //获取数据的总数
				pageFiled: 'pageNum',  //分页page的字段
				sizeFiled: 'pageSize', //分页size的字段
				queryParam: {
					id: $("#realDimId").val(),
					startDate: $("#stime").val(),
					endDate: $("#etime").val(),
				},
				beforLoad: function() {
					showLoading();
				},
			onLoaded: function(data) {
				console.log(data)
			}
		});
		document.querySelector("#a").onclick = function() {
			p.opts.pageNation.page = 1;
			p.opts.pageNation.size = 30;
			p.resetPage();
			p.ajax();
			
		}
 * */
function PageNation(opts) {
	this.uniqueId = 'P' + new Date().getTime() + Math.ceil(Math.random() * 10000);
	this.init(opts);
}

PageNation.prototype = {
	constructor: PageNation,
	init: function(opts) {
		var this_ = this;
		this.opts = opts || {};
		this.totalPage = 0;
		this.pageSize = 30;
		this.opts = this.extend(this.dftSettings(), opts);
		var $ele = $(this.opts.ele);
		$ele.html('<div id=' + this_.uniqueId + ' class="p_pagenation">' +
			'			<div class="p_pager">' +
			'				<div class="p_prev_page"></div>' +
			'					<div class="p_page_items"></div>' +
			'				<div class="p_next_page"></div>' +
			'				<div class="p_detailPage">' +
			'					<span>到第</span>' +
			'					<input type="text" />' +
			'					<span>页</span>' +
			'					<div class="p_toPageSure">确定</div>' +
			'					<div class="p_totalPage"></div>' +
			'					<div class="p_pageSize">' +
			'						<select>' +
			'							<option value="30">30条/页</option>' +
			'							<option value="40">40条/页</option>' +
			'							<option value="50">50条/页</option>' +
			'							<option value="60">60条/页</option>' +
			'						</select>' +
			'					</div>' +
			'				</div>' +
			'			</div>' +
			'		</div>')

		this.ajax();
	},
	dftSettings: function() {
		return {
			url: '',
			pageNation: {
				page: 1,
				activePage: 1,
				size: 30,
				defaultSize: 30,
				total: 0,
				disPlayPage: 7,
			},
			disPlayPage: 0,
			filedName: 'rows',
			totalFiled: 'total',
			pageFiled: 'page',
			sizeFiled: 'size',
			ele: null,
			type: 'post',
			simpleModel: false,
			queryParam: {

			},
			beforLoad: function() {

			},
			onLoaded: function() {

			},
		}
	},
	ajax: function(data) {
		var this_ = this;
		this_.opts.beforLoad(data);
		var page = this_.opts.pageFiled;
		var size = this_.opts.sizeFiled;
		this_.opts.queryParam = data ? data : this_.opts.queryParam;
		this.opts.queryParam[page] = this.opts.pageNation.page;
		this.opts.queryParam[size] = this.opts.pageNation.size;
		this.removeEvents();
		this.addEvents();
		$.ajax({
			url: this_.opts.url,
			type: this_.opts.type,
			dataType: "json",
			data: this_.opts.queryParam,
		}).done(function(data) {
			var total = eval('data.' + this_.opts.totalFiled);
			this_.totalPage = Math.ceil(total / this_.opts.pageNation.size);
			this_.opts.pageNation.total = total;
			this_.render();
			this_.opts.onLoaded(data);
		}).fail(function() {

		}).always(function() {

		});
	},
	queryParam: function() {

	},
	resetPage: function() {
		this.opts.pageNation.activePage = 1;
		this.opts.pageNation.page = 1;
	},
	render: function() {
		var this_ = this;
		var $ele = $(this.opts.ele);
		/*var a = `
		<div class="p_pagenation">
			<div class="p_pager">
				<div class="p_prev_page"></div>
				<div class="p_page_items">
					<div class="p_page_item">1</div>
					<div class="p_page_item">2</div>
					<div class="p_page_item">3</div>
				</div>
				<div class="p_next_page"></div>
			</div>
		</div>`*/

		var len = this.totalPage;
		if(this_.opts.simpleModel) {
			var pageItems = '';
			this_.opts.pageNation.activePage = Number(this_.opts.pageNation.activePage);
			pageItems = '<div class="p_page_item p_page_item_ac">' + this_.opts.pageNation.page + '</div>';
		} else {
			var disPlayPage = this_.opts.disPlayPage == 0 ? this_.opts.pageNation.disPlayPage : this_.opts.disPlayPage;
			disPlayPage = disPlayPage > len ? len : disPlayPage;
			var centerPageNum = disPlayPage - 2;
			var centerActive = Math.ceil(centerPageNum / 2);
			var pageItems = '';
			if(len == 0) {

			} else if(len <= centerPageNum) {
				for(var i = 0; i < len; i++) {
					pageItems += '<div class="p_page_item" data-id=page' + (i + 1) + '>' + (i + 1) + '</div>';
				};
			} else if(len > centerPageNum) {
				pageItems += '<div class="p_page_item" data-id=page1>1</div>';
				this_.opts.pageNation.activePage = Number(this_.opts.pageNation.activePage);
				var forStart = this_.opts.pageNation.activePage;

				forStart = forStart < centerPageNum ? 1 : forStart;
				if(forStart > centerActive && forStart < len - centerPageNum) {
					for(var i = forStart; i < len; i++) {
						if(i < forStart + centerPageNum) {
							pageItems += '<div class="p_page_item" data-id=page' + (i - 2) + '>' + (i - 2) + '</div>';
						} else if(i == len - 1) {
							pageItems += '<div class="p_page_item" data-id=page' + (i + 1) + '>' + (i + 1) + '</div>';
						}
					};
				} else if(forStart >= len - centerPageNum) {
					for(var i = len - centerPageNum; i <= len; i++) {
						pageItems += '<div class="p_page_item" data-id=page' + i + '>' + i + '</div>';
					};
				} else {
					for(var i = forStart; i < len; i++) {
						if(i < forStart + centerPageNum) {
							pageItems += '<div class="p_page_item" data-id=page' + (i + 1) + '>' + (i + 1) + '</div>';
						} else if(i == len - 1) {
							pageItems += '<div class="p_page_item" data-id=page' + (i + 1) + '>' + (i + 1) + '</div>';
						}
					};
				}
			};
		};
		$("#" + this_.uniqueId).find(".p_page_items").html('').append(pageItems);
		$("#" + this_.uniqueId).find(".p_totalPage").html('共' + this_.opts.pageNation.total + '条');
		$("#" + this_.uniqueId).find(".p_pageSize select option[value=" + this_.opts.pageNation.size + "]").attr("selected", "true");
		$("#" + this_.uniqueId).find("[data-id=page" + this.opts.pageNation.activePage + "]").addClass('p_page_item_ac').siblings().removeClass('p_page_item_ac');
	},
	addEvents: function() {
		var this_ = this;
		console.log(this)
		$(document).on('click', '#' + this_.uniqueId + ' .p_prev_page', function() {
			if(this_.opts.pageNation.activePage == 1) { //上一页
				return;
			} else {
				--this_.opts.pageNation.activePage;
				--this_.opts.pageNation.page;
				this_.ajax();
			}
		});

		$(document).on('click', '#' + this_.uniqueId + ' .p_next_page', function() { //下一页
			if(this_.opts.pageNation.activePage == this_.totalPage) {
				return
			} else {
				++this_.opts.pageNation.page;
				++this_.opts.pageNation.activePage;
				this_.ajax();
			}
		});

		$(document).on('click', '#' + this_.uniqueId + ' .p_page_item', function() { //点击具体的页数
			if(this_.opts.pageNation.activePage == $(this).html()) {
				return
			} else {
				this_.opts.pageNation.activePage = $(this).html();
				this_.opts.pageNation.page = $(this).html();
				this_.ajax();
			}
		});

		$(document).on('click', '#' + this_.uniqueId + ' .p_toPageSure', function() { //点击确定触发的函数
			var val = $('#' + this_.uniqueId + ' .p_detailPage input').val();
			if(val == '') {
				return
			} else if(val < 1) {
				return;
			} else if(val > this_.totalPage) {
				return;
			};
			this_.opts.pageNation.activePage = val;
			this_.opts.pageNation.page = val;
			this_.ajax();
		});

		$(document).on('change', '#' + this_.uniqueId + ' .p_pageSize select', function() { //改变每一页的页码
			var val = $(this).val();
			this_.opts.pageNation.size = val;
			this_.resetPage();
			this_.ajax();

		});

	},
	removeEvents: function() {
		var this_ = this
		$(document).off('click', '#' + this_.uniqueId + ' .p_page_item');
		$(document).off('change', '#' + this_.uniqueId + ' .p_pageSize select');
		$(document).off('click', '#' + this_.uniqueId + ' .p_next_page');
		$(document).off('click', '#' + this_.uniqueId + ' .p_prev_page');
		$(document).off('click', '#' + this_.uniqueId + ' .p_toPageSure');
	},
	extend: function(a, b) {
		for(var i in b) {
			a[i] = b[i]
		};
		return a
	}
}
/*分页结束*/

/*模糊搜索*/
//使用方法；
//若要获取value值，请使用realValue
//data的数据格式为[{name:"name",id:"xxx"},{name:"xxx",id:"id"}];要为字符串
//有url 的时候 保证字段为 rows:[]
/*var s = new UtilSearch("#i1", {
	data: arr,
	url:...   //有url优先使用url
	txt: "username",
	val: "userid"
});*/

function UtilSearch(id, opts) {
	this.el = document.querySelector(id);
	this.opts = this.extend(this.dftSettings(), opts);
	this.init();
}

UtilSearch.prototype = {
	constructor: UtilSearch,

	init: function() {
		this.settings = this.dftSettings();
		var this_ = this;
		this.el.onclick = function(e) {
			e.stopImmediatePropagation();
			this_.el_click();
		};

		this.el.oninput = function(e) {
			this_.appendEle();
		}

		this.el.onblur = function() {
			setTimeout(function() {
				if(this_.oDiv) {
					this_.oDiv.remove();
				}
			}, 150)
		}
		document.addEventListener("click", function() {
			this.oDiv ? this.oDiv.remove() : null
		});
	},
	dftSettings: function() {
		return {
			url: '',
			dimKey: this.el.value,
			liClass: '',
			ulClass: '',
			divClass: '',
			txt: 'text',
			val: 'value',
			queryField: 'key',
			postParam: {},
			resArr: 'rows',
			styles: '',
			data: [],
			row: '',
			fn: function(r) {

			}
		}
	},
	extend: function(a, b) { //用于配置参数用的函数，没有配置则使用原始配置，有则使用用户配置。 b为用户需要设置的对象；
		for(var i in b) {
			a[i] = b[i]
		}
		return a;
	},
	appendEle: function() {
		var lis = '';
		var oUl = document.createElement("ul");
		oUl.setAttribute("class", this.opts.ulClass);
		if(this.opts.url) { //ajax请求数据；
			var data_ = this.opts.postParam;
			data_[this.opts.queryField] = this.el.value;
			if(!this.el.value) {
				return;
			}
			$.ajax({
				url: this.opts.url,
				type: "post",
				dataType: "json",
				data: data_,
			}).done(function(data) {
				if(data.info == "查询成功!") {
					oUl.innerHTML = '';
					var rows = data[this.opts.resArr],
						txt = this.opts.txt,
						val = this.opts.val
					for(var i = 0, len = rows.length; i < len; i++) {
						var row = rows[i];
						if(!row[txt]) {
							continue;
						};
						lis += '<li class="search_li ' + this.opts.liClass + '" value="' + row[val] + '">' + row[txt] + '</li><div style="display:none">' + JSON.stringify(row) + '</div>';
					};
					if(lis) {
						oUl.innerHTML = lis;
						this.oDiv.innerHTML = '';
						this.oDiv.appendChild(oUl);
					} else {
						this.oDiv.innerHTML =
							'<p style="text-align: center;font-size: 15px; margin:10px" class="utils_no_match">无匹配内容...</p>';
					}
					document.body.appendChild(this.oDiv);
					var liArr = document.querySelectorAll(".search_li");
					var liArr_len = liArr.length;
					var this_ = this;
					if(liArr_len) {
						for(var i = 0; i < liArr_len; i++) {
							liArr[i].onclick = function(e) {
								e.stopImmediatePropagation();
								this_.oDiv.remove();
								this_.oDiv = null;
								this_.el.value = this.innerHTML;
								this_.opts.row = JSON.parse(this.nextSibling.innerHTML);
								this_.el.realValue = this.getAttribute("value");
								this_.opts.fn(this_.el.value);
							}
						}
					}
				}

			}.bind(this));
		} else { //本地数据

			if(this.el.value == '') {
				//var oUl = document.createElement("ul");
				oUl.innerHTML = '';
				for(var i = 0, len = this.opts.data.length; i < len; i++) {
					var row = this.opts.data[i],
						txt = this.opts.txt,
						val = this.opts.val;
					if(!row[txt]) {
						continue;
					}
					if(row[txt].indexOf(this.el.value) > -1) {
						lis += '<li class="search_li ' + this.opts.liClass + '" value="' + row[val] + '">' + row[txt] + '</li><div style="display:none">' + JSON.stringify(row) + '</div>';
					};
				};
			} else if(this.el.value != '') {
				for(var i = 0, len = this.opts.data.length; i < len; i++) {
					var row = this.opts.data[i],
						txt = this.opts.txt,
						val = this.opts.val;
					if(!row[txt]) {
						continue;
					}
					if(row[txt].indexOf(this.el.value) > -1) {
						lis += '<li class="search_li ' + this.opts.liClass + '" value="' + row[val] + '">' + row[txt] + '</li><div style="display:none">' + JSON.stringify(row) + '</div>';
					} else {

					}
				};
			};
			if(lis) {
				oUl.innerHTML = lis;
				this.oDiv.innerHTML = '';
				this.oDiv.appendChild(oUl);
			} else {
				this.oDiv.innerHTML = '<p style="text-align: center;font-size: 15px;" class="utils_no_match">无匹配内容...</p>';
			}
			document.body.appendChild(this.oDiv);
			var liArr = document.querySelectorAll(".search_li");
			var liArr_len = liArr.length;
			var this_ = this;
			if(liArr_len) {
				for(var i = 0; i < liArr_len; i++) {
					liArr[i].onclick = function(e) {
						e.stopImmediatePropagation();
						this_.oDiv.remove();
						this_.oDiv = null;
						this_.el.value = this.innerHTML;
						this_.opts.row = JSON.parse(this.nextSibling.innerHTML);
						this_.el.realValue = this.getAttribute("value");
						this_.opts.fn(this_.opts.row);
					}
				}
			}
		}
	},
	el_click: function() {
		if(this.oDiv) {
			this.oDiv.remove();
			this.oDiv = null;
		};
		this.oDiv = document.createElement("div");
		var el_top, el_left, el_width, el_height, el_op_position;
		el_width = this.el.offsetWidth;
		el_height = this.el.offsetHeight;
		el_left = this.el.getBoundingClientRect().left;
		//el_top = this.el.offsetTop + el_height;
		el_top = this.el.getBoundingClientRect().bottom;

		this.opts.top ? el_top += this.opts.top : null

		el_op_position = getComputedStyle(this.el.offsetParent).position;

		var border = '1px solid #ccc';
		var background = 'white';
		var zIndex = 999;
		var maxHeight = "260px";

		if(this.opts.divClass) {
			this.oDiv.setAttribute("class", this.opts.divClass);
		}

		if(el_op_position == "fixed" || el_op_position == "absolute") {
			this.oDiv.style.cssText =
				'border:' + border + ';background:' + background + ';max-height:' + maxHeight + ';z-index:' + zIndex + ';overflow:auto;position: fixed;width: ' + el_width + 'px;left:' + el_left + 'px;top: ' + el_top + 'px;'
		} else {
			this.oDiv.style.cssText =
				'border:' + border + ';background:' + background + ';max-height:' + maxHeight + ';z-index:' + zIndex + ';overflow:auto;position: absolute;width: ' + el_width + 'px;left:' + el_left + 'px;top: ' + el_top + 'px;'
		}
		this.txt = this.opts.text;
		this.val = this.opts.value;
		var oUl = document.createElement("ul");
		this.appendEle();
	}
}

/*模糊查询结束*/

/*拖动插件*/
/*
 var d = new Drag(document.querySelector("#d"),{
			titleMode:false,//默认false，若设置为true，则只能拖动.title的元素来移动。  （.title元素只能是直接子代）;
			limitMode: false, //默认为false，若设置为true，则不能拖出边框。
		});
 * 
 * 
 * */

function Drag(ele, opts) {
	var this_ = this;
	this.dx = 0;
	this.dy = 0;
	this.ele = ele;
	this.$ele = $(ele);
	this.opts = this.extend(this.dftSettings(), opts);
	this.isMobile = this.isMobile();
	this.init();
	if(this.isMobile) {
		cusEvent.addEvent(ele, 'touchstart', function(e) {
			this_.fnDown(e)
		});
	} else {
		cusEvent.addEvent(ele, 'mousedown', function(e) {
			this_.fnDown(e)
		});
	}

}

Drag.prototype = {
	constructor: Drag,

	extend: function(a, b) {
		for(var i in b) {
			a[i] = b[i]
		};
		return a
	},
	dftSettings: function() {
		return {
			titleMode: false,
			limitMode: false,
			fnDown: function() {

			},
		}
	},

	init: function() {

	},

	on: function(type, fn) {

	},

	fnDown: function(e) {
		var this_ = this;
		e.preventDefault();
		this.dx = e.clientX - this.ele.offsetLeft;
		this.dy = e.clientY - this.ele.offsetTop;

		isNaN(this.dx) ? this.dx = e.touches[0].pageX - this.ele.offsetLeft : '';
		isNaN(this.dy) ? this.dy = e.touches[0].pageY - this.ele.offsetTop : '';

		if(this.opts.titleMode) {
			if(this.$ele.children('.drag_title').length == 0) return;
			var bottom = this.$ele.children('.drag_title').position().top + this.$ele.children('.drag_title').height();
			var top = bottom - this.$ele.children('.drag_title').height()
			if(this.dy > bottom || this.dy < top) {
				return
			}
		};
		if(this.isMobile) {
			document.ontouchmove = function(e) {
				this_.fnMove(e);
			};
			document.ontouchend = function(e) {
				this_.fnUp(e);
			};
		} else {
			document.onmousemove = function(e) {
				this_.fnMove(e);
			};
			document.onmouseup = function(e) {
				this_.fnUp(e);
			};
		}

	},
	fnMove: function(e) {
		e.preventDefault();
		//e.touches[0].pageY
		var ww = window.innerWidth,
			wh = window.innerHeight,
			ofh = this.ele.offsetHeight,
			ofw = this.ele.offsetWidth,
			moveX = e.clientX,
			moveY = e.clientY;

		moveX == undefined ? moveX = e.touches[0].pageX : '';
		moveY == undefined ? moveY = e.touches[0].pageY : '';

		var l = moveX - this.dx;
		var t = moveY - this.dy;
		var b = t + ofh;
		var r = l + ofw;

		if(this.opts.limitMode) {
			l < 0 ? this.ele.style.left = 0 + 'px' : this.ele.style.left = l + 'px';
			r > ww ? this.ele.style.left = (ww - ofw) + 'px' : null;
			t < 0 ? this.ele.style.top = 0 + 'px' : this.ele.style.top = t + 'px';
			b > wh ? this.ele.style.top = (wh - ofh) + 'px' : null;
		} else {
			this.ele.style.left = l + 'px';
			this.ele.style.top = t + 'px';
		}
	},
	fnUp: function(e) {
		e.preventDefault();
		if(this.isMobile) {
			document.ontouchmove = null;
			document.ontouchend = null;
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}

	},
	isMobile: function() {
		if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			return true
		} else {
			return false
		}
	},

}
/*拖动插件结束*/

/*图片压缩*/
/*var cc = new Compress(document.querySelector("#f"), {
	quality: 0.5,
	width:300,
	height:300,
	fn: function() {
		console.log(this.files)
		this_.imgs = [];未压缩的图片数据数组；
		this.base64   // 压缩过后的base64数据数组；
	}
});*/
function Compress(ele, opts) {
	var this_ = this;
	this.init(opts);
	if(ele.files[0]) { //当传入的ele是已经选择了文件的对象执行；
		var fileReader = new FileReader();
		this_.imgs = [];
		this_.base64 = [];
		this_.files = [];
		this_.render(fileReader, ele.files, 0);
		return;
	}
	ele.onchange = function() {
		var fileReader = new FileReader();
		this_.imgs = [];
		this_.base64 = [];
		this_.files = [];
		this_.render(fileReader, this.files, 0);
	}
};

Compress.prototype = {
	constructor: Compress,

	init: function(opts) {
		this.imgs; //未压缩的图片数据数组；
		this.base64; //压缩过后的base64数据数组；
		this.files; //文件对象，包含文件的名称，修改日期等信息；
		this.opts = opts || {};
		this.opts = this.extend(this.dftSettings(), opts);
	},

	dftSettings: function() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		return {
			quality: 1, //图片压缩质量，最大为1，    0.2,  0.1....
			width: width, //默认图片压缩为设备的宽度（主要是手机端）
			height: height, //默认图片压缩为设备的高度（主要是手机端）
			fn: function() {}, //图片加载完成之后执行的函数，this.imgs表示未压缩的数据，this.base64是压缩过后的base64数据，this.files：文件对象，包含文件的名称，修改日期等信息；。
		}
	},

	render: function(fileReader, files, i) {
		var this_ = this;
		if(files[i]) {
			fileReader.readAsDataURL(files[i]);
			fileReader.onload = function() {
				var oImg = new Image();
				oImg.src = fileReader.result;
				this_.files.push(files[i]);
				this_.imgs.push(fileReader.result);
				oImg.onload = function() {
					var scale = (oImg.width / oImg.height); //长宽比例；
					this_.opts.width = oImg.width;
					this_.opts.height = oImg.height;
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					canvas.width = this_.opts.width;
					canvas.height = this_.opts.height;
					ctx.drawImage(oImg, 0, 0, canvas.width, canvas.height);
					var base64 = canvas.toDataURL('image/jpeg', this_.opts.quality);
					this_.base64.push(base64);
					this_.render(fileReader, files, ++i);
				}
			};
		} else {
			this_.opts.fn.call(this_); //数据加载完成后执行的函数。
		}
	},
	extend: function(a, b) {
		for(var i in b) {
			a[i] = b[i]
		};
		return a
	}
}
/*图片压缩结束*/

/*checkbox
 var a = new Checkbox($("#tt"),function (){
		
});
 * 
 * */

function Checkbox($ele, callback) {
	$ele = $($ele);
	if(!$ele[0]) {
		return
	};
	this.$ele = $ele;
	this.callback = callback;
	this.$ele.addClass('Mp_checkbox');
	if(this instanceof Checkbox) {
		this.init($ele, callback);
	} else {
		return new Checkbox($ele, callback);
	}
};

Checkbox.prototype = {
	construcor: Checkbox,
	init: function() {
		var this_ = this;
		this.$ele.append('<div class="slider"></div><input type="checkbox" class="real_checkbox" />');
		this.$ele.click(function() {
			this_.$ele.toggleClass('Mp_checkbox_ac');
			var isChecked = this_.$ele.hasClass('Mp_checkbox_ac');
			//this_.$ele.children('.slider').toggleClass('slider_ac');
			var realCheckbox = this_.$ele.children('.real_checkbox')[0];
			isChecked ? realCheckbox.checked = true : realCheckbox.checked = false;
			this_.callback ? this_.callback(isChecked) : null;
			return realCheckbox.checked;
		});
	},
	getStatus: function() {
		var realCheckbox = this.$ele.children('.real_checkbox')[0];
		this.isCheck = realCheckbox.checked
		return realCheckbox.checked;
	},
	setStatus: function(isCheck) {
		this.callback ? this.callback(isCheck) : null;
		if(!isCheck) {
			this.$ele.removeClass('Mp_checkbox_ac');
			var realCheckbox = this.$ele.children('.real_checkbox')[0];
			realCheckbox.checked = false;
			return realCheckbox.checked;
		} else {
			this.$ele.addClass('Mp_checkbox_ac');
			var realCheckbox = this.$ele.children('.real_checkbox')[0];
			realCheckbox.checked = true;
			return realCheckbox.checked;
		}
	},
}
/*checkbox结束*/

/*****************图片缩略图*****************/
/*
 var thb = new Thumbnail(document.querySelector("#thb"), {
			onlyImg: false,
			thumbnailClass: 'thbClass', //每个缩略图的样式
			thbImgEleClass: 'img',
			imgFullMode: false,
		});
		$("#button1").click(function() {
			console.log(thb1.filesIfon);
		});
 * */
function Thumbnail(ele, opts) {
	this.ele = ele;
	this.$ele = $(ele);
	this.filesIfon = [];
	this.fileType = {
		ppt: 'thumbnail_ppt',
		doc: 'thumbnail_word',
		txt: 'thumbnail_txt',
		pdf: 'thumbnail_pdf',
		zip: 'thumbnail_zip',
		xls: 'thumbnail_excel',
		other: 'thumbnail_other',
	}
	this.dftSettings = {
		limitImg: 4,
		compress: false, //是否压缩
		quality: 0.5, //压缩质量
		multiple: true, //文件可否多选,
		onlyImg: true, // 是否只能选择图片；
		imgFullMode: false, //图片是否填满容器
		thumbnailClass: '', //
		thbImgEleClass: '', //
		fn: function() {

		},
	}
	this.opts = opts ? this.extend(this.dftSettings, opts) : this.extend(this.dftSettings, {});
	if(this.opts.onlyImg) {
		if(this.opts.multiple) {
			this.inputEle = '<input type="file" class="thumbnail_input" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" multiple="multiple"/>'
		} else {
			this.inputEle = '<input class="thumbnail_input" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/>'
		}
	} else {
		if(this.opts.multiple) {
			this.inputEle = '<input type="file" class="thumbnail_input" multiple="multiple"/>'
		} else {
			this.inputEle = '<input class="thumbnail_input" type="file"/>'
		}
	}

	this.init();
};
Thumbnail.prototype = {
	constructor: Thumbnail,
	extend: function(a, b) {
		for(var i in b) {
			a[i] = b[i]
		};
		return a
	},
	dftComponent: function() {
		var this_ = this;
		var str = '<div class="thumbnail_div thumbnail_div_dft add_dataImg ' + this.opts.thumbnailClass + '">' + this.inputEle +
			'			<div class="thumbnail_img">' +
			'				<img src="" />' +
			'			</div>' +
			'           <div class="thumbnail_mask"></div>' +
			'			<div class="thumbnail_delete">' +
			'				<i class="thumbnail_close"></i>' +
			'			</div>' +
			'			<div class="thumbnail_base64"></div>' +
			'		</div>'

		this.$ele.append(str);

		this.$ele.find('.thumbnail_input').on('change', function(e) {
			var files = e.target.files
			var $ele = $(this);
			if(files.length + this_.filesIfon.length > this_.opts.limitImg) return
			var fileReader = new FileReader();
			if(files[0]) { //当传入的ele是已经选择了文件的对象执行；
				this_.render(fileReader, files, 0);
			} else {
				this_.render(fileReader, files, 0);
			}
		})
		return str
	},
	setComponent: function(str, imgSrc, fileName, imgClass) {
		var FullMode = this.opts.imgFullMode ? 'thumbnail_img_full' : ''
		var str = '<div class="thumbnail_div ' + this.opts.thumbnailClass + '">' + str +
			'			<div class="thumbnail_img ' + imgClass + '">' +
			'				<img class="' + FullMode + '" src="' + imgSrc + '" />' +
			'			</div>' +
			'           <div class="thumbnail_mask"></div>' +
			'			<div class="thumbnail_delete" title="' + fileName + '" >' +
			'				<i class="thumbnail_close"></i>' +
			'			</div>' +
			'           <div class="thumbnail_file_name">' + fileName + '</div>' +
			'			<div class="thumbnail_base64"></div>' +
			'		</div>'
		return str;
	},
	init: function() {
		var this_ = this;
		if(!this.ele) {
			return
		};
		this.$ele.html('');
		this.dftComponent();

		/*	$(document).on('change', this.$ele.find('.thumbnail_input'), function(e) {
				console.log(2)
				var files = e.target.files
				var $ele = $(this);
				if(this_.filesIfon.length > this_.opts.limitImg) return;
				var fileReader = new FileReader();
				if(files[0]) { //当传入的ele是已经选择了文件的对象执行；
					this_.render(fileReader, files, 0);
				} else {
					this_.render(fileReader, files, 0);
				}
			})*/

	},
	resetThumbnail: function() {
		this.filesIfon = [];
		this.files = [];
		this.$ele.html('');
		this.dftComponent();
	},
	onChange: function() {
		var this_ = this;
	},
	render: function(fileReader, files, i) {
		var this_ = this;
		if(files[i]) {
			fileReader.readAsDataURL(files[i]);
			fileReader.onload = function() {

				if(this_.getSuffix(files[i].name) == 'img') { //判断格式为图片；
					var oImg = new Image();
					oImg.src = fileReader.result;
					for(var j = 0; j < this_.filesIfon.length; j++) {
						var row = this_.filesIfon[j];
						if(row.fileName == files[i].name) { //判断文件名重复；
							alert('请勿选择相同的文件');
							return;
						}
					}
					oImg.onload = function() {
						var scale = (oImg.width / oImg.height); //长宽比例；
						this_.opts.width = this_.opts.width ? this_.opts.width : oImg.width;
						this_.opts.height = this_.opts.height ? this_.opts.height : oImg.height;
						var canvas = document.createElement('canvas');
						var ctx = canvas.getContext('2d');
						canvas.width = this_.opts.width;
						canvas.height = this_.opts.height;
						ctx.drawImage(oImg, 0, 0, canvas.width, canvas.height);
						var base64 = canvas.toDataURL('image/jpeg', this_.opts.quality);
						this_.filesIfon.unshift({
							files: files[i], //文件对象
							fileName: files[i].name, //文件的名称
							imgSrc: fileReader.result, //文件未压缩的数据
							base64: base64, //文件压缩后的数据
						});
						this_.render(fileReader, files, ++i);
					}

				} else {
					this_.filesIfon.unshift({
						files: files[i], //文件对象
						fileName: files[i].name, //文件的名称
					});
					this_.render(fileReader, files, ++i);
				}

			};
		} else {
			var len = this.filesIfon.length;

			if(len > this.opts.limitImg) {
				return;
			}
			this.$ele.html('');
			for(var i = 0; i < len; i++) {
				var suffix = this.getSuffix(this.filesIfon[i].fileName)
				if(suffix == 'img') {
					this.$ele.prepend(this.setComponent('', this.filesIfon[i].imgSrc, this.filesIfon[i].fileName, this.opts.thbImgEleClass));
				} else {
					this.$ele.prepend(this.setComponent('', '', this.filesIfon[i].fileName, this.fileType[suffix]));
				}

			};
			this_.isoverLimit();
			this_.opts.fn.call(this_); //数据加载完成后执行的函数。

			this_.$ele.find('.thumbnail_close').click(function() {
				var index = $(this).parents('.thumbnail_div').index();
				var html_imgName = $(this).parent().next().html();
				$(this).parents('.thumbnail_div').remove();
				for(var j = 0; j < this_.filesIfon.length; j++) {
					var fileName = this_.filesIfon[j].fileName;
					if(fileName == html_imgName) {
						this_.filesIfon.splice(j, 1);
						this_.isoverLimit();
						return;
					}
				}
			});
			this_.$ele.find('.thumbnail_div').dblclick(function() {
				alert(2)
			});
		}
	},
	isoverLimit: function() {
		if(this.filesIfon.length == this.opts.limitImg) {

		} else { //小于文件限制数量。
			if(this.$ele.find('.thumbnail_div_dft').length == 0) {
				this.dftComponent();
			} else {

			}
		}
	},
	getSuffix: function(fileName) { //获取文件的后缀名称
		if(!fileName) return;
		var suffix = fileName.slice(fileName.lastIndexOf('.'));
		suffix = suffix.toLowerCase();
		if(suffix == '.png' || suffix == '.jpg' || suffix == '.jpeg' || suffix == '.gif' || suffix == '.svg') {
			return 'img'
		} else if(suffix == '.txt') {
			return 'txt'
		} else if(suffix == '.doc') {
			return 'doc'
		} else if(suffix == '.docx') {
			return 'doc'
		} else if(suffix == '.xls') {
			return 'xls'
		} else if(suffix == '.xlsx') {
			return 'xls'
		} else if(suffix == '.ppt') {
			return 'ppt'
		} else if(suffix == '.zip' || suffix == '.rar') {
			return 'zip'
		} else if(suffix == '.pdf') {
			return 'pdf'
		} else {
			return 'other'
		}
	},
	getData: function() {
		return {
			filseArr: this.filse,
			imgArr: this.imgArr,
			imgBase64Arr: this.imgBase64Arr,
		}
	},
	compress: function($ele) {

	},
}
/***************图片缩略图结束********************/
/********************************************************html类型的插件***********************************************************************/
/*
 * html
 <div id="show_all_con" class="Mp_checkbox">
	<div class="slider"></div>
	<input id="real_checkbox" type="checkbox" class="real_checkbox" />
 </div>

	getCheckBoxValue($("#show_all_con"), 'notCheck');
 * */
//点击滑块触发的事件；