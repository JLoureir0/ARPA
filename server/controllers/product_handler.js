exports.handleProduct = function(product_name){
    var allergen = null;
    if(product_name.indexOf("leite") >= 0
        || product_name.indexOf("Leite") >= 0
        || product_name.indexOf("iogurte") >= 0
        || product_name.indexOf("Iogurte") >= 0
        || product_name.indexOf("queijo") >= 0
        || product_name.indexOf("Queijo") >= 0
        || product_name.indexOf("manteiga") >= 0
        || product_name.indexOf("Manteiga") >= 0) {
        allergen = "lacteos";
    }
    else if(product_name.indexOf("marisco") >= 0
        || product_name.indexOf("Marisco") >= 0
        || product_name.indexOf("camarão") >= 0
        || product_name.indexOf("Camarão") >= 0) {
        allergen = "lacteos";
    }

    return allergen;
}