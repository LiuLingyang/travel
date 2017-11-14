const Regular = require('regularjs');
const service = require('../util/service');
const tpl = require('./index.html');
const _ = require('../util/util');

const travelArr = ['route','briefRoute','duration','distance','busy','description','carbon','modePercent','cost'];
const modeMap = {
    1:'bus',
    2:'self',
    3:'taxi'
}
const app = Regular.extend({

    template: tpl,

    data:{
    	step:0,
        detailShow:true
    },

    config(data){
    	this.supr(data);

		// this.initMap();

        //初始化身份证信息
        this.initId();

		this.$watch('step',step => {
			if(step==0){
                data.detailShow = true;
				data.btnMessage = '查询';
			}else if(step==1){
                data.detailShow = true;
				data.btnMessage = '确定';
			}else if(step==2){
                data.detailShow = false;
				data.btnMessage = '更改出行方式';
			}
		})

        this.$watch('origin',origin => {
            if(!data.used) data.step = 0;
        })
    },

    initId(){
        let data = this.data;
        let u = _.getQueryByKey('u');
        if(!u) return;
        service.getCodeDi({
            codeDi:u
        }).then(result => {
            data.uid = result.Di;
            this.getUserInfo();
            this.$update();
        })
    },

    initMap(){
        let self = this;
    	let data = this.data;

        if(!!this.BMap) return;
		this.BMap = new BMap.Autocomplete(
			{
                input:"suggestId",
                location:'杭州'
            }
		);
		this.BMap.addEventListener("onconfirm", function(event) {
			let value = event.item.value;
			data.city = value.city;
			data.origin = value.city + value.district + value.business;
            data.used = false;
		});

        //定位当前位置
        if(!data.origin){
            let geolocation = new BMap.Geolocation();
            let myGeo = new BMap.Geocoder();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(result){
                        if (result){
                            data.city = result.addressComponents && result.addressComponents.city;
                            data.origin = result.address;
                            self.$update();
                        }
                    });
                }else {
                    _.message('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
        }else{
            setTimeout(() => {
                data.origin = data.origin + ' '; //触发map autocomplete
                self.$update();
            },0)
        }

    },

    getUserInfo(){
    	let data = this.data;
        //先判断已存在数据
        service.getWayToTravel({
            uid:data.uid,
            time:new Date().getTime()
        }).then(result => {
            service.getUserInfo({uid:data.uid}).then(result2 => {
                if(!result.travel_way || result.destination != result2.destination || result.time != result2.time){
                    this.initMap();
                    data.used = false;
                    data.destination = result2.destination;
                    data.time = result2.time;
                    data.formatTime = _.format(+result2.time);
                }else{
                    data.used = true;
                    data.step = 2;
                    data.origin = result.origin;
                    data.destination = result.destination;
                    data.time = result.time;
                    data.formatTime = _.format(+result.time);
                    this.$update();
    
                    let travel_way = result.travel_way;
                    if(travel_way == '驾车出行'){
                        data.mode = 2;
                    }else if(travel_way == '公共交通出行'){
                        data.mode = 1;
                    }else if(travel_way == '打车出行'){
                        data.mode = 3;
                    }
                    this.recordService();
                    this.searchService(2);
                }
            })
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
        let self = this;
    	let data = this.data;
    	if(data.step==0){
            if(!data.uid){
                _.message('请先输入市民卡号或身份证号！','err');
                return;
            }
    		if(!data.city && !data.origin){
    			_.message('请先选择出发地点！','err');
    			return;
    		}
            this.searchService();
    	}else if(data.step==1){
            this.recordService();
    	}else if(data.step==2){
    		data.step = 0;
            this.initMap();
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
    },

    searchService(step){
        let data = this.data;
        if(!data.origin){
            _.message('请选择出发地点','err');
            return;
        }
        let options = {
            uid:data.uid,
            city:data.city,
            origin:data.origin,
            destination:data.destination,
            time:data.time
        }
        service.search(options).then(result => {
            data.step = step || 1;
            if(!data.mode){
                data.mode = result['recommendation'];
            }
            data.result = result;
            this.combineTravelInfo();
            this.$update();
        })
    },

    recordService(){
        let data = this.data;
        if(!data.origin){
            _.message('请选择出发地点','err');
            return;
        }
        let options = {
            uid:data.uid,
            city:data.city,
            origin:data.origin,
            destination:data.destination,
            time:data.time,
            type:data.mode
        }
        service.record(options).then(result => {
            data.step = 2;
            this.$update();
            return service.getPatient({
                uid:data.uid,
                time:data.time,
                duration:data.duration
            });
        }).then(result => {
            data.reserveTime = result.reserveTime;
            data.finishTime = _.format(new Date().getTime() + data.reserveTime*1000);
            data.patientNumber = result.patientNumber;
            data.currentPatientNumber = result.currentPatientNumber;
            if(this.timer) clearInterval(this.timer);
            this.timer = setInterval(this.getLastTime.bind(this),0);
            this.$update();
        })

        // service.count({
        //     uid:data.uid,
        //     time:data.time,
        //     destination:data.destination,
        //     origin:data.origin,
        //     type:data.mode,
        //     create_time:Date.now(),
        //     edit_time:Date.now(),
        // }).then(result => {
        //     debugger
        // })
    },

    getLastTime(){
        let data = this.data;
        var EndTime= new Date(data.finishTime);
        var NowTime = new Date();
        var t =EndTime.getTime() - NowTime.getTime();
        var d=0;
        var h=0;
        var m=0;
        var s=0;
        if(t>=0){
          d=Math.floor(t/1000/60/60/24);
          h=Math.floor(t/1000/60/60%24);
          m=Math.floor(t/1000/60%60);
          s=Math.floor(t/1000%60);
        }
        data.formatReserveTime = d + '天' + h + '小时' + m + '分' + s + '秒';
        this.$update();
    },

    coming(){
        _.message('该功能稍后推出');
    }

})

new app().$inject('#app');