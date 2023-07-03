requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function garlandVisualization(tgt_node, data) {
            if (!data || !data.ext) {
                return
            }
            const input = data.in[0]
            const explanation = new Set(data.ext.explanation)
            const result = data.ext.result

            /**
             * 
             * attr
             * 
             */
            const attr = {
                line: {
                    'stroke-width': '0.5',
                    'stroke': '#294270',
                },
                lamp: {
                    'stroke-width': '0.5',
                    'fill': '#FFFFFF',

                },
                illumination: {
                    'stroke': 'none',
                    'fill': '#FABA00',
                    'opacity': '0.5',
                },
                number: {
                    'font-family': 'times',
                    'fill': '#b0c4de',
                    'stroke': 'none'
                }
            }

            /**
             * 
             * svg-shape
             * 
             */
            const lamp = [
                "M256,0c-79.391,0-143.75,64.344-143.75,143.75c0,33.828,11.688,64.922,31.25,89.484 c26.328,33.063,40.234,46.234,40.234,84.766c0,17.672,8.031,25.703,20.875,25.703h102.781c12.859,0,20.891-8.031,20.891-25.703 c0-38.531,13.891-51.703,40.219-84.766c19.563-24.563,31.25-55.656,31.25-89.484C399.75,64.344,335.391,0,256,0z",
                "M256,512c17.797,0,32.219-14.422,32.219-32.219h-64.438C223.781,497.578,238.203,512,256,512z",
                "M311.25,366.219h-110.5c-9.594,0-17.375,7.781-17.375,17.375c0,9.609,7.781,17.391,17.375,17.391h110.5 c9.594,0,17.391-7.781,17.391-17.391C328.641,374,320.844,366.219,311.25,366.219z",
                "M311.25,422.344h-110.5c-9.594,0-17.375,7.797-17.375,17.406c0,9.594,7.781,17.375,17.375,17.375h110.5 c9.594,0,17.391-7.781,17.391-17.375C328.641,430.141,320.844,422.344,311.25,422.344z"
            ]

            /**
             * 
             * values
             * 
             */
            const draw_area_size_px = 210
            const col = input.length
            const unit = Math.min(210 / col, 50)
            const scale = 15 * (50 / unit)
            const os_v = 10
            const os_h = 10 + (draw_area_size_px - (unit * col)) / 2

            /**
             * 
             * paper
             * 
             */
            const paper = Raphael(tgt_node, unit * col + os_h * 2, unit + os_v * 2, 0, 0)

            /**
             * 
             * draw illumination
             * 
             */
            if (result) {
                explanation.forEach(i => {
                    const center = (i + .5) * unit + os_h
                    paper.rect(center - (input[i] + 0.5) * unit, unit * .5 + os_v,
                        (input[i] + .5) * unit * 2, unit * .3).attr(attr.illumination).attr('r', 3)
                })
            }

            /**
             * 
             * draw lines, lights and input-numbers
             * 
             */
            input.forEach((n, i) => {

                // line
                paper.path(['M', i * unit + os_h, os_v, 'h', unit]).attr(attr.line)
                paper.path(['M', (i + .5) * unit + os_h, os_v, 'v', unit * .5]).attr(attr.line)

                // light
                const light = paper.path(lamp.join(' ')).translate(-256 + os_h, -256 + os_v).attr(attr.lamp)
                light.scale(1 / scale)
                light.translate(unit / 2 * scale, unit / 2 * scale)
                light.translate(i * unit * scale, 0)
                light.scale(1, -1)
                if (result && explanation.has(i)) {
                    light.attr({ 'fill': '#FABA00' })
                }

                // input number
                const t = paper.text(unit * (i + .5) + os_h, 4, n).attr(
                    { 'font-size': '10' }).attr(attr.number)
                if (!result || explanation.has(i)) {
                    t.attr({ 'font-weight': 'bold' }).attr({ 'fill': '#000000' })
                }
            })
        }

        var io = new extIO({
            animation: function ($expl, data) {
                garlandVisualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
