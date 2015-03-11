game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO
                me.input.bindKey(me.input.KEY.ENTER,"start");
                me.game.world.addChild(new (me.Renderable.extend({
                    init:function(){
                        this._super(me.Renderable,'init', [270,240,300,50]);
                        this.font= new me.Font("Arial", 46, "white");
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this),true);
                        
                    },
                    draw:function(renderer){
                        this.font.draw(renderer.getContext(), "Awesomenauts", 400 , 130);
                        this.font.draw(renderer.getContext(), "Start NEW game", this.pos.x , this.pos.y);
                    },
                    update:function(dt){
                        return true;
                    },
                    newGame:function(){
                        me.input.releasePointerEvent('pointerdown',this);
                        me.save.remove('exp');
                        me.save.remove('exp1');
                        me.save.remove('exp2');
                        me.save.remove('exp3');
                        me.save.remove('exp4');
                        me.state.change(me.state.PLAY);
                    }
                })));
                
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		
            }
});
