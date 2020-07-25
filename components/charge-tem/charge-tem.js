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
    handleSelectTem(e){
      const index= e.target.dataset.index
      this.$page.handleSelectTem(index)
    }
  },
});
