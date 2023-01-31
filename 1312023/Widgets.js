import React,{useState,useEffect} from 'react'
import Delayed from '../../hooks/Delayed';

import {
  CRow,
  CCol,
  // CDropdown,
  // CDropdownMenu,
  // CDropdownItem,
  // CDropdownToggle,
  
  CWidgetStatsA,
  CWidgetStatsB,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter ,
  CButton,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { 
  CChart , 
  CChartLine 
} from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilArrowTop,
  // cilOptions
} from '@coreui/icons'
import ReactEcharts from "echarts-for-react";

const WidgetsDropdown = ({widgetData}) => {
  console.log("Start of Widgets");


  const [visible, setVisible] = useState(false);
  const [mTitle, setMTitle] = useState("");
  const [mLabels, setMLabels] = useState([]);
  const [mData, setMData] = useState([]);

  const numberFormat = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2
    }).format(value);

  const dateFormat = (value) => {
    try{
      return new Intl.DateTimeFormat('en-IN', {
        // year: "2-digit",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"      
      }).format(value);
    } catch(err) {
      console.log("Invalid date detected: ", err)
      return "-"
    }
  }

  let prepareData = (singleWidgetData = []) => {

    let dataObj = {};
    dataObj.labels = singleWidgetData.map((entry) => { 
      // console.log("preparing labels - current entry", entry);
      if (entry.datetime) {
        return dateFormat(new Date(entry.datetime));
      } else {
        return '-';
      }
    }) || [];
    // console.log("current dataObj with labels", dataObj);
    dataObj.data = singleWidgetData.map((entry) => { 
      // console.log("preparing data - current entry", entry);
      if (entry.value) {
        return entry.value 
      } else {
        return '';
      }
    }) || [];
    // console.log("current dataObj with data", dataObj);
    let dataLen = dataObj.data.length;
    dataObj.MainPercent = numberFormat((dataLen > 0) ? dataObj['data'][(dataLen - 1)] : 0);
    dataObj.MainPercentPrev = numberFormat((dataLen > 1) ? dataObj['data'][dataLen - 2] : 0);
    dataObj.MainPercentDiff = numberFormat(dataObj.MainPercent - dataObj.MainPercentPrev) || 0;
    return dataObj;
  }
  const handleClick = (title,labels,data) => {
    setVisible(!visible);
    setMTitle(title);
    setMLabels(labels);
    setMData(data);
 }
  let singleWidget = (titleIn, widgetDataObj) => {
   

    let {labels, data, MainPercent,  MainPercentDiff} = widgetDataObj;

    let incolor = (MainPercent >= 80) ? 'danger' : (MainPercent >= 60)? 'warning' : 'info';
    console.log(widgetDataObj);

    return (
      <>
      <CWidgetStatsA
       onClick={() => handleClick(titleIn,labels,data)}
        className="mb-4"
        color={incolor}
        value={
          <>
            {MainPercent}%{' '}
            <span className="fs-6 fw-normal">
              ({MainPercentDiff}% <CIcon icon={(MainPercentDiff >= 0) ? cilArrowTop : cilArrowBottom  } />)
            </span>
          </>
        }
        title={titleIn}
        chart={
          <CChartLine
            className="mt-3 mx-3"
            style={{ height: '70px' }}
            data={{
              labels: labels,
              datasets: [
                {
                  // label: {titleIn},
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle(`--cui-${incolor}`),
                  data: data,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  min: 30,
                  max: 89,
                  display: false,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
          />
        }
      />{
<CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle>{mTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
      <Delayed waitBeforeShow={5000}>
      <CChart
  type="line" 
  data={{
    labels: mLabels,
    datasets: [
      {
         label: mTitle,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,100,.55)',
        pointBackgroundColor: getStyle(`--cui-${incolor}`),
        data: mData,
      },
    ],
  }}
  options={{
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }}
/></Delayed>
</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>

  }

      </>)
  }
  console.log("Calling prepareData");

  let cpuDataObj = prepareData(widgetData.cpu);
  let spoolDataObj = prepareData(widgetData.spool);
  let smfDataObj = prepareData(widgetData.smf);
  let inpLUD = new Date(widgetData.upd) || new Date();
  let lastUpdated = dateFormat(inpLUD)
  console.log("End of Widgets");

  return (
    <CRow><>
          <CCol sm={6} lg={3}>
        {
        singleWidget('CPU Utilization',  cpuDataObj)}
      </CCol>
         
    </>

      <CCol sm={6} lg={3}>
        {singleWidget('Spool Percent', spoolDataObj)} 
      </CCol>
      
      <CCol sm={6} lg={3}>
        {singleWidget('SMF Percent', smfDataObj)}
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-4"
          color={(widgetData.auto === 'OK')? "success" : "danger"}
          inverse
          value={widgetData.auto}
          title="Automation Status"
          progress={{ color: 'white', value: 100 }}
          text={`Last updated on:  ${lastUpdated}`}
        />
      </CCol>
    </CRow>
  )
 }

export default WidgetsDropdown
