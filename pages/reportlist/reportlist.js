var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    alcType:[],
    report:[],
    startDate:"2017-05-01",
    endDate:"2017-05-10",
    selectedReport:[]
  },

  //加载本地数据
  onLoad: function () {
    console.log('onLoad')

    this.setData({
      alcType: wx.getStorageSync('alcType'),
      report: wx.getStorageSync('report')
    })
    
    console.log("完整记录",this.data.report)

    if (this.data.alcType == []) {
      this.setData({
        alcType: app.globalData.defaultType
      })
      wx.setStorageSync('alcType', this.data.alcType)
      console.log("use default type")     
    }

    //更新截止日期至今日
    var todayFull=util.formatTime(new Date)
    var today=todayFull.split(" ")[0].split("/").join("-")
    this.setData({
      endDate: today
    })
    console.log("今天是",today)

    //更新起始日期至一个月前
    var curDate = new Date()
    var monthAgoFull = util.formatTime(new Date((curDate/1000-86400*30)*1000))
    var monthAgo = monthAgoFull.split(" ")[0].split("/").join("-")
    this.setData({
      startDate: monthAgo
    })
    console.log("一个月以前是",monthAgo)

    //截取符合条件的items并排序
    var sorted = this.sortReport(this.data.report)
    this.setData({
      selectedReport: sorted
    })
    console.log("item list loaded")
    console.log("已选记录",sorted)

  },

  //从report中截取和排序items
  sortReport: function(e) {
    var startDate = this.data.startDate
    var endDate = this.data.endDate
    var selected = {}
    var keyList = []
    var res = []
    for (var i=0;i<e.length;i++) {
      if (e[i].date>=startDate && e[i].date<=endDate) {
         e[i].key=e[i].date+e[i].uid
         selected[e[i].key]=e[i]
         keyList.push(e[i].key)
      }
    }

    keyList.sort()
    var len=keyList.length
    for (var i=0;i<len;i++) {
      res.push(selected[keyList[len-i-1]])
    }

    return res
  },

  //起始日期选择
  startDateChange:function(e){
    this.setData({
      startDate:e.detail.value
    })
    console.log("起始日期改变为",e.detail.value)

    var sorted = this.sortReport(this.data.report)
    this.setData({
      selectedReport: sorted
    })
    console.log("item list updated")
    console.log("已选记录",sorted)

  },

  //截止日期选择
  endDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
    console.log("截止日期改变为",e.detail.value)

    var sorted = this.sortReport(this.data.report)
    this.setData({
      selectedReport: sorted
    })
    console.log("item list updated")
    console.log("已选记录",sorted)
  },

  //跳转编辑item详情
  seeDetail: function(e) {
    var idx = e.target.dataset.idx
    console.log("点击了",idx)
    console.log(e.target.dataset)
    app.globalData.itemDetail= this.data.selectedReport[idx]
    console.log(app.globalData.itemDetail)
    wx.navigateTo({
      url: '../itemdetail/itemdetail'
    })
  }



})