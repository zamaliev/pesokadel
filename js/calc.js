function calc() {
    var simplemysorprice = ($('#simplemysor').is(":checked") ? $('#simplemysor').attr("value") : 0);
    document.getElementById('result').innerHTML = simplemysorprice;
}