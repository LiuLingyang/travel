let extend = require('regularjs').util.extend;
let MessageManager = require('../components/messageManager');

function obj2query(data){
	let query = '';
	if( !data ) return query;
	for( let i in data ){
	  	query += `${i}=${encodeURIComponent(data[i])}&`
	}
	return query.replace(/&$/, '');
}

/**
 * 时期格式化
 */
let fmap = {
  yyyy(date) {
    return date.getFullYear();
  },
  MM(date) {
    return fix(date.getMonth() + 1);
  },
  dd(date) {
    return fix(date.getDate());
  },
  HH(date) {
    return fix(date.getHours());
  },
  mm(date) {
    return fix(date.getMinutes());
  },
  ss(date) {
    return fix(date.getSeconds());
  }
};
let keys = Object.keys || function (obj) {
  let ret = [];
  for (let i in obj) {
    ret.push(i);
  }
  return ret;
};
let trunk = new RegExp(keys(fmap).join('|'), 'g');
function fix(str) {
  str = '' + str;
  return str.length <= 1 ? '0' + str : str;
}
function format(value,format){
	format = format || 'yyyy-MM-dd HH:mm:ss';
	if(!value) return;
	value = new Date(value);
	return format.replace( trunk, (cap) => fmap[cap]? fmap[cap](value): '');
}

/**
 * @param  {[String]} key query键
 * @param  {[String]} url
 * @return {[String]} query值
 */
function getQueryByKey(key, url) {
  if (!url) {
    url = window.location.href;
  }
  key = key.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let messageManager;
function message(message, status) {
  if (!messageManager) {
    messageManager = new MessageManager({
      data: {}
    }).$inject(document.body);
  }

  status = status || 'ok';

  messageManager.add(message, status);
}


module.exports = {
	obj2query,
	extend,
  format,
  getQueryByKey,
  message
}
