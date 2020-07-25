Component({
  mixins: [],
  data: {},
  props: {
    code: "", //设备号 / 设备号-端口号
    equname: "", //设备名称
    phonenum: "", //电话
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleOpenChargeInfo(){
      this.$page.handleOpenChargeInfo()
    }
  },
});
