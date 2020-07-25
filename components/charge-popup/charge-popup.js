Component({
  mixins: [],
  data: {},
  props: {
    paytypeShow: '', 
    chargeInfoShow: '',
    from: 1, // 1为默认是所有端口充电， 2是来自扫描单个端口充电
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    //关闭收费说明弹框
    onPopupClose(){
      this.$page.onPopupClose()
    },
    //关闭收费说明弹框
    handleCloseChargeInfo(){
      this.$page.handleCloseChargeInfo()
    }
  },
});
