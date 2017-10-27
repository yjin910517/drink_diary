var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
      itemDetail:{},
      report:[]
  },

  onLoad: function () {
      console.log('onLoad')
      var itemDetail = app.globalData.itemDetail
      this.setData({
          itemDetail:itemDetail,
          report: wx.getStorageSync('report')
      })
      console.log('Loaded')
        
  },

  confirmDelete: function () {
      var oldReport = this.data.report
      var idx = -1
      for (var i=0;i<oldReport.length;i++) {
          if (oldReport[i].uid == this.data.itemDetail.uid) {
              idx = i
              break
          }
      }

      var that=this
        wx.showModal({
          title: '提示',
          content: '确定删除该条记录吗？',
          success: function(res) {
              if (res.confirm) {
                console.log(oldReport.length)
                var deleted = oldReport.splice(idx,1)
                console.log(deleted)
                console.log(oldReport.length)
                wx.setStorageSync('report', oldReport)
                wx.showModal({
                    title: '提示',
                    content: '已删除',
                    success: function(res) {
                        wx.redirectTo({
                            url: '../index/index'
                        })                       
                    }
                })
              }
           }
        })
  }
})