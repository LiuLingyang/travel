const Regular = require('regularjs');
const service = require('../util/service');
const tpl = require('./index.html');
const _ = require('../util/util');

const travelArr = ['route','duration','distance','busy','description','carbon','modePercent'];
const modeMap = {
    1:'bus',
    2:'self',
    3:'taxi'
}
const app = Regular.extend({

    template: tpl,

    data:{
    	step:0
    },

    config(data){
    	this.supr(data);

		this.initMap();

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
			{
                input:"suggestId",
                location:'杭州'
            }
		);
		ac.addEventListener("onconfirm", function(event) {
			let value = event.item.value;
			data.city = value.city;
			data.origin = value.business;
		});
    },

    getUserInfo(){
    	let data = this.data;

    	service.getUserInfo({uid:data.uid}).then(result => {
    		data.destination = result.destination;
            data.time = result.time;
    		data.formatTime = _.format(+result.time);
    		this.$update();
    	})
    },

    changeMode(mode){
        let data = this.data;
    	data.mode = mode;
        if(data.result){
            this.combineTravelInfo();
        }
    },

    confirm(){
    	let data = this.data;
    	if(data.step==0){
            if(!data.uid){
                alert('请先输入市民卡号或身份证号！');
                return;
            }
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
    				data.mode = result['recommendation'];
    			}
                data.result = result;
                this.combineTravelInfo();

    			this.$update();
    		})
    	}else if(data.step==1){
    		let options = {
                uid:data.uid,
    			city:data.city,
    			origin:data.origin,
    			destination:data.destination,
    			time:data.time,
                type:data.mode
    		}
    		service.confirm(options).then(result => {
    			data.step = 2;
                this.$update();
                return service.getPatient({
                    uid:data.uid,
                    time:data.time
                });
    		}).then(result => {
                data.reserveTime = result.reserveTime;
                data.patientNumber = result.patientNumber;
                data.currentPatientNumber = result.currentPatientNumber;
                this.$update();
            })
    	}else if(data.step==2){
    		data.step = 0;
    		this.$update();
    	}
    },

    combineTravelInfo(){
        let data = this.data;
        let travelObj = data.result[modeMap[data.mode]];
        travelArr.forEach(item => {
            if(!!travelObj[item]){
                data[item] = travelObj[item];
            }else{
                delete data[item];
            }
        })
    }

})



new app().$inject('#app');