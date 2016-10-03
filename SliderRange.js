/**
 * @class Ext.ux.slider.Ranges
 * @extends   Ext.slider.Multi
 *
 * @class Ext.ux.slider.ThumbRange
 * @extends   Ext.slider.Thumb
 *
 * @version 0.2
 * @author Lev Savranskiy
 * @link http://wap7.ru/folio/ext-slider-range/SliderRange.html
 * @contact  levsavranskiy at gmail.com


 */


Ext.define('Ext.ux.slider.ThumbRange', {
    extend: 'Ext.slider.Thumb',
    onDrag: function (e) {
        var me = this,
            slider = me.slider,
            index = me.index,
            newValue = parseInt(me.getValueFromTracker()),
            aboveValue,
            belowValue,
            above,
            below;

        if (newValue !== undefined) {

            above = slider.thumbs[index + 1];
            below = slider.thumbs[index - 1];
            aboveValue = above ? parseInt(above.value) : slider.maxValue;
            belowValue = below ? parseInt(below.value) : slider.minValue - 1;


            if (newValue <= belowValue + slider.minRange) {
                newValue = belowValue + slider.minRange;
            }
            if (newValue >= aboveValue - slider.minRange) {
                newValue = aboveValue - slider.minRange
            }


//            console.log(newValue);
//            console.log('====');

            slider.setValue(index, newValue, false);
            slider.fireEvent('drag', slider, e, me);
        }
    }
});


Ext.define('Ext.ux.slider.Ranges', {

    extend: 'Ext.slider.Multi',
    cls: "x-slider-range",
    headerPrefix: "-x-slider-range-header-",
    useTips: false,
    //todo clickToChange some day
    clickToChange: false,
    increment: 1,
    minRange: 1,
    minValue: 1,
    maxValue: 100,
    colWidth: 14,
    width: "100%",
    // note: {id} here is really {inputId}, but {cmpId} is available
    fieldSubTpl: [
            '<div id="{id}" class="' + Ext.baseCSSPrefix + 'slider {fieldCls} {vertical}',
        '{childElCls}',
        '" aria-valuemin="{minValue}" aria-valuemax="{maxValue}" aria-valuenow="{value}" aria-valuetext="{value}">',
            '<div id="{cmpId}-endEl" class="' + Ext.baseCSSPrefix + 'slider-end" role="presentation">',
            '<div id="{cmpId}-innerEl" class="' + Ext.baseCSSPrefix + 'slider-inner" role="presentation">',
        '{%this.renderThumbs(out, values)%}',
        '</div>',
        '</div>',
        '</div>',
        {
            renderThumbs: function (out, values) {
                var me = values.$comp,
                    i = 0,
                    thumbs = me.thumbs,
                    len = thumbs.length,
                    headerConfig,
                    headerCnt = 0,
                    bgPosition = me.getThumbBgPosition(),
                    thumb,
                    thumbConfig;

                //prepend header before first thumb
                headerConfig = {
                    cls: "x-slider-range-header-odd",
                    id: me.id + me.headerPrefix + headerCnt
                };
                Ext.DomHelper.generateMarkup(headerConfig, out);

                for (; i < len; i++) {
                    thumb = thumbs[i];
                    thumbConfig = thumb.getElConfig();
                    thumbConfig.id = me.id + '-thumb-' + i;
                    //fix for different resolutions
                    thumbConfig.style["backgroundPosition"] = bgPosition + "px 0";
                    Ext.DomHelper.generateMarkup(thumbConfig, out);

                    headerCnt += 1;
                    headerConfig = {
                        cls: headerCnt % 2 === 0 ? "x-slider-range-header-odd" : "x-slider-range-header-even",
                        id: me.id + me.headerPrefix + headerCnt
                    };

                    Ext.DomHelper.generateMarkup(headerConfig, out);
                }


            },
            disableFormats: true
        }
    ],
    listeners: {
        afterrender: function (el, newVal, thumb) {
            // console.log("afterrender");
            el.rebuildHeaders();


        },

        change: function (el, newVal, thumb) {
            // console.log("change");
            el.rebuildHeaders();
        }
    },

    initComponent: function () {

        this.totalRange = this.maxValue - this.minValue;

        if (this.width && this.totalRange){
            this.colWidth = this.width / (this.totalRange + 1);
        }



        this.callParent(arguments);

    },


    validateRanges: function () {
        var me = this,
            element,
            errors = "",
            elementPrev,
            i;


        if (!me.minRange) {
            errors += "No positive minRange found\n\r";
        }


        if (!me.values) {
            errors += "No initial values found in config\n\r";
        }

        //check ranges validity
        for (i in me.values) {
            elementPrev = me.values[i - 1] ? me.values[i - 1] : 0;
            element = me.values[i];

            if ((element - elementPrev) < me.minRange) {
                errors += elementPrev + "..." + element + " range is less than minRange\n\r";

            }

            if (element < this.minValue || element > this.maxValue) {
                errors += element + " is out of range\n\r";

            }
        }

        //check last range validity
        if ((me.maxValue - element) < me.minRange) {
            errors += element + "..." + me.maxValue + " range is less than minRange\n\r";
        }

        if (errors.length) {
            //console.error(errors);
        }

    },

// IE bug
//    onMouseDown : function(e) {
//        var me = this,
//            thumbClicked = false,
//            i = 0,
//            thumbs = me.thumbs,
//            len = thumbs.length,
//            trackPoint;
//
//        if (me.disabled) {
//            return;
//        }
//
//        //see if the click was on any of the thumbs
//        for (; i < len; i++) {
//            thumbClicked = thumbClicked || e.target == thumbs[i].el.dom;
//        }
//
//            console.log(me.clickToChange ,thumbClicked);
//
//        if (me.clickToChange && !thumbClicked) {
//            trackPoint = me.getTrackpoint(e.getXY());
//            if (trackPoint !== undefined) {
//                me.onClickChange(trackPoint);
//            }
//        }
//        e.preventDefault();
//        me.focus();
//        return false;
//    },


    //default generateTitle
    // could be passed in config
    generateTitle: function (n) {
        return "Region " + n;
    },


    rebuildHeaders: function () {
        var headers = this.getHeaders(),
            len = headers.length,
            header;


        //just to be sure about ranges
        this.validateRanges();

        while (len--) {
            header = headers[len];
            Ext.get(header.id).setStyle("left", header.left + "%").setStyle("width", header.width + "%").update(header.title).set({title :  header.title});
        }
    },

    getThumbBgPosition: function () {
        var w = this.getScreenWidth(),
            pos = 0.50 * this.colWidth;

        if (w <= 1600) {
            pos = 0.55 * this.colWidth;
        }
        if (w <= 800) {
            pos = 0.60 * this.colWidth;
        }
        return  pos;
    },

    getScreenWidth: function () {
        return Ext.getBody().getViewSize().width;
    },


    getHeaders: function () {
        var i,
            me = this,
            p,
            n,
            k,
            headers = [],
            header,
            isFirst,
            width,
            left,
            elThumb,
            prevPadding,
            thisPadding,
            thumbsCollection = [];

        for (i in this.thumbs) {
            elThumb = this.thumbs[i].el;
            thumbsCollection.push(elThumb);
        }


        var sum = 0;

        for (i in thumbsCollection) {

            p = parseInt(i) - 1;
            n = parseInt(i) + 1;
            prevPadding = thumbsCollection[p] ? parseFloat(thumbsCollection[p].getStyle("left", true)) : 0;
            thisPadding = parseFloat(thumbsCollection[i].getStyle("left", true));

            isFirst = prevPadding === 0;

            k =100 / me.totalRange;
            width = thisPadding - prevPadding;
            left = prevPadding ;

            if (isFirst){
                left  =  - k;
                width  =  width + k;
            }

            sum += width;

            header = {
                "id": me.id + me.headerPrefix + i,
                "left": left,
                "thisPadding": thisPadding,
                "width": width,
                "title": this.generateTitle(n)
            };

            //console.log(i + " left  " + header.left + " / width " + header.width);
            headers.push(header);

        }


        //add last header
        prevPadding = parseFloat(headers[headers.length - 1].thisPadding)  ;
        thisPadding = 100;
        width = thisPadding - prevPadding;
        sum += width;
        headers.push({
            "id": me.id + me.headerPrefix + headers.length,
            "left": prevPadding,
            "thisPadding": thisPadding,
            "width": width,
            "title": this.generateTitle(n + 1)
        });

        //console.log((i + 1 ) + " left  " + prevPadding + " / width " + (thisPadding - prevPadding));
//        console.log(sum);
//        console.log("----");
        return headers;
    },


    addThumb: function (value) {


        var me = this,
            thumb = new Ext.ux.slider.ThumbRange({
                ownerCt: me,
                ownerLayout: me.getComponentLayout(),
                value: value,
                slider: me,
                index: me.thumbs.length,
                disabled: !!me.readOnly
            });

        me.thumbs.push(thumb);


        if (me.rendered) {
            thumb.render();
        }

        return thumb;

    },


    getRangesArr: function () {
        var RangesArr = [];
        var data = this.getRanges();
        Ext.each(data, function (item) {
            RangesArr.push(item.from);
            RangesArr.push(item.to);
        });
        return RangesArr;
    },


    getRanges: function (el) {

        var values = this.getValues(),
            ranges = [],
            range = {},
            i,
            y,
            firstIsCollapsed,
            isFirst,
            title;


        values.push(this.maxValue);
        values.unshift(this.minValue);


        for (i in values) {

            y = 1 + parseInt(i);

            if (values[y]) {


                if (i > 0 && values[i] === this.minValue) {
                    firstIsCollapsed = true;
                }
                isFirst = i == 0;
                range = {
                    "range": this.generateTitle(y),
                    "from": !isFirst || firstIsCollapsed ? parseInt(values[i]) + 1 : parseInt(values[i]),
                    "to": parseInt(values[y]),
                    "length": !isFirst || firstIsCollapsed ? values[y] - values[i] : values[y] - values[i] + 1
                };

                ranges.push(range);

            }


        }

//        console.log(ranges);
//        console.log('---');

        return ranges;
    }

});
