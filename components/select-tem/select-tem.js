Component({
  mixins: [],
  data: {},
  props: {
    temList: [], // 模板list
    defaultIndex: -1, //默认选中索引
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleSelectTem(options){
      const item= options.target.dataset.item
      const index= options.target.dataset.index
      this.$page.selectTem(item,index)
    },
  },
});
