Component({
  mixins: [],
  data: {},
  props: {
    phone: ''
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 拨打电话
    handleCall(){
      my.makePhoneCall({ number: this.props.phone })
    }
  },
});
