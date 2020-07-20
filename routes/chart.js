var myChart = document.getElementById("myChart").getContext("2d");
var newChart = new Chart(myChart,{
    type:'bar',
    data:{
        labels:["Mike Dane"],
        datasets:[{
            labl:'Game chart',
            data:[100]
        }]
    }
})