$(function() {
	// ========== 原有功能 ==========
	$(".img-small").hover(function() {
			$(this).css("border", "1px solid #4288c3");
		},
		function() {
			$(this).css("border", "");
		});
	$(".img-small").click(function() {
		var n = $(this).attr("data");
		$(".img-big").hide();
		$(".img-big[data='" + n + "']").show();
		$(".img-small").css("border", "");
		$(this).css("border", "1px solid #4288c3");
		window.currentImageIndex = parseInt(n);
	});
	$("#numUp").click(function() {
		var n = parseInt($("#num").val());
		$("#num").val(n + 1);
	});
	$("#numDown").click(function() {
		var n = parseInt($("#num").val());
		if (n == 1) return;
		$("#num").val(n - 1);
	});
	$(".img-big:eq(0)").show();
	window.currentImageIndex = 1;

	// 左右箭头滚动
	$(".gallery-nav.prev").click(function() {
		var total = $(".img-big").length;
		var newIndex = window.currentImageIndex - 1;
		if (newIndex < 1) newIndex = total;
		switchToImage(newIndex);
	});
	$(".gallery-nav.next").click(function() {
		var total = $(".img-big").length;
		var newIndex = window.currentImageIndex + 1;
		if (newIndex > total) newIndex = 1;
		switchToImage(newIndex);
	});
	function switchToImage(index) {
		$(".img-big").hide();
		$(".img-big[data='" + index + "']").show();
		$(".img-small").css("border", "");
		$(".img-small[data='" + index + "']").css("border", "1px solid #4288c3");
		window.currentImageIndex = index;
	}

	// 倒计时
	function startCountdown(endTime) {
		function update() {
			var now = new Date().getTime();
			var distance = endTime - now;
			if (distance < 0) {
				$("#countdown-timer").text("活动已结束");
				return;
			}
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			$("#countdown-timer").text(
				(hours < 10 ? "0" + hours : hours) + ":" +
				(minutes < 10 ? "0" + minutes : minutes) + ":" +
				(seconds < 10 ? "0" + seconds : seconds)
			);
		}
		update();
		setInterval(update, 1000);
	}
	var now = new Date();
	var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
	startCountdown(end.getTime());

	// 商品数据加载后填充参数和Tab
	var originalPrice = 0, originalStock = 0;
	var baseTitle = '';      // 基础标题（不含规格后缀）
	var currentSpec = '';    // 当前选中的配置
	var currentColor = '';   // 当前选中的颜色

	$(document).on('productDataLoaded', function(event, product) {
		originalPrice = product.price;
		originalStock = product.num;
		// 提取基础标题（去掉可能已有的括号内的规格信息）
		baseTitle = product.title.replace(/\s*\([^)]*\)\s*$/, '').trim();
		// 默认选中配置：16G+512G（演示效果，与原始价格库存对应）
		currentSpec = '16g512g';
		currentColor = null;
		// 高亮配置按钮
		$(".spec-btn[data-spec='16g512g']").addClass('active');
		// 更新标题
		updateProductTitle();

		$('#spec-brand').text(product.brand || '电脑商城精选');
		$('#spec-model').text(product.model || (product.title ? product.title.substring(0, 20) : '—'));
		$('#spec-cpu').text(product.cpu || 'Intel Core i7 十二代');
		$('#spec-ram').text(product.ram || '16GB DDR5');
		$('#spec-storage').text(product.storage || '512GB PCIe SSD');
		$('#spec-gpu').text(product.gpu || 'RTX 4060 8GB');

		var detailHtml = product.detail ||
			'<p><strong>' + product.title + '</strong> 是一款高性能电脑产品，适合办公、学习与轻度游戏。</p>' +
			'<p>采用先进工艺制造，散热优秀，运行稳定。电脑商城正品保障，放心购买。</p>';
		$('#productDetailText').html(detailHtml);

		var paramHtml = '<table class="param-table">' +
			'<tr><td>商品名称</td><td>' + product.title + '</td></tr>' +
			'<tr><td>商品编号</td><td>' + (product.id || pid) + '</td></tr>' +
			'<tr><td>上架时间</td><td>' + (new Date().toLocaleDateString()) + '</td></tr>' +
			'<tr><td>质保期</td><td>2年</td></tr>' +
			'<tr><td>包装清单</td><td>主机 ×1 电源线 ×1 说明书 ×1</td></tr>' +
			'</table>';
		$('#tabParams').html(paramHtml);
	});

	// 更新商品标题（根据选中的配置和颜色）
	function updateProductTitle() {
		if (!baseTitle) return;
		var specText = '';
		if (currentSpec === '16g512g') specText = '16G+512G';
		else if (currentSpec === '32g1t') specText = '32G+1T';
		var colorText = '';
		if (currentColor === 'white') colorText = '白金';
		else if (currentColor === 'gray') colorText = '深空灰';
		else if (currentColor === 'rose') colorText = '玫瑰金';

		var suffix = '';
		if (specText && colorText) suffix = ' (' + specText + ' ' + colorText + ')';
		else if (specText) suffix = ' (' + specText + ')';
		else if (colorText) suffix = ' (' + colorText + ')';
		else suffix = '';

		$('#product-title').text(baseTitle + suffix);
	}

	// 配置切换（价格、库存、核心参数 + 标题）
	$(".spec-btn").click(function() {
		$(".spec-btn").removeClass("active");
		$(this).addClass("active");
		var spec = $(this).data("spec");
		currentSpec = spec;
		if (spec === "16g512g") {
			$("#product-price").text(originalPrice);
			$("#stock").text(originalStock);
			$("#spec-ram").text("16GB DDR5");
			$("#spec-storage").text("512GB PCIe SSD");
		} else if (spec === "32g1t") {
			var newPrice = parseInt(originalPrice) + 800;
			$("#product-price").text(newPrice);
			$("#stock").text(originalStock - 100);
			$("#spec-ram").text("32GB DDR5");
			$("#spec-storage").text("1TB PCIe SSD");
		}
		updateProductTitle();
	});

	// 颜色切换（支持取消选中）
	$(".spec-color-btn").click(function() {
		var color = $(this).data("color");
		if ($(this).hasClass("active")) {
			// 取消选中
			$(this).removeClass("active");
			currentColor = null;
		} else {
			// 先移除其他颜色的高亮，再高亮当前
			$(".spec-color-btn").removeClass("active");
			$(this).addClass("active");
			currentColor = color;
		}
		updateProductTitle();
	});

	// Tab 切换（四个Tab）
	$('.tab-nav li').click(function() {
		var tabId = $(this).data('tab');
		$('.tab-nav li').removeClass('active');
		$(this).addClass('active');
		$('.tab-content').removeClass('active');
		if (tabId === 'detail') $('#tabDetail').addClass('active');
		else if (tabId === 'params') $('#tabParams').addClass('active');
		else if (tabId === 'service') $('#tabService').addClass('active');
		else if (tabId === 'reviews') $('#tabReviews').addClass('active');
	});

	// 监听商品数据加载完成事件，填充评价列表
	$(document).on('productDataLoaded', function(event, product) {
		var reviews = [
			{ name: "张***", stars: 5, date: "2025-03-15", content: "电脑性能很好，运行速度快，外观也很漂亮。", spec: "16G+512G" },
			{ name: "李***", stars: 4, date: "2025-03-10", content: "性价比很高，散热也不错，就是风扇声音略大。", spec: "16G+512G" },
			{ name: "王***", stars: 5, date: "2025-03-05", content: "物流很快，包装完好，开机即用，非常满意。", spec: "32G+1T" }
		];

		var reviewsHtml = '';
		for (var i = 0; i < reviews.length; i++) {
			var r = reviews[i];
			var starsHtml = '';
			for (var s = 0; s < 5; s++) {
				starsHtml += s < r.stars ? '★' : '☆';
			}
			reviewsHtml += '<div class="review-item">' +
				'<div class="review-header">' +
				'<span class="reviewer-name">' + r.name + '</span>' +
				'<span class="review-stars">' + starsHtml + '</span>' +
				'<span class="review-date">' + r.date + '</span>' +
				'</div>' +
				'<div class="review-content">' + r.content + '</div>' +
				'<div class="review-spec">购买规格：' + r.spec + '</div>' +
				'</div>';
		}
		$('#reviewsList').html(reviewsHtml);
	});
});