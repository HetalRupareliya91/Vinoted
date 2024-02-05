import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { GMap, removeGoogleMaps } from "primereact/gmap";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Component } from "react";

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleMapsReady: false,
      dialogVisible: false,
      markerTitle: "",
      draggableMarker: false,
      overlays: null,
      selectedPosition: null,
    };
  }

  componentDidMount() {
    // loadGoogleMaps(() => {
    this.setState({ googleMapsReady: true });
    // });
  }

  componentWillUnmount() {
    removeGoogleMaps();
  }

  onMapClick = (event) => {
    this.setState({
      dialogVisible: true,
      selectedPosition: event.latLng,
    });
  };

  onOverlayClick = (event) => {
    let isMarker = event.overlay.getTitle !== undefined;

    if (isMarker) {
      let title = event.overlay.getTitle();
      this.infoWindow = this.infoWindow || new window.google.maps.InfoWindow();
      this.infoWindow.setContent("<div>" + title + "</div>");
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

      this.toast.show({
        severity: "info",
        summary: "Marker Selected",
        detail: title,
      });
    } else {
      this.toast.show({
        severity: "info",
        summary: "Shape Selected",
        detail: "",
      });
    }
  };

  handleDragEnd = (event) => {
    this.toast.show({
      severity: "info",
      summary: "Marker Dragged",
      detail: event.overlay.getTitle(),
    });
  };

  addMarker = () => {
    let newMarker = new window.google.maps.Marker({
      position: {
        lat: this.state.selectedPosition.lat(),
        lng: this.state.selectedPosition.lng(),
      },
      title: this.state.markerTitle,
      draggable: this.state.draggableMarker,
    });

    this.setState({
      overlays: [...this.state.overlays, newMarker],
      dialogVisible: false,
      draggableMarker: false,
      markerTitle: "",
    });
  };

  onMapReady = (event) => {
    this.setState({
      overlays: [
        new window.google.maps.Marker({
          position: { lat: 36.879466, lng: 30.667648 },
          title: "Konyaalti",
        }),
        new window.google.maps.Marker({
          position: { lat: 36.883707, lng: 30.689216 },
          title: "Ataturk Park",
        }),
        new window.google.maps.Marker({
          position: { lat: 36.885233, lng: 30.702323 },
          title: "Oldtown",
        }),
        new window.google.maps.Polygon({
          paths: [
            { lat: 36.9177, lng: 30.7854 },
            { lat: 36.8851, lng: 30.7802 },
            { lat: 36.8829, lng: 30.8111 },
            { lat: 36.9177, lng: 30.8159 },
          ],
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: "#1976D2",
          fillOpacity: 0.35,
        }),
        new window.google.maps.Circle({
          center: { lat: 36.90707, lng: 30.56533 },
          fillColor: "#1976D2",
          fillOpacity: 0.35,
          strokeWeight: 1,
          radius: 1500,
        }),
        new window.google.maps.Polyline({
          path: [
            { lat: 36.86149, lng: 30.63743 },
            { lat: 36.86341, lng: 30.72463 },
          ],
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 0.5,
          strokeWeight: 2,
        }),
      ],
    });
  };

  onHide = (event) => {
    this.setState({ dialogVisible: false });
  };

  render() {
    const options = {
      center: { lat: 36.890257, lng: 30.707417 },
      zoom: 12,
    };

    const footer = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.addMarker} />
        <Button label="No" icon="pi pi-times" onClick={this.onHide} />
      </div>
    );

    return (
      <div>
        <Toast
          ref={(el) => {
            this.toast = el;
          }}
        ></Toast>

        {this.state.googleMapsReady && (
          <div className="card">
            <GMap
              overlays={this.state.overlays}
              options={options}
              style={{ width: "100%", minHeight: "320px" }}
              onMapReady={this.onMapReady}
              onMapClick={this.onMapClick}
              onOverlayClick={this.onOverlayClick}
              onOverlayDragEnd={this.handleDragEnd}
            />
          </div>
        )}

        <Dialog
          header="New Location"
          visible={this.state.dialogVisible}
          width="300px"
          modal
          footer={footer}
          onHide={this.onHide}
        >
          <div className="p-grid p-fluid">
            <div className="p-col-2" style={{ paddingTop: ".75em" }}>
              <label htmlFor="title">Label</label>
            </div>
            <div className="p-col-10">
              <InputText
                type="text"
                id="title"
                value={this.state.markerTitle}
                onChange={(e) => this.setState({ markerTitle: e.target.value })}
              />
            </div>

            <div className="p-col-2" style={{ paddingTop: ".75em" }}>
              Lat
            </div>
            <div className="p-col-10">
              <InputText
                readOnly
                value={
                  this.state.selectedPosition
                    ? this.state.selectedPosition.lat()
                    : ""
                }
              />
            </div>

            <div className="p-col-2" style={{ paddingTop: ".75em" }}>
              Lng
            </div>
            <div className="p-col-10">
              <InputText
                readOnly
                value={
                  this.state.selectedPosition
                    ? this.state.selectedPosition.lng()
                    : ""
                }
              />
            </div>

            <div className="p-col-2" style={{ paddingTop: ".75em" }}>
              <label htmlFor="drg">Drag</label>
            </div>
            <div className="p-col-10">
              <Checkbox
                checked={this.state.draggableMarker}
                onChange={(event) =>
                  this.setState({ draggableMarker: event.checked })
                }
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default GoogleMap;
