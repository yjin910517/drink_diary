var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    alcType:[] ,
    report:[],
    catId: [],
    index: 0,
    selectedCat:[],
    drinkIdx: 0,
    picked:{},
    dateValue:'2017-05-01',
    finalSubmission:{}
  },

//加载本地缓存和初始值
  onLoad: function () {
    console.log('onLoad')
    //从本地缓存获取分类信息
    this.setData({
      alcType: wx.getStorageSync('alcType'),
      report: wx.getStorageSync('report')
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

    var selectedCat = this.getSelectedCat(this.data.alcType)
    this.setData({
      selectedCat: selectedCat
    }) 

    var picked = this.data.alcType[this.data.index].value[this.data.drinkIdx]
    this.setData({
      picked:picked
    })

    //从本地缓存获取明细记录
    //

    //获取当前日期
    var todayFull=util.formatTime(new Date)
    var today=todayFull.split(" ")[0].split("/").join("-")
    this.setData({
      dateValue: today
    })
  },

//从alcType获取一级条目名称
  getCatId: function(e) {
    var res=[]
    for (var i=0;i<e.length;i++) {
      res.push(e[i].id)
    }
    return res
  },

 //从alcType获取二级条目名称
 getSelectedCat: function(e) {
    var res=[]
    var subCat=e[this.data.index].value
    for (var i=0;i<subCat.length;i++) {
      res.push(subCat[i].name)
    }
    return res
 },

//一级类别选择
bindPickerChange: function(e) {
  var index=e.detail.value
  this.setData({
    index: index
  })
  this.setData({
    drinkIdx:0
  })
  var selectedCat = this.getSelectedCat(this.data.alcType)
  this.setData({
    selectedCat: selectedCat
  }) 
  console.log(selectedCat)


  var picked = this.data.alcType[this.data.index].value[this.data.drinkIdx]
  this.setData({
    picked:picked
  })
 },

 //二级类别选择
bindDrinkChange: function(e) {
  this.setData({
    drinkIdx: e.detail.value
  })
  var picked = this.data.alcType[this.data.index].value[e.detail.value]
  this.setData({
    picked:picked
  })
  console.log(picked)
},


//日期选择
datePickerBindchange:function(e){
  this.setData({
    dateValue:e.detail.value
  })
},

//表单提交按钮
formSubmit: function(e) {
  var flag=true
  var submit = e.detail.value
  
  var finalAlc = submit.alc.trim()
  var finalVol = submit.vol.trim()
  var finalNum = submit.num.trim()
  var finalBrand = submit.brand
  var finalComment = submit.comment
  var cat = this.data.catId[this.data.index]
  var finalDate = this.data.dateValue
  var uid = String(Date.now())
  var recordTime = util.formatTime(new Date)

  if (finalNum == "") {
    finalNum = 1
  }

  if (this.data.picked == undefined) {
    var subCat = ""
    if (finalAlc == "" || finalVol == "") {
        wx.showModal({
          title: '提示',
          content: '缺少默认值，请填写酒精含量和单位体积'
        })
        flag = false
    } 
  }

  else {
    var subCat = this.data.picked.name
    if (finalAlc == "") {
      finalAlc = this.data.picked.alc
    }
    if (finalVol == "") {
      finalVol = this.data.picked.vol
    }
  }

  if (finalBrand == "") {
    finalBrand = 'N/A'
  }

  if (finalComment == "") {
    finalComment = 'N/A'
  }

  //检查alc,vol,num是否为合法数字
  if (isNaN(Number(finalAlc)) || Number(finalAlc) > 100 || Number(finalAlc) < 0) {
    wx.showModal({
      title: '提示',
      content: '请为酒精含量填入0-100的数字'
    })
    flag = false
  }
  else {
    finalAlc = Number(finalAlc)
  }

  if (isNaN(Number(finalVol)) || Number(finalVol) < 0) {
    wx.showModal({
      title: '提示',
      content: '请为单位体积填入大于0的数字'
    })
    flag = false
  }
  else {
    finalVol = Number(finalVol)
  }

  if (isNaN(Number(finalNum)) || Number(finalNum) < 0) {
    wx.showModal({
      title: '提示',
      content: '请为数量填入大于0的整数'
    })
    flag = false
  }
  else {
    finalNum = Number(finalNum)
  }

  //确认添加条目
  if (flag == true) {
    var finalSubmission = {
      'uid':uid,
      'date':finalDate,
      'cat':cat,
      'subCat':subCat,
      'alc':finalAlc,
      'vol':finalVol,
      'brand':finalBrand,
      'comment':finalComment,
      'num':finalNum,
      'recordTime':recordTime
    }

    this.setData({
      finalSubmission:finalSubmission
    })

    if (this.data.report == []) {
      var newReport = [finalSubmission]
    }
    else {
      var newReport = [finalSubmission].concat(this.data.report)      
    }

    this.setData({
      report:newReport
    })
    wx.setStorageSync('report', newReport)
    wx.redirectTo({
      url: '../index/index'
    })

  }
}



})
