(function () {
	$('head').append('<script type="text/javascript"' +
		'src="../Common/extensions/ProjectsWidgets/ui/circlegraph//include/svg.min.js">' +
		'</script>')

	TW.IDE.Widgets.circlegraph = function () {
		
		let canvas;
		let width, height, Rad_Mill;
		let cgColor = (new Array(10)).map(function () { return SVG.Color.random(); });
		let vibroData1 = new Array();

		function CreateCircle(canvasName, w, h, Radius_Mill, cCircle = SVG.Color.random(),
			cTitle = SVG.Color.random()) {

			if (!Radius_Mill || Radius_Mill <= 0) return;

			const mCircle = canvasName.circle()
				.radius(Radius_Mill)
				.center(0, 0)
				.fill('none')
				.addClass('mbCircle')
				.stroke({ color: cCircle });
		}

		

		this.widgetIconUrl = function () {
			return "../Common/extensions/ProjectsWidgets/ui/circlegraph/default_widget_icon.ide.png";
		};

		this.widgetProperties = function () {
			return {
				'name': 'CircleGraph',
				'description': '',
				'category': ['Common'],
				'properties': {
					'CircleGraph Property': {
						'baseType': 'STRING',
						'defaultValue': 'CircleGraph Property default value',
						'isBindingTarget': true
					},
					'CircleArray': {
						'description': 'Data source',
                        'isBindingTarget': true,
                        'isEditable': false,
						'baseType': 'INFOTABLE',
                        'warnIfNotBoundAsTarget': true
					},
					'CircleArrayMax': {
						'description': 'Data source max',
                        'isBindingTarget': true,
                        'isEditable': false,
						'baseType': 'INTEGER',
                        'warnIfNotBoundAsTarget': true
					},
					'CircleArrayMin': {
						'description': 'Data source min',
                        'isBindingTarget': true,
                        'isEditable': false,
						'baseType': 'INTEGER',
                        'warnIfNotBoundAsTarget': true
					},
					'AngleCircleArray': {
						'description': 'Total width of the angle',
						'baseType': 'INTEGER',
						'isVisible': true,
						'defaultValue': 400,
						'isEditable': true,
						'isBindingTarget': true
					},
					'ScaleCircleArray': {
						'description': 'Total scale of the size',
						'baseType': 'NUMBER',
						'isVisible': true,
						'defaultValue': 100,
						'isEditable': true,
						'isBindingTarget': true,
						'isBindingSource': true
					},
					'Width': {
						'description': 'Total width of the widget',
						'baseType': 'INTEGER',
						'isVisible': true,
						'defaultValue': 700,
						'isEditable': true,
						'isBindingTarget': true
					},
					'Height': {
						'description': 'Total height of the widget',
						'baseType': 'INTEGER',
						'isVisible': true,
						'defaultValue': 500,
						'isEditable': true,
						'isBindingTarget': true
					},
				}
			}
		};

		this.afterSetProperty = function (name, value) {
			var thisWidget = this;
			var refreshHtml = false;
			switch (name) {
				case 'Style':
				case 'CircleGraph Property':
					thisWidget.jqElement.find('.circlegraph-property').text(value);
				case 'Width':
				case 'Height':
					width = this.getProperty('Width');
					height = this.getProperty('Height') - 10;
					Rad_Mill = 3 * width / 16 * 1 / 2 * 1 / 2;
					refreshHtml = true;
					break;
				case 'Alignment':
					refreshHtml = true;
					break;
				default:
					break;
			}
			return refreshHtml;
		};

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
			
			let alphaC = new Array();
			let alphaS = new Array();
			let points = 1100;

			for (let i = 0; i < points; i++) {
				vibroData1[i] = (Math.random() * 4 + (Rad_Mill - 10)).toFixed(3);
				alphaC[i] = vibroData1[i] * Math.cos((360 / points * i) * (Math.PI / 180));
				alphaS[i] = vibroData1[i] * Math.sin((360 / points * i) * (Math.PI / 180));
			}

			let trajectoryPoint = new SVG.PathArray();
			trajectoryPoint[0] = ['M', alphaC[0], alphaS[0]];
			for (let i = 1; i < points; i++) {
				trajectoryPoint[i] = ['L', alphaC[i], alphaS[i]];
			}
			trajectoryPoint[points] = ['z'];

			let trajectoryPath = canvas.path(trajectoryPoint).addClass('trajectoryPath_A')
				.fill({ color: SVG.Color.random() })
				.stroke({ color: SVG.Color.random() });
		};

	};
}());