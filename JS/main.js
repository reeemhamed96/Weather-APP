'use strict'
const searchInput = document.getElementById("searchInput")
// get forecast data
async function getData(city) {
    let req = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7c177f82de784dda854221118241512&q=${city}&days=3&aqi=no&alerts=no`)
    let data = await req.json()
    console.log(data);
    if (!data.error) {
        showData(data)
    }
}
//get current location
function success(position) {
    getData(`${position.coords.latitude},${position.coords.longitude}`)
}
function fail() {
    getData("cairo")
}
navigator.geolocation.getCurrentPosition(success, fail);
// get weekday
function getDay(date) {
    const day = new Date(date)
    return day.toString().split(" ")[0]

}
// show data
function showData(data) {
    let { last_updated, condition, temp_c, humidity, wind_kph } = data.current
    let forecastData = data.forecast.forecastday
    let currentDate = new Date(last_updated)
    let temp = ``

    // tomorrow and aftertomorrow
    for (let i = 1; i < forecastData.length; i++) {
        temp += `
    <div class="col-lg-4 col-md-6">
        <div class="item  py-4 h-100 d-flex flex-column align-items-center" >
        <h5 class="text-secondary">${getDay(forecastData[i].date)}</h5>
        <img src="${forecastData[i].day.condition.icon}" alt="" class="w-25">
        <h2 class="py-2">${forecastData[i].day.maxtemp_c}<sup>o</sup>C</h2>
        <h4>${forecastData[i].day.mintemp_c}<sup>o</sup></h4> 
        <span class="condition pt-2">${forecastData[i].day.condition.text}</span>       
        </div>
    </div>`

    }
    // current day

    document.getElementById("myData").innerHTML = `<div class="col-lg-4 ">
    <div class="item d-flex flex-column align-items-center justify-content-center  py-4 h-100 px-4" >
    <div class="d-flex justify-content-between w-100 align-items-center pb-3 text-secondary">  <h5>${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })}</h5>
    <h5>${getDay(last_updated)}</h5></div>
  
    <h3>${data.location.name}</h3>
    <div class="d-flex  w-100 justify-content-center align-items-center  "  ><span class="fs-1 fw-bolder">${temp_c}<sup>o</sup>C</span>
    <img src="${condition.icon}" alt="icon" class="w-25 ms-3"></div>
     <span class="condition pb-4">${condition.text}</span> 
    <div>
    <span class="me-2"><i class="fa-solid fa-droplet me-1"></i> ${humidity}%</span>     
    <span class="me-2"><i class="fa-solid fa-wind me-1"></i>${wind_kph}Km/h</span>
    <span><img src="images/icon-compass.png" class="me-1" alt="compass icon">East</span>     
    </div>
    </div>
</div>` + temp

}
// Search 
searchInput.addEventListener("keyup", async (ele) => {
    let searchReq = await fetch(`https://api.weatherapi.com/v1/search.json?key=7c177f82de784dda854221118241512&q=${ele.target.value.trim() ? ele.target.value.trim() : navigator.geolocation.getCurrentPosition(success, fail)}`)
    let searchData = await searchReq.json()
    if (searchData.length) {
        getData(searchData[0].name)


    }
})












