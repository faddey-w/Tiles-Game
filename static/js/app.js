/*
  Tiles Classic Game
  andy.pro
  angular
  09.06.2016
*/


angular.module('TilesGame', [
  //
])
.component('tilesTable', {
  template: [
    '<div id="tile-table" class="container">',
      '<congra-tulations ng-show="$ctrl.gameover"></congra-tulations>',
      '<tile-element ng-repeat="tile in $ctrl.tiles"></tile-element>',
    '</div>',
    '<btn-restart></btn-restart>'
  ].join(''),
  controller: ['$filter', function TilesTable($filter) {
    var font = [
      "bluetooth", "camera-retro", "envira", "bank",
      "binoculars", "car", "firefox", "soccer-ball-o"
    ];
    this.restart = function() {
      var rnd =	$filter('randomSequense')(0, 15);
      this.tiles = $filter('randomTiles')(rnd, font);
      this.formerTile = undefined;
      this.count = 8;
      this.gameover = false;
    };
    this.restart();
  }]
})
.directive('tileElement', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'static/views/tile.html',
    link: function(scope, element, attr) {

      function getId(tile) {
        return tile.attributes['data-icon-id'].value;
      }

      function dfrAction(data) {
        // here we can apply animations
        $timeout(function() {
          switch(data.action) {
            case 'close':
              data.tile1.image = '';
              data.tile2.image = '';
              break;
            case 'disappear':
              data.tile1.innerHTML = '';
              data.tile2.innerHTML = '';
              break;
            //case
          }
        }, data.timeout);
      }

      scope.click = function() {

        var ctrl = scope.$parent.$ctrl; // shortcut to controller scope
        if(!scope.tile.image) scope.tile.image = scope.tile.class; //open the tile, 'if' - for test
        var thisTile = element[0]; // get root div of the current tile

        if(ctrl.formerTile === undefined) { // is a first click for pair?
          ctrl.formerTile = {
            el: thisTile,
            tile: scope.tile
          }
        }
        else { // this is a second click for pair

          if(ctrl.formerTile.el === thisTile) {
            // need to close the tile, it is the same!
            scope.tile.image = '';
          } else {
            // different tiles
            if(getId(ctrl.formerTile.el) === getId(thisTile)) {
              // the contents of the tiles is same, both should disappear
              dfrAction({
                tile1: thisTile,
                tile2: ctrl.formerTile.el,
                action: 'disappear',
                timeout: 1000
              });
              ctrl.count--;
              if(!ctrl.count) ctrl.gameover = true;
            } else{
              // different contents, both should close
              dfrAction({
                tile1: scope.tile,
                tile2: ctrl.formerTile.tile,
                action: 'close',
                timeout: 1000
              });
            }
          }
          // after second click we must reset previous tile
          ctrl.formerTile = undefined;
        }
      };
      // prepare font awesome classes
      scope.tile.class = "fa fa-" + scope.tile.icon + " fa-5x";
      scope.tile.image = "";
      //scope.tile.image = scope.tile.class; // uncomment this for God-mode
    }
  };
}])
.directive('btnRestart', [function() {
  return {
    restrict: 'E',
    template: [
      '<div class="center spaced padded">',
        '<button class="btn large aquamarin rounded" ng-click="$ctrl.restart()">Restart</button>',
      '</div>'
    ].join('')
  };
}])
.directive('congraTulations', [function() {
  return {
    restrict: 'E',
    replace: true,
    template: [
      '<div class="congratulations">',
        '<button class="btn large rounded orange" ng-click="$ctrl.restart()">Congratulations!</button>',
      '</div>'
    ].join('')
  };
}])
.filter('randomSequense', function() {
  return function(begin, end) {
    // or use the underscore.js _.range()
    var array = [];
    for(var i = begin; i <= end; i++) array.push(i);
    //  and _.shuffle() functions.
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
})
.filter('randomTiles', function() {
  return function(rnd, font) {
    var tiles = [];
    rnd.forEach(function(id) {
      if(id > 7) id -= 8;
      tiles.push({
        id: id,
        icon: font[id]
      });
    });
    return tiles;
  }
});
