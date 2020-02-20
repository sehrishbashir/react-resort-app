import React, { Component } from 'react'
import items from './data'
const RoomContext = React.createContext();

class RoomProvider extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }
    state = {
        rooms: [],
        sortedRooms: [],
        featuredRooms: [],
        loading: true,
        type: 'all',
        capacity: 1,
        price: 0,
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        breakfast: false,
        pets: false
    };

    //getdata

    componentDidMount() {
        //this.getdata
        let rooms = this.formatData(items);
        let featuredRooms = rooms.filter(room => room.featured === true);
        let maxPrice = Math.max(...rooms.map(item => item.price));
        let maxSize = Math.max(...rooms.map(item => item.size));
        this.setState({
            rooms,
            featuredRooms,
            sortedRooms: rooms,
            loading: false,
            price: maxPrice,
            maxPrice,
            maxSize
        })
    }

    formatData(items) {
        let tempItems = items.map(item => {
            let id = item.sys.id;
            let images = item.fields.images.map(image =>
                image.fields.file.url);
            let room = { ...item.fields, images, id };
            return room;
        });
        return tempItems;
    }

    getRoom = (slug) => {
        let tempRooms = [...this.state.rooms]
        //find method accept the callback
        const room = tempRooms.find(room => room.slug === slug);
        return room;
    }

    handleChange = (e) => {
        e.preventDefault();
        console.log('The link was clicked.');
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = e.target.name;
        console.log(target, name, value)
        this.setState({
            [name]: value
        }, this.filterRooms)
    }

    filterRooms = () => {
        let {
            rooms,
            type,
            capacity,
            minSize,
            maxSize,
            breakfast,
            price,
            pets
        } = this.state

        // all the rooms
        let tempRooms = [...rooms];

        // transform value
        capacity = parseInt(capacity)
        price = parseInt(price)

        // filter by type
        if (type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === type);
        }

        // filter by capacity
        if (capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity >= capacity);
        }

        // filter by price
        tempRooms = tempRooms.filter(room => room.price <= price); 

        // filter by size
        tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize);

        // filter by breakfast
        if(breakfast) {
            tempRooms = tempRooms.filter(room => room.breakfast === true);
        }
        // filter by pets
        if(pets) {
            tempRooms = tempRooms.filter(room => room.pets === true);
        }

        // change state
        this.setState({
            sortedRooms: tempRooms
        })
    }


    render() {
        return (
            <RoomContext.Provider
                value={{
                    ...this.state,
                    getRoom: this.getRoom,
                    handleChange: this.handleChange
                }}>
                {this.props.children}
            </RoomContext.Provider>
        );
    }
}
console.log(<RoomContext.Provider />)

const RoomConsumer = RoomContext.Consumer;
console.log(RoomConsumer);

export function withRoomConsumer(Component) {
    return function ConsumerWrapper(props) {
        return (
            <RoomConsumer>
                {value => <Component {...props} context={value} />}
            </RoomConsumer>
        )
    }
}

export { RoomConsumer, RoomContext, RoomProvider };
