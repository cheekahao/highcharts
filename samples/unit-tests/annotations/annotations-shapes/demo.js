QUnit.test('Drawing path based on points', function (assert) {
	var chart = Highcharts.chart('container', {
		chart: {
			width: 600,
			height: 400
		},

		series: [{
			keys: ['y', 'id'],
			dataLabels: {enabled: true, x: 0, y: 0},
			data: [
				[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'],
				[144.0, '4'], [176.0, '5']
			]
		}],

		yAxis: {
        	max: 300
    	},

		annotations: [{
			shapes: [{
				borderWidth: 1,
				backgroundColor: 'none',
				type: 'path',
				points: ['1', {
					x: 2,
					y: 200,
					xAxis: 0,
					yAxis: 0
				}, '2', {
					x: 3,
					y: 200,
					xAxis: 0,
					yAxis: 0
				}]
			}]
		}]
	});

	var roundPath = function (dArray) {
			return Highcharts.map(dArray, function (value) {
				var number = Math.round(value);
				return Highcharts.isNumber(number) ? number : value;
			});
		},

		xAxis = chart.xAxis[0],
		yAxis = chart.yAxis[0],
		data = chart.series[0].data,
		shape = chart.annotations[0].shapes[0];
	
	var actualPath = shape.d.split(' ');
	var expectedPath = [
		'M', xAxis.toPixels(data[1].x), yAxis.toPixels(data[1].y),
		'L', xAxis.toPixels(2), yAxis.toPixels(200),
		'L', xAxis.toPixels(data[2].x), yAxis.toPixels(data[2].y),
		'L', xAxis.toPixels(3), yAxis.toPixels(200)
	]

	assert.deepEqual(roundPath(actualPath), roundPath(expectedPath), 'Compare path d attribute');
});

QUnit.test('Drawing shapes on incorrect points', function (assert) {
	var chart = Highcharts.chart('container', {
		chart: {
			width: 600,
			height: 400
		},

		series: [{
			keys: ['y', 'id'],
			dataLabels: {enabled: true, x: 0, y: 0},
			data: [
				[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'],
				[144.0, '4'], [176.0, '5']
			]
		}],

		yAxis: {
        	max: 300
    	},

		annotations: [{
			shapes: [{
				type: 'path',
				points: [{x: 20, y: 20}, null, '1'], 
			}, {
				type: 'rect'
			}]
		}]
	});

	assert.strictEqual(chart.annotations[0].shapes.length, 0, 'Shape is destroyed if the points are incorrect');
});


QUnit.test('Drawing path with a marker', function (assert) {
	var chart = Highcharts.chart('container', {
		chart: {
			width: 600,
			height: 400
		},

		defs: {
			markers: [{
				id: 'arrow-marker',
				refY: 5,
				refX: 5,
				markerWidth: 10,
				markerHeight: 10,
				elements: [{
					type: 'path',
					attrs: {
						d: 'M 0 0 L 10 5 L 0 10 Z' // triangle (used as an arrow)
					}
				}]
			}]
		},

		series: [{
			keys: ['y', 'id'],
			dataLabels: {enabled: true, x: 0, y: 0},
			data: [
				[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'],
				[144.0, '4'], [176.0, '5']
			]
		}],

		yAxis: {
        	max: 300
    	},

		annotations: [{
			shapes: [{
				type: 'path',
				points: [{x: 200, y: 100}, '2'],
				markerEnd: 'url(#arrow-marker)',
				markerStart: 'url(#arrow-marker)'
			}]
		}]
	});

	var marker = document.getElementById('arrow-marker');
	assert.ok(marker, 'Marker is created');
	assert.strictEqual(marker.parentNode.nodeName, 'defs', 'Marker is placed in defs tag');

	var path = marker.querySelector('path');
	assert.ok(path, 'Marker path is created inside the marker');
	assert.strictEqual(path.getAttribute('d'), 'M 0 0 L 10 5 L 0 10 Z', 'Marker path d attribute is correct');

	assert.strictEqual(chart.annotations[0].shapes[0].element.getAttribute('marker-end'), 'url(#arrow-marker)', 'End marker id is correctly attached to the annotation\'s path');
	assert.strictEqual(chart.annotations[0].shapes[0].element.getAttribute('marker-start'), 'url(#arrow-marker)', 'Start marker is correctly attached to the annotation\'s path');
});