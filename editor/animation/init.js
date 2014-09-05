//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'solver';

            var checkioInput = data.in || [['.XXX.', '...X.', '.X.X.', '.....'], "words"];
            var checkioInputStr = fname + '(<br>    (';
            checkioInputStr += 'u"' + checkioInput[0][0] + '"';
            for (var i = 1; i < checkioInput[0].length; i++) {
                checkioInputStr += '<br>     u"' + checkioInput[0][i] + '",';
            }
            checkioInputStr += "),<br>    WORDS)";

            var failError = function (dError) {
                $content.find('.call-in').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call-in').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new CrosswordSVG($content.find(".explanation")[0]);
            svg.prepare(checkioInput[0]);


            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];

                setTimeout(function(){svg.finish(userResult)}, 300);

                $content.find('.output').html('&nbsp;Your result:<br>&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html(result_addon);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });

        function CrosswordSVG(dom) {

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var cell = 30;

            var aCell, aLetter;

            var paper;

            this.prepare = function (data) {
                cell = Math.min(cell, 400 / data[0].length);
                aCell = {"stroke": colorBlue4, "stroke-width": cell / 20};
                aLetter = {"font-family": "Roboto", "font-weight": "bold", "font-size": cell * 0.7};
                paper = Raphael(dom, cell * (data[0].length + 2), cell * (data.length + 2));

                for (var row = 0; row < data.length; row++) {
                    for (var col = 0; col < data[row].length; col++) {
                        var ch = data[row][col];
                        var r = paper.rect((col + 1) * cell, (row + 1) * cell, cell, cell).attr(aCell);
                        r.attr("fill", ch === "X" ? colorBlue3 : colorBlue1);
                        if (ch !== "X" && ch !== ".") {
                            paper.text(cell * (col + 1.5), cell * (row + 1.5), ch).attr(aLetter);
                        }
                    }
                }

            };

            this.finish = function (data) {
                if (!data) {
                    return false;
                }
                if (!$.isArray(data)) {
                    return false;
                }
                for (var row = 0; row < data.length; row++) {
                    var line = data[row];
                    if (typeof line !== "string") {
                        continue;
                    }
                    for (var col = 0; col < line.length; col++) {
                        var symb = line[col];
                        if (symb === "X") {
                            paper.path([
                                ["M", cell * (col + 1.15), cell * (row + 1.15)],
                                ["L", cell * (col + 1.85), cell * (row + 1.85)]
                            ]).attr(aCell);
                            paper.path([
                                ["M", cell * (col + 1.85), cell * (row + 1.15)],
                                ["L", cell * (col + 1.15), cell * (row + 1.85)]
                            ]).attr(aCell);
                        }
                        else {
                            paper.text(cell * (col + 1.5), cell * (row + 1.5), symb).attr(aLetter);
                        }
                    }
                }
            }

        }

    }
);
