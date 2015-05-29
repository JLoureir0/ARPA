exports.handleProduct = function(product_name){
    var allergen = null;
    if(product_name.indexOf("leite") >= 0
        || product_name.indexOf("Leite") >= 0
        || product_name.indexOf("iogurte") >= 0
        || product_name.indexOf("Iogurte") >= 0
        || product_name.indexOf("queijo") >= 0
        || product_name.indexOf("Queijo") >= 0
        || product_name.indexOf("manteiga") >= 0
        || product_name.indexOf("Manteiga") >= 0
    ){
        allergen = "lacteos";
    }
    else if(product_name.indexOf("marisco") >= 0
        || product_name.indexOf("Marisco") >= 0
        || product_name.indexOf("camarão") >= 0
        || product_name.indexOf("Camarão") >= 0
        || product_name.indexOf("Caranguejo") >= 0
        || product_name.indexOf("caranguejo") >= 0
    ){
        allergen = "marisco";
    }

    else if(product_name.indexOf("bolachas") >= 0
        || product_name.indexOf("Bolachas") >= 0
        || product_name.indexOf("pão") >= 0
        || product_name.indexOf("Pão") >= 0
        || product_name.indexOf("trigo") >= 0
        || product_name.indexOf("Trigo") >= 0
        || product_name.indexOf("cevada") >= 0
        || product_name.indexOf("Cevada") >= 0
        || product_name.indexOf("cerveja") >= 0
        || product_name.indexOf("Cerveja") >= 0
        || product_name.indexOf("Pizza") >= 0
        || product_name.indexOf("pizza") >= 0
    ){
        allergen = "gluten";
    }

    else if(product_name.indexOf("amendoins") >= 0
        || product_name.indexOf("Amendoins") >= 0
        || product_name.indexOf("avelã") >= 0
        || product_name.indexOf("Avelã") >= 0
        || product_name.indexOf("Caju") >= 0
        || product_name.indexOf("caju") >= 0
        || product_name.indexOf("pinhões") >= 0
        || product_name.indexOf("Pinhões") >= 0
        || product_name.indexOf("pistachio") >= 0
        || product_name.indexOf("Pistachio") >= 0
        || product_name.indexOf("Amendoim") >= 0
        || product_name.indexOf("amendoim") >= 0
    ){
        allergen = "amendoins";
    }

    else if(product_name.indexOf("ovo") >= 0
        || product_name.indexOf("Ovo") >= 0
        || product_name.indexOf("ovos") >= 0
        || product_name.indexOf("Ovos") >= 0
    ){
        allergen = "ovos";
    }

    else if(product_name.indexOf("mostarda") >= 0
        || product_name.indexOf("Mostarda") >= 0
        || product_name.indexOf("mostardas") >= 0
        || product_name.indexOf("Mostardas") >= 0
    ){
        allergen = "mostarda";
    }
    else if(product_name.indexOf("mostarda") >= 0
        || product_name.indexOf("Mostarda") >= 0
        || product_name.indexOf("mostardas") >= 0
        || product_name.indexOf("Mostardas") >= 0
    ){
        allergen = "mostarda";
    }

    else if(product_name.indexOf("peixe") >= 0
        || product_name.indexOf("Peixe") >= 0
        || product_name.indexOf("carapau") >= 0
        || product_name.indexOf("Carapau") >= 0
        || product_name.indexOf("Pescada") >= 0
        || product_name.indexOf("pescada") >= 0
        || product_name.indexOf("cherne") >= 0
        || product_name.indexOf("Cherne") >= 0
        || product_name.indexOf("bacalhau") >= 0
        || product_name.indexOf("Bacalhau") >= 0
        || product_name.indexOf("tamboril") >= 0
        || product_name.indexOf("Tamboril") >= 0
    ){
        allergen = "peixe";
    }

    else if(product_name.indexOf("sesamo") >= 0
        || product_name.indexOf("Sesamo") >= 0
        || product_name.indexOf("Sêsamo") >= 0
        || product_name.indexOf("sêsamo") >= 0
    ){
        allergen = "sesamo";
    }

    else if(product_name.indexOf("vinho") >= 0
        || product_name.indexOf("Vinho") >= 0
        || product_name.indexOf("espumante") >= 0
        || product_name.indexOf("Espumante") >= 0
    ){
        allergen = "so2";
    }

    else if(product_name.indexOf("soja") >= 0
        || product_name.indexOf("Soja") >= 0
    ){
        allergen = "soja";
    }

    else if(product_name.indexOf("tremoço") >= 0
        || product_name.indexOf("Tremoço") >= 0
        || product_name.indexOf("tremoços") >= 0
        || product_name.indexOf("Tremoços") >= 0
    ){
        allergen = "tremocos";
    }









    return allergen;
}