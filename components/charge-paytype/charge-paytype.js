Component({
  mixins: [],
  data: {},
  props: {
    ifwallet: 2, //是否强制钱包支付, 1、强制   2、不知强制
    paytype: 1, //支付类型
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 设置paytype
    onCheckClick(e){
      const paytype= e.target.dataset.val
      this.$page.handleSetPayType(paytype)
    }
  },
});
