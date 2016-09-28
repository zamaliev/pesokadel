/**
 * Created by RIF on 28.09.2016.
 */
var calculator = (function() {

    var data = []; // хранилище данных для подсчета и запроса

    var firstMsk = true;

    var types = []; // хранилище типов услуг

    function Item(name, value, group) { // конструктор объектов для подсчета
        this.name = name;
        this.value = value;
        this.group = group;
    }

    function sum() {

        var autos = 0;
        var containers = 0;

        for (var i = 0; i < data.length; i++) {
            for ( var property in data[i]) {
                if (data[i][property] == "auto") {
                    autos += parseInt(data[i]['value'], 10);
                } else if (data[i][property] == "container") {
                    containers += parseInt(data[i]['value'], 10);
                }
            }
        }
        $("input.sum_cars").val(autos).toggleClass('active', autos > 0)
            .closest(".sum_box").toggleClass('active', autos > 0);
        $("input.sum_containers").val(containers).toggleClass('active',
            containers > 0).closest(".sum_box").toggleClass('active',
            containers > 0);

    }

    function addServices($this) {

        var flag = false; // для определения чекбокс или инпут

        var $input = $this.closest('.wrapper_inputs')
            .find('.input_number_serv');

        var name = $input.attr("name");

        var group = $input.data("group");

        if ($this.hasClass("cInput")) { // менядся инпут
            var span = $this.closest('.wrapper_inputs').find('span.check');

            var checked = span.hasClass("checked");

            flag = true;

        } else { // менялся чекбокс
            var val = $input.val();
            // var checked = $this.hasClass("checked");

        }

        if (flag) { // если изменилось количество машин

            if (!checked) { // если еще не было галки. то ставим ее

                // span.addClass("checked");
                span.toggleClass("checked", true);
                var value = $this.val();

                data.push(new Item(name, value, group)); // добавляем объект
                // в хранилище

                console.log(span.hasClass("checked"));

            } else { // если кол-во машин/котанеров равно нулю, то нужно
                // удалить объект из хранилища
                var value = $this.val();
                if (value == 0) {
                    // span.removeClass("checked");
                    span.toggleClass("checked", false);
                    var index = '';
                    for (var i = 0; i < data.length; i++) {
                        for ( var property in data[i]) {
                            if (name == data[i][property]) {
                                index = i;
                            }
                        }
                    }
                    data.splice(index, 1); // удаляем элемент из хранилища
                    console.log(span.hasClass("checked"));
                }
            }
        } else { // если кликнули на чекбокс

            if (val == 0) { // галки не было
                console.log("поставили");
                $this.toggleClass("checked", true);
                $input.val(1);
                var value = $input.val();
                data.push(new Item(name, value, group)); // добавляем объект
                // в хранилище

            } else { // нгалка была и сняли ее
                console.log("сняли");
                $this.toggleClass("checked", false);
                $input.val(0);
                var index = '';
                for (var i = 0; i < data.length; i++) {
                    for ( var property in data[i]) {
                        if (name == data[i][property]) {
                            index = i;
                        }
                    }
                }
                data.splice(index, 1); // удаляем элемент из хранилища

            }
        }
        // далее идет установка или снятие типов услуг
        var checkedInputs = $this.closest('.wrapper_inputs').parent().find(
            'span.checked');

        if (checkedInputs.length > 0) {

            if ($input.data('group') == "auto") {
                if (!$('.notebook_list').find('a[data-type="2"]').hasClass(
                        'check_item')) {
                    $('.notebook_list').find('a[data-type="2"]').addClass(
                        'check_item');
                    types.push(2);
                    calculator.update($("input.typeInput"), types);
                }
            } else {
                if (!$('.notebook_list').find('a').not("[data-type=2]")
                        .hasClass('check_item')) {
                    $('.notebook_list').find('a').not("[data-type=2]").each(
                        function() {
                            $(this).addClass('check_item');
                            types.push($(this).data('type'));
                            calculator.update($("input.typeInput"), types);
                        });

                }

            }

        } else {
            if ($input.data('group') == "auto") {

                $('.notebook_list').find('a[data-type="2"]').removeClass(
                    'check_item');
                var searchTypeIndex = types.indexOf($('.notebook_list').find(
                    'a[data-type="2"]').data("type"));
                if (searchTypeIndex > -1) {
                    types.splice(searchTypeIndex, 1);
                }
                calculator.update($("input.typeInput"), types);

            } else {

                $('.notebook_list').find('a').not("[data-type=2]").each(
                    function() {
                        $(this).removeClass('check_item');
                        var searchTypeIndex = types.indexOf($(this).data(
                            "type"));
                        if (searchTypeIndex > -1) {
                            types.splice(searchTypeIndex, 1);
                            calculator.update($("input.typeInput"), types);
                        }

                    });

            }
        }
    }

    function calc() {

        $queryPost = ""; // строка запроса

        if (data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                $queryPost += (i > 0 ? "&" : '') + data[i]['name'] + '='
                    + data[i]['value'];
            }
        }

        $.post("/order/", $queryPost + "&calculator=1", function(res) {

            $("#price").html(
                (res ? res.toString().replace(
                    /(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') : 0));
        }, "json");

    }

    return {
        init : function() {
            $('.selectDistance').find("select").prop("disabled", false);

            $('.selectArea span#city').addClass('check_item');

            $('.calcMap').maphilight(
                {

                    toggleOnClick : true,
                    click : function() {

                        $(".MoscowZoneInput").val(
                            this.getAttribute("data-zone")).change();
                        $(".areaInput").val(1).change();
                        if (!$("span#city").hasClass("check_item")) {
                            $("span#city, span#inTheCountryside")
                                .toggleClass("check_item");
                        }
                        $('area[data-zone="2"]').trigger(
                            'mouseout.maphilight');
                        document.getElementById("distanse").selectedIndex=0;
                        /*$("select[name='order[distance]'] option:last")
                         .attr('selected', true);*/
                        setTimeout(function() {
                            $("select[name='order[distance]']").trigger(
                                'refresh');
                        }, 100);

                    }
                });

            $('area[data-zone="2"]').trigger('mouseover.maphilight').addClass(
                "area-active");
            ;

            $('.result_list_place').html('Вывоз из: Москвы').css('display',
                'list-item');

            // дефолтные значения добавляем сразу в храниилище при инициализации
            var name = $(".areaInput").attr('name');
            $(".areaInput").val(1);
            var value = $(".areaInput").val();
            data.push(new Item(name, value));

            name = $(".MoscowZoneInput").attr('name');
            $(".MoscowZoneInput").val(2);
            value = $(".MoscowZoneInput").val();
            data.push(new Item(name, value));

            name = $('.cInput[name="order[loading_days]"]').attr('name');
            data.push(new Item(name, 1));

            name = $('.cInput[name="order[distance]"]').attr('name');
            value = $('.cInput[name="order[distance]"]').val();
            data.push(new Item(name, value));

            name = $("input.typeInput").attr('name');
            value = [];
            data.push(new Item(name, value));

            console.log(data);

        },
        submit : function(event) {
            var name = "order[name]";
            var value = $('input[name="order[name]"]').val();
            data.push(new Item(name, value));

            name = "order[email]";
            value = $('input[name="order[email]"]').val();
            data.push(new Item(name, value));

            name = "order[phone]";
            if ($('input[name="order[phone]"]').val() !== '') {

                value = $('input[name="order[phone]"]').val();

            } else {
                value = '';
            }
            data.push(new Item(name, value));

            var $queryPost = ""; // строка запроса

            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    $queryPost += (i > 0 ? "&" : '')
                        + data[i]['name']
                        + '='
                        + (typeof data[i]['value'] === 'object' ? data[i]['value']
                            .toString()
                            : data[i]['value']);
                }
            }

            console.log($queryPost);
            $.post("/order/", $queryPost, function(o) {
                if (o !== true) {
                    alert("Проверьте правильность заполнения формы!");

                    shFormErrors($("#calculator_form"), o);
                } else {
                    $('.popupContactForm').hide();

                    showPopup();
                    $(".thankMessage button").click(function() {
                        $('#overlay').remove();
                    });

                    shFormErrors($("#calculator_form"));

                    // yaCounter27018216.reachGoal("order");
                }
            }, "json");

            event = event || window.event;
            event.preventDefault();

        },

        setArea : function($this) {

            $(".areaInput").val($this.attr("data-area"));

            this.update($this);

            $('.result_list_place').css('display', 'list-item').empty();

            $(".selectArea span.orange_link").removeClass('check_item');

            $this.addClass('check_item');

            var active = $('.selectArea span#inTheCountryside').hasClass(
                'check_item');

            var checked = $('.selectArea span#city').hasClass('check_item');

            // if ($this.hasClass('selectbox')) {

            /*
             * if (!active) { $('.selectArea
             * span#inTheCountryside').addClass('check_item');
             * $(".areaInput").val(2); }
             */
            // }
            if (checked) {
                $('.result_list_place').append('Вывоз из: Москвы');

                $(".areaCalcMap area[data-zone='2']").click();
                document.getElementById("distanse").selectedIndex=0;
                /*$("select[name='order[distance]'] option:first").attr(
                 'selected', true);*/
                setTimeout(function() {
                    $("select[name='order[distance]']").trigger(
                        'refresh');
                }, 100);

            } else {
                $('.result_list_place').append('Вывоз из: Подмосковья');

            }

            if (active) {

                $('area').trigger('mouseout.maphilight').removeClass(
                    "area-active");
                // $(".areaCalcMap area[data-zone='2']").click();
            }

            // $('.wrapperCalcMap').toggle(checked);

        },
        setDistance : function($this) {
            // $(".areaInput").val(2);

            $this = $(".areaInput");

            this.update($this, "2");

            $(".selectArea span.orange_link").removeClass('check_item');

            $('.result_list_place').css('display', 'list-item').empty();
            var active = $('.selectArea span#inTheCountryside').hasClass(
                'check_item');

            var checked = $('.selectArea span#city').hasClass('check_item');
            if (!active) {
                $('.selectArea span#inTheCountryside').addClass('check_item');
                // $(".areaInput").val(2);

            }
            // }
            if (checked) {
                $('.result_list_place').append('Вывоз из: Москвы');
            } else {
                $('.result_list_place').append('Вывоз из: Подмосковья');
            }

            if (!active && firstMsk) {
                firstMsk = false;
                // $(".areaCalcMap area[data-zone='2']").click();
            }
            $('area').trigger('mouseout.maphilight').removeClass("area-active");
            // $('.wrapperCalcMap').toggle(checked);
        },
        setService : function(event, $this) {
            $this.toggleClass("check_item");
            if ($this.hasClass("check_item")) {
                types.push($this.data("type")); // если чекнутый, то добавим тип
                // в массив типов
            } else {
                var searchTypeIndex = types.indexOf($this.data("type"));
                if (searchTypeIndex > -1) {
                    types.splice(searchTypeIndex, 1); // если сняли чек, то
                    // нужно убрать тип из
                    // массива
                }
            }

            this.update($("input.typeInput"), types); // обновим данные о
            // типах

            event.preventDefault();
            return false;
        },
        update : function($this) {

            /*
             * if ($this.hasClass("carInput") ||
             * $this.hasClass("containerInput")) { // общее // кол-в // машин
             *
             * sum($this);//подсчет суммы машин и контенеров }
             */

            if (!$this.hasClass("orange_link")
                && !$this.hasClass("MoscowZoneInput")
                && !$this.hasClass("areaInput")
                && !$this.hasClass("typeInput")
                && !$this.hasClass("selectbox")
                && ($this.data('group') != 'area')
                && !$this.hasClass("notRequired")) {

                addServices($this);

            }

            if ($this.hasClass("cInput") || $this.data("area")) { // обновление
                // значения
                // инпута
                if ($this.data("area")) {
                    var name = "order[area]";
                    var value = $(".areaInput").val();
                } else {

                    if ($this.attr("name") == "order[distance]") { // измнения
                        // дистанции
                        this.setDistance($this);
                    }

                    var name = $this.attr("name");

                    var value = (arguments.length == 1) ? $this.val()
                        : arguments[1]; // если в метод update передали
                    // более одного параметра
                }

                for (var i = 0; i < data.length; i++) {
                    for ( var property in data[i]) {
                        if (data[i][property] == name) {
                            data[i].value = value;
                        }
                    }
                }

            }

            sum();// подсчет суммы машин и контенеров

            console.log(data);

            calc(); // вызовем функцию подсчета итоговой цены

        }
    }
})();

$(function() {

    calculator.init(); // инициализация калькулятора

    $('.selectArea span.orange_link').click(function() {
        calculator.setArea($(this));
    });

    $('.input_value span.check').click(function() {
        calculator.update($(this));
    });

    $('.notebook_list a').click(function(event) {
        event = event || window.event;
        calculator.setService(event, $(this));
    });
    $($("#calculator_form").find(".notRequired")).keyup(function() {
        calculator.update($(this));
    });
    $("#calculator_form").find(".cInput").change(function() {
        calculator.update($(this));
    });

    $("#calculator_form").submit(function(event) {
        calculator.submit(event);

    });
    $("#calculator_form").keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

});
