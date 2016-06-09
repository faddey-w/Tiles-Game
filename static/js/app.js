/*
  Tiles Classic Game
  andy.pro
  angular
  09.06.2016
*/


angular.module('TilesGame', ['ngAnimate'])
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
      /*var1: 1-dim array(1x16) - all tales with 'quarter' class(25%) and 'float:left'
        var2: 2-dim array(4x4):
          tile-table > div {display: block} this is rows
          tile-table > div > div {display: inline-block} this is cells
      */
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

      function dfrAction(data) { // some deferred actions
        // here we can apply animations
        $timeout(function() {
          switch(data.action) {
            case 'close':
              data.tile1.tile.show = false;
              data.tile2.tile.show = false;
              break;
            case 'disappear':
              data.tile1.tile.show = false;
              data.tile2.tile.show = false;
              dfrAction({
                tile1: data.tile1,
                tile2: data.tile2,
                action: 'empty',
                timeout: 500
              });
              break;
            case 'empty':
              data.tile1.el.innerHTML = '';
              data.tile2.el.innerHTML = '';
              break;
          }
        }, data.timeout);
      }

      scope.click = function() {

        var ctrl = scope.$parent.$ctrl, // shortcut to controller scope
            thisTile = {
              el: element[0], // get root div of the current tile
              tile: scope.tile
            };

        thisTile.tile.show = true;

        if(ctrl.formerTile === undefined) { // is a first click for pair?
          ctrl.formerTile = thisTile;
        } else { // this is a second click for pair
          if(ctrl.formerTile.el === thisTile.el) {
            // need to close the tile, it is the same!
            thisTile.tile.show = false;
          } else {
            // different tiles
            if(getId(ctrl.formerTile.el) === getId(thisTile.el)) {
              // the contents of the tiles is same, both should disappear
              dfrAction({
                tile1: thisTile,
                tile2: ctrl.formerTile,
                action: 'disappear',
                timeout: 1000
              });
              ctrl.count--;
              if(!ctrl.count) ctrl.gameover = true;
            } else{
              // different contents, both should close
              dfrAction({
                tile1: thisTile,
                tile2: ctrl.formerTile,
                action: 'close',
                timeout: 1000
              });
            }
          }
          // after second click we must reset previous tile
          ctrl.formerTile = undefined;
        }
      };
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
        icon: font[id],
        show: false // change this to 'true' for God-mode
      });
    });
    return tiles;
  }
});
