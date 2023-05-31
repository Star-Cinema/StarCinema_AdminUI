////////////////////////////////////////////////////////////////////////////////////////////////////////
//FileName: LineChart.js
//FileType: Javascript Source file
//Author : TuNT37
//Created On : 23/05/2023
//Last Modified On : 24/05/2023
//Copy Rights : FA Academy
//Description : 
////////////////////////////////////////////////////////////////////////////////////////////////////////

import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";

function LineChart({dataRevenue}) {
  const { Title, Paragraph } = Typography;

  //TuNT37 Get 3first character of month in 12month since current month 
  let listMonth = []
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setDate(1)
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'long' }).slice(0, 3);
    listMonth.push(month)
  }  

  //TuNT37 Line Chart
  const lineChart = {
    series: [
      {
        name: "Revenue Services",
        data: dataRevenue.listRevenueServices && dataRevenue.listRevenueServices.reverse(),
        offsetY: 0,
      },
      {
        name: "Revenue Tickets",
        data: dataRevenue.listRevenueTickets && dataRevenue.listRevenueTickets.reverse(),
        offsetY: 0,
      },
    ],
  
    options: {
      chart: {
        width: "100%",
        height: dataRevenue.listRevenueTickets && Math.max(...dataRevenue.listRevenueTickets) + (dataRevenue.listRevenueTickets * 10 / 100) ,
        type: "area",
        toolbar: {
          show: false,
        },
      },
  
      legend: {
        show: false,
      },
  
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
  
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
  
      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: listMonth.reverse(),
      },
  
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Chart Revenue</Title>
          <Paragraph className="lastweek">
            Revenue 12 month <span className="bnb2"> ...  </span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Revenue Services </li>
            <li>{<MinusOutlined />} Revenue Tickets </li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={400}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
