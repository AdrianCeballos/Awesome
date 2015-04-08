game.MiniMap = me.Entity.extend({
    init: function (x,y,settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "minimap",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 100)).toPolygon();
                }
            }]);
        this.floating = true;
    }
});

