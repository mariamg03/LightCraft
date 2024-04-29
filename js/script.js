let choose_img_Btn = document.querySelector(".choose_img button");
let show_masks_Btn = document.getElementById("show_masks_info");
let main_img_Area = document.getElementById("main_img_box");
let choose_Input = document.querySelector(".choose_img input");
let imgSrc = document.querySelector(".view_img img");
let filter_buttons = document.querySelectorAll(".icons_room button");
let slider = document.querySelector(".slider input");
let filter_name = document.querySelector(".filter_info .name");
let slider_value = document.querySelector(".filter_info .value");
let rotate_btns = document.querySelectorAll(".icons_room1 button");
let reset = document.querySelector(".reset");
let save = document.querySelector(".save");
let relight = document.querySelector(".relight");
let brightness = 100,
  contrast = 100,
  saturate = 100,
  invert = 0,
  blur = 0,
  rotate = 0,
  flip_x = 1,
  flip_y = 1;


choose_img_Btn.addEventListener("click", () => choose_Input.click());
main_img_Area.addEventListener("click", () => {
  document.getElementById("layers").style.display = "none";
  document.getElementById("image_boxes").style.display = "none";

   document.getElementById("selected_mask").value ="img_src";
});

choose_Input.addEventListener("change", () => {
  get_all_image_info();
  let file = choose_Input.files[0];
  if (!file) return;

  imgSrc.src = URL.createObjectURL(file);
  imgSrc.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disabled");
  });
});

show_masks_Btn.addEventListener("click", () => {
  document.getElementById("layers").style.display = "block";
  document.getElementById("image_boxes").style.display = "block";
});

filter_buttons.forEach((element) => {

  element.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    element.classList.add("active");
    filter_name.innerText = element.id;
    if (element.id === "brightness") {
      slider.max = "200";
      slider.value = brightness;
      slider_value.innerText = `${brightness}`;
    } else if (element.id === "contrast") {
      slider.max = "200";
      slider.value = contrast;
      slider_value.innerText = `${contrast}`;
    } else if (element.id === "saturate") {
      slider.max = "200";
      slider.value = saturate;
      slider_value.innerText = `${saturate}`;
    } else if (element.id === "invert") {
      slider.max = "100";
      slider.value = invert;
      slider_value.innerText = `${invert}`;
    } else if (element.id === "blur") {
      slider.max = "100";
      slider.value = blur;
      slider_value.innerText = `${blur}`;
    }
  });
});

slider.addEventListener("input", () => {
  slider_value.innerText = `${slider.value}%`;
  let sliderState = document.querySelector(".icons_room .active");
  if (sliderState.id === "brightness") {
    brightness = slider.value;
  } else if (sliderState.id === "contrast") {
    contrast = slider.value;
  } else if (sliderState.id === "saturate") {
    saturate = slider.value;
  } else if (sliderState.id === "invert") {
    invert = slider.value;
  } else if (sliderState.id === "blur") {
    blur = slider.value;
  }
 
  selected_mask = document.getElementById("selected_mask");
  document.getElementById(selected_mask.value).style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`;
});

rotate_btns.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.id === "rotate_left") {
      rotate -= 90;
    } else if (element.id === "rotate_right") {
      rotate += 90;
    } else if (element.id === "flip_x") {
      flip_x = flip_x === 1 ? -1 : 1;
    } else if (element.id === "flip_y") {
      flip_y = flip_y === 1 ? -1 : 1;
    }

    imgSrc.style.transform = `rotate(${rotate}deg) scale(${flip_x}, ${flip_y})`;
  });
});

reset.addEventListener("click", () => {
  reset_slider()
});

function reset_slider() {
  brightness = "100";
  saturate = "100";
  contrast = "100";
  invert = "0";
  rotate = 0;
  flip_x = 1;
  flip_y = 1;
  let sliderState = document.querySelector(".icons_room .active");
  if (sliderState.id === "brightness" ||  sliderState.id === "contrast" || sliderState.id === "saturate") {
    slider.max = "200";
    slider.value = 100;
    slider_value.innerText = "100%";
  } else if (sliderState.id === "invert" ||  sliderState.id === "blur") {
    slider.max = "100";
    slider.value = 0;
    slider_value.innerText = "0%";
  }
  selected_mask = document.getElementById("selected_mask");
  document.getElementById(selected_mask.value).style.filter = "";
}
// function that is called when the user selects a mask to edit
function set_img_filters(mask) {
  // this code sets the slider to the style of the selected mask
  var filterString = mask.style.filter;
  // if the selected mask does not have a style, reset the slider to the default values
  if (filterString == "") {
    reset_slider();     
  }

  var regex = /(\w+)\(([^)]+)\)/g;
  let sliderState = document.querySelector(".icons_room .active");
  // if the selected mask has a style , this code sets the slider values to this style
  while ((match = regex.exec(filterString)) !== null) {
      // Extract filter property and value from each match
      var property = match[1];
      var value = match[2];

      if (property === "brightness") {
        brightness = value;
        
        if (sliderState.id === "brightness") {
          slider.max = "200";
          slider.value = value;
          slider_value.innerText = `${value}`;
        }
      } else if (property === "contrast") {
        contrast = value;
        if (sliderState.id === "contrast") {
          slider.max = "200";
          slider.value = value;
          slider_value.innerText = `${value}`;
        }
      } else if (property === "saturate") {
        saturate = value;
        if (sliderState.id === "saturate") {
          slider.max = "200";
          slider.value = value;
          slider_value.innerText = `${value}`;
        }
      } else if (property === "invert") {
        invert = value;
        if (sliderState.id === "invert") {
          slider.max = "100";
          slider.value = value;
          slider_value.innerText = `${value}`;
        }
      } else if (property === "blur") {
        blur = value;
        if (sliderState.id === "blur") {
          slider.max = "100";
          slider.value = value;
          slider_value.innerText = `${value}`;
        }
      }
  }
}

function get_all_image_info() {
  reset_masks();
  call_server('get_all_masks', 'create_image_masks', {})
}

// method is the server methor
// handler is the javascript method name that will display the data returned from the server
// params: represents a hash of any paramters that should be sent to the server
function call_server(method, handler, params){
  var fileInput = document.getElementById('photo');
  var file = fileInput.files[0];
  var reader = new FileReader();
  var result
  reader.onload = function(event) {
    // Get the data URL of the imag
      var dataURL = event.target.result;

      // Send the data URL to the Flask server
      fetch('http://127.0.0.1:5000/'+method, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image: dataURL, params: params })
      })
      .then(response => response.json())
      .then(data => {
        eval(handler+'(data.message)')
        
      })
      .catch(error => {
          console.error('Error:', error);
          alert("Reload or change the picture if the objects aren't clear. Happy editing!");
      });
  };
  reader.readAsDataURL(file);
}

// function responsible for displaying the masks and areas that are returned by the backend
function create_image_masks(img_data) {
  const layers_parent_element = document.getElementById('layers');
  const boxes_parent_element = document.getElementById('image_boxes');

  if (img_data.length == 0) {
    alert("No Object Found");
    return;
  }


  // for every mask, a rectangle are will be added to be displayed around a mask
  for (let i = 0; i < img_data.length; i++) {
    // mask represents the mask image returned
    const mask = document.createElement('img');
    mask.src = 'data:image/png;base64,' + img_data[i]["mask"]
    mask.alt="Workplace"
    mask.usemap="#workmap"
    mask.class="boxes"
    mask.id = "img_src_edited" + i
    mask.style="z-index: 20;position: absolute;"
    mask.style.position = "absolute";
    mask.style.top = 0;
    mask.style.left = 0;
    mask.style.filter = "filter: brightness(100%) contrast(100%) saturate(100%) invert(0px) blur(0%);";

    layers_parent_element.appendChild(mask); 

    box = img_data[i]["box"]
    image_element = document.getElementById("img_src");
    const rectArea = document.createElement('area');
    rectArea.style.top =(box[1]*image_element.height);
    rectArea.style.left =(box[0]*image_element.width);
    rectArea.style.width = (box[2]*image_element.width) - (box[0]*image_element.width);
    rectArea.style.height = (box[3]*image_element.height)- (box[1]*image_element.height);
    rectArea.style.border = "solid #0000FF";
    rectArea.style.position = "absolute";
    rectArea.setAttribute('alt', 'object_id');
    rectArea.style.zIndex = 30;

    rectArea.addEventListener("click", function() {

      document.getElementById("layers").style.display = "block";
      
      document.getElementById("image_boxes").style.display = "none";

      document.getElementById("selected_mask").value = mask.id;
      mask.style.display = "block";
      set_img_filters(mask);
      });
    boxes_parent_element.appendChild(rectArea);

  }
  document.getElementById("show_masks_info").disabled = false;
}

// function responsible for removing any masks related to a previously displayed image
function reset_masks() {
  // remove all the boxes that mark the masks
  const boxes_parent_element = document.getElementById('image_boxes');
  boxes_parent_element.style.display = "none";
  while (boxes_parent_element.firstChild) {
    boxes_parent_element.removeChild(boxes_parent_element.firstChild);
  }

  // removes the previous masks
  const layers_parent_element = document.getElementById('layers');
  layers_parent_element.style.display = "none";
  while (layers_parent_element.firstChild) {
    layers_parent_element.removeChild(layers_parent_element.firstChild);
  }
  document.getElementById("show_masks_info").disabled = true;
}

function save_image() {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = imgSrc.naturalWidth;
  canvas.height = imgSrc.naturalHeight;
  ctx.filter = document.getElementById("img_src").style.filter;

  ctx.drawImage(document.getElementById("img_src"),0,0);

  var layers = document.getElementById("layers");
  var masks = Array.from(layers.children);

  masks.forEach(function(child) {

    // Adjust brightness of the image
    ctx.filter = child.style.filter;

    // Draw the image
    ctx.drawImage(child, 0, 0);

    // Reset the filter for the next image
    ctx.filter = "none";
  });
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flip_x, flip_y);
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
}

 