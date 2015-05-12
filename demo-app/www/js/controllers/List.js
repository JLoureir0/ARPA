angular.module('demo-app')

.controller('ListController', ListController);

function ListController($ionicLoading, productFactory) {
  var vm = this;

  vm.list = [{
    Name          : 'Leite Aromatizado Cereais',
    Brand         : 'MIMOSA',
    Description   : 'emb. 4 x 200 ml',
    RetailPrice   : '1.6',
    UrlLargeImage : 'http://media.continente.pt/Sonae.eGlobal.Presentation.Web.Media/media.axd?resourceSearchType=2&resource=ProductId=4678922(eCsf$RetekProductCatalog$MegastoreContinenteOnline$Continente)&siteId=1&channelId=1&width=180&height=170&defaultOptions=1',
    ItemID        : '4678922'
  }];
}
