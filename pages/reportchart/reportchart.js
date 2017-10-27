let Line = require('../../utils/line.js');

var util = require('../../utils/util.js')
var app = getApp()

let line = new Line();

Page({
  data: {
      alcType:[],
      report:[],
      today:'2017-05-01',
      monthStart: '2017-05-01',
      yearStart: '2017-05-01',
      monthLabel: [],
      dayLabel: [],
      chartData: []
  },

onLoad: function() {
    console.log('onLoad')
    this.setData({
      alcType: wx.getStorageSync('alcType'),
      report: wx.getStorageSync('report')
    })

    //获取今日、月首、年首
    var todayFull = util.formatTime(new Date)
    var today = todayFull.split(" ")[0].split("/").join("-")
    var monthStart = today.slice(0,8).concat('01')
    var yearStart = today.slice(0, 5).concat('01-01')

    this.setData({
      today: today,
      monthStart:monthStart,
      yearStart:yearStart
    })
    console.log("今天是", today)

    //获取dayLabel
    var dayLabel = []
    var todayRaw = new Date()
    var i = 1
    while (today > monthStart) {
      dayLabel = [today].concat(dayLabel)
      var daySoFar = (todayRaw/1000 - 86400*i)*1000
      today = util.formatTime(new Date(daySoFar)).split(" ")[0].split("/").join("-")
      i++
      console.log(today)
    }

    this.setData({
      dayLabel: dayLabel
    })

    //从report中截取当月记录
    var selected = this.selectReport(this.data.monthStart,this.data.today,this.data.report)
    this.setData({
      selectedReport: selected
    })
    console.log("已选记录", selected)

    //汇总当月记录
    var summary = this.summarizeReport('day',this.data.selectedReport)
    var chartData = summary[0]
    this.setData({
      chartData: chartData
    })  

    //绘图
    line.draw({
      renderTo: 'lineCanvas',
      series: this.data.chartData,
      pagePadding: 20,
      setCanvasSize: o => this.setData({ lineCtxHeight: o.height }),
      onTouch: e => this.setData({ oneDayData: e.serie })
    })   

    console.log('load completed')
},

//从report中截取selected 
selectReport: function (startDate,endDate,report) {
  var res = []
  for (var i = 0; i < report.length; i++) {
    if (report[i].date >= startDate && report[i].date <= endDate) {
      res.push(report[i])
    }
  }
  return res
},

//汇总数据
summarizeReport: function (by,raw) {
  if (by == 'day') {
    var labels = this.data.dayLabel
    var volume = []
    var alcohol = []
    for (var i = 0; i<labels.length; i++) {
      volume.push(0)
      alcohol.push(0)
    }

    for (var i = 0; i<raw.length; i++) {
      var idx = labels.indexOf(raw[i].date)
      volume[idx] = volume[idx] + raw[i].vol * raw[i].num
      alcohol[idx] = alcohol[idx] + raw[i].vol * raw[i].num * raw[i].alc / 100
    }
    
    var volumeSum = []
    var alcSum = []

    for (var i =0; i < labels.length; i++) {
      volumeSum.push({'value':volume[i],'txt':labels[i]})
      alcSum.push({ 'value': alcohol[i], 'txt': labels[i] })
    }

    return [volumeSum,alcSum]
  }

  else {
    console.log("其它类别汇总")
  }
},

})



