document.addEventListener('DOMContentLoaded', function() {
	var u = document.getElementById("upload");
	var s = document.getElementById("size");
	var gapInput = document.getElementById("gap");
	var trans = document.getElementById("trans");
	var c = document.getElementById("container");
	var downloadBtn = document.getElementById("download");
	var url = null;

	u.onchange = function() {
		var f = u.files[0];
		if (!f) return;
		if (url) URL.revokeObjectURL(url);
		url = URL.createObjectURL(f);
		draw();
	};

	s.oninput = draw;
	gapInput.oninput = draw;
	trans.oninput = draw;

	function draw() {
		if (!url) return;
		var sliderVal = parseInt(s.value, 10);
		var sz = sliderVal * 10;
		var gp = parseInt(gapInput.value, 10) * 10;
		var alpha = 0.9 - ((parseInt(trans.value, 10) - 1) * 0.1);
		if (alpha < 0) alpha = 0;
		if (alpha > 1) alpha = 1;

		while (c.children.length > 1) {
			c.removeChild(c.lastChild);
		}

		var containerSize = 500;
		var countX = Math.ceil((containerSize + gp) / (sz + gp));
		var countY = Math.ceil((containerSize + gp) / (sz + gp));
		var totalWidth = countX * sz + (countX + 1) * gp;
		var totalHeight = countY * sz + (countY + 1) * gp;
		var offsetX = Math.floor((containerSize - totalWidth) / 2);
		var offsetY = Math.floor((containerSize - totalHeight) / 2);

		for (var y = 0; y < countY; y++) {
			for (var x = 0; x < countX; x++) {
				var i = document.createElement("img");
				i.src = url;
				i.width = sz;
				i.height = sz;
				i.className = "tile";
				i.style.left = (offsetX + gp + x * (sz + gp)) + "px";
				i.style.top = (offsetY + gp + y * (sz + gp)) + "px";
				i.style.opacity = alpha;
				c.appendChild(i);
			}
		}
	}

	downloadBtn.addEventListener("click", function () {
		if (!url) return;

		var sliderVal = parseInt(s.value, 10);
		var sz = sliderVal * 10;
		var gp = parseInt(gapInput.value, 10) * 10;
		var alpha = 0.9 - ((parseInt(trans.value, 10) - 1) * 0.1);
		if (alpha < 0) alpha = 0;
		if (alpha > 1) alpha = 1;

		var containerSize = 500;
		var countX = Math.ceil((containerSize + gp) / (sz + gp));
		var countY = Math.ceil((containerSize + gp) / (sz + gp));
		var totalWidth = countX * sz + (countX + 1) * gp;
		var totalHeight = countY * sz + (countY + 1) * gp;
		var offsetX = Math.floor((containerSize - totalWidth) / 2);
		var offsetY = Math.floor((containerSize - totalHeight) / 2);

		var canvas = document.createElement("canvas");
		canvas.width = containerSize;
		canvas.height = containerSize;
		var ctx = canvas.getContext("2d");

		var userImg = new Image();
		userImg.crossOrigin = "anonymous";
		userImg.src = url;

		userImg.onload = function () {
			var bgImg = new Image();
			bgImg.crossOrigin = "anonymous";
			bgImg.src = document.getElementById("background").src;

			bgImg.onload = function () {
				ctx.drawImage(bgImg, 0, 0, containerSize, containerSize);
				for (var y = 0; y < countY; y++) {
					for (var x = 0; x < countX; x++) {
						var drawX = offsetX + gp + x * (sz + gp);
						var drawY = offsetY + gp + y * (sz + gp);
						ctx.globalAlpha = alpha;
						ctx.drawImage(userImg, drawX, drawY, sz, sz);
					}
				}
				ctx.globalAlpha = 1.0;
				var link = document.createElement("a");
				link.download = "bubblewrap.png";
				link.href = canvas.toDataURL("image/png");
				link.click();
			};
		};
	});
});