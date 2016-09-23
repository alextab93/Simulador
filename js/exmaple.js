// y = fn(x)
function myFunction(x) {
    return Math.pow(x, 2);
}

// construct data
var labels = [];
var data = [];
for (var i = 0; i <= 10;) {
    labels.push(i);
    data.push(myFunction(i));
    i += 1;
}


// move point to position x in myChart
function updateChartPoint(myChart, xValue) {
    var ctx = myChart.chart.ctx;
    var scale = myChart.scale;
    var scaling = (scale.width - (scale.xScalePaddingLeft + scale.xScalePaddingRight)) / (scale.xLabels[scale.xLabels.length - 1] - scale.xLabels[0]);

    // cancel existing animations
    if (myChart.animationLoop)
        clearInterval(myChart.animationLoop);

    // figure out where we want to go
    var xTarget = Math.round(scale.xScalePaddingLeft + xValue * scaling);
    var xCurrent;
    if (myChart.point)
        xCurrent = myChart.point.x;
    else
        xCurrent = xTarget;
    var increment = (xTarget - xCurrent) / 30;

    myChart.animationLoop = setInterval(function () {
        myChart.point = {
            x: xCurrent,
            y: scale.calculateY(myFunction((xCurrent - scale.xScalePaddingLeft) / scaling))
        }

        myChart.update();

        ctx.beginPath();
        ctx.arc(myChart.point.x, myChart.point.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        // move / stop moving
        if (Math.abs(xTarget - xCurrent) <= Math.abs(increment))
            clearInterval(myChart.animationLoop);
        else
            xCurrent += increment;
    }, 5);
}


$("#slider").slider({
    min: 0,
    max: 10,
    step: 0.1,
    value: 5
});


var data = {
    labels: labels,
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: data
        }
    ]
};

var ctx = document.getElementById("myChart").getContext("2d");
var myLineChart = new Chart(ctx).Line(data, {
    showTooltips: false,
    pointDot: false,
    // the initial setting of the point
    onAnimationComplete: function () {
        if (!this.point) {
            var chart = this;
            chart.options.animation = false;

            $('#slider').slider("option", "slide", function (event, ui) {
                updateChartPoint(chart, ui.value)
            })

            updateChartPoint(chart, $('#slider').slider("option", "value"))
        }
    }
});
