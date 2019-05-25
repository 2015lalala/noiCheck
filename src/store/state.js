let  x = '暂无';
let  y = '暂无';
let headerStation = '西湖监测点';
let headerCity = localStorage.headerCity;
try{
    if(localStorage.headerCity){
        headerCity = localStorage.headerCity
    }
} catch (e) {}
try{
    if(localStorage.headerStation){
        headerStation = localStorage.headerStation
    }
} catch (e) {}


export default{
    x:x,
    y:y,
    headerCity: headerCity,
    headerStation: headerStation
}