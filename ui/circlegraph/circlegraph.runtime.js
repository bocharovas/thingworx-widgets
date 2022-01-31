(function () {
	$('head').append('<script type="text/javascript"' +
		'src="../Common/extensions/ProjectsWidgets/ui/circlegraph//include/svg.min.js">' +
		'</script>')

	TW.Runtime.Widgets.circlegraph = function () {

		function CreateCircle(canvasName, Radius_Mill){
			canvasName.circle()
				.radius(Radius_Mill)
				.center(0, 0)
				.fill('none')
				.addClass('mbCircle')	
		}
		
		let canvas;
		let width, height, Rad_Mill;
		let vibroData1 = new Array();
		let points = 1100;
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

			height = this.getProperty('Height') - 10;
			Rad_Mill = 3 * width / 16 * 1 / 2 * 1 / 2;

			canvas = SVG().addTo(document.getElementById(this.jqElementId))
				.size(width, height)
				.viewbox(-width / 16, -height / 16, width / 8, height / 8);

			CreateCircle(canvas, Rad_Mill);

			let trajectoryLine = new SVG.PathArray();
			for (let j = 0; j < 12; (j = j + 2)) {
				trajectoryLine[j] = ['M', Rad_Mill * Math.cos((j/2 * 30)  * Math.PI/180), 
					Rad_Mill * Math.sin((j/2 * 30) * Math.PI/180)];				
				trajectoryLine[j+1] = ['L', Rad_Mill * Math.cos(((j/2 * 30) + 180) * Math.PI/180),
					Rad_Mill * Math.sin(((j/2 * 30) + 180) * Math.PI/180)];
			}	
			canvas.path(trajectoryLine).addClass('mbCircle');
			canvas.text('30').addClass('mbText');
			
			
		};
		
		this.updateProperty = function (updatePropertyInfo) {
			if (updatePropertyInfo.TargetProperty === 'CircleGraph Property') {
				valueElem.text(updatePropertyInfo.SinglePropertyValue);
				this.setProperty('CircleGraph Property', updatePropertyInfo.SinglePropertyValue);
			}
			if (updatePropertyInfo.TargetProperty === 'CircleArray') {
				let rows = updatePropertyInfo.ActualDataRows;
				for (let i = 0; i < rows.length; i++) {
					vibroData1[i] = Rad_Mill - rows[i].value;
				}
				
				let alphaC = new Array();
				let alphaS = new Array();

				for (let i = 0; i < points; i++) {
					alphaC[i] = vibroData1[i] * Math.cos((360 / points * i) * (Math.PI / 180));
					alphaS[i] = vibroData1[i] * Math.sin((360 / points * i) * (Math.PI / 180));
				}

				let trajectoryPoint = new SVG.PathArray();
				trajectoryPoint[0] = ['M', alphaC[0], alphaS[0]];
				for (let i = 1; i < points; i++) {
					trajectoryPoint[i] = ['L', alphaC[i], alphaS[i]];
				}
				trajectoryPoint[points] = ['z'];

				SVG.find('.trajectoryPath_A').remove();
				canvas.path(trajectoryPoint).addClass('trajectoryPath_A');
				
				}
		};
	};
}());