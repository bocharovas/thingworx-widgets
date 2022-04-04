(function () {
	$('head').append('<script type="text/javascript"' +
		'src="../Common/extensions/ProjectsWidgets/ui/circlegraph//include/svg.min.js">' +
		'</script>')
		.append('<script type="text/javascript"' +
			'src="../Common/extensions/ProjectsWidgets/ui/circlegraph//include/figures.js">' +
			'</script>')

	TW.Runtime.Widgets.circlegraph = function () {
		let canvas;
		let width, height, Rad_Mill;
		let rmsAccRawRel = new Array();
		let rmsAccRawAbs = new Array();
		let validity = new Array();
		let vibroData1Min;
		let vibroData1Max;
		let scale;
		let correctur;
		var valueElem;
		let classC;
		let ausbesserung;
		let geschwindigkeit;
		let koeffVerz10;
		//let koeffVerz17 = 3.83;
		

		this.renderHtml = function () {
			return '<div class="widget-content widget-circlegraph">' +
				'<span class="circlegraph-property">' + this.getProperty('CircleGraph Property')
				+ '</span>' +
				'</div>';
		};

		this.afterRender = function () {
			valueElem = this.jqElement.find('.circlegraph-property');
			valueElem.text(this.getProperty('CircleGraph Property'));
			width = this.getProperty('Width');
			classC = this.getProperty('CircleClass');
			height = this.getProperty('Height') - 10;
			Rad_Mill = 3 * width / 16 * 1 / 2 * 1 / 2;

			canvas = SVG().addTo(document.getElementById(this.jqElementId))
				.size(width, height)
				.viewbox(-width / 16, -height / 16, width / 8, height / 8);
			CreateCircle(canvas, Rad_Mill);
			let trajectoryLine = new SVG.PathArray();

			for (let j = 0; j < 12; (j = j + 2)) {
				let x = Rad_Mill * Math.cos((j / 2 * 30) * Math.PI / 180);
				let y = Rad_Mill * Math.sin((j / 2 * 30) * Math.PI / 180);
				let xn = Rad_Mill * Math.cos(((j / 2 * 30) + 180) * Math.PI / 180);
				let yn = Rad_Mill * Math.sin(((j / 2 * 30) + 180) * Math.PI / 180);
				trajectoryLine[j] = ['M', x, y];
				trajectoryLine[j + 1] = ['L', xn, yn];

				switch (j) {
					case 0:
						x = x + 2
						y = y + 1
						xn = xn - 5
						yn = yn + 1
						break;
					case 2:
						x = x + 2
						y = y + 3
						xn = xn - 6
						yn = yn - 1
						break;
					case 4:
						x = x + 1
						y = y + 5
						xn = xn - 4
						yn = yn - 3
						break;
					case 6:
						x = x - 1
						y = y + 5
						xn = xn - 2
						yn = yn - 3
						break;
					case 8:
						x = x - 4
						y = y + 5
						xn = xn + 1
						yn = yn - 3
						break;
					case 10:
						x = x - 5
						y = y + 3
						xn = xn + 2
						yn = yn - 1
						break;
				}

				let korr = j / 2 * 30 - 90;

				if (korr < 0) korr = korr + 360;

				canvas.text()
					.text(korr)
					.x(x)
					.dy(y)
					.addClass('mbText')

				canvas.text()
					.text((j / 2 * 30) + 90)
					.x(xn)
					.dy(yn)
					.addClass('mbText')
			}
			canvas.path(trajectoryLine).addClass('axis_x_0');
		};

		this.updateProperty = function (updatePropertyInfo) {

			switch (updatePropertyInfo.TargetProperty) {
				case 'CircleArrayMin':
					vibroData1Min = updatePropertyInfo.SinglePropertyValue;
					break;
				case 'CircleArrayMax':
					vibroData1Max = updatePropertyInfo.SinglePropertyValue;
					break;
				case 'ScaleCircleArray':
					scale = updatePropertyInfo.SinglePropertyValue;
					break;
				case 'AngleCircleArray':
					correctur = updatePropertyInfo.SinglePropertyValue;
					break;
				case 'Geschwindigkeit':
					geschwindigkeit = updatePropertyInfo.SinglePropertyValue;
					ausbesserung = geschwindigkeit * koeffVerz10;
					break;
			}

			if (updatePropertyInfo.TargetProperty === 'CircleGraph Property') {
				valueElem.text(updatePropertyInfo.SinglePropertyValue);
				this.setProperty('CircleGraph Property', updatePropertyInfo.SinglePropertyValue);
			}

			if (updatePropertyInfo.TargetProperty === 'CircleArray') {

				let rows = updatePropertyInfo.ActualDataRows;

				for (let i = 0; i < rows.length; i++) {
					rmsAccRawRel[i] = scale - rows[i].S603C01RMSAccRaw;
					rmsAccRawAbs[i] = scale - rmsAccRawRel[i];
					validity[i] = rows[i].S603C01Validity;
				}

				let alphaC = new Array();
				let alphaS = new Array();
				let angle;

				if (geschwindigkeit < 70.0) {koeffVerz10 = 4.92}
				if (geschwindigkeit < 17.4) {koeffVerz10 = 1.49}
				

				console.log(koeffVerz10);

				//if (classC === 'trajectoryPath_B') {
					
				//} else {
					//ausbesserung = 0;
				//}
				


				for (let i = 0; i < rows.length; i++) {
					angle = 360 / rows.length * i - correctur;
					if (angle < 0) angle = angle + 360;
					alphaC[i] = ((rmsAccRawRel[i] / scale) * Rad_Mill) *
						Math.cos((angle) * (Math.PI / 180));
					alphaS[i] = ((rmsAccRawRel[i] / scale) * Rad_Mill) *
						Math.sin((angle) * (Math.PI / 180));
				}

				let trajectoryPoint = new SVG.PathArray();
				let j = 0;

				for (let i = 0; i < (rows.length); i++) {

					if (validity[i].toString() === 'true' && rmsAccRawAbs[i] >= vibroData1Min
						&& rmsAccRawAbs[i] <= vibroData1Max) {
						if (j == 0) {
							trajectoryPoint[j] = ['M', alphaC[i], alphaS[i]];
						} else {
							trajectoryPoint[j] = ['L', alphaC[i], alphaS[i]];
						}
						j++;
					}
				}

				let t = '.';
				trajectoryPoint[j] = ['z'];
				SVG.find(t + classC).remove();
				canvas.path(trajectoryPoint).addClass(classC);
			}
		};
	};
}());