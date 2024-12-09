
let map, heatmap;
let maps_list;
const button = document.getElementById("select-location-btn");
let isCrosshairActive = false;
let clickedFlag=0;
let hoverFlag = 1;
let section = document.getElementById("site-incident-section");
const initialHeight = parseFloat(getComputedStyle(section).height);


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13.5,
    center: { lat: 39.118711706679555, lng: -84.50582668435575},
    mapTypeId: "satellite",
    draggableCursor: "default", 
    draggingCursor: "default",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
  });

  button.addEventListener("mouseover", () => {

    button.style.cursor="pointer";

  });
  
  
  button.addEventListener("click", () => {
    isCrosshairActive = true;
    
    button.style.backgroundColor = "#B9DCDC";
    document.body.style.cursor = "crosshair"; 
    map.setOptions({ draggableCursor: "crosshair", draggingCursor: "crosshair" });
    
  });
  
  map.addListener("click", (event) => {
    if (isCrosshairActive) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`new google.maps.LatLng(${lat}, ${lng}),`);
      
      addPointToHeatmap(lat, lng);
      const userConfirmed = confirm("Are you sure you want to submit this incident?");
      if (userConfirmed) {
        displayLatLng(lat, lng);
        updateStats()
      } 
      else{
        button.style.backgroundColor = "#cddddd";
      }
      document.addEventListener("click", revertCursor, { once: true }); 
      adjustHeight()
    }
  });
} // end map function 


function revertCursor(event) {
  if (isCrosshairActive) {
    document.body.style.cursor = "default";
    map.setOptions({ draggableCursor: "default", draggingCursor: "default" });
    isCrosshairActive = false;
  }
}

function displayLatLng(lat, lng) {
  lat = parseFloat(lat.toFixed(4));
  lng = parseFloat(lng.toFixed(4));
  const latLngContainer = document.getElementById("lat-lng-values");
  latLngContainer.innerHTML = `Recorded the incident at:<br>Latitude: ${lat}<br>Longitude: ${lng}`;
}
// incidents section -----------------------------------

function setHoverFlag() { // you are hovering over.
  hoverFlag = 1; // Set hover flag
  console.log("Hover flag:", hoverFlag);
  console.log("Click flag:", clickedFlag);
  if (!clickedFlag) { //  adjust height if not clicked
    section.style.height = `${initialHeight * 2}px`;
  }
}
function adjustHeight() {
  console.log("You've clicked in the section:", clickedFlag)
  clickedFlag = 1; 
  let currentHeight = parseFloat(getComputedStyle(section).height);
  if (currentHeight >= initialHeight * 2) {
    console.log("Already doubled.");
    return; // Do nothing if already doubled
  } else {
    section.style.height = `${initialHeight * 2}px`; // Double the height
    console.log("Section clicked, height adjusted:", section.style.height);
  }
}

function revertHeight() {
  hoverFlag=0; // on mouse leave
  
  if(clickedFlag==0){// you have not clicked in the seciton already.
    section.style.height = `${initialHeight / 2}px`;
    section.classList.remove("active"); 
    console.log("Height reverted to initial:", initialHeight);
  } else{ // if you have clicked alread don't revert height. 
    console.log("You're hovering outside of the section and have already clicked", hoverFlag)
    console.log("You're hovering outside of the section and have already clicked", clickedFlag)
  }
}
document.addEventListener("DOMContentLoaded", () => {
  section.addEventListener("mouseover", (event) => {
    event.stopPropagation();
    setHoverFlag();
    section.classList.add("active");
    // section.classList.toggle("active");
  });
  section.addEventListener("mouseleave", (event) => {
    console.log("Mouse Leave")
    event.stopPropagation();
    revertHeight();
    //section.classList.remove("active"); 
    // section.classList.toggle("active");
  });
  section.addEventListener("click", (event) => {
    event.stopPropagation();
    adjustHeight();
    section.classList.add("active");
    // section.classList.toggle("active");
  });
  
});




let stats = {
  fatalities: 40,
  injuries: 215,
  closeCalls: 432,
};

function animateNumber(id, start, end, duration) { // to animate numbers
  const element = document.getElementById(id);
  let current = start;
  const increment = (end - start) / (duration / 10);
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 10);
}
window.onload = () => {
  animateNumber("fatalities", 0, stats.fatalities, 2000);
  animateNumber("injuries", 0, stats.injuries, 2000);
  animateNumber("close-calls", 0, stats.closeCalls, 2000);
};

function updateStats() {
  const statIds = {
    "fatality": "fatalities",
    "injury": "injuries",
    "close-call": "close-calls",
  };

  const incidentType = document.getElementById("incident-type").value || "injury";
  const statId = statIds[incidentType];
  if (statId && stats[statId] !== undefined) {
    const previousValue = stats[statId];
    stats[statId] += 1;
    animateNumber(statId, previousValue, stats[statId], 1000);

    const element = document.getElementById(statId);
    element.classList.add("fade-color");
    setTimeout(() => {
      element.classList.remove("fade-color"); // Remove the class after the animation
    }, 2000);

    console.log(`Updated ${statId} to ${stats[statId]}`);
  } else {
    console.error("Invalid incident type selected or missing stat ID.");
  }
}

function getPoints() {
  maps_list= [
    new google.maps.LatLng(39.128461525568575, -84.51839137072957),
    new google.maps.LatLng(39.12844488014171, -84.51779055591024),
    new google.maps.LatLng(39.12844488014171, -84.51727557177938),
    new google.maps.LatLng(39.12844488014171, -84.51678204532064),
    new google.maps.LatLng(39.12827842565671, -84.51607394214071),
    new google.maps.LatLng(39.12827842565671, -84.51525855060018),
    new google.maps.LatLng(39.127812351005794, -84.51118159289754),
    new google.maps.LatLng(39.127812351005794, -84.51060223575033),
    new google.maps.LatLng(39.12776241425311, -84.50852084155477),
    new google.maps.LatLng(39.13563533830825, -84.51302695269979),
    new google.maps.LatLng(39.13569359133682, -84.51523709292806),
    new google.maps.LatLng(39.12706311258784, -84.50832033398882),
    new google.maps.LatLng(39.126180882027036, -84.51274061444536),
    new google.maps. LatLng(39.098231343532134, -84.51242379857769), 
    new google.maps. LatLng(39.098219676712546, -84.51243407000989), 
    new google.maps. LatLng (39.09859769905626, -84.51152257634868), 
    new google.maps. LatLng(39.09893074788085, -84.51040677739849), 
    new google.maps.LatLng(39.10066257640809, -84.51281003667583), 
    new google.maps. LatLng(39.101428563918184, -84.5131104440855), new google.maps.LatLng (39.10226114959825, -84.5131104440855), new google.maps. LatLng(39.102860605199375, -84.5131104440855), new google.maps.LatLng(39.101728295895754, -84.5090764017271), new google.maps. LatLng(39.10952088000976, -84.51379708959331), new google.maps. LatLng(39.10952088000976, -84.51263837529888), new google.maps.LatLng(39.10958747957974, -84.51190881444683), new google.maps.LatLng (39.13738326416033, -84.44121970275519), new google.maps. LatLng(39.13738326416033, -84.44085492232917), new google.maps.LatLng(39.13738326416033, -84.44053305724738), new google.maps. LatLng(39.13705039705027, -84.43403138259528), new google.maps.LatLng(39.13705039705027, -84.43310870269416), new google.maps. LatLng(39.13247817203543, -84.43284372308837), new google.maps. LatLng (39.132353338357966, -84.43252185800658), new google.maps. LatLng (39.13220353765291, -84.43230728128539), new google.maps. LatLng(39.13672815280316, -84.43147015730305), new google.maps. LatLng(39.13691123074633, -84.43282199064656), new google.maps. LatLng(39.136799320459076, -84.43051112029026), new google.maps.LatLng(39.136699459663085, -84.42971718642185), new google.maps. LatLng(39.14145933341231, -84.42503941389988), new google.maps.LatLng(39.14130955207948, -84.42261469695042), new google.maps. LatLng(39.1378228939326, -84.44897002259451), new google.maps.LatLng(39.1378228939326, -84.45012873688894), new google.maps. LatLng(39.138523443200086, -84.45452524848562), new google.maps.LatLng(39.138689873469794, -84.45458962150198), new google.maps.LatLng(39.13892287518638, -84.4547183675347), new google.maps.LatLng(39.140886716157944, -84.4505770368157), new google.maps.LatLng(39.14038743974824, -84.45122076697928),
    new google.maps.LatLng(39.101228557968604, -84.51291323544636), new google.maps.LatLng(39.098181201881985, -84.51307416798726), new google.maps.LatLng(39.09792410061969, -84.5130748641986), new google.maps.LatLng(39.09798751983262, -84.51389492394581), new google.maps. LatLng(39.09814648463517, -84.51303661706105), new google.maps.LatLng(39.09829367394758, -84.51225877644673), new google.maps.LatLng(39.13717085739949, -84.43763978981886), new google.maps.LatLng(39.137154214031156, -84.43851955437574), new google.maps.LatLng(39.128310228277584, -84.5156488207843), new google.maps. LatLng(39.12813250441511, -84.51565092395431), new google.maps.LatLng(39.128758915125026, -84.51995644846221), new google.maps. LatLng(39.12858413868474, -84.52061090746184), new google.maps.LatLng(39.13536892293179, -84.50952581006199), new google.maps.LatLng(39.135452141844155, -84.50903228360325), new google.maps.LatLng(39.13546878561482, -84.50943997937351), new google.maps.LatLng(39.135485429381546, -84.50980475979954), new google.maps.LatLng(39.135402210508545, -84.50989059048801), new google.maps.LatLng(39.13536892293179, -84.50989059048801), new google.maps.LatLng(39.13536892293179, -84.50939706402927), new google.maps.LatLng(39.135402210508545, -84.50916102963596), new google.maps.LatLng(39.135535360658146, -84.50553468304783), new google.maps.LatLng(39.135535360658146, -84.50600675183445), new google.maps.LatLng(39.13538556672216, -84.50574925976902), new google.maps.LatLng(39.135502073144345, -84.50544885235935), new google.maps.LatLng(39.137016639090724, -84.50553468304783), new google.maps.LatLng(39.13690013517456, -84.5057278020969), new google.maps.LatLng(39.1379985930099, -84.50534156399875), new google.maps.LatLng(39.13829816944529, -84.50534156399875), new google.maps.LatLng(39.13235633208218, -84.52025464612156), new google.maps.LatLng(39.13300546476093, -84.52025464612156), new google.maps.LatLng(39.13407069516447, -84.52025464612156),
    new google.maps.LatLng(39.128207823416695, -84.5163037722343), new google.maps.LatLng(39.128241114378525, -84.51669001033244), new google.maps.LatLng(39.128241114378525, -84.51681875636515), new google.maps.LatLng(39.128241114378525, -84.51735519816813), new google.maps.LatLng(39.128241114378525, -84.5176556055778), new google.maps.LatLng(39.128241114378525, -84.51819204738078), new google.maps.LatLng(39.13265202764946, -84.52031635692057), new google.maps. LatLng(39.132119403731764, -84.52040218760905), new google.maps.LatLng(39.13381712842489, -84.5203378145927), new google.maps.LatLng(39.13341766747348, -84.5203378145927), new google.maps.LatLng(39.128607313920284, -84.52467226436076), new google.maps.LatLng(39.12842421438741, -84.52514433314738), new google.maps.LatLng(39.12832434171432, -84.52546619822917), new google.maps.LatLng (39.119372319802686, -84.5249099862023), new google.maps.LatLng(39.119588737916736, -84.52473832482535), new google.maps.LatLng(39.11959312043364, -84.52473411512754), new google.maps.LatLng(39.119555442865526, -84.52429844254691), new google.maps.LatLng(39.11923613177607, -84.52442155092248), new google.maps.LatLng (39.11966475851879, -84.52452374810416), new google.maps. LatLng(39.11952349962408, -84.52482951993186),
    new google.maps.LatLng(39.12802052653346, -84.51472907505638), new google.maps.LatLng(39.127720906371984, -84.51511531315452), new google.maps. LatLng(39.12738799358654, -84.5163169427932), new google.maps. LatLng(39.12738799358654, -84.51743274174339), new google.maps.LatLng(39.126888621457965, -84.51743274174339), new google.maps. LatLng(39.12765432394079, -84.51747565708763), new google.maps. LatLng(39.12775419756398, -84.5186772867263), new google.maps. LatLng(39.132381520142225, -84.5203509851516), new google.maps. LatLng(39.13377964413015, -84.52026515446312), new google.maps.LatLng(39.13441211967221, -84.52017932377464), new google.maps.LatLng(39.132148496778804, -84.52039390049583), new google.maps.LatLng(39.13168244773876, -84.52039390049583), new google.maps.LatLng(39.13174902636187, -84.52022223911888), new google.maps.LatLng(39.1327144093238, -84.5201364084304), new google.maps.LatLng(39.13291414207744, -84.5201364084304), new google.maps.LatLng(39.13521102802639, -84.50953631840355), new google.maps.LatLng(39.13524431567777, -84.50992255650169), new google.maps.LatLng(39.135410753698636, -84.51507239781029), new google.maps.LatLng(39.13542014727957, -84.51507835339144), new google.maps.LatLng(39.13551061632233, -84.51560883961326), new google.maps.LatLng(39.135360822333695, -84.51601653538353), new google.maps. LatLng(39.135360822333695, -84.51483636341698), new google.maps.LatLng(39.13549397256156, -84.51483636341698), new google.maps.LatLng(39.135410753698636, -84.50704722843773), new google.maps.LatLng(39.1368279297497, -84.50549044581538), new google.maps.LatLng(39.13682651526271, -84.50548876948397), new google.maps.LatLng(39.13813442825134, -84.5054582593072), new google.maps.LatLng(39.13790974552177, -84.50544753047114), new google.maps.LatLng(39.13812610668156, -84.50530805560237), new google.maps.LatLng(39.138400717965325, -84.50532951327449), new google.maps.LatLng(39.138866722541316, -84.50531878443843), new google.maps.LatLng(39.138708614191614, -84.50526514025813), new google.maps.LatLng(39.1387335786915, -84.50520076724177),
    new google.maps.LatLng(39.13448366401486, -84.52053591859341), new google.maps. LatLng(39.13415078319699, -84.52053591859341), new google.maps. LatLng(39.13341843985846, -84.52053591859341), new google.maps. LatLng(39.13258622227416, -84.52053591859341), new google.maps.LatLng(39.13128794320393, -84.52053591859341), new google.maps. LatLng(39.130988336942565, -84.52053591859341), new google.maps.LatLng(39.13142110113317, -84.5201925958395), new google.maps.LatLng(39.13148768000336, -84.52010676515103), new google.maps. LatLng(39.131620837554955, -84.51997801911831), new google.maps.LatLng(39.1322533324866, -84.51976344239712), new google.maps. LatLng(39.13255293336621, -84.51976344239712), new google.maps.LatLng(39.13381790080546, -84.51933428895474), new google.maps.LatLng (39.13398434219793, -84.51942011964321), new google.maps.LatLng(39.13388447740965, -84.5198492730856), new google.maps.LatLng(39.134650103833685, -84.5198492730856), new google.maps.LatLng(39.13321870853518, -84.51980635774136), new google.maps. LatLng(39.12769258394365, -84.51628729951382), new google.maps. LatLng(39.12822524134152, -84.51705977571011), new google.maps. LatLng(39.12819195037216, -84.51753184449673), new google.maps. LatLng(39.13564873448501, -84.50504347932339), new google.maps. LatLng(39.135415721933164, -84.50504347932339), new google.maps.LatLng(39.13504955779377, -84.5053868020773), new google.maps. LatLng(39.13524928392402, -84.50581595551968), new google.maps. LatLng(39.13524928392402, -84.50680300843716), new google.maps. LatLng (39.1355155845498, -84.5079617227316),
    new google.maps.LatLng(39.12765096991479, -84.4959132398367), new google.maps.LatLng (39.12591980452839, -84.49017331254483), new google.maps.LatLng(39.12705172517301, -84.48965832841397), new google.maps.LatLng(39.12818362762735, -84.48948666703701), new google.maps.LatLng(39.12598638859927, -84.49420735490322), new google.maps. LatLng(39.12918234998084, -84.50115964066983), new google.maps.LatLng(39.12904918781864, -84.50201794755459), new google.maps.LatLng(39.12785071702906, -84.50854107987881), new google.maps.LatLng(39.12698514210924, -84.50828358781338), new google.maps. LatLng(39.125786636197844, -84.50828358781338), new google.maps.LatLng (39.12252393345421, -84.50854107987881), new google.maps.LatLng(39.11166936543937, -84.5063953126669), new google.maps.LatLng(39.11200235250847, -84.50802609574795), new google.maps.LatLng(39.112401934914544, -84.51085850846768), new google.maps.LatLng(39.10927181209586, -84.51197430741787), new google.maps.LatLng(39.10927181209586, -84.51214596879483), new google.maps.LatLng(39.109138612296405, -84.51214596879483), new google.maps.LatLng(39.10873901138754, -84.51206013810635),
  ];

  return maps_list;
}

function addPointToHeatmap(latitude, longitude) {

  let newPoint = new google.maps.LatLng(latitude, longitude);

  maps_list.push(newPoint); // Add the new point to the data array

  heatmap.setData(maps_list); // Update the heatmap with the new data
  console.log("added point to heatmap")
}

document.addEventListener("DOMContentLoaded", () => {
  const learnButton = document.getElementById("learn-button");
  const aboutUsButton = document.getElementById("about-us");
  const aboutUsModal = document.getElementById("about-us-modal");
  const closeAboutUsModal = document.getElementById("close-about-us-modal");
  const modal = document.getElementById("popup-modal");
  const closeModal = document.getElementById("close-modal");
  
  learnButton.addEventListener("click", () => {
    modal.style.display = "block";
  });
  
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  aboutUsButton.addEventListener("click", () => {
    aboutUsModal.style.display = "block";
  });
  
  closeAboutUsModal.addEventListener("click", () => {
    aboutUsModal.style.display = "none";
  });
  
  
  window.addEventListener("click", (event) => {
    if (event.target == aboutUsModal) {
      aboutUsModal.style.display = "none";
    }
  });
});


window.initMap = initMap;