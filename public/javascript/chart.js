console.log('Hello from Chart.js');

getChart();
async function getChart() {
    const url = `/admin/chart` ;
    console.log(url);

    const res = await fetch(url, {
                    method: 'GET',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });

    const chartData = await res.json();
    console.log(chartData);

    

    // product wise sale
    new Chart(
      document.getElementById('products'),
      {
        type: 'bar',
        data: {
          labels: chartData.productWiseSale.map(row => row._id),
          datasets: [
            {
              label: 'Product Wise sale',
              data: chartData.productWiseSale.map(row => row.totalAmount)
            }
          ]
        }
      }
    );

    //  category wise product number
    new Chart(
      document.getElementById('categories') ,
      {
          type: "pie",
          data: {
            labels: chartData.categories.map(row => row._id),
            datasets: [{
              backgroundColor: barColors = [
                "#b91d47",
                "#00aba9",
                "#2b5797",
                "#e8c3b9"
              ],
              data: chartData.categories.map(row => row.total)
            }]
          } ,
          options: {
            title: {
              display: true,
              text: "Category wise products"
            }
          }
      }
    );    
    
    // daily wise sale
    new Chart(
      document.getElementById('dailyWiseSale'),
      {
        type: 'bar',
        data: {
          labels: chartData.dailyWiseSale.map(row => row._id),
          datasets: [
            {
              label: 'Daily Wise sale',
              data: chartData.dailyWiseSale.map(row => row.totalAmount)
            }
          ]
        }
      }
    );
    

    
    
}













// [
//     {
//       '$lookup': {
//         'from': 'products', 
//         'localField': 'orderItems.id', 
//         'foreignField': '_id', 
//         'as': 'test'
//       }
//     }, {
//       '$unwind': {
//         'path': '$test'
//       }
//     }, {
//       '$lookup': {
//         'from': 'categories', 
//         'localField': 'test.categories', 
//         'foreignField': '_id', 
//         'as': 'result'
//       }
//     }
// ]


// new Chart(
    //     document.getElementById('acquisitions'),
    //     {
    //       type: 'bar',
    //       data: {
    //         labels: chartData.chartData.map(row => row.year),
    //         datasets: [
    //           {
    //             label: 'Acquisitions by year',
    //             data: chartData.chartData.map(row => row.count)
    //           }
    //         ]
    //       }
    //     }
    // );