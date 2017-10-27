var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
  alcType:[],
  currentTab: 0
  },

//读取本地缓存类别
  onLoad: function () {
    console.log('onLoad')

    this.setData({
      alcType: wx.getStorageSync('alcType')
    })

    if (this.data.alcType == []) {
      this.setData({
        alcType: app.globalData.defaultType
      })
      wx.setStorageSync('alcType', this.data.alcType)
      console.log("use default type")     
    }

  },

//顶端菜单跳转
  switchNav: function() {
      wx.redirectTo({
          url: '../subcatset/subcatset'
      })
  },

//添加一级目录
  formBindsubmit:function(e){
      var newData=e.detail.value
      var flag=true
      if (newData.firstLevel=="") {
        wx.showModal({
          title: '提示',
          content: '类别名称不能为空'
        })
        flag=false
      }

      var oldType=this.data.alcType
      for (var i = 0, len = oldType.length; i < len; i++) { 
        if (oldType[i].id==newData.firstLevel) {
          wx.showModal({
            title: '提示',
            content: '该类别已经存在'
          })
          flag=false
          break
        }
      }

      if (flag==true) {
        var that=this
        wx.showModal({
          title: '提示',
          content: '确定添加类别“'+newData.firstLevel+'”吗？',
          success: function(res) {
            if (res.confirm) {
              var newCat=[{id:newData.firstLevel,value:[]}]
              if (that.data.alcType==[]) {
                that.data.alcType=newCat
              }
              else {
              that.data.alcType=newCat.concat(that.data.alcType)                
              }
              var updateType=that.data.alcType
              that.setData({
                alcType: updateType
              })
              console.log(updateType)
              wx.setStorageSync('alcType', updateType)
            }
          }
        })
      }
   },

  //编辑已有一级目录
  editDetail:function(e) {
    var idx = e.target.dataset.idx
    var newType = this.data.alcType
    for (var i = 0; i<newType.length; i++) {
      newType[i].isExpand=false
      if (i==idx) {
        newType[i].isExpand=true
      }
    }
    this.setData({
      alcType:newType,
    })
  },

  //删除二级目录
  confirmDelete: function(e) {
    var idx = e.target.dataset.idx
    var newType = this.data.alcType
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除类别“'+newType[idx].id+'”吗（子类别会一同消失）？',
      success: function(res) {
        if (res.confirm) {
          newType.splice(idx,1)
          that.setData({
            alcType:newType,
          })
          wx.setStorageSync('alcType', newType)
        }
      }
    })
  },

  //置顶二级目录
  setDefault: function(e) {
    var idx = e.target.dataset.idx
    var oldType = this.data.alcType
    var newType = []
    newType = newType.concat([oldType[idx]])
    for (var i =0;i<oldType.length;i++) {
      if (i!=idx) {
        newType = newType.concat([oldType[i]])
      }
    }

    var that = this
    wx.showModal({
      title: '提示',
      content: '确定置顶类别“'+oldType[idx].id+'”吗？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            alcType:newType,
          })
          wx.setStorageSync('alcType', newType)
        }
      }
    })
  }

})
