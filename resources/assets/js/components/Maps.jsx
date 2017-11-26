import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {compose, withProps} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"
import _ from 'lodash';

// import Axios from 'axios';

class NgajiMarker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    toggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Marker position={{lat: this.props.lat, lng: this.props.lng}} onClick={this.toggleOpen.bind(this)}>
            {
                this.state.isOpen &&
                <InfoWindow onCloseClick={this.toggleOpen.bind(this)}>
                    <ul>
                        <li>{this.props.title}</li>
                        <li>{this.props.lecturer}</li>
                        <li>{this.props.address}</li>
                    </ul>
                </InfoWindow>
            }
        </Marker>;
    }
}

const BareMaps = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCh4DrxQW-TTsHp0_oJTRTu1YeRglNXys4&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `400px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap defaultZoom={11}
               defaultCenter={{lat: -6.1761264, lng: 106.8206753}}>
        {props.children}
    </GoogleMap>
);

class MapsWindow extends Component {

    constructor(props){
        super(props);

        this.getScheduleComponents = this.getScheduleComponents.bind(this);
    }

    getScheduleComponents() {
        console.log(this.props.schedules);
        window.kepo = this.props;
        return this.props.schedules.map((schedule, key) => {
            return <NgajiMarker key={key}
                lat={schedule.lat}
                lng={schedule.lng}
                title={schedule.title}
                lecturer={schedule.lecturer}
                address={schedule.address}
            />
        })

    }

    render() {
        return <BareMaps>
            {this.getScheduleComponents()}
        </BareMaps>
    }
}

class NgajiAdd extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: '',
            lecturer: '',
            address: '',
            lat: '',
            lng: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    onSubmit(event){
        event.preventDefault();
        console.log(this.state);
        this.props.addKajian(this.state);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return <div style={{marginTop: '30px'}}>
            <form onSubmit={this.onSubmit}>
                <label>Judul</label>
                <input className="u-full-width" type="text" placeholder="Judul kajian" value={this.state.title} onChange={this.handleInputChange} name='title'/>
                <label>Nama Pemateri</label>
                <input className="u-full-width" type="text" placeholder="Nama Pemateri Kajian" value={this.state.lecturer} onChange={this.handleInputChange} name='lecturer'/>
                <label>Alamat</label>
                <input className="u-full-width" type="text" placeholder="Alamat Kajian" value={this.state.address} onChange={this.handleInputChange} name='address'/>
                <div className="row">
                    <div className="four columns">
                        <label>Lattitude</label>
                        <input className="u-full-width" type="text" placeholder="Lattitude" value={this.state.lat} onChange={this.handleInputChange}
                               name="lat"/>
                    </div>
                    <div className="four columns">
                        <label>Longitude</label>
                        <input className="u-full-width" type="text" placeholder="Longitude" value={this.state.lng} onChange={this.handleInputChange}
                               name="lng"/>
                    </div>
                </div>
                <input name='button' className="button-primary" type="submit"/>
            </form>
        </div>
    }
}

class Maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedules: [
                {
                    lat: -6.160044,
                    lng: 106.770618,
                    title: 'Memandikan dan mengkafankan jenazah',
                    lecturer: 'Ustad Azhar Khalid bin Sheff',
                    address: "Masjid Al Ikhlas - (Masuk dari jembatan gantung)\n Masjid Al Ikhlas, Jl. Mutiara, Komplek Permata, Daan Mogot, Cengkareng, Jakarta Barat"
                },
                {
                    lat: -6.244713200000001,
                    lng: 106.80069509999998,
                    title: 'Yang memberikan dan menerima suap',
                    address: 'Masjid Nurul Iman\n' +
                    'Masjid Nurul Iman, Blok M Square Lt. 7, Jl. Melawai, Kebayoran Baru, Jakarta Selatan'
                },
                {
                    lat: -6.219421100000001, lng: 106.86778490000006,
                    title: 'Muamalah Maliyah',
                    lecturer: 'Ustad Erwandi Tarmidzi',
                    address: 'Masjid Al Fattah, Jatinegara\n' +
                    'Jl. Jatinegara Timur No. 48.50 Jakarta Timur, Indonesia'
                }
            ]
        }
        this.addKajian = this.addKajian.bind(this);
    }

    addKajian(kajian){
        kajian.lat = _(kajian.lat).toNumber()
        kajian.lng = _(kajian.lng).toNumber()
        console.log(kajian);
        this.setState({
            schedules: _(this.state.schedules).push(kajian).value()
        })
    }

    render() {
        return (
            <div>
                <MapsWindow schedules={this.state.schedules}/>
                <NgajiAdd addKajian={this.addKajian}/>
            </div>

        );
    }
}

if (document.getElementById('maps')) {
    ReactDOM.render(<Maps/>, document.getElementById('maps'));
}