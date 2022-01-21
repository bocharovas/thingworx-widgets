(function () {
	$('head').append('<script type="text/javascript" src="../Common/extensions/ProjectsWidgets/ui/circlegraph//include/svg.min.js">' +
		'</script>')


	import CreateCircle from './figures.js';

	TW.Runtime.Widgets.circlegraph = function () {

		/*function CreateCircle(canvasName, w, h, Radius_Mill, cCircle = SVG.Color.random(), cTitle = SVG.Color.random()) {

			if (!Radius_Mill || Radius_Mill <= 0) return;

			const mCircle = canvasName.circle()
				.radius(Radius_Mill)
				.center(0, 0)
				.fill('none')
				.addClass('mbCircle')
				.stroke({ color: cCircle });

			function Point_st(L) { return -L / 2 + 10; }
			function Point_end(L) { return L / 2 - 10; }
		}*/

		

		let canvas;
		let width, height, Rad_Mill;
		let cgColor = (new Array(10)).map(function () { return SVG.Color.random(); });
		var valueElem;

		this.renderHtml = function () {
			return '<div class="widget-content widget-circlegraph">' +
				'<span class="circlegraph-property">' + this.getProperty('CircleGraph Property') + '</span>' +
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

			CreateCircle(canvas, width, height, Rad_Mill, cgColor[0], cgColor[1]);
		};

		this.updateProperty = function (updatePropertyInfo) {
			if (updatePropertyInfo.TargetProperty === 'CircleGraph Property') {
				valueElem.text(updatePropertyInfo.SinglePropertyValue);
				this.setProperty('CircleGraph Property', updatePropertyInfo.SinglePropertyValue);
			}
		};
	};
}());