var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
  alcType:[],
  catId:[],
  selected:[],
  currentTab: 1,
  index:0
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

    var catId=this.getCatId(this.data.alcType)
    this.setData({
      catId: catId
    })
  },

//顶端菜单跳转
  switchNav: function() {
      wx.redirectTo({
          url: '../catset/catset'
      })
  },

//获取一级条目名称
getCatId: function(e) {
    var res=[]
    for (var i=0;i<e.length;i++) {
      res.push(e[i].id)
    }
    return res
  },

//一级类别选择
bindPickerChange: function(e) {
  var index=e.detail.value
  this.setData({
    index: index
  })
 },

//添加二级目录
  formBindsubmit:function(e){
      var newData=e.detail.value
      var flag=true
      if (newData.secondLevel==""||newData.alc==""||newData.vol=="") {
        wx.showModal({
          title: '提示',
          content: '信息不全，请补全'
        })
        flag=false
      }


      //判断是否已存在
      var oldType=this.data.alcType[this.data.index].value
      for (var i = 0, len = oldType.length; i < len; i++) { 
        if (oldType[i].name==newData.secondLevel) {
          wx.showModal({
            title: '提示',
            content: '该类别已经存在'
          })
          flag=false
          break
        }
      }

      //判断是否为合法数字
      var alc = newData.alc.trim()
      if (isNaN(Number(alc)) || Number(alc)>100 || Number(alc)<0) {
        wx.showModal({
          title: '提示',
          content: '请为默认酒精含量填入0-100的数字'
        })
        flag = false       
      }
      else {
        alc = Number(alc)
      }

      var vol = newData.vol.trim()
      if (isNaN(Number(vol)) || Number(vol)<0 ) {
        wx.showModal({
          title: '提示',
          content: '请为默认体积填入大于0的数字'
        })
        flag = false
      }
      else {
        vol = Number(vol)
      }

      if (flag==true) {
        var that=this
        wx.showModal({
          title: '提示',
          content: '确定添加类别“'+newData.secondLevel+'”吗？',
          success: function(res) {
            if (res.confirm) {
              var newCat={name:newData.secondLevel.trim(),alc:alc,vol:vol}
              var updateType=that.data.alcType
              var newValue=updateType[that.data.index].value.concat(newCat)
              updateType[that.data.index].value=newValue
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
   
   //编辑已有二级目录
   editDetail:function(e) {
     var idx = e.target.dataset.idx
     var newType = this.data.alcType
     var index = this.data.index
     var subList=newType[index].value
     for (var i = 0; i<subList.length; i++) {
       subList[i].isExpand=false
       if (i==idx) {
         subList[i].isExpand=true
       }
     }
     newType[index].value=subList
     this.setData({
        alcType:newType,
     })
   },

   //删除二级目录
   confirmDelete: function(e) {
      var idx = e.target.dataset.idx
      var newType = this.data.alcType
      var index = this.data.index
      var subList=newType[index].value
      var that = this
      wx.showModal({
        title: '提示',
        content: '确定删除类别“'+subList[idx].name+'”吗？',
        success: function(res) {
          if (res.confirm) {
            subList.splice(idx,1)
            newType[index].value=subList
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
      var newType = this.data.alcType
      var index = this.data.index
      var subList=newType[index].value
      console.log(idx)
      var newCat = []
      newCat = newCat.concat([subList[idx]])
      for (var i =0;i<subList.length;i++) {
        if (i!=idx) {
          newCat = newCat.concat([subList[i]])
        }
      }
      newType[index].value=newCat

      var that = this
      wx.showModal({
        title: '提示',
        content: '确定置顶类别“'+subList[idx].name+'”吗？',
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
