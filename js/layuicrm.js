layui.define(['element', 'layer', 'jquery'], function(exports) {
	var element = layui.element;
	var $ = layui.jquery;
	var layer = layui.layer;
	layuicrm = new function() {
		this.config = function(name) {

			var config = {
				urlHashLocation: true, // URL地址hash定位
				urlSuffixDefault: true, // URL后缀
				BgColorDefault: 0, // 默认皮肤（0开始）
				checkUrlDefault: false, // 是否判断URL有效
			};

			if (name == undefined) {
				return config;
			} else {
				return config[name];
			}
		};
		this.InitMenu = function(url) {
			$.getJSON(url, function(result) {
				var leftMenuHtml = '';
				window.menuParameId = 1;
				leftMenuHtml += '<ul class="layui-nav layui-nav-tree layui-left-nav-tree">\n';
				$.each(result.root, function(index, menu) {
					leftMenuHtml += '<li class="layui-nav-item">\n';
					if (menu.child != undefined && menu.child != []) {
						leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + menu.icon +
							'"></i><span class="layui-left-nav"> ' + menu.title + '</span> </a>';
						var buildChildHtml = function(html, child, menuParameId) {
							html += '<dl class="layui-nav-child">\n';
							$.each(child, function(childIndex, childMenu) {
								html += '<dd>\n';
								if (childMenu.child != undefined && childMenu.child != []) {
									html += '<a href="javascript:;" class="layui-menu-tips" ><i class="' + childMenu.icon +
										'"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>';
									html = buildChildHtml(html, childMenu.child, menuParameId);
								} else {
									html += '<a href="javascript:;" class="layui-menu-tips" data-type="tabAdd"  data-tab-mpi="m-p-i-' +
										menuParameId + '" data-tab="' + childMenu.href + '" target="' + childMenu.target + '"><i class="' +
										childMenu.icon + '"></i><span class="layui-left-nav"> ' + childMenu.title + '</span></a>\n';
									menuParameId++;
									window.menuParameId = menuParameId;
								}
								html += '</dd>\n';
							});
							html += '</dl>\n';
							return html;
						};
						leftMenuHtml = buildChildHtml(leftMenuHtml, menu.child, menuParameId);
					} else {
						leftMenuHtml += '<a href="javascript:;" class="layui-menu-tips"  data-type="tabAdd" data-tab-mpi="m-p-i-' +
							menuParameId + '" data-tab="' + menu.href + '" target="' + menu.target + '"><i class="' + menu.icon +
							'"></i><span class="layui-left-nav"> ' + menu.title + '</span></a>\n';
						menuParameId++;
					}
					leftMenuHtml += '</li>\n';
				});
				leftMenuHtml += '</ul>\n';
				$('.layui-left-menu').html(leftMenuHtml);
				element.init();
			});
		};

		this.addTab = function(tabId, href, title, addSession) {
			if (addSession == undefined || addSession == true) {
				var layuicrmTabInfo = JSON.parse(sessionStorage.getItem("layuicrmTabInfo"));
				if (layuicrmTabInfo == null) {
					layuicrmTabInfo = {};
				}
				layuicrmTabInfo[tabId] = {
					href: href,
					title: title
				}
				sessionStorage.setItem("layuicrmTabInfo", JSON.stringify(layuicrmTabInfo));
			}
			element.tabAdd('layuicrmTab', {
				title: title + '<i data-tab-close="" class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
					,
				content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>',
				id: tabId
			});
		};

		this.checkTab = function(tabId, isIframe) {
			// 判断选项卡上是否有
			var checkTab = false;
			if (isIframe == undefined || isIframe == false) {
				$(".layui-tab-title li").each(function() {
					checkTabId = $(this).attr('lay-id');
					if (checkTabId != null && checkTabId == tabId) {
						checkTab = true;
					}
				});
			} else {
				parent.layui.$(".layui-tab-title li").each(function() {
					checkTabId = $(this).attr('lay-id');
					if (checkTabId != null && checkTabId == tabId) {
						checkTab = true;
					}
				});
			}
			if (checkTab == false) {
				return false;
			}

			// 判断sessionStorage是否有
			var layuicrmTabInfo = JSON.parse(sessionStorage.getItem("layuicrmTabInfo"));
			if (layuicrmTabInfo == null) {
				layuicrmTabInfo = {};
			}
			var check = layuicrmTabInfo[tabId];
			if (check == undefined || check == null) {
				return false;
			}
			return true;
		};

		this.checkUrl = function(url) {
			
			var msg = true;
			$.ajax({
				url: url,
				type: 'get',
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				async: false,
				error: function(xhr, textstatus, thrown) {
					msg = 'Status:' + xhr.status + '，' + xhr.statusText + '，请稍后再试！';
				}
			});
			return msg;
		};
		/**
		 * 成功
		 * @param title
		 * @returns {*}
		 */
		this.msg_success = function (title) {
		    return layer.msg(title, {icon: 1, shade: this.shade, scrollbar: false, time: 2000, shadeClose: true});
		};
		
		/**
		 * 失败
		 * @param title
		 * @returns {*}
		 */
		this.msg_error = function (title) {
		    return layer.msg(title, {icon: 2, shade: this.shade, scrollbar: false, time: 3000, shadeClose: true});
		};
		
		this.tabRoll = function () {
		    $(window).on("resize", function (event) {
		        var topTabsBox = $("#top_tabs_box"),
		            topTabsBoxWidth = $("#top_tabs_box").width(),
		            topTabs = $("#top_tabs"),
		            topTabsWidth = $("#top_tabs").width(),
		            tabLi = topTabs.find("li.layui-this"),
		            top_tabs = document.getElementById("top_tabs"),
		            event = event || window.event;
		
		        if (topTabsWidth > topTabsBoxWidth) {
		            if (tabLi.position().left > topTabsBoxWidth || tabLi.position().left + topTabsBoxWidth > topTabsWidth) {
		                topTabs.css("left", topTabsBoxWidth - topTabsWidth);
		            } else {
		                topTabs.css("left", -tabLi.position().left);
		            }
		            //拖动效果
		            var flag = false;
		            var cur = {
		                x: 0,
		                y: 0
		            }
		            var nx, dx, x;
		
		            function down(event) {
		                flag = true;
		                var touch;
		                if (event.touches) {
		                    touch = event.touches[0];
		                } else {
		                    touch = event;
		                }
		                cur.x = touch.clientX;
		                dx = top_tabs.offsetLeft;
		            }
		
		            function move(event) {
		                var self = this;
		                if (flag) {
		                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		                    var touch;
		                    if (event.touches) {
		                        touch = event.touches[0];
		                    } else {
		                        touch = event;
		                    }
		                    nx = touch.clientX - cur.x;
		                    x = dx + nx;
		                    if (x > 0) {
		                        x = 0;
		                    } else {
		                        if (x < topTabsBoxWidth - topTabsWidth) {
		                            x = topTabsBoxWidth - topTabsWidth;
		                        } else {
		                            x = dx + nx;
		                        }
		                    }
		                    top_tabs.style.left = x + "px";
		                    //阻止页面的滑动默认事件
		                    document.addEventListener("touchmove", function () {
		                        event.preventDefault();
		                    }, false);
		                }
		            }
		
		            //鼠标释放时候的函数
		            function end() {
		                flag = false;
		            }
		
		            //pc端拖动效果
		            topTabs.on("mousedown", down);
		            topTabs.on("mousemove", move);
		            $(document).on("mouseup", end);
		            //移动端拖动效果
		            topTabs.on("touchstart", down);
		            topTabs.on("touchmove", move);
		            topTabs.on("touchend", end);
		        } else {
		            //移除pc端拖动效果
		            topTabs.off("mousedown", down);
		            topTabs.off("mousemove", move);
		            topTabs.off("mouseup", end);
		            //移除移动端拖动效果
		            topTabs.off("touchstart", down);
		            topTabs.off("touchmove", move);
		            topTabs.off("touchend", end);
		            topTabs.removeAttr("style");
		            return false;
		        }
		    }).resize();
		};
		
		/**
		 * 删除窗口
		 * @param tabId
		 * @param isParent
		 */
		this.delTab = function (tabId, isParent) {
		    var layuicrmTabInfo = JSON.parse(sessionStorage.getItem("layuicrmTabInfo"));
		    if (layuicrmTabInfo != null) {
		        delete layuicrmTabInfo[tabId];
		        sessionStorage.setItem("layuicrmTabInfo", JSON.stringify(layuicrmTabInfo))
		    }
		    if (isParent === true) {
		        parent.layui.element.tabDelete('layuicrmTab', tabId);
		    } else {
		        element.tabDelete('layuicrmTab', tabId);
		    }
		};
	
	}

	$('body').on('click', '[data-tab]', function() {
		var loading = layer.load(0, {
			shade: false,
			time: 2 * 1000
		});
		var tabId = $(this).attr('data-tab'),
			href = $(this).attr('data-tab'),
			title = $(this).html(),
			target = $(this).attr('target');
		if (target == '_blank') {
			layer.close(loading);
			window.open(href, "_blank");
			return false;
		}
		title = title.replace('style="display: none;"', '');

		// 拼接参数
		if (layuicrm.config('urlSuffixDefault')) {
			var menuParameId = $(this).attr('data-tab-mpi');
			if (href.indexOf("?") > -1) {
				href = href + '&mpi=' + menuParameId;
				tabId = href;
			} else {
				href = href + '?mpi=' + menuParameId;
				tabId = href;
			}
		}

		// 判断链接是否有效
		var checkUrl = layuicrm.checkUrl(href);
		if (checkUrl != true) {
			return layuicrm.msg_error(checkUrl);
		}

		if (tabId == null || tabId == undefined) {
			tabId = new Date().getTime();
		}
		// 判断该窗口是否已经打开过
		var checkTab = layuicrm.checkTab(tabId);
		if (!checkTab) {
			layuicrm.addTab(tabId, href, title, true);
		}
		element.tabChange('layuicrmTab', tabId);
		layuicrm.tabRoll();
		layer.close(loading);
	});
	
	/**
	 * 关闭选项卡
	 **/
	$('body').on('click', '[data-tab-close]', function () {
	    var loading = layer.load(0, {shade: false, time: 2 * 1000});
	    $parent = $(this).parent();
	    tabId = $parent.attr('lay-id');
	    if (tabId != undefined || tabId != null) {
	        layuicrm.delTab(tabId);
	    }
	    layuicrm.tabRoll();
	    layer.close(loading);
	});
	
	/**
	 * 选项卡操作
	 */
	$('body').on('click', '[data-page-close]', function () {
	    var loading = layer.load(0, {shade: false, time: 2 * 1000});
	    var closeType = $(this).attr('data-page-close');
	    $(".layui-tab-title li").each(function () {
	        tabId = $(this).attr('lay-id');
	        var id = $(this).attr('id');
	        if (id != 'layuicrmHomeTabId') {
	            var tabClass = $(this).attr('class');
	            if (closeType == 'all') {
	                layuicrm.delTab(tabId);
	            } 
				else if(closeType == "this"){
					if(tabClass == "layui-this"){
						layuicrm.delTab()	
					}				
				}
				else {
	                if (tabClass != 'layui-this') {
	                    layuicrm.delTab(tabId);
	                }
	            }
	        }
	    });
	    layuicrm.tabRoll();
	    layer.close(loading);
	});
	

	exports("layuicrm", layuicrm);
});
