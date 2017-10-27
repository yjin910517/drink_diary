//app.js
App({
  globalData:{
  "itemDetail":{},

  "defaultType":[
    {
      "id":"葡萄酒",
      "value":[
        {"name":"红葡萄酒 Red", "alc":"14","vol":"150"},
        {"name":"白葡萄酒 White", "alc":"12","vol":"150"},
        {"name":"桃红葡萄酒 Rose", "alc":"10","vol":"150"},
        {"name":"气泡酒 Sparkle", "alc":"8","vol":"100"}
      ]
    },
    {
      "id":"啤酒",
      "value":[
        {"name":"工业啤酒 Industrial", "alc":"4","vol":"330"},
        {"name":"精酿啤酒 Craft", "alc":"5","vol":"330"}
      ]
    },
    {
      "id":"烈酒",
      "value":[
        {"name":"Gin", "alc":"40","vol":"50"},
        {"name":"Vodka", "alc":"40","vol":"50"},
        {"name":"Rum", "alc":"40","vol":"50"},
        {"name":"Whiskey", "alc":"40","vol":"50"}
      ]
    }
  ]
  }
})