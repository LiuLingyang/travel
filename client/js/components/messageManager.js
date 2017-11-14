let Regular = require('regularjs');
let Message = require('./message');

let tpl = `
  <ul class="m-messages" ref=box></ul>
`;

module.exports = Regular.extend({
  name: 'messageManager',
  template: tpl,
  config(data) {
    data.messages = [];
  },
  add(message, type) {
    var oLi = document.createElement('li');
    oLi.className = 'message-item';
    var box = this.$refs.box;
    box.insertBefore(oLi, box.firstChild);
    new Message({
      data: {
        message: {
          text: message,
          type: type
        },
        container: oLi
      }
    }).show().$on('close', (container) => {
      box.removeChild(container);
    });
  },

  addDetail(message, value) {
    var oLi = document.createElement('li');
    oLi.className = 'message-item';
    var box = this.$refs.box;
    box.insertBefore(oLi, box.firstChild);
    new Message({
      data: {
        message: {
          text: message,
          value: value,
          type: 'err'
        },
        container: oLi
      }
    }).show().$on('close', (container) => {
      box.removeChild(container);
    });
  },

  delMessage() {

    this.$update();
  }

});