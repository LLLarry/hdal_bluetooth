Component({
  mixins: [],
  data: {},
  props: {
     templatelist: [], //模板列表
     defaultIndex: 0, //默认选中索引
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 点击开始充电按钮
    handleSubmit(){
      this.$page.handleSubmit()
    }
  },
});
