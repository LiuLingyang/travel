let service = require('../util/service');

let tpl = '\
<div class="m-info">\
	<div class="blk">\
		<input type="text" placeholder="出发地点" id="suggestId"/>\
	</div>\
	<div class="blk">\
		<input type="text" placeholder="就诊医院" disabled r-model={destination}/>\
	</div>\
	<div class="blk">\
		<input type="text" placeholder="就诊时间" disabled r-model={time}/>\
	</div>\
</div>\
<div class="m-drive f-cb">\
	<div class="item item-1" r-class={{"item-1-active":mode=="self"}} on-click={this.changeMode("self")}>\
		<div class="ttl">驾车出行</div>\
		<div class="img"><img/></div>\
	</div>\
	<div class="item item-2" r-class={{"item-2-active":mode=="bus"}} on-click={this.changeMode("bus")}>\
		<div class="ttl">公共交通出行</div>\
		<div class="img"><img/></div>\
	</div>\
	<div class="item item-3" r-class={{"item-3-active":mode=="taxi"}} on-click={this.changeMode("taxi")}>\
		<div class="ttl">打车出行</div>\
		<div class="img"><img/></div>\
	</div>\
</div>\
<div class="m-trip f-cb" r-hide={step==0}>\
	<div class="ln"><div class="wrd"><span class="f-fwb">行程路线：</span>经过平海路达到终点</div></div>\
	<div class="ln ln-1"><div class="wrd"><span class="f-fwb">行程时间：</span>50min</div></div>\
	<div class="ln ln-1"><div class="wrd"><span class="f-fwb">公里里程：</span>40公里</div></div>\
	<div class="ln ln-1"><div class="wrd"><span class="f-fwb">繁忙程度：</span>中</div></div>\
	<div class="ln ln-1"><div class="wrd"><span class="f-fwb">拥堵程度：</span>轻度拥堵</div></div>\
	<div class="ln"><div class="wrd">本行程共减少碳排量0.222kg</div></div>\
	<div class="ln"><div class="wrd">有35%的杭州市民选中与您同样的出行方式</div></div>\
</div>\
<div class="m-plan" r-hide={step==0 || step==1}>\
	您已经选定出行规划<br>\
	距离建议出行时间还有<b>10小时20分钟</b><br>\
	您的就诊号是<b>50</b>号，当前到了<b>100</b>号\
</div>\
<div class="m-confirm">\
	<div class="u-btn" on-click={this.confirm($event)}>{btnMessage}</div>\
</div>\
'

let app = Regular.extend({

    template: tpl,

    data:{
    	step:0
    },

    config(data){
    	this.supr(data);

		this.initMap();

		this.getFullInfo();

		this.$watch('step',step => {
			if(step==0){
				data.btnMessage = '查询';
			}else if(step==1){
				data.btnMessage = '确定';
			}else if(step==2){
				data.btnMessage = '更改出行方式';
			}
		})
    },

    initMap(){
    	let data = this.data;
		let ac = new BMap.Autocomplete(
			{"input" : "suggestId"}
		);
		ac.addEventListener("onconfirm", function(event) {
			let value = event.item.value;
			data.city = value.city;
			data.origin = value.business;
		});
    },

    getFullInfo(){
    	let data = this.data;

    	service.get().then(result => {
    		data.destination = result.destination;
    		data.time = result.time;
    		this.$update();
    	})
    },

    changeMode(mode){
    	this.data.mode = mode;
    },

    confirm(){
    	let data = this.data;
    	if(data.step==0){
    		if(!data.city && !data.origin){
    			alert('请先选择出发地点！');
    			return;
    		}
    		let options = {
    			city:data.city,
    			origin:data.origin,
    			destination:data.destination,
    			time:data.time
    		}
    		service.search(options).then(result => {
    			data.step = 1;
    			if(!data.mode){
    				data.mode = 'self';
    			}
    			this.$update();
    		})
    	}else if(data.step==1){
    		let options = {
    			city:data.city,
    			origin:data.origin,
    			destination:data.destination,
    			time:data.time
    		}
    		service.confirm(options).then(result => {
    			data.step = 2;
    			this.$update();
    		})
    	}else if(data.step==2){
    		data.step = 0;
    		this.$update();
    	}
    }

})



new app().$inject('#app');