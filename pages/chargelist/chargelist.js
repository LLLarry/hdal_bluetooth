
Page({
  data: {
    list: [],
    time: ''
  },
  onLoad() {
    // const date= getDate('2020-07-23T07:42:53.000+0000')
    // this.setData({
    //   time: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    // })

    setTimeout(() => {
      this.setData({
        list: [
          {
            id: 1,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          },
          {
            id: 2,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          },
          {
            id: 3,
            time: '2020-05-23 16:22:45',
            status: 1,
            chargetime: '04:23',
            money: 1
          }
        ]
      })
    }, 300);
  }
});
