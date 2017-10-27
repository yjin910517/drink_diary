var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    alcType:[],
    report:[],
    recent:[]
  },

  //加载本地数据
  onLoad: function () {
    console.log('onLoad')
    
    this.setData({
      alcType: wx.getStorageSync('alcType'),
      report: wx.getStorageSync('report')
    })


    if (this.data.alcType == []) {
      this.setData({
        alcType: app.globalData.defaultType
      })
      wx.setStorageSync('alcType', this.data.alcType)
      console.log(this.data.alcType)
      console.log("use default type")     
    }

    console.log("当前报告",this.data.report)
    console.log("当前报告长度",this.data.report.length)

    if (this.data.report.length==0) {
      var recent = []
    }
    
    else {
      var recent = []
      var len = Math.min(this.data.report.length,5)
      for (var i = 0; i < len;i++) {
        recent.push(this.data.report[i])
      }
    }

    this.setData({
      recent:recent
    })

    console.log("最近记录",recent)

    console.log("index page loaded")
  },

  //跳转到chart
  chart: function() {
    console.log('review chart')
    wx.navigateTo({
      url: '../reportchart/reportchart'
    })
  },

  //跳转到输入记录
  itemAdd: function() {
    console.log('add new entry')
    wx.navigateTo({
      url: '../additem/additem'
    })
  },

  //跳转到自定义分类
  catSet: function() {
    console.log('add new entry')
    wx.navigateTo({
      url: '../catset/catset'
    })
  },

  //跳转到报告明细
  checkReport: function() {
    console.log('check report list')
    wx.navigateTo({
      url: '../reportlist/reportlist'
    })
  },

  //跳转编辑item详情
  seeDetail: function(e) {
    var idx = e.target.dataset.idx
    app.globalData.itemDetail= this.data.recent[idx]
    console.log(idx)
    console.log(this.data.recent[idx])
    console.log(app.globalData.itemDetail)
    wx.navigateTo({
      url: '../itemdetail/itemdetail'
    })
  }

})
