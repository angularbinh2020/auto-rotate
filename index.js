/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
// Create viewer.
var viewer = new Marzipano.Viewer(
  document.querySelector(".section-image-single-demo")
);

// Register the custom control method.
var deviceOrientationControlMethod = new DeviceOrientationControlMethod();
var controls = viewer.controls();
controls.registerMethod("deviceOrientation", deviceOrientationControlMethod);

const defaultView = {
  pitch: 0.0732336538048628,
  yaw: 0.4144114484218129,
};

const maxFovDefault = (120 * Math.PI) / 180;

const newSource = Marzipano.ImageUrlSource.fromString(
  `https://nhathat.azureedge.net/vrdev360/7a0b454b-8d43-481d-92e6-30057a851ca1/{f}_{x}_{y}.jpg`,
  {
    cubeMapPreviewUrl: `https://nhathat.azureedge.net/vrdev360/7a0b454b-8d43-481d-92e6-30057a851ca1/preview.jpg`,
  }
);

const newGeometry = new Marzipano.CubeGeometry([
  {
    tileSize: 280,
    size: 280,
    fallbackOnly: true,
  },
  { tileSize: 840, size: 6720 / 4 },
]);

const newLimiter = Marzipano.RectilinearView.limit.traditional(
  6720 / 4,
  maxFovDefault
);

const newView = new Marzipano.RectilinearView({ ...defaultView }, newLimiter);

const newScene = viewer.createScene({
  source: newSource,
  geometry: newGeometry,
  view: newView,
  pinFirstLevel: true,
});
/* // Create source.
      var source = Marzipano.ImageUrlSource.fromString(
          "//www.marzipano.net/media/cubemap/{f}.jpg"
      );
  
      // Create geometry.
      var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);
  
      // Create view.
      var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
      var view = new Marzipano.RectilinearView(null, limiter);
  
      // Create scene.
      var scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
      }); */

// Display scene.
newScene.switchTo();

// Set up control for enabling/disabling device orientation.

var enabled = false;

function requestPermissionForIOS() {
  window.DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response === "granted") {
        enableDeviceOrientation();
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

function enableDeviceOrientation() {
  deviceOrientationControlMethod.getPitch(function (err, pitch) {
    if (!err) {
      newView.setPitch(pitch);
    }
  });
  controls.enableMethod("deviceOrientation");
  enabled = true;
}

function enable() {
  if (window.DeviceOrientationEvent) {
    if (typeof window.DeviceOrientationEvent.requestPermission == "function") {
      // requestPermissionForIOS();
    } else {
      enableDeviceOrientation();
    }
  }
}

function disable() {
  controls.disableMethod("deviceOrientation");
  enabled = false;
}

function toggle() {
  if (enabled) {
    disable();
  } else {
    enable();
  }
}

document.getElementById("enableRotate").addEventListener("click", () => {
  if (window.DeviceOrientationEvent) {
    if (typeof window.DeviceOrientationEvent.requestPermission == "function") {
      window.DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            enableDeviceOrientation();
          } else {
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      enableDeviceOrientation();
    }
  } else {
  }
});

document.getElementById("enableRotate").click()