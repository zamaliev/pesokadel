<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Калькулятор</title>
    <!--  ALL CSS FILES #START -->
    <link href="css/style.css" rel="stylesheet" />
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!--  #ALL CSS FILES #END -->

    <!--  ALL JS FILES #START -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script src="js/calc.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <!--  #ALL JS FILES #END -->
</head>
<body>
<div class="row calc">
    <div class="well col-md-5">
    <p>
        <b> 1.Выберите услугу:</b>
        <span class="uslugi"><input type="checkbox" value="100" onchange="calc()" id="simplemysor" class="test"/> Вывоз мусора</span>
        <span class="uslugi"><input type="checkbox" value="200" onchange="calc()" id="grunt"/> Вывоз грунта</span>
        <span class="uslugi"><input type="checkbox" value="300" onchange="calc()" id="hardmysor" /> Вывоз строительного мусора<br /></span>
    </p>
    <hr>
    <div class="row">
        <div class="car col-md-3">
            <i></i> САМОСВАЛЫ <br>
            <input style="margin-top: 25px;" type="number" id="cars" class="form-control" min="0" max="20">
        </div>
        <div class="contaner col-md-3">
            <i></i> <span class="itext">КОНТЕЙНЕР</span><br>
            <input style="margin-top: 25px;"type="number" id="cars" class="form-control" min="0" max="20">
        </div>
    </div>

    <b>Стоимость: </b><div id="result">0</div> руб.
</div></div>

</body>
</html>