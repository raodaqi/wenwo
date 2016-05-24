$.showPreloader();

function formatDate(format, timestamp, full) {
    format = format.toLowerCase();
    if (!format) format = "y-m-d h:i:s";

    function zeroFull(str) {
        // console.log(full);
        // return full ? (str >= 10 ? str : ('0' + str)) : str;
        return (str >= 10 ? str : ('0' + str));
    }
    var time = new Date(timestamp),
        o = {
            y: time.getFullYear(),
            m: zeroFull(time.getMonth() + 1),
            d: zeroFull(time.getDate()),
            h: zeroFull(time.getHours()),
            i: zeroFull(time.getMinutes()),
            s: zeroFull(time.getSeconds())
        };
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return o[m];
    });
};

function formatType(type) {
    switch (type) {
        case '0':
            return "问我";
            break;
        case '1':
            return "美食";
            break;
        case '2':
            return "住宿";
            break;
        case '3':
            return "交通";
            break;
        case '4':
            return "购物";
            break;
        case '5':
            return "游玩";
            break;
        case '6':
            return "防坑";
            break;
    }
}


function getAddress(lnglatXY,callback){
      var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });        
        geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              var address = result.regeocode; //返回地址描述
              console.log(address);
              callback.success(address);
              // console.log(address);

              // if(type == "detail"){
              //   console.log(address.formattedAddress);
              //   return address.formattedAddress;
              // }
              var address = {
                province : address.addressComponent.province,
                city     : address.addressComponent.city,
                district : address.addressComponent.district
              }
              // console.log(address);
              // return address;
            }
        }); 
    }

function GetLength(str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};