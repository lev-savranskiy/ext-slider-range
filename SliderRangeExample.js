Ext.onReady(function () {

    Ext.create('Ext.ux.slider.Ranges', {
        id: 'disabled-slider-demo',
        width: 300,
        disabled: true,
        values: [25, 50, 75],
        renderTo: 'disabled-slider'
    });



    var cmp1 =  Ext.create('Ext.ux.slider.Ranges', {
        id: 'minimal-slider-demo',
        width: 500,
        values: [25, 50, 75],
        renderTo: 'minimal-slider'
    });



    var updateInfo1 = function () {
        var ranges = cmp1.getRanges(),
            total = 0,
            r,
            i,
            txt = "<p>";

        for (i in ranges) {
            r = ranges[i];
            txt += "<span>" +  r.range + " { " + r.from + " , " + r.to + "}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }

        txt += "</p>";
        Ext.fly('info1').update(txt);

    };


    cmp1.on('dragend',
        function () {
            updateInfo1();
        }
    );
    updateInfo1();

    var minValue = 1;
    var maxValue = 200;
    var colWidth = 16;
    var colHeight = 40;
    var minRange = 4;
    var width = ( maxValue - minValue + 1) * colWidth;


    var cmp2 = Ext.create('Ext.ux.slider.Ranges', {
        id: 'custom-slider-demo',
        width: width,
        maxValue: maxValue,
        minValue: minValue,
        minRange: minRange,
        generateTitle: function (n) {
            var title;
            if (n % 2 === 0) {
                title = "EVEN " + Math.ceil(n / 2);
            } else {
                title = "ODD " + Math.ceil(n / 2);
            }
            return title;
        },
        values: [10, 19, 41, 58, 73, 170],
        renderTo: 'custom-slider'
    });


    var w = cmp2.getScreenWidth();
    var size = 11;
    if (w <= 1600) {
        size = 10;
    }
    if (w <= 1400) {
        size = 9;
    }

    if (w <= 800) {
        size = 8;
    }


    //create mock table
    for (var i = minValue; i <= maxValue; i++) {
        var sfx = i % 2 === 0 ? "even" : "odd";
        Ext.get('grid').createChild({
            tag: 'div',
            style: 'float: left; font-size: ' + size + 'px; height: ' + colHeight + 'px; width: ' + colWidth + 'px;',
            cls: sfx,
            html: "<div class='_270'>" + Ext.String.leftPad((i), 3, '0') + "</div>"
        });
    }

    Ext.get('grid').setStyle("width", width + "px");

    //update Info upon dragging
    var updateInfo = function () {
        var ranges = cmp2.getRanges(),
            total = 0,
            r,
            i,
            txt = "";

        txt += "<table><thead><td class='text-left'>Range</td><td>From</td><td>To</td><td>Length</td></thead>";
        for (i in ranges) {
            r = ranges[i];
            txt += "<tr><td class='text-left'>" + r.range + "</td><td>" + r.from + "</td><td>" + r.to + "</td><td>" + r.length + "</td></tr>";
            total += r.length;

        }
        txt += "<tr><td class='text-left'><b>TOTAL</b></td><td></td><td></td><td>" + total + "</td></tr>";
        txt += "</table>";

        Ext.fly('info').update(txt);
        Ext.fly('colHeight').update(colHeight);
        Ext.fly('maxValue').update(maxValue);
        Ext.fly('maxValue1').update(maxValue);
        Ext.fly('minValue').update(minValue);
        Ext.fly('minRange').update(minRange);
        Ext.fly('minRange1').update(minRange);
        Ext.fly('width').update(width);

    };

    cmp2.on('dragend',
        function () {
            updateInfo();
        }
    );
    updateInfo();

});