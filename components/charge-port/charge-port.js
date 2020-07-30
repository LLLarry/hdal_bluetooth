Component({
  mixins: [],
  data: {},
  props: {
    portList: [], //端口列表
    selectPort: null, //选中端口
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleSelectPort(e){
      const item= e.target.dataset.item
      if([2,4].includes(item.portStatus-0)){
         return my.showToast({
            content: item.portStatus == 2 ? '该端口已被占用' : '改端口为故障端口',
            duration: 1000,
          });
      }
      this.$page.handleSetSelectPort(item.port)
    }
  },
});
