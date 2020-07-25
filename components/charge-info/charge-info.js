Component({
  mixins: [],
  data: {
    chargeInfoList: []
  },
  props: {
    code: "", //设备号
    areaname: "", //小区名称
    chargeInfo: "", //充电信息
  },
  deriveDataFromProps(nextProps){
    if(nextProps.chargeInfo){
      const chargeInfoList= nextProps.chargeInfo.split('\n')
      this.setData({
        chargeInfoList
      })
    }
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 关闭弹框
    handleCloseChargeInfo(){
      this.$page.handleCloseChargeInfo()
    }
  },
});
