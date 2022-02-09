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
		let vibroData1 = new Array();
		let validity = new Array();
		let vibroData1Min;
		let vibroData1Max;
		let scale;
		var valueElem;

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
			console.log(11);
			
			console.log(22);

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
		console.log('io');
		
		this.updateProperty = function (updatePropertyInfo) {

			switch (updatePropertyInfo.TargetProperty){
				case 'CircleArrayMin':
					vibroData1Min = updatePropertyInfo.SinglePropertyValue;
					console.log(vibroData1Min);
					console.log('min');
					break;
				case 'CircleArrayMax':
					vibroData1Max = updatePropertyInfo.SinglePropertyValue;
					console.log(vibroData1Max);
					console.log('max');
					break;
				case 'ScaleCircleArray':
					scale = updatePropertyInfo.SinglePropertyValue;
					console.log(scale);
					console.log('scale');
					break;
			}

			//scale = 3000;

			if (updatePropertyInfo.TargetProperty === 'CircleGraph Property') {
				valueElem.text(updatePropertyInfo.SinglePropertyValue);
				this.setProperty('CircleGraph Property', updatePropertyInfo.SinglePropertyValue);
			}
		
			if (updatePropertyInfo.TargetProperty === 'CircleArray') {
				//console.log(98);
				let rows = updatePropertyInfo.ActualDataRows;
				//console.log(142);
				
				for (let i = 0; i < rows.length; i++) {
					vibroData1[i] = scale - rows[i].S603C01RMSAccRaw;
					validity[i] = rows[i].S603C01Validity;	
				}
				//console.log(555);
				let alphaC = new Array();
				let alphaS = new Array();

				let angle;
				let correctur = 180;
				//console.log('vibroData1Min');
				//console.log(33);
				for (let i = 0; i < rows.length; i++) {
					angle = 360 / rows.length * i - correctur;
					if(angle < 0) angle = angle + 360;
					alphaC[i] = ((vibroData1[i]/scale) * Rad_Mill) * 
						Math.cos((angle) * (Math.PI / 180));
					alphaS[i] = ((vibroData1[i]/scale) * Rad_Mill) * 
						Math.sin((angle) * (Math.PI / 180));
				}
				console.log(alphaC);
				console.log(alphaS);
				let trajectoryPoint = new SVG.PathArray();
				trajectoryPoint[0] = ['M', alphaC[0], alphaS[0]];
			
				let j = 1;
				vibroData1Min = 100;
				vibroData1Max = 800;
				
				for (let i = 1; i < (rows.length - 2); i++) {
				
					if (validity[i].toString() === 'true' && rows[i].S603C01RMSAccRaw >= vibroData1Min
						&& rows[i].S603C01RMSAccRaw <= vibroData1Max) {
						trajectoryPoint[j] = ['L', alphaC[i], alphaS[i]];
						j++;
					}
				}
				//console.log(55);
				trajectoryPoint[j] = ['z'];
				//console.log(trajectoryPoint);
				SVG.find('.trajectoryPath_A').remove();
				console.log(trajectoryPoint);
				canvas.path(trajectoryPoint).addClass('trajectoryPath_A');

				console.log(669);
			}
		};
	};
}());