import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const particlesOptions = {
  particles: {
    number: { value: 50, density: { enable: true, value_area: 600 } },
    color: { value: "#ffffff" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
      image: { src: "img/github.svg", width: 0, height: 0 },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "window",
    events: { onhover: { enable: true, mode: "repulse" }, resize: true },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  user: {
    _id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
      leftCol: clarifaiFace.left_col * width,
    };
  };
  displayFaceBox = (box) => {
    this.setState({ box: box });
    console.log(box);
  };
  onSubmit = () => {
    console.log(this.state);
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3002/image", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3002/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: this.state.user._id,
            }),
          })
            .then((response) => response.json())
            .then((entries) => {
              this.setState(
                Object.assign(this.state.user, { entries: entries })
              );
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else {
      this.setState({ route: route });
    }
  };
  loadUser = (user) => {
    this.setState({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };
  render() {
    console.log(this.state.route);
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        {this.state.route === "main" ? (
          <div>
            <Navigation onRouteChange={this.onRouteChange} signed={true} />
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <div>
            <Navigation onRouteChange={this.onRouteChange} signed={false} />
            <Signin
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          </div>
        ) : (
          <div>
            <Navigation onRouteChange={this.onRouteChange} signed={false} />
            <Register
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
