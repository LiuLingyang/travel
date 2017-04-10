let fetch = require('../util/fetch');

let service = {

	getUserInfo(data){
		// return new Promise((resolve, reject) => {
		//     resolve({
		// 		destination:'市一医院',          //医院
		// 		time:'1490774273429'             //就诊时间
		// 	});
		// });
		return fetch('http://122.224.104.142:9913/odhbase/rest/history',{
			method:'GET',
			data:data
		});
	},

	search(data){
		// return new Promise((resolve, reject) => {
		//     resolve({
		// 	    bus:{
		// 	      	route:'步行，地铁1号线(湘湖--临平)到达终点',   //行程路线
		// 	      	duration:50,                  //行程时间（分钟）
		// 	      	distance:60,                  //行程距离（公里）  
		// 	      	busy:'中',                    //繁忙程度
		// 	      	description:'轻度',           //拥堵程度
		// 	      	carbon:0.222,                 //减少的碳排量（千克）
		// 	      	modePercent:'30%'             //同种出行方式占比 
		// 	    },
		// 	    self:{
		// 	        route:'经过秋涛路、解放东路、解放路到达终点',
		// 	      	duration:30,
		// 	      	distance:50,
		// 	      	busy:'中',
		// 	      	description:'轻度',
		// 	      	modePercent:'50%'
		// 	    },
		// 	    taxi:{
		// 	      	duration:30,
		// 	      	distance:50,
		// 	      	modePercent:'20%'
		// 	    }
		// 	});
		// });
		return fetch('http://122.224.104.142:9913/odhbase/rest/od',{
			method:'POST',
			data:data
		});
	},

	confirm(data){
		// return new Promise((resolve, reject) => {
		//     resolve({
				
		// 	});
		// });
		return fetch('http://122.224.104.142:9913/rest/record',{
			method:'POST',
			data:data
		});
	},

	getPatient(data){
		// return new Promise((resolve, reject) => {
		//     resolve({
		// 		reserveTime: "1小时15分钟",
		// 	    patientNumber: 100,
		// 	    currentPatientNumber: 10
		// 	});
		// });
		return fetch('http://122.224.104.142:9913/odhbase/rest/patient/number',{
			method:'GET',
			data:data
		});
	},

}

module.exports = service;