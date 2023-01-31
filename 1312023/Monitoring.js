import React, { lazy, useEffect, useState } from 'react'
import axiosConnect from './../../api/axiosConnect.js';
import {
  // CAvatar,
    CCardBody,
    CCardTitle,
//   CButtonGroup,
  CCard,
//   CCardBody,
//   CCardFooter,
  CCardHeader,
//   CCardTitle,
  // CCol,
  // CProgress,
  // CRow,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  //   CTableRow,
  // CWidgetStatsB,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter ,
  CButton,


} from '@coreui/react'
import ProdTaskTable from './ProdTaskTable.js';
import JobAbendsTable from './JobAbendsTable.js';
import ReactEcharts from "echarts-for-react";


const Widgets = lazy(() => import('./Widgets.js'))
//Import json file. Used in {options}.
const data = require("./../../assets/data/chart.json");
const cpudata = require("./../../assets/data/cpudata.json");

//Array of names for legend in {options}
const dataNames = data.map(i => i.name);

//Chart style
const style = {
  height: "90vh",
  width: "100%"
};

//Chart options
let option = {
  backgroundColor: "rgb(43, 51, 59)",
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true
      },
      magicType: {
        show: true,
        type: ["pie", "funnel"]
      },
      restore: {
        show: true,
        title: "Restore"
      },
      saveAsImage: {
        show: true,
        title: "Save Image"
      }
    }
  },
  graphic: [
    // {
    //   type: "group",
    //   left: "0",
    //   top: "bottom",
    //   children: [
    //     {
    //       type: "rect",
    //       z: 100,
    //       left: "center",
    //       top: "middle",
    //       shape: {
    //         width: 190,
    //         height: 90
    //       },
    //       style: {
    //         fill: "#fff",
    //         stroke: "#555",
    //         lineWidth: 2,
    //         shadowBlur: 8,
    //         shadowOffsetX: 3,
    //         shadowOffsetY: 3,
    //         shadowColor: "rgba(0,0,0,0.3)"
    //       }
    //     },
    //     {
    //       type: "text",
    //       z: 100,
    //       left: "center",
    //       top: "middle",
    //       style: {
    //         fill: "#333",
    //         text: ["This is a note.", "With multiple lines."].join("\n"),
    //         font: "14px Arial"
    //       }
    //     }
    //   ]
    // }
  ],
  // Hover Tooltip
  // {a} = series:[{name:}]
  // {b} = series:[{data: [{name:}]}]
  // {c} = series:[{data: [{value:}]
  tooltip: {
    trigger: "item",
    formatter: "{a}<br/><strong>{b}</strong>: {c} Suffix"
  },
  title: {
    text: "PieHalfRose",
    left: "center",
    top: 20,
    textStyle: {
      color: "#ccc"
    }
  },
  calculable: true,
  legend: {
    icon: "circle",
    x: "center",
    y: "50px",
    data: dataNames,
    textStyle: {
      color: "#fff"
    }
  },
  series: [
    {
      name: "Series Name",
      type: "pie",
      animationDuration: 2000,
      animationEasing: "quarticInOut",
      radius: [10, 150],
      avoidLabelOverlap: false,
      startAngle: 90,
      hoverOffset: 5,
      center: ["50%", "50%"],
      roseType: "area",
      selectedMode: "multiple",
      label: {
        normal: {
          show: true,
          formatter: "{c} Suffix" // {c} data: [{value:},]
        },
        emphasis: {
          show: true
        }
      },
      labelLine: {
        normal: {
          show: true,
          smooth: false,
          length: 20,
          length2: 10
        },
        emphasis: {
          show: true
        }
      },
      data: data
    }
  ]
};



const Monitoring = () => {
  console.log("Start of Monitoring");

    const [cardData, setCardData] = useState([]);
    const [visible, setVisible] = useState(false);
    const onChartClick = (params)=>{
      // Do what you want to do on click event. params depend on the  type of  chart 
      console.log("clicked"+params);
      setVisible(!visible);
    }
    let _onEvents = {
      'click': onChartClick,
    }
    const handleClick = (e) => {
      console.log("clicked");
      setVisible(!visible);
   }
    useEffect(async () => {
      // let ignore = false;

      async function loadData () {
        // const res = await fetch("http://localhost:3000/mf/getmonitoringD");
        //const res = await axiosConnect.get("/getmonitoring");
        const res = cpudata;

        // const resData = await res.json();
        console.log("getmonitoring resData received from MF as");
        console.log( res);
        if (res && res.status === 201) {
          let resData = res.data;
          if (resData && resData.success && resData.commandResponse) {
              setCardData(resData.commandResponse);
          } else {
              setCardData([]);
          }
        } else {
            setCardData(res.commandResponse);
        }
      }

      loadData();
      // return () => { ignore = true;}
    }, []);

     let wtorList;
     if (cardData.wtor && cardData.wtor.length > 0) {
        wtorList = cardData.wtor.map((entry, index) => {
            return (
                <CListGroupItem color={"danger"} key={index}  >
                    {entry}
                </CListGroupItem>
            )
        })
     }
     let healthCheckerList;
     if (cardData.healthChecker && cardData.healthChecker.length > 0) {
        healthCheckerList = cardData.healthChecker.map((entry, index) => {
            return (
                <CListGroupItem color={"warning"} key={index}>
                  {entry}
                </CListGroupItem>
            )
        })
     }

    //  console.log("cardData", cardData);
  return (
      <>
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle>Modal title</CModalTitle>
      </CModalHeader>
      <CModalBody><ReactEcharts option={option} style={style} className="pie-chart"   onEvents= {_onEvents}/>
</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
          {/* Trending chart widgets */}
          <Widgets  onClick={  handleClick } 
               widgetData={{
              cpu: cardData["cpupercentage"], 
              spool: cardData["spoolpercent"], 
              smf: cardData["smfpercent"],
              auto: cardData["automationstatus"],
              upd: cardData["lastUpdate"]
          }}/>

           {/* WTOR Tasks */}
          <CCard className="mb-4">
              <CCardHeader>
                  <CCardTitle>WTOR Tasks that needs attention</CCardTitle>
              </CCardHeader>
              <CCardBody>                  
                  <CListGroup>
                    {(cardData.wtor && cardData.wtor.length > 0) ? wtorList : ( <div>No data</div> )}
                  </CListGroup>
              </CCardBody>
          </CCard>

          {/* Chart for States */}
          <CCard className="mb-8">
              <CCardHeader>
                  <CCardTitle>Chart</CCardTitle>
              </CCardHeader>
              <CCardBody>                  
                  <CListGroup>
                  <ReactEcharts option={option} style={style} className="pie-chart"   onEvents= {_onEvents}/>
                  </CListGroup>
              </CCardBody>
          </CCard> 

           {/* Health Tasks */}
           <CCard className="mb-4">
              <CCardHeader>
                  <CCardTitle>Health Status Updates</CCardTitle>
              </CCardHeader>
              <CCardBody>                  
                  <CListGroup>
                      {(cardData.healthChecker && cardData.healthChecker.length > 0) ? healthCheckerList : ( <div>No data</div> )}
                  </CListGroup>
              </CCardBody>
          </CCard>          

           {/* Production Tasks */}
           <CCard className="mb-4">
              <CCardHeader>
                  <CCardTitle>Scheduling Conflicts</CCardTitle>
              </CCardHeader>
              <CCardBody>
                  {(cardData.prodjobs && cardData.prodjobs.length > 0) ? (
                    <ProdTaskTable prodjobs={cardData.prodjobs} /> ) : ( <div>No data</div> )}
              </CCardBody>
          </CCard>
          
           {/* JOB Abends */}
           <CCard className="mb-4">
              <CCardHeader>
                  <CCardTitle>Details of JOB Abends</CCardTitle>
              </CCardHeader>
              <CCardBody>
                  {(cardData.jobabends && cardData.jobabends.length > 0) ? (
                    <JobAbendsTable jobabends={cardData.jobabends} /> ) : ( <div>No data</div> )}
              </CCardBody>
           </CCard>

    </>
  )
    console.log("Start of Monitoring");

}

export default Monitoring
