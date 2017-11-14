let Regular = require('regularjs');

let tpl = `
	<div class="m-message m-message-{message.type}" r-anim='on:enter; wait: 0; class: z-show, 3; on:leave;wait: 0; class: z-show, 4;'  >
		<span>{message.text}</span>
	</div>
`;

module.exports = Regular.extend({
	
	name: 'message',
	
	template: tpl,                                                                

	data: {},
	
	detailShowed: false,
	
	init() {

		this.$watch('!!show', function( show ){
      
      this.$inject(show? this.data.container : false);

    });

    this.$on('$destroy', () => {
    	clearTimeout(this.closeTimer);
    })

	},

	show() {
		this.data.show = true;

		if (this.closeTimer) clearTimeout(this.closeTimer);

		this.closeTimer = setTimeout(() => {
			if (this.data.show) {
				this.close();
			}
		}, 3000)
		this.$update();
		return this;
	},

	close() {
		this.data.show = false;
		setTimeout(() => {
  		this.$emit('close', this.data.container);
  	}, 350)
		this.$update();
		return this;
	}

})
