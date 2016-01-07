var monitor = (function () {
	
	var lineChartData = null;
	var lineChart = null;
	var step = 2;
	var received = 0;
	var refresh = 30000;
							
	var rSF = function() { return Math.round(Math.random()*100) };
	var timeConverter = function(UNIX_timestamp) {
		var a = new Date(Math.floor(UNIX_timestamp * 1000));
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  		var year = a.getFullYear();
  		var month = months[a.getMonth()];
  		var date = a.getDate();
  		var hour = a.getHours();
  		var min = a.getMinutes();
  		var sec = a.getSeconds();
  		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  		return time;
	};

	return {
		step: step,
		refresh: refresh,
		lineChartData: lineChartData,
		lineChart: lineChart,
		getData: function(nb) {
			$.ajax({
				context: monitor,
				url: "/chartdata.txt",
				success: function(dataIn) {
					var datArr = dataIn.split("\n");
					var test = datArr[0];
					var foundStart = false;
					var foundEnd = false;
	
					while (datArr.length > 0 && !foundStart) {
						test = datArr.shift();
						foundStart = (test.indexOf("GRAPH-START") >= 0);
					}
					while (datArr.length > 0 && !foundEnd) {
						test = datArr.pop();
						if ($.isNumeric(test)) {
							received = timeConverter(test);
							$("#time").text("Received from Teensy at " + received);
						}
						foundEnd = (test.indexOf("GRAPH-END") >= 0);
					}
					
					monitor.refresh = 30000;
					if (foundStart && foundEnd) {
						for (var i = 0; i < datArr.length; i += monitor.step) {
							var tmpArr = datArr[i].split(",");
							monitor.lineChart.addData(tmpArr, ((i % 100) == 0) ? ((i*40) / 1000) + " kHz" : "");
						}

						monitor.lineChart.update();
					} else {
						monitor.refresh = 1000;
					}
					window.setTimeout(monitor.initChart, monitor.refresh);					
				},
				error: function (jqXHR, textStatus, errorThrown) {
					alert("No data received!");
				},
				timeout: 30000 //in milliseconds
			});
		},
		
		initChart: function (event) {

			Chart.defaults.global.responsive = true;
			var options = {
			    ///Boolean - Whether grid lines are shown across the chart
			    scaleShowGridLines : true,
			    //String - Colour of the grid lines
			    scaleGridLineColor : "rgba(0,0,0,.05)",
			    //Number - Width of the grid lines
			    scaleGridLineWidth : 1,
			    //Boolean - Whether to show horizontal lines (except X axis)
			    scaleShowHorizontalLines: true,
			    //Boolean - Whether to show vertical lines (except Y axis)
			    scaleShowVerticalLines: true,
			    //Boolean - Whether the line is curved between points
			    bezierCurve : true,
			    //Number - Tension of the bezier curve between points
			    bezierCurveTension : 0.4,
			    //Boolean - Whether to show a dot for each point
			    pointDot : false,
			    //Number - Radius of each point dot in pixels
			    pointDotRadius : 4,
			    //Number - Pixel width of point dot stroke
			    pointDotStrokeWidth : 1,
			    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			    pointHitDetectionRadius : 20,
			    //Boolean - Whether to show a stroke for datasets
			    datasetStroke : true,
			    //Number - Pixel width of dataset stroke
			    datasetStrokeWidth : 2,
			    //Boolean - Whether to fill the dataset with a colour
			    datasetFill : true,
			    //Boolean - Whether to horizontally center the label and point dot inside the grid
			    offsetGridLines : false
			};
			
			monitor.lineChartData = {
				labels : [],
				datasets : [
					{
						label: "My First dataset",
						fillColor : "rgba(255,120,120,0.1)",
						strokeColor : "rgba(255,120,120,1)",
						pointColor : "rgba(255,120,120,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(255,220,220,1)",
						data : []
					},
					{
						label: "My Second dataset",
						fillColor : "rgba(051,187,105,0.1)",
						strokeColor : "rgba(051,187,105,1)",
						pointColor : "rgba(051,187,105,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(051,187,105,1)",
						data : []
					},
					{
						label: "My Third dataset",
						fillColor : "rgba(151,205,187,0.1)",
						strokeColor : "rgba(151,205,187,1)",
						pointColor : "rgba(151,205,187,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(151,205,187,1)",
						data : []
					},
					{
						label: "My Fourth dataset",
						fillColor : "rgba(205,187,71,0.1)",
						strokeColor : "rgba(205,187,71,1)",
						pointColor : "rgba(205,187,71,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(205,187,71,1)",
						data : []
					}
				]
			};

			var ctx = document.getElementById("canvas").getContext("2d");
			monitor.lineChart = new Chart(ctx).Line(monitor.lineChartData, options);
	
			monitor.getData();
		}
	}
})();

$(document).ready(function() {
	$("#btnStart").click(monitor.initChart);
	monitor.initChart();
});