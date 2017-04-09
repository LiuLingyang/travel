let tpl = '\
<div class="m-info">\
	<div class="blk">\
		<div class="txt">出发地点</div>\
	</div>\
	<div class="blk">\
		<div class="txt">就诊医院</div>\
	</div>\
	<div class="blk">\
		<div class="txt">就诊时间</div>\
	</div>\
</div>'


module.export = Regular.extend({
	name:'travel-info',

    template: tpl,

    config(data){
    	
    },


})
