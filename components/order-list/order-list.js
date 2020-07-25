Component({
  mixins: [],
  data: {},
  props: {
    list: []
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 跳转到详情页
    handleGoDetail(e){
      my.navigateTo({
        url: '/pages/chargelistdetail/chargelistdetail'
      });
    }
  },
});
