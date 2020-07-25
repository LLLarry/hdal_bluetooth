Component({
  mixins: [],
  data: {
    isshow: false //是否显示，关闭微信小程序
  },
  props: {
    
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    toggleCloseMiniPro(flag){
      this.setData({
        isshow: flag
      })
    }
  },
});
