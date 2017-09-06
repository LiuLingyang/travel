let fetch = require('../util/fetch');

const hostIp = 'http://116.62.148.154:8080';
const mock = false;

let service = {

	getUserInfo(data){
		if(mock){
			return new Promise((resolve, reject) => {
			    resolve({
					destination:'市一医院',          //医院
					time:'1502257800000'             //就诊时间
				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/history',{
			method:'GET',
			data:data
		});
	},

	search(data){
		if(mock){
			return new Promise((resolve, reject) => {
			    resolve({
			    	recommendation:1,
				    bus:{
				      	route:'步行，地铁1号线(湘湖--临平)到达终点',   //行程路线
				      	briefRoute:'这是简要路线',        //简要路线
				      	duration:'8分钟',                  //行程时间（分钟）
				      	distance:'3公里',                  //行程距离（公里）
				      	busy:'中',                    //繁忙程度
				      	description:'轻度',           //拥堵程度
				      	carbon:0.222,                 //减少的碳排量（千克）
				      	modePercent:'30%',            //同种出行方式占比
						cost:'2元'                    //费用
				    },
				    self:{
				        route:'经过秋涛路、解放东路、解放路到达终点',
				      	duration:30,
				      	distance:50,
				      	busy:'中',
				      	description:'轻度',
				      	modePercent:'50%'
				    },
				    taxi:{
				      	duration:30,
				      	distance:50,
				      	modePercent:'20%',
				      	cost:'30元'
				    }
				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/od',{
			method:'POST',
			data:data
		});
	},

	record(data){
		if(mock){
			 return new Promise((resolve, reject) => {
			    resolve({

				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/record',{
			method:'POST',
			data:data
		});
	},

	getPatient(data){
		if(mock){
			return new Promise((resolve, reject) => {
			    resolve({
						reserveTime: 600000,
				    patientNumber: 100,
				    currentPatientNumber: 10
				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/patient/number',{
			method:'GET',
			data:data
		});
	},

	getWayToTravel(data){
		if(mock){
			return new Promise((resolve, reject) => {
		    resolve({
					"origin": "浙江省杭州市江干区钱江路",
	        "destination": "杭州市妇产科医院",
	        "time": "2017-09-29 19:30:00",
	        "travel_way": "驾车出行"
				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/getWayToTravel',{
			method:'GET',
			data:data
		});
	},

	getCodeDi(data){
		if(mock){
			return new Promise((resolve, reject) => {
		    resolve({
					Di:'330724199204142913'
				});
			});
		}

		return fetch(hostIp + '/odhbase/rest/getCodeDi',{
			method:'GET',
			data:data
		});
	},

}

module.exports = service;