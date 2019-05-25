export default{
    changeXy (state,  {x , y}){
        state.x = x
        state.y = y
    },
    changeCityName(state, headerCity){
        state.headerCity = headerCity
        try {
            localStorage.headerCity = headerCity
            console.log(localStorage.headerCity = headerCity)
          } catch (e) {}
    },
    changeStationName(state, stationName){
        state.headerStation = stationName
        try {
            localStorage.headerStation = stationName
          } catch (e) {}
    }
}