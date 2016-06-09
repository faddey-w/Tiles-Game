/*
  Example how to separate business logic and technology
  faddey
  09.06.2016

  fork of:
  Tiles Classic Game
  andy.pro
  angular
  09.06.2016
*/


angular.module('TilesGame', ['ngAnimate'])
.component('tilesTable', {
    templateUrl: 'static/views/tiles_table.html',
    controller: ['$timeout', function($timeout) {
        this.icons = [
          "bluetooth", "camera-retro", "envira", "bank",
          "binoculars", "car", "firefox", "soccer-ball-o"
        ];
        this.restart = function() {
            var self = this;
            this.game = new Game({
                num_tiles: 16,
                num_types: 8,
                on_mistake: show_both_500ms,
                on_remove: show_both_500ms
            });
          window.game = this.game;
        };
        this.restart();
        this.ignored_hide = {};

        var self = this;
        function show_both_500ms(tile_id, former_tile_id) {
            self.ignored_hide[tile_id] = true;
            self.ignored_hide[former_tile_id] = true;
            $timeout(function() {
                self.ignored_hide[tile_id] = false;
                self.ignored_hide[former_tile_id] = false;
            }, 500);
        }
    }]
});
